import numpy as np
import cv2
import torchvision.models as models
import torch.nn as nn


from ultralytics import YOLO

def determine_orientation(image_path = None):
    # Load the image
    if (isinstance(image_path, str)):
        image = cv2.imread(image_path)
    else:
        image = image_path
    orientation = {90: 0, 180:0} #The 90 degree clockwise rotation and 180 degree rotation need to make the image upright
    h, w = image.shape[:2]
    if(h > 1.5*w):
        image = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
        orientation[90] += 1
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Otsu's thresholding
    _, binary_mask = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Invert the mask if necessary (white background should be 0)
    # binary_mask = cv2.bitwise_not(binary_mask)
    
    # Calculate the height of the image
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

class ImageProccessing():
    '''Process the raw Image from the front end'''
    def __init__(self, model = 'yolov8s-seg.pt') -> None:
        self.model = YOLO(model)
    def process(self, img_link): #Crop and Rotate
        '''Crop to zoom in the uCard and Rotate to the Upright position to let the OCR Model read the text'''
        img = cv2.imread(img_link)
        result = self.model(img_link)

        for r in result:
            cropped_image = img
            for box in r.boxes:
                if (box.cls != 73):
                    continue
                x_min, y_min, x_max, y_max = map(int, box.xyxy[0])
                cropped_image = img[int(y_min) : int(y_max), int(x_min) : int(x_max)]
                rotations = determine_orientation(cropped_image)
                if rotations[90]:
                    cropped_image = cv2.rotate(cropped_image, cv2.ROTATE_90_CLOCKWISE)
                if rotations[180]:
                    cropped_image = cv2.rotate(cropped_image, cv2.ROTATE_180)
            cv2.imwrite('cropped.png', cropped_image)
            return cropped_image #If dont want to create a new image use this nparray