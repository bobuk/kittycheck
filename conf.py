DEBUG           = True
MONGO_DBNAME    = "kittycheck"
SECRET          = '98a$tkd 4affne8leqw8h9v98c;z.qYOOOHOOO!'

CELERY_RESULT_BACKEND = "mongodb"
BROKER_TRANSPORT = "mongodb"
CELERYD_POOL = "eventlet"
CELERYD_CONCURRENCY = 1000
CELERY_RESULT_BACKEND = "mongodb"
CELERY_MONGODB_BACKEND_SETTINGS =  {
    "host": "localhost",
    "port": 27017,
    "user": "guest",
    "database": "celery",
    "taskmeta_collection": "celery_taskmeta",
}
