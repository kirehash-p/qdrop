from flask import Flask, request, jsonify
from flask_cors import CORS
import json

import helper
import db_ops
import res_template

with open('./env.json', 'r') as file:
    env = json.load(file)
    CORS_ORIGIN = env['CORS_ORIGIN']

app = Flask(__name__, static_url_path='/static', static_folder='static')
cors = CORS(app, resources={r"/*": {"origins": CORS_ORIGIN}})

@app.route('/odai_list.json', methods=['GET'])
def get_odai_list():
    err, odais = db_ops.get_all_odai()
    if err:
        print(err)
        return res_template.db_error()
    return jsonify({"success": True, "data": helper.trim_dict(odais, ['title', 'description', 'url_path'])})

@app.route('/odai/<string:url_path>.json', methods=['GET'])
def get_odai(url_path):
    err, all_odai = db_ops.get_all_odai()
    if err:
        print(err)
        return res_template.db_error()
    for o in all_odai:
        if o['url_path'] == url_path:
            odai = o
            break
    else:
        return res_template.odai_not_found()
    return jsonify({"success": True, "data": helper.trim_dict(odai, ['title', 'description', 'url_path'])})

@app.route('/answer/<string:url_path>.json', methods=['GET'])
def get_answers(url_path):
    err, all_odai = db_ops.get_all_odai()
    if err:
        print(err)
        return res_template.db_error()
    for o in all_odai:
        if o['url_path'] == url_path:
            odai = o
            break
    else:
        return res_template.odai_not_found()
    err, answers = db_ops.get_answer_by_odai_id(odai["id"])
    if err:
        print(err)
        return res_template.db_error()
    return jsonify({"success": True, "data": helper.trim_dict(answers, ['answer'])})

@app.route('/submit', methods=['POST'])
def submit_answer():
    url_path = request.json.get('url_path')
    img = request.json.get('img')
    if not url_path or not img:
        return res_template.submit_format_error()
    if not helper.validate_img(img):
        return res_template.submit_image_error()
    err, all_odai = db_ops.get_all_odai()
    if err:
        print(err)
        return res_template.db_error()
    for odai_data in all_odai:
        if odai_data['url_path'] == url_path:
            odai = odai_data
            break
    else:
        return res_template.odai_not_found()
    err = db_ops.submit_answer_by_url_path(url_path, img)
    if err:
        print(err)
        return res_template.db_error()
    return jsonify({"success": True, "redirect": "/odai/" + odai['url_path']})

@app.errorhandler(404)
def page_not_found(e):
    return res_template.not_found(e)

if __name__ == '__main__':
    app.run(port=4000, host='0.0.0.0')