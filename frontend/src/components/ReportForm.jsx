
import  { useState } from 'react';
import { Camera, MapPin, CreditCard} from 'lucide-react';

function ReportForm() {
    const [itemType, setItemType] = useState('ucard')
    const [formData,setFormData] = useState({
        studentName: '',
        cardNumber: '',
        location: ''
    })

    const handleInputChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    const isFormValid = () => {
        return formData.studentName && formData.cardNumber && formData.location;
    };

    return (
        <form className='flex flex-col  gap-3'>
            <label className = 'flex items-center space-x-3'>
            <div>
                <input
                    type="radio"
                    className="w-6 h-6 opacity-0 absolute"
                    checked={itemType === 'ucard'}
                    onChange={() => setItemType('ucard')}
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    itemType === 'ucard' ? 'border-black' : 'border-gray-300' 
                }`}> 
                {itemType === 'ucard' && (
                    <div className="w-3 h-3 rounded-full bg-black"></div>
                )}
                </div>
            </div>
            <span className="text-base">UCard</span>
            </label>
            
            {itemType === 'ucard' && (
                <button
                    type="button"
                    className='w-full bg-[#212721] text-white rounded-xl py-3 px-4 flex justify-center items-center space-x-2 hover:bg-gray-800 transition-colors'
                >    <Camera className="w-5 h-5 mr-3" />
                    <span>Take a Picture of UCard</span>
                </button>
            )}

            <div className = "space-y-2">
                <label className='block text-base font-semibold'> Student Name</label>
                <input
                    type="text"
                    name="studentName"
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    placeholder='E.g. John Doe'
                    value={formData.studentName}
                    onChange = {handleInputChange}
                />
            </div>
            <div className = "space-y-2">
                <label className='block text-base font-semibold'> Spire ID</label>
                <input
                    type="text"
                    name="cardNumber"
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    placeholder='E.g. 12345678'
                    value = {formData.cardNumber}
                    onChange = {handleInputChange}
                />
            </div>
            <div className = "space-y-2">
                <label className='block text-base font-semibold'>Found Location</label>
                <input
                    type="text"
                    name="location"
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    placeholder='E.g. Franklin 2nd floor, across Deli'
                    value={formData.location}
                    maxLength={8}
                    onChange = {handleInputChange}
                />
            </div>

            <button type = 'submit' className='w-full flex items-center justify-center bg-[#212721] text-white rounded-xl py-3 px-4 space-x-2 hover:bg-gray-500 transition-colors' >
                <MapPin className="w-5 h-5" />
                <span>Map AR Pin to Location</span>
            </button>

            <button
                type="submit"
                className={`w-full flex items-center justify-center ${isFormValid() ? 'bg-gray-400 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} rounded-xl py-3 px-4 space-x-2 hover:bg-gray-500 transition-colors`}
                onClick={handleSubmit}
                disabled = {!isFormValid()}
            >
                <CreditCard className="w-5 h-5" />
                <span>Report Found Item</span>
            </button>
        </form>
        /* Neu lam general item thi them cai nay vo cai form o tren

        <label className = 'flex items-center space-x-3'>
            <div>
                <input
                    type="radio"
                    className="w-6 h-6 opacity-0 absolute"
                    checked={itemType === 'general'}
                    onChange={() => setItemType('general')}
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    itemType === 'general' ? 'border-black' : 'border-gray-300' 
                }`}> 
                {itemType === 'general' && (
                    <div className="w-3 h-3 rounded-full bg-black"></div>
                )}
                </div>
            </div>
            <span className="text-base">General Items</span>
            </label>
        */
    )

}

export default ReportForm;