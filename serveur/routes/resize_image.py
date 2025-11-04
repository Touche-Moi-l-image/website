from flask import Blueprint, request, jsonify
from routes.utils import process_image
from PIL import Image

resize_image = Blueprint('resize_image', __name__)


@resize_image.route('/api/resize-image', methods=['POST'])
def resize_image_route():
    image_source = request.form.get('image_source')
    x_percent = request.form.get('x_percent')
    y_percent = request.form.get('y_percent')

    if not image_source:
        return jsonify({"error": "No image source provided"}), 400
    
    if x_percent is None and y_percent is None:
        return jsonify({"error": "At least one of x_percent or y_percent must be provided"}), 400

    if x_percent is None:
        x_percent = y_percent
    if y_percent is None:
        y_percent = x_percent

    if x_percent <= 0 or y_percent <= 0:
        return jsonify({"error": "Percentages must be positive"}), 400

    def do_resize(image: Image.Image):
        orig_w, orig_h = image.size
        new_w = max(1, int(orig_w * (x_percent / 100.0)))
        new_h = max(1, int(orig_h * (y_percent / 100.0)))
        return image.resize((new_w, new_h), resample=Image.LANCZOS)

    return process_image(image_source, do_resize)
