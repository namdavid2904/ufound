import pytesseract
import io
import base64
import os

from pymongo import MongoClient
from Image_processing import ImageProcessing
from utils import extract_info
from flask import Flask, request, jsonify
from PIL import Image

app = Flask(__name__)

# Connect to MongoDB Atlas
client = MongoClient(os.getenv("MONGODB_URI"))  # Set MongoDB URI as an environment variable
db = client['your_database_name']
collection = db['your_collection_name']

@app.route('/process_image', methods=['POST'])
def process_image():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        #Read and process the Image
        image_file = request.files['image']
        image = Image.open(image_file)
        img_proccess = ImageProcessing("models/yolov8m-seg.pt")
        new_img = img_proccess.process(image)
 
        #Extracting text from the newly process Image
        text = pytesseract.image_to_string(new_img)
        data = extract_info(text)
        result = collection.insert_one(data)
        return jsonify({
            "data": data, 
            "db_id": str(result.inserted_id)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
