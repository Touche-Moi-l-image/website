import os
from flask import Flask
from flask_cors import CORS
from routes.convert_to_bw import convert_to_bw
from routes.rotate_image import rotate_image
from routes.flip_image import flip_image
from routes.blur_image import blur_image
from routes.resize_image import resize_image
from routes.contrast_image import contrast_image
from routes.brightness_image import brightness_image
from routes.crop_image import crop_image
from routes.remove_background import remove_background
from routes.modify_image import modify_image

app = Flask(__name__)

app.config['MAX_CONTENT_LENGTH'] = None  # Désactive la limite globale de taille de requête
app.config['MAX_FORM_MEMORY_SIZE'] = 1024 * 1024 * 1024 * 10  # 50 MB
app.config['MAX_FORM_PARTS_SIZE'] = 10 * 1024 * 1024 * 10

# Configuration CORS pour autoriser votre frontend
CORS(app)

app.register_blueprint(convert_to_bw)
app.register_blueprint(rotate_image)
app.register_blueprint(flip_image)
app.register_blueprint(blur_image)
app.register_blueprint(resize_image)
app.register_blueprint(contrast_image)
app.register_blueprint(brightness_image)
app.register_blueprint(crop_image)
app.register_blueprint(remove_background)
app.register_blueprint(modify_image)

@app.route('/')
def index():
    return "Server is running! 🚀"

if __name__ == '__main__':
    dev_mode = os.getenv('DEV','') == '1'
    app.run(host='127.0.0.1', port=5000, debug=dev_mode)