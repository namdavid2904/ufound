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
