from fabric.context_managers import cd
from fabric.operations import sudo
from fabric.api import run, env
from fabric.contrib.project import rsync_project
from fabtools import require
import fabtools

import os

env.user = 'bobuk'
env.hosts = ['82.196.0.32']

def deploy():
    rsync_project(
        remote_dir = "/home/bobuk/V/kittycheck", 
        local_dir = ".", 
        exclude = ["v", "*.pyc", "*.pem", "*.xls", ".v", ".git"],
        delete = True)
    fabtools.supervisor.restart_process('kittycheck')

def check():
    with fabtools.python.virtualenv('/home/bobuk/v'):
        require.python.package('Flask')
        require.python.package('bleach')
        require.python.package('Flask-pymongo')
        require.python.package('Flask-oauth')
        require.python.package('gevent')
        require.python.package('gunicorn')
        require.python.package('simplejson')
        require.python.package('requests')
        require.python.package('gmail')
        require.python.package('Markdown')

    require.nginx.proxied_site('kittycheck.com',
        docroot='/home/bobuk/V/kittycheck',
        proxy_url='http://127.0.0.1:8118'
        )

    require.supervisor.process('kittycheck',
        command = '/home/bobuk/v/bin/gunicorn index:app -c /home/bobuk/V/kittycheck/gunicorn.conf.py',
        directory = '/home/bobuk/V/kittycheck/',
        autostart = True, autorestart = True,
        user='bobuk'
        )
