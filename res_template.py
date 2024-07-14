from flask import jsonify

def db_error():
    return jsonify({"success": False, "message": "データベースエラーが発生しました。"}), 500

def odai_not_found():
    return jsonify({"success": False, "message": "お題が見つかりませんでした。"}), 404

def submit_format_error():
    return jsonify({"success": False, "message": "送信データの形式が正しくありません。"}), 400

def submit_image_error():
    return jsonify({"success": False, "message": "画像の形式が正しくありません。"}), 400

def not_found(e):
    return jsonify({"success": False, "message": "404 Not Found"}), 404