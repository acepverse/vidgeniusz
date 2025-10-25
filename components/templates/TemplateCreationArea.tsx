import React, { useState, useRef, DragEvent, FC } from 'react';
import { Template, TemplateField } from './templates';
import { UploadIcon } from '../icons';
import { GoogleGenAI, Modality, Operation } from '@google/genai';

interface TemplateCreationAreaProps {
    template: Template;
    onGenerate: (template: Template, formData: Record<string, string>) => Promise<string | null>; // Updated to be async
    onBack: () => void;
    isLoading: boolean;
    resultUrl: string | null;
    error: string | null;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // Keep the prefix for ImageInputField preview
        resolve(result);
    };
    reader.onerror = (error) => reject(error);
  });


const ImageInputField: FC<{ field: TemplateField; value: string; onChange: (value: string) => void }> = ({ field, value, onChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(value || null);

    const handleFileChange = async (files: FileList | null) => {
        const file = files?.[0];
        if (file) {
            const base64String = await fileToBase64(file);
            setPreview(base64String);
            onChange(base64String); // Pass base64 with prefix
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFileChange(e.dataTransfer.files);
    };

    return (
        <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative cursor-pointer aspect-video bg-[#1c1c1c] border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-lg flex items-center justify-center text-center transition-colors p-4"
        >
            <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} className="hidden" accept="image/*" />
            {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-md" />
            ) : (
                <div className="flex flex-col items-center text-gray-500">
                    <UploadIcon className="w-8 h-8 mb-2" />
                    <span className="font-semibold">{field.label}</span>
                </div>
            )}
        </div>
    );
};

const TemplateCreationArea: React.FC<TemplateCreationAreaProps> = ({ template, onGenerate, onBack, isLoading, resultUrl, error }) => {
    const [formData, setFormData] = useState<Record<string, string>>(() =>
        template.fields.reduce((acc, field) => {
            acc[field.id] = field.defaultValue || '';
            return acc;
        }, {} as Record<string, string>)
    );

    const handleInputChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const isGenerationDisabled = template.fields.some(field => !formData[field.id]);

    const ResultArea = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center bg-[#1c1c1c] border border-gray-800 rounded-xl p-8 w-full aspect-video">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400"></div>
                    <p className="mt-4 text-gray-300">Generating from template...</p>
                </div>
            );
        }
        
        if (error) {
             return (
                <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg p-4">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )
        }

        if (resultUrl) {
            if (template.type === 'video') {
                 return (
                    <div className="rounded-xl overflow-hidden border border-gray-800 aspect-video">
                         <video src={resultUrl} controls autoPlay loop className="w-full h-full object-cover" />
                    </div>
                );
            }
            return (
                <div className="rounded-xl overflow-hidden border border-gray-800 aspect-square max-w-lg mx-auto">
                    <img src={resultUrl} alt="Generated from template" className="w-full h-full object-cover" />
                </div>
            );
        }

        return null;
    };


    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="text-gray-400 hover:text-white">&larr; Back to Templates</button>
                <h1 className="text-3xl font-bold text-white">{template.title}</h1>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2 space-y-4">
                    {template.fields.map(field => (
                        <div key={field.id}>
                            <label className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
                            {field.type === 'text' && (
                                <input
                                    type="text"
                                    value={formData[field.id]}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="w-full bg-[#1c1c1c] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            )}
                            {field.type === 'textarea' && (
                                <textarea
                                    value={formData[field.id]}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    rows={4}
                                    className="w-full bg-[#1c1c1c] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                />
                            )}
                            {field.type === 'image' && (
                                <ImageInputField field={field} value={formData[field.id]} onChange={(value) => handleInputChange(field.id, value)} />
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => onGenerate(template, formData)}
                        disabled={isLoading || isGenerationDisabled}
                        className="w-full mt-4 text-lg font-bold bg-teal-500 text-white py-3 px-6 rounded-full transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(45,212,191,0.7)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>

                <div className="w-full lg:w-1/2">
                    <ResultArea />
                </div>
            </div>
        </div>
    );
};

export default TemplateCreationArea;
