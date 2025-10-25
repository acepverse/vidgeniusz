import React, { useState } from 'react';
import ImageParameterSidebar from './ImageParameterSidebar';
import ImageMainContentArea from './ImageMainContentArea';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleGenAI, Modality, Part } from '@google/genai';
import { addProjectForUser, NewProjectData, Project } from '../../services/database';

export type ImageAspectRatio = '1:1' | '3:4' | '9:16' | '16:9' | '4:5';
export type ImageStyle = 
    | 'Realistis' 
    | 'Sinematik' 
    | 'Pixar Style' 
    | '3D Render' 
    | 'Anime' 
    | '2D Kartun' 
    | 'Photoreal' 
    | 'Fashion Look' 
    | 'Studio Portrait';
export type ImageQuality = 'HD' | 'UHD' | 'Ultra HD' | '4K Detail' | '8K Detail';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });

interface ImageCreationPageProps {
  onPublishProject: (project: Project) => void;
}

const ImageCreationPage: React.FC<ImageCreationPageProps> = ({ onPublishProject }) => {
    const { user, openLoginModal } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [imageResultUrl, setImageResultUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [animationPrompt, setAnimationPrompt] = useState<string | null>(null);
    const [isGeneratingAnimationPrompt, setIsGeneratingAnimationPrompt] = useState(false);

    // State for parameters
    const [model, setModel] = useState('imagen-4.0-generate-001');
    const [style, setStyle] = useState<ImageStyle>('Realistis');
    const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>('1:1');
    const [quality, setQuality] = useState<ImageQuality>('HD');
    const [prompt, setPrompt] = useState('');
    const [faceImage, setFaceImage] = useState<File | null>(null);
    const [productImage, setProductImage] = useState<File | null>(null);

    const generateAnimationPrompt = async (base64Data: string, mimeType: string, originalPrompt: string) => {
        setIsGeneratingAnimationPrompt(true);
        setAnimationPrompt(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const systemPrompt = "You are an expert in video animation. Based on the provided image and its original prompt, create a concise and creative prompt for a short video animation. The animation should bring the image to life with subtle movements. Describe camera movement, subject animation, and environmental effects. Keep the prompt under 50 words and output only the prompt text, nothing else. For example: 'A slow dolly zoom on the character, their hair gently blowing in the wind, with dust motes drifting in the sunbeams.'";
            
            const imagePart = { inlineData: { mimeType: mimeType, data: base64Data } };
            const textPart = { text: `Original prompt: "${originalPrompt}"` };
    
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, textPart] },
                config: { systemInstruction: systemPrompt },
            });
            
            setAnimationPrompt(response.text);
    
        } catch (e) {
            console.error("Failed to generate animation prompt:", e);
        } finally {
            setIsGeneratingAnimationPrompt(false);
        }
    };
    
    const handleGenerateImage = async () => {
        if (!user) {
            openLoginModal();
            return;
        }
        if (!prompt.trim()) {
            setError('Silakan masukkan prompt untuk menghasilkan gambar.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setImageResultUrl(null);
        setAnimationPrompt(null); 
        setIsSaved(false);
        setIsPublished(false);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const fullPrompt = `${style}, ${quality} quality. ${prompt}`;
            
            const effectiveModel = (faceImage || productImage) ? 'gemini-2.5-flash-image' : model;

            if (effectiveModel === 'imagen-4.0-generate-001') {
                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: fullPrompt,
                    config: {
                      numberOfImages: 1,
                      outputMimeType: 'image/jpeg',
                      aspectRatio: aspectRatio,
                    },
                });

                const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                if (base64ImageBytes) {
                    setImageResultUrl(`data:image/jpeg;base64,${base64ImageBytes}`);
                    await generateAnimationPrompt(base64ImageBytes, 'image/jpeg', fullPrompt);
                } else {
                    throw new Error('API tidak mengembalikan data gambar.');
                }
            } else { // Using gemini-2.5-flash-image
                const imageParts: Part[] = [];
                if (faceImage) {
                    const data = await fileToBase64(faceImage);
                    imageParts.push({ inlineData: { mimeType: faceImage.type, data } });
                }
                if (productImage) {
                    const data = await fileToBase64(productImage);
                    imageParts.push({ inlineData: { mimeType: productImage.type, data } });
                }

                const response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash-image',
                  contents: { parts: [{ text: fullPrompt }, ...imageParts] },
                  config: { responseModalities: [Modality.IMAGE] },
                });

                const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
                if (imagePart?.inlineData) {
                    const { data, mimeType } = imagePart.inlineData;
                    setImageResultUrl(`data:${mimeType};base64,${data}`);
                    await generateAnimationPrompt(data, mimeType, fullPrompt);
                } else {
                    throw new Error('API tidak mengembalikan data gambar.');
                }
            }

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'Terjadi error yang tidak diketahui saat menghasilkan gambar.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setModel('imagen-4.0-generate-001');
        setStyle('Realistis');
        setAspectRatio('1:1');
        setQuality('HD');
        setFaceImage(null);
        setProductImage(null);
        setError(null);
    };
    
    const getProjectData = (): NewProjectData | null => {
        if (!imageResultUrl) return null;
        return {
            title: prompt.substring(0, 50) || 'Gambar Baru',
            type: 'image',
            thumbnailUrl: imageResultUrl,
            mediaUrl: imageResultUrl,
            prompt: prompt,
        };
    };

    const handleSaveProject = () => {
        if (!user) return;
        const projectData = getProjectData();
        if (projectData) {
            addProjectForUser(user.id, projectData);
            setIsSaved(true);
            alert('Proyek berhasil disimpan!');
        }
    };

    const handlePublish = () => {
        if (!user) return;
        const projectData = getProjectData();
        if (projectData) {
            const newProject = addProjectForUser(user.id, projectData);
            onPublishProject(newProject);
            setIsSaved(true);
            setIsPublished(true);
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold mb-6 text-white">Image Generation</h1>
            <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
                <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
                    <ImageParameterSidebar
                        model={model}
                        onModelChange={setModel}
                        style={style}
                        onStyleChange={setStyle}
                        aspectRatio={aspectRatio}
                        onAspectRatioChange={setAspectRatio}
                        quality={quality}
                        onQualityChange={setQuality}
                        faceImage={faceImage}
                        onFaceImageUpload={setFaceImage}
                        productImage={productImage}
                        onProductImageUpload={setProductImage}
                        onReset={handleReset}
                    />
                </div>
                <div className="w-full lg:w-2/3 xl:w-3/4">
                    <ImageMainContentArea
                        isLoading={isLoading}
                        imageResultUrl={imageResultUrl}
                        prompt={prompt}
                        onPromptChange={setPrompt}
                        onGenerate={handleGenerateImage}
                        aspectRatio={aspectRatio}
                        error={error}
                        onDelete={() => {
                            setImageResultUrl(null);
                            setError(null);
                            setAnimationPrompt(null);
                        }}
                        isSaved={isSaved}
                        onSaveProject={handleSaveProject}
                        isPublished={isPublished}
                        onPublishProject={handlePublish}
                        animationPrompt={animationPrompt}
                        isGeneratingAnimationPrompt={isGeneratingAnimationPrompt}
                    />
                </div>
            </div>
        </>
    );
};

export default ImageCreationPage;