from flask import Flask, jsonify, request

app = Flask(__name__)

# Exemple de route API
@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello, World!"})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)