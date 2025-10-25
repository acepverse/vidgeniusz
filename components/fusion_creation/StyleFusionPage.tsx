import React, { useState } from 'react';
import StyleFusionParameterSidebar from './StyleFusionParameterSidebar';
import StyleFusionMainContentArea from './StyleFusionMainContentArea';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleGenAI, Modality, Operation, VideoGenerationReferenceImage, VideoGenerationReferenceType } from '@google/genai';


export type OutputType = 'image' | 'video';

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


const StyleFusionPage: React.FC = () => {
    const { user, openLoginModal } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Menggabungkan gaya...');
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultType, setResultType] = useState<OutputType | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Inputs
    const [contentFile, setContentFile] = useState<File | null>(null);
    const [styleFile, setStyleFile] = useState<File | null>(null);
    
    // Params
    const [outputType, setOutputType] = useState<OutputType>('image');

    const handleGenerate = async () => {
        if (!user) {
            openLoginModal();
            return;
        }
        if (!contentFile || !styleFile) {
            setError('Silakan unggah file konten dan file gaya.');
            return;
        }

        setIsLoading(true);
        setResultUrl(null);
        setResultType(null);
        setError(null);
        setLoadingMessage('Memulai fusi gaya...');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            setLoadingMessage('Mengonversi file...');
            const [contentBase64, styleBase64] = await Promise.all([
                fileToBase64(contentFile),
                fileToBase64(styleFile)
            ]);

            if (outputType === 'image') {
                const response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash-image',
                  contents: { parts: [
                      { text: 'Terapkan gaya dari gambar kedua ke gambar/video pertama.' },
                      { inlineData: { mimeType: contentFile.type, data: contentBase64 } },
                      { inlineData: { mimeType: styleFile.type, data: styleBase64 } },
                  ] },
                  config: { responseModalities: [Modality.IMAGE] },
                });
                
                const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
                if (imagePart?.inlineData) {
                    const { data, mimeType } = imagePart.inlineData;
                    setResultUrl(`data:${mimeType};base64,${data}`);
                    setResultType('image');
                } else {
                    throw new Error('API tidak mengembalikan data gambar.');
                }
            } else { // Video
                const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
                if (!hasKey) {
                    setLoadingMessage('Silakan pilih kunci API untuk melanjutkan...');
                    await (window as any).aistudio?.openSelectKey();
                }

                const referenceImagesPayload: VideoGenerationReferenceImage[] = [
                    { image: { imageBytes: contentBase64, mimeType: contentFile.type }, referenceType: VideoGenerationReferenceType.ASSET },
                    { image: { imageBytes: styleBase64, mimeType: styleFile.type }, referenceType: VideoGenerationReferenceType.STYLE }
                ];

                setLoadingMessage('Mengirim permintaan ke model AI...');
                let operation: Operation = await ai.models.generateVideos({
                    model: 'veo-3.1-generate-preview',
                    prompt: 'Buat video dari gambar konten pertama, dengan menerapkan gaya dari gambar referensi kedua.',
                    config: {
                        numberOfVideos: 1,
                        referenceImages: referenceImagesPayload,
                        resolution: '720p',
                        aspectRatio: '16:9'
                    }
                });

                setLoadingMessage('Video sedang dalam proses... Ini mungkin memakan waktu beberapa menit.');
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
                setResultUrl(URL.createObjectURL(videoBlob));
                setResultType('video');
            }
        } catch(e) {
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

    const handleDelete = () => {
        if (resultUrl && resultType === 'video') {
            URL.revokeObjectURL(resultUrl);
        }
        setResultUrl(null);
        setResultType(null);
        setError(null);
    };

    return (
        <>
            <h1 className="text-3xl font-bold mb-6 text-white">Style Fusion</h1>
            <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
                <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
                    <StyleFusionParameterSidebar
                        outputType={outputType}
                        onOutputTypeChange={setOutputType}
                    />
                </div>
                <div className="w-full lg:w-2/3 xl:w-3/4">
                    <StyleFusionMainContentArea
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                        resultUrl={resultUrl}
                        resultType={resultType}
                        contentFile={contentFile}
                        onContentFileUpload={setContentFile}
                        styleFile={styleFile}
                        onStyleFileUpload={setStyleFile}
                        onGenerate={handleGenerate}
                        onDelete={handleDelete}
                        error={error}
                    />
                </div>
            </div>
        </>
    );
};

export default StyleFusionPage;
