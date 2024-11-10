import easyocr
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
    def __init__(self, model = 'yolov10x.pt') -> None:
        self.model = YOLO(model)
    def process(self, img):
        '''Crop to zoom in the uCard and Rotate to the Upright position 
        to let the OCR Model read the text \nReturn a PIL.Image'''
        if img.mode == 'RGBA':
            img = img.convert('RGB')

        np_img = np.array(img)

        result = self.model(np_img)

        for r in result:
            for box in r.boxes:
                if box.cls != 73:
                    continue
                x_min, y_min, x_max, y_max = map(int, box.xyxy[0])
                #Cropping
                #For cv2 np.array
                np_img = np_img[int(y_min) : int(y_max), int(x_min) : int(x_max)]
                img = img.crop((x_min, y_min, x_max, y_max))

                #Doing rotation
                rotations = determine_orientation(np_img)
                if rotations[90]:
                    #For cv2 np.array
                    np_img = cv2.rotate(np_img, cv2.ROTATE_90_CLOCKWISE)
                    img = img.rotate(270)
                if rotations[180]:
                    #For cv2 np.array
                    np_img = cv2.rotate(np_img, cv2.ROTATE_180)
                    img = img.rotate(180)

        # Check if working properly
        # img.save('After Image Processing.png')
        return np_img

def open_base64_image(base64_string):
    """
    Opens a base64 encoded image using PIL
    
    Returns:
    PIL.Image.Image: The opened image
    """
    try:
        # If the string contains the Data URI scheme, remove it
        if base64_string.startswith('data:'):
            # Extract the base64 part after the comma
            base64_string = base64_string.split(',')[1]

        # Decode the base64 string
        image_data = base64.b64decode(base64_string)

        # Create a BytesIO object to work with PIL
        image_buffer = io.BytesIO(image_data)

        # Open the image using PIL
        image = Image.open(image_buffer)
        image.load()
        return image

    except base64.binascii.Error:
        raise ValueError("Invalid base64 string")
    except Exception as e:
        raise ValueError(f"Error opening image: {str(e)}")
    finally:
        # Clean up the BytesIO buffer if it was created
        if 'image_buffer' in locals():
            image_buffer.close()

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

# def extract_info_pytesseract(text):
#     '''Filter out only the Name and Spire ID'''
#     name = ''
#     spire_id = ''
#     line_of_string = text.split('\n')
#     for s in line_of_string:
#         words = s.split(" ")
#         for w in words:
#             all_num = True
#             for c in w:
#                 if not c.isdigit():
#                     all_num = False
#                     break
#             if all_num and len(w) == 8:
#                 spire_id = w
#         if spire_id != '':
#             name = re.sub(r'[^A-Za-z\s]', '', s[9:])
#             return {'name': name,
#                     'id': spire_id}

def extract_info_easy_ocr(text_list):
    name = ''
    spire_id = ''
    for word in text_list:
        if word.isdigit() and len(word) == 8:
            spire_id = word
        if word.isupper():
            if name != '':
                name += ' '
            name += word
    return {'name': name,
            'id': spire_id}
            

def process_image(image_url):
    '''Take in an Image Data URI (base64 encoded)'''
    # Open and Process the Image
    image = open_base64_image(image_url)
    
    img_process = ImageProcessing()
    new_img = img_process.process(image)

    # Extracting text from the newly process Image
    text_reader = easyocr.Reader(['en'])
    text = text_reader.readtext(new_img, detail=0)
    return jsonify(extract_info_easy_ocr(text)) # <---------- Return a JSON object


if __name__ == "__main__":
    # ----------------> Call process_image to run the code <---------------------
    # process_image(...)
    
    
    # Testing Implementation
    # with open('message.txt', 'r') as file:
    #     link = file.read()
    
    # test_image = open_base64_image(link)
    # test_img_process = ImageProcessing()
    # reader = easyocr.Reader(['en'])
    # for i in range(1,71):
    #     print(f'Picture {i}')
    #     test_image = Image.open(f'input_img/test ({i}).jpeg')
    #     test_image.load()

    #     test_new_img = test_img_process.process(test_image)


    #     res = reader.readtext(test_new_img, detail=0)
    #     print(extract_info_easy_ocr(res))
    #     print('-------------------------------------')
    #     t = pytesseract.image_to_string(test_new_img)
    #     d = extract_info(t)
    #     print(d)
