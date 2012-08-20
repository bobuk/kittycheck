import sys;reload(sys); sys.setdefaultencoding('utf-8');
import os
sys.path.append('./libs/')
import hashlib, simplejson, requests, random
from datetime import datetime
import time
import pymongo, bson
from flask import Flask, render_template, request, Response, redirect, abort, session, send_from_directory, g, url_for
from flask.ext.pymongo import PyMongo
from flaskext.oauth import OAuth
import config
import bleach
import markdown

app = Flask("index")
app.config.from_object(config)
app.secret_key = config.SECRET
mongo = PyMongo(app)
oauth = OAuth()

twitter = oauth.remote_app('KittyCheck',
    consumer_key=config.TWITTER["consumer_key"],
    consumer_secret=config.TWITTER["consumer_secret"],

    base_url='http://api.twitter.com/1/',
    request_token_url='http://api.twitter.com/oauth/request_token',
    access_token_url='http://api.twitter.com/oauth/access_token',
    authorize_url='http://api.twitter.com/oauth/authenticate',
)

def jsonify(hash, callback = None):
    if hash.has_key('_id'):
        del hash['_id']
    res = simplejson.dumps(hash, ensure_ascii=False)
    if callback:
        res = callback + '(' + res + ');'
    return Response(
            res,
            mimetype='text/javascript'
    )

def hash_validity(hash):
    return ''.join(
        filter(
            lambda x: x.isalpha() or x.isdigit() or x in ['-'],
            hash
        )
    )

def get_checkin_by_hash(hash):
    return mongo.db.kitty.find_one({'sitehash': hash})

def get_default_checkin(hash):
    return {
        'sitehash': hash, "checkins": 1, "comments": [],
    }

@app.before_request
def before_request():
    g.user = None
    if 'user_id' in session:
        g.user = mongo.db.users.find_one(
            {
                "user_id": session['user_id']
            }
        )

@twitter.tokengetter
def get_twitter_token():
    user = g.user
    if user is not None:
        return user["oauth_token"], user["oauth_secret"]

@app.route('/login')
def login():
    if g.user:
        return redirect(url_for("window_close"))
    return twitter.authorize(callback=url_for('oauth_authorized',
        next=request.args.get('next')))

@app.route('/logout')
def logout():
    if 'user_id' in session:
        del session['user_id']
    return redirect(url_for("window_close"))

@app.route('/oauth-authorized')
@twitter.authorized_handler
def oauth_authorized(resp):
    next_url = request.args.get('next') or url_for('window_close')
    if resp is None:
        return redirect(next_url)

    user = mongo.db.users.find_one({"name": resp['screen_name']})
    if user is None:
        user = dict(
            name = resp['screen_name'],
            user_id = resp["user_id"],
        )
        mongo.db.users.insert(user)
        del user['_id']
    user_info =  simplejson.loads(requests.get(twitter.expand_url('users/show.json'), params={
            'screen_name': resp['screen_name']
    }).content)
    user["full_name"] = user_info['name']
    user["oauth_token"] = resp['oauth_token']
    user["oauth_secret"] = resp['oauth_token_secret']
    mongo.db.users.update({"user_id" : user["user_id"]}, user)
    session['user_id'] = user["user_id"]
    session.permanent = True
    return redirect(next_url)

@app.route('/api/v1/identity/', methods = ['GET'])
def api_authinfo():
    if not g.user:
        return abort(401)
    res  = dict(
        authenticated = True,
        author = dict(
            login = g.user['name'],
            name  = g.user['name']
        )
    )
    return jsonify(res)

@app.route('/api/v1/checkin/<sitehash>/', methods = ['POST', 'GET'])
def api_checkin(sitehash):
    sitehash = hash_validity(sitehash)
    callback = request.args.get('cb', None)
    checkin = get_checkin_by_hash(sitehash)
    if request.method == 'GET':
        if not checkin:
            return jsonify({'error':"No checkins yet", "checkins": 0})
    elif request.method == 'POST':
        if not checkin:
            checkin = get_default_checkin(sitehash)
            mongo.db.kitty.insert(checkin)
        else:
            checkin_inc = {"$inc": {"checkins": 1}}
            mongo.db.kitty.update({'sitehash': sitehash}, checkin_inc)
    checkin['error'] = 0
    checkin["comments_url"] = '/api/v1/comments/' + sitehash
    if checkin.has_key("comments"):
        del checkin["comments"]
    return jsonify(checkin, callback)

@app.route('/api/v1/comments/<sitehash>/', methods = ['POST', 'GET'])
def api_comments(sitehash):
    sitehash = hash_validity(sitehash)
    callback = request.args.get('cb', None)
    checkin = get_checkin_by_hash(sitehash)
    if request.method == 'GET':
        checkins = 0 if not checkin else int(checkin['checkins'])
        if not checkin or not checkin.has_key('comments') or len(checkin['comments']) == 0:
            return jsonify({'error':"No comments yet", "checkins": checkins, "comments": []})
    elif request.method == 'POST':
        if not g.user:
            return abort(401)
        text = request.form.get('text', '')
        if not text or len(text) == 0:
            return jsonify({'error':"Empty text", "checkins": 0, "comments": []})
        text = bleach.linkify(
            bleach.clean(
                text,
                tags = ['i','b','strong','h3']
            ),
            nofollow = True
        )
        if not checkin:
            checkin = get_default_checkin(sitehash)
            mongo.db.kitty.insert(checkin)
        checkin['comments'].insert(0, {
            "text": text,
            "author": {"login": g.user['name'], "name": g.user['full_name'] or g.user['name']},
            "datetime": str(time.mktime(datetime.now().timetuple()))
        })
        mongo.db.kitty.update({'sitehash': sitehash}, checkin)
    checkin['error'] = 0
    return jsonify(checkin, callback)

@app.route('/window/close')
def window_close():
    return "<!DOCTYPE html><meta charset=utf-8 /><title>close</title><script>window.close()</script>"

@app.route('/iframe', methods = ['GET'])
def get_iframe():
    sui = request.args.get('site_uniq_id')
    if sui:
        rot = hash_validity(sui)
    else:
        referer = request.environ.get('HTTP_REFERER', '')
        rot = hashlib.md5(referer).hexdigest() if referer else '0'
    return open('views/index.html').read().replace('@@site_uniq_id@@', rot)

@app.route('/deploy', methods=['GET', 'POST'])
def deployment():
    os.system('git pull')
    return 'Done'

@app.route('/', methods=['GET'])
def index():
    out = markdown.markdown(
        open('site.ru.md','r').read(),
        extensions=['fenced_code', 'toc'],
        output_format = 'html5'
    )
    return open('views/site.html').read().replace('@@internal@@', out)

@app.route('/<path:fullpath>')
def static_router(fullpath):
    return send_from_directory('.', fullpath)

if __name__ == "__main__":
    app.run()
