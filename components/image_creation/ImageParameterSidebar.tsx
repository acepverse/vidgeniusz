import React, { FC, ReactNode, useRef, useState, useEffect, DragEvent } from 'react';
import type { ImageAspectRatio, ImageStyle, ImageQuality } from './ImageCreationPage';
import { UploadIcon, ResetIcon } from '../icons';

interface ImageParameterSidebarProps {
    model: string;
    onModelChange: (value: string) => void;
    style: ImageStyle;
    onStyleChange: (value: ImageStyle) => void;
    aspectRatio: ImageAspectRatio;
    onAspectRatioChange: (value: ImageAspectRatio) => void;
    quality: ImageQuality;
    onQualityChange: (value: ImageQuality) => void;
    faceImage: File | null;
    onFaceImageUpload: (file: File | null) => void;
    productImage: File | null;
    onProductImageUpload: (file: File | null) => void;
    onReset: () => void;
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

const ImageUploadSlot: FC<{ title: string; file: File | null; onFileChange: (file: File | null) => void; }> = ({ title, file, onFileChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        return () => {
          reader.onloadend = null;
        }
    }, [file]);

    const handleFileSelect = (files: FileList | null) => {
        onFileChange(files?.[0] || null);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFileSelect(e.dataTransfer.files);
    };

    return (
        <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative cursor-pointer aspect-square bg-[#2a2a2a] border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-lg flex items-center justify-center text-center transition-colors p-2"
        >
            <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files)} className="hidden" accept="image/*" />
            {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
            ) : (
                <div className="flex flex-col items-center text-gray-500">
                    <UploadIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs font-semibold">{title}</span>
                </div>
            )}
        </div>
    );
};


const ImageParameterSidebar: React.FC<ImageParameterSidebarProps> = (props) => {
    return (
        <aside className="bg-[#1c1c1c] p-5 rounded-xl border border-gray-800">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Parameter Gambar</h2>
                <button onClick={props.onReset} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                    <ResetIcon className="w-4 h-4" />
                    Reset Semua
                </button>
            </div>
            
            <ControlSection title="Model">
                <StyledSelect value={props.model} onChange={(e) => props.onModelChange(e.target.value)}>
                    <option value="imagen-4.0-generate-001">Imagen 4</option>
                    <option value="gemini-2.5-flash-image">Gemini Flash Image</option>
                </StyledSelect>
                <p className="text-xs text-gray-500 mt-2">Gemini Flash akan digunakan secara otomatis jika gambar referensi diunggah.</p>
            </ControlSection>

            <ControlSection title="Gambar Referensi">
                <div className="grid grid-cols-2 gap-3">
                    <ImageUploadSlot title="Wajah / Model" file={props.faceImage} onFileChange={props.onFaceImageUpload} />
                    <ImageUploadSlot title="Produk / Gaya" file={props.productImage} onFileChange={props.onProductImageUpload} />
                </div>
                <p className="text-xs text-gray-500 mt-2">Gabungkan wajah model dengan produk atau gaya referensi.</p>
            </ControlSection>


            <ControlSection title="Gaya">
                 <StyledSelect value={props.style} onChange={(e) => props.onStyleChange(e.target.value as ImageStyle)}>
                    <option>Realistis</option>
                    <option>Sinematik</option>
                    <option>Pixar Style</option>
                    <option>3D Render</option>
                    <option>Anime</option>
                    <option>2D Kartun</option>
                    <option>Photoreal</option>
                    <option>Fashion Look</option>
                    <option>Studio Portrait</option>
                </StyledSelect>
            </ControlSection>
            
            <ControlSection title="Rasio Aspek">
                <div className="grid grid-cols-3 gap-2">
                    {(['1:1', '3:4', '9:16', '16:9', '4:5'] as ImageAspectRatio[]).map(r => (
                        <OptionButton key={r} onClick={() => props.onAspectRatioChange(r)} isActive={props.aspectRatio === r}>{r}</OptionButton>
                    ))}
                </div>
            </ControlSection>

            <ControlSection title="Kualitas Gambar">
                 <StyledSelect value={props.quality} onChange={(e) => props.onQualityChange(e.target.value as ImageQuality)}>
                    <option>HD</option>
                    <option>UHD</option>
                    <option>Ultra HD</option>
                    <option>4K Detail</option>
                    <option>8K Detail</option>
                </StyledSelect>
            </ControlSection>

        </aside>
    );
};

export default ImageParameterSidebar;
