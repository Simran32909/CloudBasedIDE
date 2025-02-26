from flask import request, g
import time
import logging

logger = logging.getLogger(__name__)

def setup_middleware(app):
    """Set up all middleware for the application"""

    @app.before_request
    def before_request():
        """Process request before it's handled by the route handler"""
        # Store request start time for performance monitoring
        g.start_time = time.time()

        # Log incoming requests in development mode
        if app.config.get('DEBUG'):
            logger.debug(f"Request: {request.method} {request.path}")

    @app.after_request
    def after_request(response):
        """Process response before it's sent back to the client"""
        # Calculate request duration
        if hasattr(g, 'start_time'):
            duration = time.time() - g.start_time

            # Add timing header in development mode
            if app.config.get('DEBUG'):
                response.headers['X-Request-Duration'] = str(duration)
                logger.debug(f"Response: {response.status_code} - {duration:.4f}s")

        # CORS headers
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'

        return response

    # Register error handlers
    from server.app.middleware.error_handler import register_error_handlers
    register_error_handlers(app)

    return app