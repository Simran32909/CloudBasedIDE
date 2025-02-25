# server/app/config.py
import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard-to-guess-string'
    DEBUG = os.environ.get('FLASK_DEBUG', 'True') == 'True'

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///cloud_ide.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    STORAGE_PATH = os.environ.get('STORAGE_PATH') or os.path.join(os.getcwd(), 'storage')

    GIT_ENABLED = True

    DOCKER_HOST = os.environ.get('DOCKER_HOST') or 'unix://var/run/docker.sock'
    EXECUTION_TIMEOUT = 30  # seconds