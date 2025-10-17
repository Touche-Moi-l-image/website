from flask import Blueprint, request, jsonify
from routes.utils import process_image
from PIL import Image

rotate_image = Blueprint('rotate_image', __name__)

@rotate_image.route('/api/rotate-image', methods=['POST'])
def rotate_image_route():
    image_source = request.form.get('image_source')
    angle = request.form.get('angle', type=int)

    print("Image source:", image_source)
    print("Angle:", angle)

    if not image_source:
        return jsonify({"error": "No image source provided"}), 400

    if angle is None:
        return jsonify({"error": "No angle provided. Please specify an angle in degrees."}), 400

    def rotate(image):
        print("Original image format:", image.format)
        rotated = image.rotate(-angle, expand=True)  # Negative angle for clockwise rotation
        print("Rotation applied successfully with angle:", angle)
        return rotated

    return process_image(image_source, rotate)