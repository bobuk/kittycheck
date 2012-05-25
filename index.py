import sys;reload(sys); sys.setdefaultencoding('utf-8');
import os
sys.path.append('./libs/')
import hashlib, simplejson, requests, random
from datetime import datetime
import pymongo
from flask import Flask, render_template, request, Response, redirect, abort, session
from flask.ext.pymongo import PyMongo
import config

app = Flask("index")
app.config.from_object(config)
app.secret_key = config.SECRET
mongo = PyMongo(app)

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

def check_hash_validity(hash):
    try:
        int(hash, 16)
        return True
    except:
        return False

def get_checkin_by_hash(hash):
    return mongo.db.kitty.find_one({'sitehash': hash})

def get_default_checkin(hash):
    return {
        'sitehash': hash, "checkins": 1, "comments": [],
    }

@app.route('/api/v1/checkin/<sitehash>/', methods = ['POST', 'GET'])
def api_checkin(sitehash):
    if not check_hash_validity(sitehash):
        return abort(403)
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
            checkin['checkins'] = int(checkin['checkins']) + 1
            mongo.db.kitty.update({'sitehash': sitehash}, checkin)
    checkin['error'] = 0
    checkin["comments_url"] = '/api/v1/comments/' + sitehash
    if checkin.has_key("comments"):
        del checkin["comments"]
    return jsonify(checkin, callback)

@app.route('/api/v1/comments/<sitehash>/', methods = ['POST', 'GET'])
def api_comments(sitehash):
    if not check_hash_validity(sitehash):
        return abort(403)
    callback = request.args.get('cb', None)
    checkin = get_checkin_by_hash(sitehash)
    if request.method == 'GET':
        if not checkin or not checkin.has_key('comments') or len(checkin['comments']) == 0:
            return jsonify({'error':"No comments yet", "checkins": 0, "comments": []})
    elif request.method == 'POST':
        text = request.form.get('text', '')
        if not checkin:
            checkin = get_default_checkin(sitehash)
            mongo.db.kitty.insert(checkin)
        checkin['comments'].append({"text": text, "author": 'nobody', "datetime": str(datetime.now())})
        mongo.db.kitty.update({'sitehash': sitehash}, checkin)
    checkin['error'] = 0
    return jsonify(checkin, callback)

@app.route('/iframe', methods = ['GET'])
def get_iframe():
    referer = request.environ.get('HTTP_REFERER', '')
    rot = hashlib.md5(referer).hexdigest() if referer else '0'
    return open('views/index.html').read().replace('@@site_uniq_id@@', rot)

@app.route('/deploy', methods=['GET', 'POST'])
def deployment():
    os.system('git pull')
    return 'Done'

@app.route('/<path:fullpath>')
def static_redirect(fullpath):
    return redirect('/static/' + fullpath)

if __name__ == "__main__":
    app.run()
