from flask import Blueprint, request, jsonify, send_file
from routes.utils import process_image
from PIL import Image
import io

remove_background = Blueprint('remove_background', __name__)

@remove_background.route('/api/remove-background', methods=['POST'])
def remove_background_route():
    """Remove the background from an input image and return a PNG with alpha."""
    image_source = request.form.get('image_source')
    if not image_source:
        return jsonify({"error": "No image source provided"}), 400

    def do_remove_bg(image: Image.Image) -> Image.Image:
        try:
            # Lazy import to speed up server start
            from rembg import remove as rembg_remove
        except ImportError:
            # If rembg is not installed, we can handle it here or let it crash
            # But the route checks for it separately usually. 
            # In this lazy loading pattern, we assume it's there or fail at runtime.
            raise ImportError("Server missing dependency 'rembg'. Install with: pip install rembg")

        result = rembg_remove(image)
        if isinstance(result, Image.Image):
            return result
        if isinstance(result, (bytes, bytearray)):
            return Image.open(io.BytesIO(result))
        raise TypeError(f"Unexpected rembg output type: {type(result)}")

    return process_image(image_source, do_remove_bg)
