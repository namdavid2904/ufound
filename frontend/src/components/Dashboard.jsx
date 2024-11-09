import  { useState } from 'react';

import Tabs from './ui/Tabs';
import ReportForm from './ReportForm';





export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('report');
    



    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-semibold text-black mb-2">U<span className='text-[#962a3f]'>Found</span></h1>
          <p className="text-gray-500 mb-6">Report or search for lost items</p>
          
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "report" ? <ReportForm/> : null}
          
        </div>
      </div>
    );
  }