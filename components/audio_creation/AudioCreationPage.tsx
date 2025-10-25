import React, { useState } from 'react';
import AudioParameterSidebar from './AudioParameterSidebar';
import AudioMainContentArea from './AudioMainContentArea';
import { GoogleGenAI, Modality } from '@google/genai';
import { useAuth } from '../../contexts/AuthContext';
import { addProjectForUser, NewProjectData, Project } from '../../services/database';

// Types for audio creation
export type VoiceOption = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
export type SpeechStyle = 'Default' | 'Cheerful' | 'Serious' | 'Emotive';

interface AudioCreationPageProps {
  onPublishProject: (project: Project) => void;
}

const AudioCreationPage: React.FC<AudioCreationPageProps> = ({ onPublishProject }) => {
    const { user, openLoginModal } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [audioResultBase64, setAudioResultBase64] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isPublished, setIsPublished] = useState(false);

    // State for parameters
    const [model, setModel] = useState('gemini-2.5-flash-preview-tts');
    const [voice, setVoice] = useState<VoiceOption>('Kore');
    const [style, setStyle] = useState<SpeechStyle>('Default');
    const [text, setText] = useState('');

    const handleGenerateAudio = async () => {
        if (!user) {
            openLoginModal();
            return;
        }

        if (!text.trim()) {
            setError('Please enter some text to generate audio.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAudioResultBase64(null);
        setIsSaved(false);
        setIsPublished(false);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            let prompt = text;
            if (style !== 'Default') {
                prompt = `Say ${style.toLowerCase()}: ${text}`;
            }

            const response = await ai.models.generateContent({
                model: model,
                contents: [{ parts: [{ text: prompt }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: voice },
                        },
                    },
                },
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

            if (base64Audio) {
                setAudioResultBase64(base64Audio);
            } else {
                setError('Failed to generate audio. The response was empty.');
            }
        } catch (e) {
            console.error(e);
            setError(`An error occurred: ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDeleteAudio = () => {
        setAudioResultBase64(null);
    };
    
    const getProjectData = (): NewProjectData | null => {
        if (!audioResultBase64) return null;
        return {
            title: text.substring(0, 50) || 'Audio Baru',
            type: 'audio',
            thumbnailUrl: 'https://picsum.photos/id/1040/400/350',
            mediaUrl: `data:audio/pcm;base64,${audioResultBase64}`,
            prompt: text,
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
            <h1 className="text-3xl font-bold mb-6 text-white">Audio Generation</h1>
            <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
                <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
                    <AudioParameterSidebar
                        model={model}
                        onModelChange={setModel}
                        voice={voice}
                        onVoiceChange={setVoice}
                        style={style}
                        onStyleChange={setStyle}
                    />
                </div>
                <div className="w-full lg:w-2/3 xl:w-3/4">
                    <AudioMainContentArea
                        isLoading={isLoading}
                        audioResultBase64={audioResultBase64}
                        text={text}
                        onTextChange={setText}
                        onGenerate={handleGenerateAudio}
                        onDelete={handleDeleteAudio}
                        error={error}
                        isSaved={isSaved}
                        onSaveProject={handleSaveProject}
                        isPublished={isPublished}
                        onPublishProject={handlePublish}
                    />
                </div>
            </div>
        </>
    );
};

export default AudioCreationPage;