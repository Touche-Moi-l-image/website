from flask import Blueprint, request, jsonify
from routes.utils import process_image
from PIL import Image, ImageFilter

blur_image = Blueprint('blur_image', __name__)


@blur_image.route('/api/blur-image', methods=['POST'])
def blur_image_route():
    image_source = request.form.get('image_source')
    percent_raw = request.form.get('percent')

    if not image_source:
        return jsonify({"error": "No image source provided"}), 400

    try:
        percent = float(percent_raw) if percent_raw is not None else 50.0
    except Exception:
        return jsonify({"error": "Invalid percent value"}), 400

    if percent < 0 or percent > 100:
        return jsonify({"error": "Percent must be between 0 and 100"}), 400

    def do_blur(image: Image.Image):
        radius = percent * 0.2
        return image.filter(ImageFilter.GaussianBlur(radius))

    return process_image(image_source, do_blur)
