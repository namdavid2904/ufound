import pytesseract
from Image_processing import ImageProccessing
from flask import jsonify


#All the text appear in the image

def extract_info(text):
    name = ''
    spire_id = ''
    line_of_string = text.split('\n')
    for s in line_of_string:
        words = s.split(" ")
        for w in words:
            all_num = True
            for c in w:
                if(not c.isdigit()):
                    all_num = False
                    break
            if all_num and len(w) == 8:
                spire_id = w
        if (spire_id != ''):
            name = s[9:]
            return {'name': name,
                    'id': spire_id}
    
img_proccess = ImageProccessing("models/yolov8m-seg.pt")
filepath = 'input_img/test (3).jpeg' #Specified the file path to the original img
new_img = img_proccess.process(filepath)

text = pytesseract.image_to_string(new_img)
print(extract_info(text))