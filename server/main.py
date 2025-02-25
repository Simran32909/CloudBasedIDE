from flask import Flask
from flask_cors import CORS
from app.api.routes import register_routes
from app.middleware.error_handler import register_error_handlers
from app.config import Config
import os


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app)
    register_routes(app)
    register_error_handlers(app)

    @app.route('/')
    def home():
        return {'message': 'Welcome to Cloud IDE API'}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=app.config['DEBUG'])