#!/usr/bin/env python2.7
from __future__ import absolute_import
from flask.ext.script import Manager
from flask.ext.celery import install_commands as install_celery_commands

from index import app
manager = Manager(app)
install_celery_commands(manager)

if __name__ == "__main__":
    manager.run()
