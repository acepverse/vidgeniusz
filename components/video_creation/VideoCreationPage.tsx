import React, { useState } from 'react';
import ParameterSidebar from './ParameterSidebar';
import MainContentArea from './MainContentArea';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleGenAI, Operation } from '@google/genai';
import { addProjectForUser, NewProjectData, Project } from '../../services/database';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3';
export type Resolution = 'otomatis' | '720p' | '1080p';
export type VideoStyle = 'otomatis' | 'realistis' | 'sinematik' | 'pixar style' | '3d render' | 'anime' | '2d kartun' | 'cyberpunk';


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

interface VideoCreationPageProps {
  onPublishProject: (project: Project) => void;
}

const VideoCreationPage: React.FC<VideoCreationPageProps> = ({ onPublishProject }) => {
    const { user, openLoginModal } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Menghasilkan visual & audio...');
    const [videoResultUrl, setVideoResultUrl] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isPublished, setIsPublished] = useState(false);

    // State for parameters
    const [model, setModel] = useState('veo-3.1-fast-generate-preview');
    const [resolution, setResolution] = useState<Resolution>('otomatis');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [style, setStyle] = useState<VideoStyle>('otomatis');
    const [description, setDescription] = useState('');
    const [dialogue, setDialogue] = useState(''); // State baru untuk dialog

    const handleCreateVideo = async () => {
        if (!user) {
            openLoginModal();
            return;
        }
        if (!description && !uploadedImage) {
            setError('Silakan berikan deskripsi atau unggah gambar untuk memulai.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setVideoResultUrl(null);
        setIsSaved(false);
        setIsPublished(false);
        setLoadingMessage('Memulai generasi video...');

        try {
            const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
            if (!hasKey) {
                setLoadingMessage('Silakan pilih kunci API untuk melanjutkan...');
                await (window as any).aistudio?.openSelectKey();
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            let imagePayload;
            if (uploadedImage) {
                setLoadingMessage('Mengonversi gambar...');
                const base64Data = await fileToBase64(uploadedImage);
                imagePayload = {
                    imageBytes: base64Data,
                    mimeType: uploadedImage.type,
                };
            }

            const apiResolution = resolution === 'otomatis' ? '720p' : resolution;

            let finalPrompt = description;
            if (style !== 'otomatis') {
                finalPrompt = `A ${style} style video of ${description}`;
            }
            if (dialogue.trim()) {
                finalPrompt = `${finalPrompt}. A character is speaking the following dialogue with clear, matching lip movements: "${dialogue}"`;
            }


            setLoadingMessage('Mengirim permintaan ke model AI...');
            let operation: Operation = await ai.models.generateVideos({
                model: model,
                prompt: finalPrompt,
                image: imagePayload,
                config: {
                    numberOfVideos: 1,
                    resolution: apiResolution,
                    aspectRatio: aspectRatio
                }
            });

            setLoadingMessage('Video sedang dalam proses... Ini mungkin memakan waktu beberapa menit.');
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10s
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            if (operation.error) {
                throw new Error(`Operasi gagal: ${operation.error.message}`);
            }
            
            setLoadingMessage('Mengambil hasil video...');
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

            if (!downloadLink) {
                 throw new Error('Tautan unduhan video tidak ditemukan di respons API.');
            }

            const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!videoResponse.ok) {
                throw new Error(`Gagal mengambil video: ${videoResponse.statusText}`);
            }

            const videoBlob = await videoResponse.blob();
            const objectUrl = URL.createObjectURL(videoBlob);
            setVideoResultUrl(objectUrl);

        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'Terjadi error yang tidak diketahui.';
             if (errorMessage.includes('Requested entity was not found')) {
                setError('Kunci API tidak valid atau tidak ditemukan. Silakan pilih kunci API lain dari dialog.');
            } else {
                setError(`Terjadi error: ${errorMessage}`);
            }
        } finally {
            setIsLoading(false);
            setLoadingMessage('Menghasilkan visual & audio...');
        }
    };
    
    const handleDeleteVideo = () => {
        if(videoResultUrl) {
            URL.revokeObjectURL(videoResultUrl);
        }
        setVideoResultUrl(null);
        setError(null);
    };

    const getProjectData = (): NewProjectData | null => {
        if (!videoResultUrl) return null;
        return {
            title: description.substring(0, 50) || 'Video Baru',
            type: 'video',
            thumbnailUrl: 'https://assets.mixkit.co/videos/preview/mixkit-a-fox-in-the-snow-4232-large.mp4',
            mediaUrl: videoResultUrl,
            prompt: description,
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
            <h1 className="text-3xl font-bold mb-6 text-white">Video Generation</h1>
            <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
                <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
                    <ParameterSidebar
                        model={model}
                        onModelChange={setModel}
                        resolution={resolution}
                        onResolutionChange={setResolution}
                        aspectRatio={aspectRatio}
                        onAspectRatioChange={setAspectRatio}
                        style={style}
                        onStyleChange={setStyle}
                        dialogue={dialogue}
                        onDialogueChange={setDialogue}
                    />
                </div>
                <div className="w-full lg:w-2/3 xl:w-3/4">
                    <MainContentArea
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                        videoResultUrl={videoResultUrl}
                        description={description}
                        onDescriptionChange={setDescription}
                        uploadedImage={uploadedImage}
                        onImageUpload={setUploadedImage}
                        onCreateVideo={handleCreateVideo}
                        onDeleteVideo={handleDeleteVideo}
                        aspectRatio={aspectRatio}
                        error={error}
                        isSaved={isSaved}
                        onSaveProject={handleSaveProject}
                        onPublishProject={handlePublish}
                        isPublished={isPublished}
                    />
                </div>
            </div>
        </>
    );
};

export default VideoCreationPage;