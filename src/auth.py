from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import validators
from database import User, db, Data

auth = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth.post("/register")
@cross_origin()
def register():
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]

    if len(password) < 6:
        return jsonify({"error": "Password must be longer than 6 characters"}), 400

    if len(username) < 4:
        return jsonify({"error": "Username is too short"}), 400

    if not username.isalnum() or " " in username:
        return jsonify({"error": "Username should be alphanumeric, also no spaces "}), 400

    if not validators.email(email):
        return jsonify({"error": "Email is not valid"}), 400

    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"error": "Email is taken"}), 409

    if User.query.filter_by(username=username).first() is not None:
        return jsonify({"error": "Username is taken"}), 409

    hashed = generate_password_hash(password)

    user = User(username=username, email=email, password=hashed)

    db.session.add(user)
    db.session.commit()

    newUser = User.query.filter_by(email=email).first()

    accessToken = create_access_token(identity=newUser.id)
    return jsonify({
        "status": "success",
        "JWT": accessToken,
        "user": {
            "username": username,
            "email": email
        }
    }), 201


@auth.post("/login")
@cross_origin()
def login():
    password = request.json["password"]
    email = request.json["email"]

    user = User.query.filter_by(email=email).first()

    if user:
        isCorrectPass = check_password_hash(user.password, password)

        if isCorrectPass:
            accessToken = create_access_token(identity=user.id)
            return jsonify({
                "JWT": accessToken,
                "user": {
                    "username": user.username,
                    "email": user.email
                }
            }), 200

    return jsonify({
        "error": "Wrong Email or Password"
    }), 401


@auth.get("/me")
@cross_origin()
@jwt_required()
def me():
    userId = get_jwt_identity()
    user = User.query.filter_by(id=userId).first()

    return jsonify({
        'username': user.username,
        'email': user.email
    }), 200


@auth.get("/getdata")
@cross_origin()
@jwt_required()
def getData():
    allRows = Data.query.all()

    dataRows = []

    for row in allRows:
        dataRows.append(
            {"number": row.number, "result": row.result, "id": row.id})

    return jsonify({
        "result": len(dataRows),
        "data": dataRows
    })
