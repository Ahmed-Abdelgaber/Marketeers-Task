from cgitb import reset
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required
from flask import Blueprint, request, jsonify
from database import Data, db

data = Blueprint("data", __name__, url_prefix="/api/data")


@data.post('/update-data')
@cross_origin()
@jwt_required()
def workOnData():
    updatedRows = request.json['updatedData']

    for row in updatedRows:
        oldRecord = Data.query.filter_by(id=row['id']).first()
        oldRecord.result = row['result']
        db.session.commit()

    return jsonify({
        "status": "success"
    }), 201


@data.get("/get-data")
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
