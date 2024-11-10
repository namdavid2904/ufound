const Tesseract = require('tesseract.js');
const { createWorker, PSM } = Tesseract;
const { Buffer } = require('buffer');

// Extract student name and ID from the OCR text.
function extractInfo(text) {
    const lines = text.split('\n');
    let studentName = '';
    let spireId = '';

    for (const line of lines) {
        const words = line.split(' ');
        for (const word of words) {
            if (/^\d{8}$/.test(word)) {  // Matches an 8-digit ID
                spireId = word;
            } else if (/^[A-Z]+$/.test(word)) {  // Matches uppercase words (for name)
                studentName += (studentName ? ' ' : '') + word;
            }
        }
        if (spireId) {
            return { studentName, spireId };
        }
    }
    return { studentName: '', spireId: '' };
}

// Process the base64 image and perform OCR to extract text.
async function processImage(base64Image) {
    try {
        const base64Data = base64Image.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Create a Tesseract worker for OCR processing
        const worker = createWorker();
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        await worker.setParameters({
            tessedit_pageseg_mode: PSM.AUTO // Adjust as needed
        });

        // Perform OCR on the image
        const { data: { text } } = await worker.recognize(imageBuffer);
        await worker.terminate();

        // Extract student data from text
        const studentData = extractInfo(text);
        return studentData;
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image');
    }
}

module.exports = { processImage };