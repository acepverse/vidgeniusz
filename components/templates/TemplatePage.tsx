import React, { useState } from 'react';
import { templates, Template } from './templates';
import TemplateGrid from './TemplateGrid';
import TemplateCreationArea from './TemplateCreationArea';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleGenAI, Modality, Operation } from '@google/genai';

const base64ToBlob = (base64: string, type: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
};


const TemplatePage: React.FC = () => {
    const { user, openLoginModal } = useAuth();
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (template: Template, formData: Record<string, string>): Promise<string | null> => {
        if (!user) {
            openLoginModal();
            return null;
        }
        
        setIsLoading(true);
        setResultUrl(null);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

            if (template.type === 'image') {
                let prompt = '';
                // Construct prompt based on template ID
                switch (template.id) {
                    case 'inspirational-quote':
                        prompt = `Buat gambar kutipan inspirasional yang indah. Kutipan: "${formData.quoteText}" - ${formData.author}. Latar belakang harus: ${formData.backgroundImagePrompt}. Pastikan teksnya mudah dibaca dan bergaya.`;
                        break;
                    case 'ai-avatar-post':
                        prompt = `Hasilkan avatar AI berdasarkan deskripsi ini: ${formData.avatarPrompt}. Tulis juga caption yang cocok: "${formData.postCaption}"`;
                        break;
                    default:
                        prompt = 'Hasilkan gambar berdasarkan data yang diberikan.';
                }
                
                const response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash-image',
                  contents: { parts: [{ text: prompt }] },
                  config: { responseModalities: [Modality.IMAGE] },
                });

                const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
                if (imagePart?.inlineData) {
                    const { data, mimeType } = imagePart.inlineData;
                    const url = `data:${mimeType};base64,${data}`;
                    setResultUrl(url);
                    return url;
                } else {
                    throw new Error('API tidak mengembalikan data gambar.');
                }
            } else { // Video generation
                const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
                if (!hasKey) {
                    await (window as any).aistudio?.openSelectKey();
                }
                
                let prompt = '';
                let imageFieldKey = '';

                switch(template.id) {
                    case 'product-promo':
                        prompt = `Buat video promo produk yang pendek dan menarik untuk "${formData.productName}". Tagline: "${formData.tagline}". Fitur utama: ${formData.features}.`;
                        imageFieldKey = 'productImage';
                        break;
                    case 'event-recap':
                        prompt = `Hasilkan rekap video dinamis untuk "${formData.eventName}" yang diadakan pada ${formData.eventDate}. Sorot momen-momen berikut: ${formData.highlightMoments}.`;
                        imageFieldKey = 'eventLogo';
                        break;
                    case 'real-estate':
                        prompt = `Buat video daftar real estat yang elegan untuk properti di ${formData.address}. Harga: ${formData.price}. Fitur: ${formData.propertyFeatures}.`;
                        imageFieldKey = 'mainImage';
                        break;
                    case 'fashion-lookbook':
                         prompt = `Buat video lookbook fashion yang stylish untuk koleksi "${formData.collectionName}". Deskripsi gaya: ${formData.styleDescription}.`;
                        imageFieldKey = 'modelImage';
                        break;
                }

                const imageBase64WithPrefix = formData[imageFieldKey];
                if (!imageBase64WithPrefix) throw new Error('Gambar referensi tidak ditemukan.');

                const [prefix, base64Data] = imageBase64WithPrefix.split(',');
                const mimeType = prefix.match(/:(.*?);/)?.[1] || 'image/jpeg';

                let operation: Operation = await ai.models.generateVideos({
                    model: 'veo-3.1-fast-generate-preview',
                    prompt: prompt,
                    image: { imageBytes: base64Data, mimeType },
                    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
                });

                while (!operation.done) {
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    operation = await ai.operations.getVideosOperation({ operation: operation });
                }
                 if (operation.error) throw new Error(`Operasi gagal: ${operation.error.message}`);
                
                const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
                if (!downloadLink) throw new Error('Tautan unduhan video tidak ditemukan.');

                const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                if (!videoResponse.ok) throw new Error(`Gagal mengambil video: ${videoResponse.statusText}`);

                const videoBlob = await videoResponse.blob();
                const url = URL.createObjectURL(videoBlob);
                setResultUrl(url);
                return url;
            }

        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'Terjadi error yang tidak diketahui.';
            if (errorMessage.includes('Requested entity was not found')) {
                setError('Kunci API tidak valid atau tidak ditemukan. Silakan pilih kunci API lain dari dialog.');
            } else {
                setError(`Terjadi error: ${errorMessage}`);
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleBack = () => {
        setSelectedTemplate(null);
        setResultUrl(null);
        setError(null);
    }

    if (selectedTemplate) {
        return (
            <TemplateCreationArea 
                template={selectedTemplate}
                onGenerate={() => handleGenerate(selectedTemplate, {})}
                onBack={handleBack}
                isLoading={isLoading}
                resultUrl={resultUrl}
                error={error}
            />
        );
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-2 text-white">Templates</h1>
            <p className="text-gray-400 mb-6">Choose a template to get started quickly.</p>
            <TemplateGrid 
                templates={templates} 
                onSelectTemplate={setSelectedTemplate} 
            />
        </>
    );
};

export default TemplatePage;
