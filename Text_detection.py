import pytesseract
import cv2
from ultralytics import YOLO

crop_model = YOLO("yolov8s.pt")

def crop_img(img_link):
    img = cv2.imread(img_link)
    result = crop_model.predict(img_link)

    for r in result:
        cropped_image = img
        for box in r.boxes:
            if int(box.cls) != 73:
                continue
            x_min, y_min, x_max, y_max = map(int, box.xyxy[0])
            cropped_image = img[int(y_min) : int(y_max), int(x_min) : int(x_max)]
        cv2.imwrite(f'modified_input_img/cropped_id_card.jpg', cropped_image)

#All the text appear in the image
text = pytesseract.image_to_string(f'modified_input_img/cropped_id_card1.jpg')

def extract_info(text):
    name = ''
    spire_id = ''
    line_of_string = text.split('\n')
    print(line_of_string)
    for s in line_of_string:
        print(s)
        words = s.split(" ")
        print(words)
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
            return (name, spire_id)
            
print(extract_info(text))