import React, { useState } from 'react';
import { Search } from 'lucide-react';

function SearchForm({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real implementation, this would call your search API
      onSearch(searchQuery);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-2">Find Lost Item</h1>
        <p className="text-gray-500 mb-8">Search for your lost item</p>

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-lg font-semibold">
              Search (Name, Description, or Location)
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

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Recently Reported Items</h2>
          {/* This would be populated with your recent items data */}
          <div className="space-y-4">
            {/* Placeholder for recent items list */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchForm;