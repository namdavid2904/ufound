import Tesseract from 'tesseract.js';

const imageInput = document.getElementById('imageInput') as HTMLInputElement;

imageInput.addEventListener('change', (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageSrc = e.target?.result as string;
            recognizeText(imageSrc);
        };
        reader.readAsDataURL(file);
    }
});

function recognizeText(imageSrc: string) {
    Tesseract.recognize(
        imageSrc,
        'eng', // Specify the language
        {
            logger: (m) => console.log(m), // Optional logger
        }
    ).then(({ data: { text } }) => {
        console.log('Recognized text:', text);
    }).catch((error) => {
        console.error('Error recognizing text:', error);
    });
}