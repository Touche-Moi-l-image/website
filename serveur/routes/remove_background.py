from flask import Blueprint, request, jsonify, send_file
from routes.utils import process_image
from PIL import Image
import io

try:
    from rembg import remove as rembg_remove
except Exception as e:
    print(f"\n\n❌ ERREUR CRITIQUE IMPORT REMBG : {e}\n\n")
    rembg_remove = None

remove_background = Blueprint('remove_background', __name__)

@remove_background.route('/api/remove-background', methods=['POST'])
def remove_background_route():
    """Remove the background from an input image and return a PNG with alpha."""
    image_source = request.form.get('image_source')
    if not image_source:
        return jsonify({"error": "No image source provided"}), 400

    if rembg_remove is None:
        return jsonify({
            "error": "Server missing dependency 'rembg'",
            "hint": "Install with: pip install rembg",
        }), 500

    def do_remove_bg(image: Image.Image) -> Image.Image:
        result = rembg_remove(image)
        if isinstance(result, Image.Image):
            return result
        if isinstance(result, (bytes, bytearray)):
            return Image.open(io.BytesIO(result))
        raise TypeError(f"Unexpected rembg output type: {type(result)}")

    return process_image(image_source, do_remove_bg)
