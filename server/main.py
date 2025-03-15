import sys
import os
from flask import Flask
from flask_cors import CORS
from app.api.routes import register_routes
from app.middleware.error_handler import register_error_handlers
from app.config import Config
from flask_jwt_extended import JWTManager
from datetime import timedelta

# Optional: Dynamically add the current folder to the path if necessary
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

def create_app(config_class=Config):
    # Create and configure the Flask application
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Set up JWT
    app.config['JWT_SECRET_KEY'] = 'your-secret-key-here'  # Change this in production!
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'
    jwt = JWTManager(app)

    # Enable CORS with specific settings
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Ensure storage directory exists
    storage_path = os.path.join(os.path.dirname(app.root_path), 'storage')
    os.makedirs(storage_path, exist_ok=True)
    app.config['STORAGE_PATH'] = storage_path

    # Register routes and error handlers
    register_routes(app)
    register_error_handlers(app)

    # Define a simple route
    @app.route('/')
    def home():
        return {'message': 'Welcome to Cloud IDE API'}

    return app

# Ensure Gunicorn runs the app in production
if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 2001), debug=True)  # Enable debug mode for development