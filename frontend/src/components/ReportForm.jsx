import { useState, useRef } from 'react';
import { Camera, CreditCard } from 'lucide-react';

function ReportForm() {
    const [image, setImage] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [itemType, setItemType] = useState('ucard');
    const [cameraOpened, setCameraOpened] = useState(false);

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

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
    };

    const isFormValid = () => {
        return (
            cardFormData.location &&
            image
        );
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setCameraOpened(true);
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

    const TemplateUCard = () => {
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
                <video ref={videoRef} style={{ width: '100%', display: image ? 'none' : 'block' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
                {image ? null : (
                    <button
                        type="button"
                        className='w-full bg-[#212721] text-white rounded-xl py-3 px-4 hover:bg-gray-800 transition-colors'
                        onClick={takePicture}
                    >
                        <span>Take Picture</span>
                    </button>
                )}
                {image && <img src={image} alt="Captured" className="mt-2" />}
            </div>
        );
    };

    return (
        <div>
            <form className='flex flex-col gap-3 border border-color-gray px-4 py-4 rounded-lg' onSubmit={handleSubmit}>
                <h1 className='text-2xl font-semibold'>Report Found Item</h1>
                <h2 className='text-gray-400'>Provide details about the item you found</h2>
                <label className='flex items-center space-x-3'>
                    <div>
                        <input
                            type="radio"
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
                <div className="space-y-2">
                    <label className='block text-base font-semibold'>Found Location</label>
                    <input
                        type="text"
                        name="location"
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                        placeholder='E.g. Park, Street Name'
                        value={cardFormData.location}
                        onChange={handleInputChange}
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full flex items-center justify-center ${isFormValid() ? 'bg-[#962a3f] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} rounded-xl py-3 px-4 space-x-2 hover:bg-gray-500 transition-colors disabled:bg-gray-300`}
                    disabled={!isFormValid()}
                >
                    <CreditCard className="w-5 h-5" />
                    <span>Report Found Item</span>
                </button>
            </form>
            <TemplateUCard />
        </div>
    );
}

export default ReportForm;