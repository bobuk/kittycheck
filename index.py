import sys;reload(sys); sys.setdefaultencoding('utf-8');
sys.path.append('./libs/')
import hashlib, simplejson, requests, random
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

def get_by_hash(hash):
    return mongo.db.kitty.find_one({'sitehash': hash})

def get_default_checkin(hash):
    return {
        'sitehash': hash, "checkins": 1,
    }

@app.route('/api/v1/checkin/<sitehash>/', methods = ['POST', 'GET'])
def api_checkin(sitehash):
    if not check_hash_validity(sitehash):
        return abort(403)
    callback = request.args.get('cb', None)
    checkin = get_by_hash(sitehash)
    if request.method == 'GET':
        if not checkin:
            return jsonify({'error':"sitehash key not found"})
    elif request.method == 'POST':
        if not checkin:
            checkin = get_default_checkin(sitehash)
            mongo.db.kitty.insert(checkin)
        else:
            checkin['checkins'] = int(checkin['checkins']) + 1
            mongo.db.kitty.update({'sitehash': sitehash}, checkin)
    checkin['error'] = 0
    checkin["comments_url"] = '/api/v1/comments/' + sitehash
    return jsonify(checkin, callback)

if __name__ == "__main__":
    app.run()
