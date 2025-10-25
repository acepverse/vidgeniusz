import React, { FC, ReactNode } from 'react';
// Import updated types
import type { AspectRatio, Resolution, VideoStyle } from './VideoCreationPage';

interface ParameterSidebarProps {
    model: string;
    onModelChange: (value: string) => void;
    resolution: Resolution;
    onResolutionChange: (value: Resolution) => void;
    aspectRatio: AspectRatio;
    onAspectRatioChange: (value: AspectRatio) => void;
    style: VideoStyle;
    onStyleChange: (value: VideoStyle) => void;
    dialogue: string;
    onDialogueChange: (value: string) => void;
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

const ParameterSidebar: React.FC<ParameterSidebarProps> = (props) => {
    return (
        <aside className="bg-[#1c1c1c] p-5 rounded-xl border border-gray-800">
            <h2 className="text-lg font-bold text-white mb-6">Parameter</h2>
            
            <ControlSection title="Model">
                <StyledSelect value={props.model} onChange={(e) => props.onModelChange(e.target.value)}>
                    <option value="veo-3.1-fast-generate-preview">Veo Fast (Cepat)</option>
                    <option value="veo-3.1-generate-preview">Veo HD (Kualitas Tinggi)</option>
                </StyledSelect>
                <p className="text-xs text-gray-500 mt-2">Model HD mendukung fitur lanjutan seperti gambar referensi ganda.</p>
            </ControlSection>

             <ControlSection title="Resolusi">
                <div className="grid grid-cols-3 gap-2">
                     {(['otomatis', '720p', '1080p'] as Resolution[]).map(r => (
                       <OptionButton key={r} onClick={() => props.onResolutionChange(r)} isActive={props.resolution === r}>{r}</OptionButton>
                    ))}
                </div>
            </ControlSection>

            <ControlSection title="Gaya">
                <StyledSelect value={props.style} onChange={(e) => props.onStyleChange(e.target.value as VideoStyle)}>
                    <option value="otomatis">Otomatis</option>
                    <option value="realistis">Realistis</option>
                    <option value="sinematik">Sinematik</option>
                    <option value="pixar style">Pixar Style</option>
                    <option value="3d render">3D Render</option>
                    <option value="anime">Anime</option>
                    <option value="2d kartun">2D Kartun</option>
                    <option value="cyberpunk">Cyberpunk</option>
                </StyledSelect>
                <p className="text-xs text-gray-500 mt-2">Gaya 'Otomatis' akan mencoba mengikuti gaya gambar yang diunggah.</p>
            </ControlSection>
            
            <ControlSection title="Rasio video">
                <div className="grid grid-cols-4 gap-2">
                    {(['1:1', '9:16', '16:9', '4:3'] as AspectRatio[]).map(r => (
                        <OptionButton key={r} onClick={() => props.onAspectRatioChange(r)} isActive={props.aspectRatio === r}>{r}</OptionButton>
                    ))}
                </div>
            </ControlSection>

            <ControlSection title="Dialog (Opsional)">
                <textarea
                    value={props.dialogue}
                    onChange={(e) => props.onDialogueChange(e.target.value)}
                    rows={3}
                    className="w-full bg-[#1c1c1c] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Masukkan dialog di sini..."
                />
                <p className="text-xs text-gray-500 mt-2">
                    AI akan mencoba membuat gerakan mulut yang sesuai dengan dialog. Hasilnya mungkin tidak sinkron sempurna, tetapi ini memberikan arahan visual.
                </p>
            </ControlSection>

        </aside>
    );
};

export default ParameterSidebar;