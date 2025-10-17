from flask import Blueprint, request, jsonify, send_file
from routes.utils import process_image

convert_to_bw = Blueprint('convert_to_bw', __name__)

@convert_to_bw.route('/api/convert-to-bw', methods=['POST'])
def convert_to_bw_route():
    image_source = request.form.get('image_source')
    if not image_source:
        return jsonify({"error": "No image source provided"}), 400

    def to_black_and_white(image):
        return image.convert('L')

    return process_image(image_source, to_black_and_white)
