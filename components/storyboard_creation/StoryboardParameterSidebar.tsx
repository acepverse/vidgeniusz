import React, { FC, ReactNode } from 'react';
import type { StoryboardStyle, StoryboardAspectRatio } from './StoryboardCreationPage';

interface StoryboardParameterSidebarProps {
    style: StoryboardStyle;
    onStyleChange: (value: StoryboardStyle) => void;
    aspectRatio: StoryboardAspectRatio;
    onAspectRatioChange: (value: StoryboardAspectRatio) => void;
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

const StyledSelect: FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
     <select
        {...props}
        className="w-full bg-[#1c1c1c] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
        {props.children}
    </select>
);

const StoryboardParameterSidebar: React.FC<StoryboardParameterSidebarProps> = ({ style, onStyleChange, aspectRatio, onAspectRatioChange }) => {
    return (
        <aside className="bg-[#1c1c1c] p-5 rounded-xl border border-gray-800">
            <h2 className="text-lg font-bold text-white mb-6">Parameter</h2>
            
            <ControlSection title="Gaya / Style">
                <StyledSelect value={style} onChange={(e) => onStyleChange(e.target.value as StoryboardStyle)}>
                    <option value="realistis">Realistis</option>
                    <option value="sinematik">Sinematik</option>
                    <option value="3d pixar style">3D Pixar Style</option>
                    <option value="3d render">3D Render</option>
                    <option value="anime">Anime</option>
                    <option value="2d kartun">2D Kartun</option>
                </StyledSelect>
            </ControlSection>
            
            <ControlSection title="Aspek Rasio">
                <div className="grid grid-cols-2 gap-2">
                    {(['16:9', '9:16', '4:5', '4:3'] as StoryboardAspectRatio[]).map(r => (
                        <OptionButton key={r} onClick={() => onAspectRatioChange(r)} isActive={aspectRatio === r}>{r}</OptionButton>
                    ))}
                </div>
            </ControlSection>
        </aside>
    );
};

export default StoryboardParameterSidebar;
