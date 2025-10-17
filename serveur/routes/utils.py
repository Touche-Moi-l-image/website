from flask import jsonify, send_file
from PIL import Image
import io
import requests
import os

def process_image(image_source, transform_function):
    try:
        print("Image source received:", image_source)
        print("Resolved path:", os.path.abspath(image_source))
        if image_source.startswith('http://') or image_source.startswith('https://'):
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
            response = requests.get(image_source, headers=headers)
            response.raise_for_status()
            image = Image.open(io.BytesIO(response.content))
        else:
            with open(image_source, 'rb') as f:
                image = Image.open(f)

        image.load()

        transformed_image = transform_function(image)

        img_byte_arr = io.BytesIO()
        transformed_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        return send_file(img_byte_arr, mimetype='image/png')

    except FileNotFoundError:
        return jsonify({"error": "Local file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500