import React from 'react';
import { SearchIcon } from './icons';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="mb-6">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-500" />
                </span>
                <input
                    type="text"
                    placeholder="Cari prompt atau gaya..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-full py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
        </div>
    );
};

export default SearchBar;
