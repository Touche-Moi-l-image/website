from flask import jsonify, send_file
from PIL import Image
import io
import requests
import os
import traceback

def process_image(image_source, transform_function):
    try:
        print("Image source received:", image_source)
        
        # Convertir les chemins relatifs en chemins absolus
        if not (image_source.startswith('http://') or image_source.startswith('https://')):
            image_source = os.path.abspath(image_source)
            print("Resolved absolute path:", image_source)
        
        if image_source.startswith('http://') or image_source.startswith('https://'):
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
            response = requests.get(image_source, headers=headers)
            response.raise_for_status()
            image = Image.open(io.BytesIO(response.content))
        else:
            try:
                with open(image_source, 'rb') as f:
                    image = Image.open(f)
            except FileNotFoundError:
                print("FileNotFoundError: The file does not exist at path:", image_source)
                raise
            except Exception as e:
                print("Error while opening the file:", str(e))
                raise

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