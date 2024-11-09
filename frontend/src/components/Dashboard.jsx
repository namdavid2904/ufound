import  { useState } from 'react';
import { Camera, MapPin, CreditCard, Search } from 'lucide-react';
import Tabs from './ui/Tabs';



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

}


export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('report');
    



    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-black mb-2">U<span className='text-[#962a3f]'>Found</span></h1>
          <p className="text-gray-500 mb-6">Report or search for lost items</p>
          
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "report" ? <ReportForm/> : null}
          
        </div>
      </div>
    );
  }