import React, { useState, useRef } from 'react';
import { Camera, CreditCard, MapPin } from 'lucide-react';
import mockItems from './mock/mockdata';

function ReportForm() {
    const [image, setImage] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [itemType, setItemType] = useState('ucard');
    const [cameraOpened, setCameraOpened] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });

    const [formData, setFormData] = useState({
        studentName: '',
        spireId: '',
        itemDescription: '',
        location: '',
        pinLocation: '',
        image: '',
        latitude: null,
        longitude: null,
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    //MOCK DEMO 
    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = {
          id: mockItems.length + 1,
          type: itemType,
          studentName: "Minh Tuong Nguyen",
          spireId: 34451343,
          location: "Hamlin",
          date: new Date().toISOString().split('T')[0],
          image: formData.image,
          latitude: formData.latitude,
          longitude: formData.longitude,
        };
        mockItems.push(newItem);
        setSuccessMessage('Item reported successfully!');
        // Reset form
        setFormData({
          studentName: '',
          spireId: '',
          location: '',
          pinLocation: '',
          image: '',
          latitude: null,
          longitude: null,
        });
      };

    const startCamera = async () => {
        setImage(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: "environment" } }
            });
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
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
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
        }
    };

    const takePicture = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setImage(dataUrl);
        setFormData(prevData => ({
            ...prevData,
            image: dataUrl
        }));
    };

    const handleMapPinClick = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
                setFormData((prevData) => ({
                    ...prevData,
                    latitude,
                    longitude,
                }));
            },
            (error) => console.error("Error fetching location: ", error),
            { enableHighAccuracy: true }
        );
    };

    const isFormValid = () => {
        if (itemType === 'ucard') {
            return formData.location && image;
        } else {
            return formData.itemDescription && formData.location && image;
        }
    };

    return (
        <div>
            {successMessage && (
                <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            <form className='flex flex-col gap-3 border border-color-gray px-4 py-4 rounded-lg' onSubmit={handleSubmit}>
                <h1 className='text-2xl font-semibold'>Report Found Item</h1>
                <h2 className='text-gray-400'>Provide details about the item you found</h2>
                <div className="flex space-x-4">
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
                        <span className="text-base">General Item</span>
                    </label>
                </div>
                
                <div className='flex flex-col gap-3'>
                    <button
                        type="button"
                        className='w-full bg-[#212721] text-white rounded-xl py-3 px-4 flex justify-center items-center space-x-2 hover:bg-gray-800 transition-colors'
                        onClick={startCamera}
                    >
                        <Camera className="w-5 h-5 mr-3" />
                        <span>{itemType === 'ucard' ? 'Auto Parse UCard' : 'Capture Item'}</span>
                    </button>

                    <div>
                        <video
                            ref={videoRef}
                            style={{ width: '100%', display: cameraOpened && !image ? 'block' : 'none' }}
                            playsInline
                        />
                        <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
                    </div>

                    {cameraOpened && !image && (
                        <button
                            type="button"
                            className='w-full bg-[#212721] text-white rounded-xl py-3 px-4 hover:bg-gray-800 transition-colors'
                            onClick={takePicture}
                        >
                            <span>Take Picture</span>
                        </button>
                    )}

                    {image && <img src={image} alt="Captured" className="mt-2" />}

                    {itemType === 'ucard' ? (
                        <>  
                            
                        </>
                    ) : (
                        <div className="space-y-2">
                            <label htmlFor="itemDescription" className='block text-base font-semibold'>Item Description</label>
                            <textarea
                                id="itemDescription"
                                name="itemDescription"
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                placeholder='Describe the item you found'
                                value={formData.itemDescription}
                                onChange={handleInputChange}
                                rows={4}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="location" className='block text-base font-semibold'>Found Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                            placeholder='E.g. Library, 2nd floor'
                            value={formData.location}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleMapPinClick}
                    className="btn w-full flex items-center justify-center bg-gray-700 rounded-md px-2 py-2 text-gray-100 mt-4"
                >
                    <MapPin className="mr-2 h-4 w-4" /> Pin Location for AR/Map
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
        </div>
    );
}

export default ReportForm;