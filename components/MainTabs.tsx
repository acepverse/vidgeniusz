
import React from 'react';
import { MainTab } from '../App';

interface MainTabsProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

const MainTabs: React.FC<MainTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: MainTab[] = ['All', 'Video', 'Agen', 'Template'];

  return (
    <div className="flex items-center gap-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`relative px-4 py-2 rounded-full text-md font-medium transition-colors ${
            activeTab === tab ? 'bg-[#2a2a2a] text-white' : 'text-gray-400'
          }`}
        >
          {tab}
          {tab === 'Agen' && (
             <span className="absolute -top-1 -right-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              New
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default MainTabs;