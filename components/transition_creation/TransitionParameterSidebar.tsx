import React, { FC, ReactNode } from 'react';
import type { TransitionStyle } from './TransitionCreationPage';

interface TransitionParameterSidebarProps {
    style: TransitionStyle;
    onStyleChange: (value: TransitionStyle) => void;
}

const ControlSection: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">{title}</label>
        {children}
    </div>
);

const StyledSelect: FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
     <select
        {...props}
        className="w-full bg-[#1c1c1c] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
        {props.children}
    </select>
);

const TransitionParameterSidebar: React.FC<TransitionParameterSidebarProps> = (props) => {
    return (
        <aside className="bg-[#1c1c1c] p-5 rounded-xl border border-gray-800">
            <h2 className="text-lg font-bold text-white mb-6">Transition Parameters</h2>
            
            <ControlSection title="Transition Style">
                <StyledSelect value={props.style} onChange={(e) => props.onStyleChange(e.target.value as TransitionStyle)}>
                    <option>Fade</option>
                    <option>Dissolve</option>
                    <option>Wipe</option>
                    <option>Slide</option>
                </StyledSelect>
            </ControlSection>

        </aside>
    );
};

export default TransitionParameterSidebar;
