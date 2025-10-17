from flask import Flask
from routes.convert_to_bw import convert_to_bw

app = Flask(__name__)

app.register_blueprint(convert_to_bw)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)