import React, { useState } from 'react';
import TransitionParameterSidebar from './TransitionParameterSidebar';
import TransitionMainContentArea from './TransitionMainContentArea';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleGenAI, Operation } from '@google/genai';

export type TransitionStyle = 'Fade' | 'Dissolve' | 'Wipe' | 'Slide';

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

const TransitionCreationPage: React.FC = () => {
    const { user, openLoginModal } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Generating transition...');
    const [videoResultUrl, setVideoResultUrl] = useState<string | null>(null);
    const [startImage, setStartImage] = useState<File | null>(null);
    const [endImage, setEndImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // Params
    const [transitionStyle, setTransitionStyle] = useState<TransitionStyle>('Fade');
    const [prompt, setPrompt] = useState('');

    const handleGenerate = async () => {
        if (!user) {
            openLoginModal();
            return;
        }
        if (!startImage || !endImage) {
            setError('Silakan unggah gambar awal dan akhir.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setVideoResultUrl(null);
        setLoadingMessage('Memulai generasi transisi...');

        try {
            const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
            if (!hasKey) {
                setLoadingMessage('Silakan pilih kunci API untuk melanjutkan...');
                await (window as any).aistudio?.openSelectKey();
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

            setLoadingMessage('Mengonversi gambar...');
            const [startImageBase64, endImageBase64] = await Promise.all([
                fileToBase64(startImage),
                fileToBase64(endImage)
            ]);

            const fullPrompt = `Buat transisi video bergaya '${transitionStyle.toLowerCase()}' dari gambar awal ke gambar akhir. ${prompt}`;

            setLoadingMessage('Mengirim permintaan ke model AI...');
            let operation: Operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: fullPrompt,
                image: { imageBytes: startImageBase64, mimeType: startImage.type },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: '16:9',
                    lastFrame: {
                        imageBytes: endImageBase64,
                        mimeType: endImage.type,
                    }
                }
            });

            setLoadingMessage('Transisi sedang dalam proses... Ini mungkin memakan waktu beberapa menit.');
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
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
            if (!videoResponse.ok) throw new Error(`Gagal mengambil video: ${videoResponse.statusText}`);

            const videoBlob = await videoResponse.blob();
            setVideoResultUrl(URL.createObjectURL(videoBlob));

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
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold mb-6 text-white">Video Transitions</h1>
            <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
                <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
                    <TransitionParameterSidebar
                        style={transitionStyle}
                        onStyleChange={setTransitionStyle}
                    />
                </div>
                <div className="w-full lg:w-2/3 xl:w-3/4">
                    <TransitionMainContentArea
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                        videoResultUrl={videoResultUrl}
                        startImage={startImage}
                        onStartImageUpload={setStartImage}
                        endImage={endImage}
                        onEndImageUpload={setEndImage}
                        prompt={prompt}
                        onPromptChange={setPrompt}
                        onGenerate={handleGenerate}
                        error={error}
                    />
                </div>
            </div>
        </>
    );
};

export default TransitionCreationPage;
