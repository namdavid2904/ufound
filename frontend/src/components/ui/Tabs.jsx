import PropTypes from 'prop-types';

function Tabs({activeTab, setActiveTab}){
    Tabs.propTypes = { // Add prop types validation
        activeTab: PropTypes.string.isRequired,
        setActiveTab: PropTypes.func.isRequired,
    };
    return (
        <div className='flex w-full rounded-lg bg-gray-100 p-1 mb-6'>
            <button className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${activeTab === 'report'
                    ? 'bg-white text-black shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`} onClick={() => setActiveTab('report')}>
                Report Found Item
            </button>
            <button onClick={() => setActiveTab('search')} className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
          activeTab === 'search'
            ? 'bg-white text-black shadow'
            : 'text-gray-500 hover:text-gray-700'
        }`}>
            Search Lost Item
            </button>
        </div>

        
    )
} 


export default Tabs;