import pytesseract
import io
import base64
import os
import cv2
import re
import numpy as np


from pymongo import MongoClient
from flask import Flask, request, jsonify
from PIL import Image
from ultralytics import YOLO


class ImageProcessing():
    '''Process the raw Image from the front end'''
    def __init__(self, model = 'yolov8s-seg.pt') -> None:
        self.model = YOLO(model)
    def process(self, img):
        '''Crop to zoom in the uCard and Rotate to the Upright position 
        to let the OCR Model read the text \nReturn a PIL.Image'''
        new_image = np.array(img)
        result = self.model(new_image)

        for r in result:
            for box in r.boxes:
                if box.cls != 73:
                    continue
                x_min, y_min, x_max, y_max = map(int, box.xyxy[0])
                new_image = new_image[int(y_min) : int(y_max), int(x_min) : int(x_max)]
                rotations = determine_orientation(new_image)
                if rotations[90]:
                    new_image = cv2.rotate(new_image, cv2.ROTATE_90_CLOCKWISE)
                if rotations[180]:
                    new_image = cv2.rotate(new_image, cv2.ROTATE_180)
            return Image.fromarray(new_image)

def determine_orientation(image:np.array):
    '''Determine the orientation of the uCard in the photo'''
    #The 90 degree clockwise rotation and 180 degree rotation need to make the image upright
    orientation = {90: 0, 180:0}
    h, w = image.shape[:2]
    if h > 1.5*w:
        image = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
        orientation[90] += 1
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Otsu's thresholding
    _, binary_mask = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    height, width = binary_mask.shape

    # Calculate the number of white pixels in the bottom third
    bottom_third = binary_mask[int(height/3):, :]
    white_pixels_bottom = np.sum(bottom_third == 255)

    # Calculate the number of white pixels in the top two-thirds
    top_two_thirds = binary_mask[:int(height/3), :]
    white_pixels_top = np.sum(top_two_thirds == 255)

    # Determine orientation based on the white pixel counts
    if white_pixels_bottom <= white_pixels_top:
        orientation[180] += 1

    return orientation

def extract_info(text):
    '''Filter out only the Name and Spire ID'''
    name = ''
    spire_id = ''
    line_of_string = text.split('\n')
    print(line_of_string)
    for s in line_of_string:
        words = s.split(" ")
        for w in words:
            all_num = True
            for c in w:
                if not c.isdigit():
                    all_num = False
                    break
            if all_num and len(w) == 8:
                spire_id = w
        if spire_id != '':
            name = re.sub(r'[^A-Za-z\s]', '', s[9:])
            return {'name': name,
                    'id': spire_id}



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
        img_process = ImageProcessing("models/yolov8m-seg.pt")
        new_img = img_process.process(image)

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

    # Testing Implementation
    # test_image = Image.open('input_img/test (6).jpeg')
    # test_img_process = ImageProcessing("models/yolov8m-seg.pt")
    # test_new_img = test_img_process.process(test_image)

    # t = pytesseract.image_to_string(test_new_img)
    # d = extract_info(t)
    # print(d)
