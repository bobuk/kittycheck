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
    del hash['_id']
    res = simplejson.dumps(hash, ensure_ascii=False)
    if callback:
        res = callback + '(' + res + ');'
    return Response(
            res,
            mimetype='text/javascript'
    )

@app.route('/api/v1/checkin/<sitehash>/', methods = ['POST', 'GET'])
def api_checkin(sitehash):
    callback = request.args.get('cb', None)
    if request.method == 'GET':
        checkin = mongo.db.kitty.find_one({'sitehash': sitehash})
        if not checkin:
            return jsonify({'error':"sitehash key not found"})
    elif request.method == 'POST':
        checkin = mongo.db.kitty.find_one({'sitehash': sitehash})
        if not checkin:
            checkin = {
                'sitehash': sitehash, "checkins": 1, "comments_url": '/api/v1/comments/' + sitehash,
            }
            mongo.db.kitty.insert(checkin)
        else:
            checkin['checkins'] = int(checkin['checkins']) + 1
            mongo.db.kitty.update({'sitehash': sitehash}, checkin)
        checkin['error'] = 0
    return jsonify(checkin, callback)

if __name__ == "__main__":
    app.run()
