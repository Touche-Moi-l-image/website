from flask import Flask
from routes.convert_to_bw import convert_to_bw
from routes.rotate_image import rotate_image
from routes.flip_image import flip_image

app = Flask(__name__)

app.register_blueprint(convert_to_bw)
app.register_blueprint(rotate_image)
app.register_blueprint(flip_image)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)