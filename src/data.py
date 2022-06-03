from flask_cors import cross_origin
from flask_jwt_extended import jwt_required
from flask import Blueprint, request, jsonify
from database import Data, db

data = Blueprint("data", __name__, url_prefix="/api/data")


@data.post('/')
@cross_origin()
@jwt_required()
def workOnData():
    number = request.json['number']
    result = request.json['result']
    newRecord = Data(number=number, result=result)

    db.session.add(newRecord)
    db.session.commit()

    return jsonify({
        "status": "success"
    }), 201


@data.get("/getdata")
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
