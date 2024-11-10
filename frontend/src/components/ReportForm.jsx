import { useState, useRef } from 'react';
import { Camera, CreditCard, MapPin } from 'lucide-react';

function ReportForm() {
    const [image, setImage] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [itemType, setItemType] = useState('ucard');
    const [cameraOpened, setCameraOpened] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [cardFormData, setCardFormData] = useState({
        studentName: '',
        cardNumber: '',
        location: '',
        pinLocation: '',
        image: '',
    });

    const handleInputChange = (e) => {
        setCardFormData({
            ...cardFormData,
            [e.target.name]: e.target.value
        });
    };

    const base64ToBlob = (base64, type = 'image/png') => {
        const byteCharacters = atob(base64.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('studentName', cardFormData.studentName);
        formData.append('cardNumber', cardFormData.cardNumber);
        formData.append('location', cardFormData.location);
        if (image) {
            const blob = base64ToBlob(image);
            formData.append('image', blob, 'ucard.png');
        }

        // Process formData (e.g., send to server)
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        // Reset form states to default
        setCardFormData({
            studentName: '',
            cardNumber: '',
            location: '',
            pinLocation: '',
            image: '',
        });
        setImage(null);
        setCameraOpened(false);
        setItemType('ucard');

        // Stop the video stream if active
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }

        // Set success message
        setSuccessMessage('Report submitted successfully');

        // Optionally hide the message after a few seconds
        setTimeout(() => {
            setSuccessMessage('');
        }, 5000);
    };

    const startCamera = async () => {
        setImage(null); // Clear previous image
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;

            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play()
                    .then(() => {
                        setCameraOpened(true);
                    })
                    .catch((playError) => {
                        console.error("Error playing the video: ", playError);
                    });
            };
        } catch (err) {
            console.error("Error accessing the camera: ", err);
        }
    };

    const takePicture = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setImage(dataUrl);
        setCardFormData(prevData => ({
            ...prevData,
            image: dataUrl
        }));
    };

    const handleMapPinClick = () => {
        // Implement your mapping logic here
        // After mapping is complete, set isPinMapped to true
        setCardFormData(prevData => ({
            ...prevData,
            pinLocation: 'Mapped Location'
        }));
    };

    const isFormValid = () => {
        return (
            cardFormData.location &&
            image
        );
    };

    return (
        <div>
            {/* Display success message */}
            {successMessage && (
                <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            <form className='flex flex-col gap-3 border border-color-gray px-4 py-4 rounded-lg' onSubmit={handleSubmit}>
                <h1 className='text-2xl font-semibold'>Report Found Item</h1>
                <h2 className='text-gray-400'>Provide details about the item you found</h2>
                <label className='flex items-center space-x-3'>
                    <div>
                        <input
                            type="radio"
                            name="itemType"
                            className="w-6 h-6 opacity-0 absolute"
                            checked={itemType === 'ucard'}
                            onChange={() => setItemType('ucard')}
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${itemType === 'ucard' ? 'border-black' : 'border-gray-300'}`}>
                            {itemType === 'ucard' && <div className="w-3 h-3 rounded-full bg-black"></div>}
                        </div>
                    </div>
                    <span className="text-base">UCard</span>
                </label>
                <label className='flex items-center space-x-3'>
                    <div>
                        <input
                            type="radio"
                            name="itemType"
                            className="w-6 h-6 opacity-0 absolute"
                            checked={itemType === 'general'}
                            onChange={() => setItemType('general')}
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${itemType === 'general' ? 'border-black' : 'border-gray-300'}`}>
                            {itemType === 'general' && <div className="w-3 h-3 rounded-full bg-black"></div>}
                        </div>
                    </div>
                    <span className="text-base">General Items</span>
                </label>
                <TemplateUCard
                    startCamera={startCamera}
                    takePicture={takePicture}
                    videoRef={videoRef}
                    canvasRef={canvasRef}
                    cameraOpened={cameraOpened}
                    image={image}
                    cardFormData={cardFormData}
                    handleInputChange={handleInputChange}
                />
                <button
                type="button"
                onClick={handleMapPinClick}
                className="btn w-full flex items-center justify-center bg-gray-700 rounded-md px-2 py-2 text-gray-100 mt-4"
            >
                <MapPin className="mr-2 h-4 w-4" /> Map AR Pin to Location
            </button>
                <button
                    type="submit"
                    className={`w-full flex items-center justify-center ${isFormValid() ? 'bg-[#962a3f] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} rounded-xl py-3 px-4 space-x-2 hover:bg-gray-500 transition-colors disabled:bg-gray-300`}
                    disabled={!isFormValid()}
                >
                    <CreditCard className="w-5 h-5" />
                    <span>Report Found Item</span>
                </button>
            </form>

            {/* Map AR Pin to Location Button */}
            
        </div>
    );
}

export default ReportForm;

function TemplateUCard(props) {
    const {
        startCamera,
        takePicture,
        videoRef,
        canvasRef,
        cameraOpened,
        image,
        cardFormData,
        handleInputChange
    } = props;

    return (
        <div className='flex flex-col gap-3'>
            <button
                type="button"
                className='w-full bg-[#212721] text-white rounded-xl py-3 px-4 flex justify-center items-center space-x-2 hover:bg-gray-800 transition-colors'
                onClick={startCamera}
            >
                <Camera className="w-5 h-5 mr-3" />
                <span>Open Camera</span>
            </button>

            {/* Video Element */}
            <div>
                <video
                    ref={videoRef}
                    style={{ width: '100%', display: cameraOpened && !image ? 'block' : 'none' }}
                    playsInline
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
            </div>

            {/* "Take Picture" Button */}
            {cameraOpened && !image && (
                <button
                    type="button"
                    className='w-full bg-[#212721] text-white rounded-xl py-3 px-4 hover:bg-gray-800 transition-colors'
                    onClick={takePicture}
                >
                    <span>Take Picture</span>
                </button>
            )}

            {/* Display Captured Image */}
            {image && <img src={image} alt="Captured" className="mt-2" />}

            {/* Found Location Input */}
            <div className="space-y-2">
                <label htmlFor="location" className='block text-base font-semibold'>Found Location</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    placeholder='E.g. Park, Street Name'
                    value={cardFormData.location}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
}