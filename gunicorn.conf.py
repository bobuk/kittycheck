import os

def numCPUs():
    if not hasattr(os, "sysconf"):
        raise RuntimeError("No sysconf detected.")
    return os.sysconf("SC_NPROCESSORS_ONLN")

bind = "0.0.0.0:8118"
workers = numCPUs() * 2 + 1
pidfile = '/tmp/kittycheck.pid'
proc_name = 'gunicorn/kittycheck'
daemon = False
debug = False
logfile = "/tmp/kittycheck.log"
loglevel = "info"
