# coding=utf-8
DEBUG           = True
MONGO_DBNAME    = "kittycheck"
SECRET          = 'rorororororor Привет всем в этом чате!'
CELERY_RESULT_BACKEND = "mongodb"
BROKER_TRANSPORT = "mongodb"
CELERYD_POOL = "eventlet"
CELERYD_CONCURRENCY = 1000
CELERY_RESULT_BACKEND = "mongodb"
CELERY_MONGODB_BACKEND_SETTINGS =  {
    "host": "localhost",
    "port": 27017,
    "user": "бобук",
    "database": "celery",
    "taskmeta_collection": "celery_taskmeta",
}

TWITTER = dict(
    consumer_key='консумер кей всегда секрет',
    consumer_secret='консумер секрет всегда кей'
)

BASE_URL = '//127.0.0.1:5000'