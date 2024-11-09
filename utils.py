import numpy as np
import cv2
import re


def determine_orientation(image_path = None):
    # Load the image
    if isinstance(image_path, str):
        image = cv2.imread(image_path)
    else:
        image = image_path
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
