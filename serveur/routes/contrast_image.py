from flask import Blueprint, request, jsonify
from routes.utils import process_image
from PIL import ImageEnhance

contrast_image = Blueprint('contrast_image', __name__)


@contrast_image.route('/api/contrast-image', methods=['POST'])
def contrast_image_route():
    """Adjust image contrast by percentage.

    Parameters (form-data):
      - image_source: URL or local path to the image
      - percent: Contrast percent (100 = original). Unit: percent (%). Accepts number or '50%'.
    """
    image_source = request.form.get('image_source')
    percent_raw = request.form.get('percent')

    if not image_source:
        return jsonify({"error": "No image source provided"}), 400

    def parse_percent(value):
        if value is None:
            return None
        if isinstance(value, str) and value.endswith('%'):
            value = value[:-1]
        try:
            return float(value)
        except Exception:
            return None

    percent = parse_percent(percent_raw)
    if percent is None:
        return jsonify({"error": "Invalid percent value. Use number or '50%'"}), 400

    if percent < 0:
        return jsonify({"error": "Percent must be >= 0"}), 400

    # Map percent to PIL contrast factor: 100 -> 1.0, 200 -> 2.0, 50 -> 0.5
    factor = percent / 100.0

    def do_contrast(image):
        enhancer = ImageEnhance.Contrast(image)
        result = enhancer.enhance(factor)
        return result

    return process_image(image_source, do_contrast)
