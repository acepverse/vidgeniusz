import React, { FC, ReactNode } from 'react';
import type { OutputType } from './StyleFusionPage';

interface StyleFusionParameterSidebarProps {
    outputType: OutputType;
    onOutputTypeChange: (value: OutputType) => void;
}

const ControlSection: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">{title}</label>
        {children}
    </div>
);

const OptionButton: FC<{ onClick: () => void; isActive: boolean; children: ReactNode }> = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-purple-600 text-white'
                : 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);

const StyleFusionParameterSidebar: React.FC<StyleFusionParameterSidebarProps> = (props) => {
    return (
        <aside className="bg-[#1c1c1c] p-5 rounded-xl border border-gray-800">
            <h2 className="text-lg font-bold text-white mb-6">Parameter Fusi</h2>
            
            <ControlSection title="Tipe Output">
                <div className="grid grid-cols-2 gap-2">
                    <OptionButton onClick={() => props.onOutputTypeChange('image')} isActive={props.outputType === 'image'}>Gambar</OptionButton>
                    <OptionButton onClick={() => props.onOutputTypeChange('video')} isActive={props.outputType === 'video'}>Video</OptionButton>
                </div>
                 <p className="text-xs text-gray-500 mt-2">Output video memerlukan model Veo HD dan mungkin membutuhkan waktu lebih lama.</p>
            </ControlSection>
        </aside>
    );
};

export default StyleFusionParameterSidebar;
