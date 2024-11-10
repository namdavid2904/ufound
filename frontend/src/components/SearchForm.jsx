import React, { useState } from 'react';
import { Search } from 'lucide-react';
import mockItems from './mock/mockdata';

function SearchForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentItems, setRecentItems] = useState(mockItems);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = mockItems.filter(item =>
        (item.type === 'ucard' && (
          item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.locationFound.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.finderEmail.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (item.type === 'general' && (
          item.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.locationFound.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
      setSearchResults(results);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm p-3 border border-gray-300">
        <h1 className="text-3xl font-bold mb-2">Find Lost Item</h1>
        <p className="text-gray-500 mb-10">Search for your lost item</p>
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-md font-semibold">
              Search (Name, SpireID, Description, or Location)
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="E.g., John Doe, 1234, Blue Backpack, or Library"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white rounded-xl py-3 px-4 flex items-center justify-center space-x-2 hover:bg-gray-900 transition-colors"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          <div className="space-y-4">
            {searchResults.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">{item.type === 'ucard' ? item.studentName : item.itemDescription}</h3>
                <p className="text-sm text-gray-600">{item.locationFound}</p>
                {item.type === 'ucard' && <p className="text-sm text-gray-500">{item.finderEmail}</p>}
                <img src={item.imageUrl} alt={item.type === 'ucard' ? 'UCard' : item.itemDescription} className="w-full h-auto mt-2" />
                <p className="text-sm text-gray-500">{item.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Recently Reported Items</h2>
        <div className="space-y-4">
          {recentItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{item.type === 'ucard' ? item.studentName : item.itemDescription}</h3>
              <p className="text-sm text-gray-600">{item.locationFound}</p>
              {item.type === 'ucard' && <p className="text-sm text-gray-500">{item.finderEmail}</p>}
              <img src={item.imageUrl} alt={item.type === 'ucard' ? 'UCard' : item.itemDescription} className="w-full h-auto mt-2" />
              <p className="text-sm text-gray-500">{item.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchForm;