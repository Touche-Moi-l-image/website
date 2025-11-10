from flask import jsonify, send_file
from io import BytesIO
from PIL import Image
import io
import base64
import requests
import os
import traceback

def process_image(image_source, transform_function):
    try:
        print("Image source received:", image_source)
        image_source = image_source.split(',')[1]
        image_data = base64.b64decode(image_source)
        image = Image.open(BytesIO(image_data))
        image.load()

        try:
            transformed_image = transform_function(image)
        except Exception as e:
            print("Error during image transformation:", str(e))
            traceback.print_exc()
            raise

        if not isinstance(transformed_image, Image.Image):
            print("Transformed object is not a PIL Image, got:", type(transformed_image))
            raise TypeError("Transformation function did not return a PIL Image")

        img_byte_arr = io.BytesIO()
        try:
            transformed_image.save(img_byte_arr, format='PNG')
        except Exception as e:
            print("Error saving transformed image to bytes:", str(e))
            traceback.print_exc()
            raise
        img_byte_arr.seek(0)
        return send_file(img_byte_arr, mimetype='image/png')

    except FileNotFoundError:
        return jsonify({"error": "Local file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500