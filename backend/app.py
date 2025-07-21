from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS to allow all origins
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///kushalara.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)

# Import models and routes
from src.models.application import CitizenshipApplication, EResidencyApplication
from src.routes.applications import applications_bp

# Register blueprints
app.register_blueprint(applications_bp, url_prefix='/api/applications')

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

# Root endpoint
@app.route('/')
def root():
    return jsonify({
        "message": "KushAlara API Server",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "citizenship": "/api/applications/citizenship",
            "eresidency": "/api/applications/eresidency",
            "admin": "/api/applications/admin/dashboard"
        }
    })

# Create tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    # Run the application
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    app.run(
        host='0.0.0.0',  # Allow external connections
        port=port,
        debug=debug
    )

