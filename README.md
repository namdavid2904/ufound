
# Inspiration
UFound was inspired by the shared frustration of misplacing UCards and the challenges involved in retrieving them. Recognizing this common pain point, we aimed to create a community-driven platform to streamline the reporting and searching of lost items, making it easier for users to reconnect with lost belongings. This platform fosters trust and collaboration among users, encouraging everyone to help one another recover lost items.

# What it does
UFound allows users to report found UCards by uploading an image. Using OCR technology, UFound automatically extracts essential information like the SpireID and student name from the image, eliminating the need for manual input. This data is then added to a searchable database of lost UCards, where users can enter search terms to locate specific items. By connecting finders and owners, the platform facilitates direct communication and helps users locate their items without the hassle of filling out multiple forms, retracing their steps, or asking around.

# How we built it
UFound is built using a combination of technologies:

Frontend: React for building a responsive, intuitive user interface.
Backend: Node.js and Express to handle server requests and responses.
Data Processing: Flask with OCR for image analysis and text extraction to capture SpireID and student name details from UCard images.
# What's next for UFound
Implement Enhanced Python Script for Image Processing  
Currently, UFound uses a simple OCR model (tesseract.js) to read text from captured images and return a string. This approach has limitations, particularly if the image is rotated or taken from a distance, reducing OCR accuracy. To improve this, we developed a Python script that incorporates advanced computer vision techniques to enhance OCR accuracy.

## Card Detection: 
The script uses an object detection model to identify the card and outline its bounding box within the image. This enables the script to crop a close-up version of the UCard for better OCR performance.
## Orientation Detection: 
To address orientation issues, we apply a rotation step if the image is a vertical rectangle, as UCards are typically horizontal. Then, using Otsu thresholding, we detect the white space in the bottom third of the UCard image to determine if the picture is correctly oriented. Although developing a custom orientation model would require a substantial training dataset (unfeasible within 36 hours), this workaround has shown promising results.
## Expanding Python's Capabilities: 
Moving to Python for image processing also opens up potential to add further capabilities, such as identifying “general items” beyond UCards.
## Developing for General Items
In the future, we aim to expand UFound to support locating a variety of commonly misplaced items like calculators, umbrellas, clothing, chargers, and more. Achieving this will require a revised structure, as well as an enhanced database schema capable of distinguishing similar items. This expansion will likely involve large language models (LLMs) and additional computer vision models to better identify and categorize various items accurately.

## AR-Based Item Locating (Does not work yet lol)
To improve the user experience in finding lost items, we plan to incorporate augmented reality (AR) features. This could involve embedding a 360-degree panoramic image of the environment where the item was found, offering users a visual map similar to Google Street View. This feature would allow users to see the location in greater detail, improving their ability to locate and retrieve lost items more effectively.



1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   ```
2. Navigate to the project directory:
   ```bash
   cd your-repo-name
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Run frontend:
   ```bash
   npm run dev
   ```
