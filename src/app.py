from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from auth import auth
from data import data
from database import db
import os


def createApp(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        app.config.from_mapping(
            SECRET_KEY=os.environ.get("SECRET_KEY"),
            SQLALCHEMY_DATABASE_URI=os.environ.get("SQLALCHEMY_DB_URI"),
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
            JWT_SECRET_KEY=os.environ.get('JWT_SECRET_KEY')
        )
    else:
        app.config.from_mapping(test_config)

    db.app = app
    db.init_app(app)

    JWTManager(app)

    app.register_blueprint(auth)
    app.register_blueprint(data)

    CORS(app, resources={r"/api/*": {"origins": "*"}},)

    @ app.errorhandler(404)
    def handle_404(e):
        return jsonify({'error': 'OPS!! Invalid URL'}), 404

    @ app.errorhandler(500)
    def handle_500(e):
        return jsonify({'error': 'Something went wrong, we are working on it'}), 500

    return app


app = createApp()
