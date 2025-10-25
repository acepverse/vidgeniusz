import React, { FC, ReactNode } from 'react';
import type { VoiceOption, SpeechStyle } from './AudioCreationPage';

interface AudioParameterSidebarProps {
    model: string;
    onModelChange: (value: string) => void;
    voice: VoiceOption;
    onVoiceChange: (value: VoiceOption) => void;
    style: SpeechStyle;
    onStyleChange: (value: SpeechStyle) => void;
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


const AudioParameterSidebar: React.FC<AudioParameterSidebarProps> = (props) => {
    return (
        <aside className="bg-[#1c1c1c] p-5 rounded-xl border border-gray-800">
            <h2 className="text-lg font-bold text-white mb-6">Audio Parameters</h2>
            
            <ControlSection title="Model">
                <StyledSelect value={props.model} onChange={(e) => props.onModelChange(e.target.value)}>
                    <option value="gemini-2.5-flash-preview-tts">Gemini TTS</option>
                </StyledSelect>
            </ControlSection>

            <ControlSection title="Voice">
                 <StyledSelect value={props.voice} onChange={(e) => props.onVoiceChange(e.target.value as VoiceOption)}>
                    <option value="Kore">Kore (Female)</option>
                    <option value="Puck">Puck (Male)</option>
                    <option value="Charon">Charon (Male, Deep)</option>
                    <option value="Fenrir">Fenrir (Male, Breathy)</option>
                    <option value="Zephyr">Zephyr (Female, Warm)</option>
                </StyledSelect>
            </ControlSection>
            
            <ControlSection title="Speech Style">
                 <StyledSelect value={props.style} onChange={(e) => props.onStyleChange(e.target.value as SpeechStyle)}>
                    <option>Default</option>
                    <option>Cheerful</option>
                    <option>Serious</option>
                    <option>Emotive</option>
                </StyledSelect>
                <p className="text-xs text-gray-500 mt-2">Guides the model on the tone of voice to use.</p>
            </ControlSection>

        </aside>
    );
};

export default AudioParameterSidebar;
