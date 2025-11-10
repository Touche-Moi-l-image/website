import os
from flask import Flask
from routes.convert_to_bw import convert_to_bw
from routes.rotate_image import rotate_image
from routes.flip_image import flip_image
from routes.blur_image import blur_image
from routes.resize_image import resize_image
from routes.contrast_image import contrast_image
from routes.brightness_image import brightness_image

app = Flask(__name__)

app.register_blueprint(convert_to_bw)
app.register_blueprint(rotate_image)
app.register_blueprint(flip_image)
app.register_blueprint(blur_image)
app.register_blueprint(resize_image)
app.register_blueprint(contrast_image)
app.register_blueprint(brightness_image)

if __name__ == '__main__':
    dev_mode = os.getenv('DEV','') == '1'
    app.run(host='127.0.0.1', port=5000, debug=dev_mode)