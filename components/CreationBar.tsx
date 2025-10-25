import React from 'react';
import { ImageIcon, VideoIcon } from './icons';

const CreationBar: React.FC = () => {
    return (
        <div className="sticky bottom-0 bg-black/80 backdrop-blur-sm p-3 border-t border-gray-800">
            <div className="max-w-4xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Describe what you want to create..."
                        className="w-full bg-[#2a2a2a] border border-gray-700 rounded-full py-3 pl-5 pr-28 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                        <button className="p-2 rounded-full hover:bg-gray-700">
                            <ImageIcon className="w-5 h-5 text-gray-300" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-700">
                            <VideoIcon className="w-5 h-5 text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreationBar;
