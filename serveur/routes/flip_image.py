from flask import Blueprint, request, jsonify
from routes.utils import process_image
from PIL import Image

flip_image = Blueprint('flip_image', __name__)

@flip_image.route('/api/flip-image', methods=['POST'])
def flip_image_route():
    image_source = request.form.get('image_source')
    direction = request.form.get('direction')

    if not image_source:
        return jsonify({"error": "No image source provided"}), 400

    if direction not in ['H', 'V']:
        return jsonify({"error": "Invalid direction. Use 'H' for horizontal or 'V' for vertical."}), 400

    def flip(image):
        if direction == 'H':
            return image.transpose(Image.FLIP_LEFT_RIGHT)
        elif direction == 'V':
            return image.transpose(Image.FLIP_TOP_BOTTOM)

    return process_image(image_source, flip)