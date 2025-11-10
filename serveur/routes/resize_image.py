from flask import Blueprint, request, jsonify
from routes.utils import process_image
from PIL import Image

resize_image = Blueprint('resize_image', __name__)


@resize_image.route('/api/resize-image', methods=['POST'])
def resize_image_route():
    image_source = request.form.get('image_source')
    x_raw = request.form.get('x_percent')
    y_raw = request.form.get('y_percent')

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

    x_percent = parse_percent(x_raw)
    y_percent = parse_percent(y_raw)

    if x_percent is None and y_percent is None:
        return jsonify({"error": "At least one of x_percent or y_percent must be provided"}), 400

    if x_percent is None:
        x_percent = y_percent
    if y_percent is None:
        y_percent = x_percent

    if x_percent is None or y_percent is None:
        return jsonify({"error": "Invalid percentage value(s). Use numbers or strings with '%' (e.g. 50 or '50%')"}), 400

    if x_percent <= 0 or y_percent <= 0:
        return jsonify({"error": "Percentages must be positive"}), 400

    def do_resize(image: Image.Image):
        orig_w, orig_h = image.size
        new_w = max(1, int(orig_w * (x_percent / 100.0)))
        new_h = max(1, int(orig_h * (y_percent / 100.0)))
        print(f"Resizing image: orig=({orig_w},{orig_h}) -> new=({new_w},{new_h}), x%={x_percent}, y%={y_percent}")
        resized = image.resize((new_w, new_h), resample=Image.LANCZOS)
        print("Resize completed, mode:", resized.mode, "format:", getattr(resized, 'format', None))
        return resized

    return process_image(image_source, do_resize)
