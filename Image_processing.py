import numpy as np
import cv2

from PIL import Image

from ultralytics import YOLO
from utils import determine_orientation


class ImageProcessing():
    '''Process the raw Image from the front end'''
    def __init__(self, model = 'yolov8s-seg.pt') -> None:
        self.model = YOLO(model)
    def process(self, img):
        '''Crop to zoom in the uCard and Rotate to the Upright position 
        to let the OCR Model read the text \nReturn a PIL.Image'''
        result = self.model(img)

        for r in result:
            cropped_image = np.array(img)
            for box in r.boxes:
                if box.cls != 73:
                    continue
                x_min, y_min, x_max, y_max = map(int, box.xyxy[0])
                cropped_image = img[int(y_min) : int(y_max), int(x_min) : int(x_max)]
                rotations = determine_orientation(cropped_image)
                if rotations[90]:
                    cropped_image = cv2.rotate(cropped_image, cv2.ROTATE_90_CLOCKWISE)
                if rotations[180]:
                    cropped_image = cv2.rotate(cropped_image, cv2.ROTATE_180)
                Image.fromarray(cropped_image).show()
            return Image.fromarray(cropped_image) #If dont want to create a new image use this nparray
