from flask import Blueprint, request, jsonify, send_file
from routes.utils import process_image
from PIL import Image
import io

crop_image = Blueprint('crop_image', __name__)


@crop_image.route('/api/crop-image', methods=['POST'])
def crop_image_route():
    image_source = request.form.get('image_source')
    # allow uploading the image directly via form-data 'file' to avoid local-path visibility issues
    upload = request.files.get('file') if hasattr(request, 'files') else None

    if not image_source and not upload:
        return jsonify({"error": "No image source provided"}), 400

    def parse_bool(val):
        if val is None:
            return False
        if isinstance(val, bool):
            return val
        s = str(val).strip().lower()
        return s in ('1', 'true', 'yes', 'on')

    def parse_side_value(value):
        """Parse a side value which can be:
        - an integer number of pixels (e.g. '10' or '10px')
        - a boolean-ish flag (1/true/on) which will be interpreted as 1 pixel
        - missing -> 0
        Returns an int >= 0 or None if the value is invalid.
        """
        if value is None:
            return 0
        s = str(value).strip().lower()
        if s == '':
            return 0
        if s.endswith('px'):
            s = s[:-2]
        if s in ('1', 'true', 'yes', 'on'):
            return 1
        try:
            v = int(float(s))
            return max(0, v)
        except Exception:
            return None

    # Each side can be a pixel count (e.g. crop_left=10) or a boolean-ish flag (crop_left=1).
    crop_left_val = parse_side_value(request.form.get('crop_left'))
    crop_right_val = parse_side_value(request.form.get('crop_right'))
    crop_top_val = parse_side_value(request.form.get('crop_top'))
    crop_bottom_val = parse_side_value(request.form.get('crop_bottom'))

    if any(v is None for v in (crop_left_val, crop_right_val, crop_top_val, crop_bottom_val)):
        return jsonify({"error": "Invalid side value. Use a non-negative integer or boolean (e.g. 10 or '10px' or 1)."}), 400

    if not (crop_left_val or crop_right_val or crop_top_val or crop_bottom_val):
        return jsonify({"error": "No side selected to crop. Provide a positive pixel value for at least one of crop_left/crop_right/crop_top/crop_bottom."}), 400

    def do_crop(image: Image.Image):
        orig_w, orig_h = image.size
        left_px = crop_left_val
        right_px = crop_right_val
        top_px = crop_top_val
        bottom_px = crop_bottom_val

        left = left_px
        upper = top_px
        right = max(left + 1, orig_w - right_px)
        lower = max(upper + 1, orig_h - bottom_px)

        if right <= left or lower <= upper:
            raise ValueError(f"Cropping parameters remove entire image or produce non-positive dimensions: box=({left},{upper},{right},{lower}), orig=({orig_w},{orig_h})")

        print(f"Cropping image: orig=({orig_w},{orig_h}), left={left_px}, right={right_px}, top={top_px}, bottom={bottom_px}, box=({left},{upper},{right},{lower})")
        cropped = image.crop((left, upper, right, lower))
        return cropped

    # Support direct file upload to avoid server-local file visibility issues.
    upload = request.files.get('file')
    if upload:
        try:
            image = Image.open(upload.stream)
            image.load()
            result = do_crop(image)
            img_byte_arr = io.BytesIO()
            result.save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)
            return send_file(img_byte_arr, mimetype='image/png')
        except FileNotFoundError:
            return jsonify({"error": "Uploaded file not found"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Fallback to existing behaviour (URL or local path)
    return process_image(image_source, do_crop)
