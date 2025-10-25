import React, { useState } from 'react';
import StoryboardParameterSidebar from './StoryboardParameterSidebar';
import StoryboardMainContentArea from './StoryboardMainContentArea';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleGenAI, Modality, Part, Type } from '@google/genai';
import { addProjectForUser, Project } from '../../services/database';

export type StoryboardStyle = 'realistis' | 'sinematik' | '3d pixar style' | '3d render' | 'anime' | '2d kartun';
export type StoryboardAspectRatio = '16:9' | '9:16' | '4:5' | '4:3';

export interface CharacterReference {
  id: number;
  name: string;
  file: File | null;
}

export interface StoryboardResult {
  shot: number;
  imageUrl: string;
  animationPrompt: string;
  dialogue: string;
}

interface StoryboardCreationPageProps {
  onPublishProject: (project: Project) => void;
}

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

const StoryboardCreationPage: React.FC<StoryboardCreationPageProps> = ({ onPublishProject }) => {
    const { user, openLoginModal } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Params
    const [style, setStyle] = useState<StoryboardStyle>('sinematik');
    const [aspectRatio, setAspectRatio] = useState<StoryboardAspectRatio>('16:9');
    const [script, setScript] = useState('');
    const [characterRefs, setCharacterRefs] = useState<CharacterReference[]>(
        Array.from({ length: 8 }, (_, i) => ({ id: i, name: '', file: null }))
    );
    const [results, setResults] = useState<StoryboardResult[]>([]);

    const handleCharacterChange = (index: number, name: string, file: File | null) => {
        const newRefs = [...characterRefs];
        newRefs[index] = { ...newRefs[index], name, file };
        setCharacterRefs(newRefs);
    };

    const handleGenerate = async () => {
        if (!user) {
            openLoginModal();
            return;
        }
        if (!script.trim()) {
            setError('Naskah tidak boleh kosong.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults([]);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            // 1. Break script into scenes
            setLoadingMessage('Menganalisis dan memecah naskah menjadi adegan...');
            const characterNames = characterRefs.map(c => c.name).filter(Boolean);
            const sceneSchema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        scene_description: { type: Type.STRING, description: 'Deskripsi visual adegan yang sangat detail untuk AI generator gambar, termasuk aksi, emosi, dan latar.' },
                        dialogue_or_narration: { type: Type.STRING, description: 'Teks dialog atau narasi yang tepat untuk adegan ini.' },
                        characters_in_scene: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Daftar nama karakter yang ada dalam adegan ini, harus cocok dengan nama yang disediakan.' }
                    },
                    required: ["scene_description", "dialogue_or_narration", "characters_in_scene"]
                },
            };

            const segmentationResponse = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: `Anda adalah sutradara storyboard. Tugas Anda adalah memecah naskah berikut menjadi adegan visual yang berurutan. Karakter yang tersedia adalah: ${characterNames.join(', ') || 'Tidak ada karakter yang didefinisikan'}. Untuk setiap adegan, berikan deskripsi visual yang detail untuk prompt pembuatan gambar dan dialog atau narasi yang sesuai. Pastikan untuk mengidentifikasi karakter yang ada di setiap adegan. Kembalikan output sebagai array JSON. Naskah:\n---\n${script}`,
                config: { responseMimeType: "application/json", responseSchema: sceneSchema },
            });
            
            const scenes = JSON.parse(segmentationResponse.text);

            if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
                throw new Error("Gagal memecah naskah menjadi adegan. Coba periksa kembali naskah Anda.");
            }
            
            // 2. Generate image and animation prompt for each scene
            const generatedResults: StoryboardResult[] = [];
            for (let i = 0; i < scenes.length; i++) {
                const scene = scenes[i];
                if (!scene.scene_description) continue; // Skip empty scenes

                setLoadingMessage(`Menghasilkan gambar untuk adegan ${i + 1} dari ${scenes.length}...`);

                // Prepare character reference images for this scene
                const imageParts: Part[] = [];
                if (scene.characters_in_scene && Array.isArray(scene.characters_in_scene)) {
                    for (const charName of scene.characters_in_scene) {
                        const charRef = characterRefs.find(c => c.name.toLowerCase() === charName.toLowerCase() && c.file);
                        if (charRef && charRef.file) {
                            const base64Data = await fileToBase64(charRef.file);
                            imageParts.push({ inlineData: { mimeType: charRef.file.type, data: base64Data } });
                        }
                    }
                }
                
                // Generate image
                const imageResponse = await ai.models.generateContent({
                  model: 'gemini-2.5-flash-image',
                  contents: { parts: [{ text: `${scene.scene_description}, gaya ${style}, rasio aspek ${aspectRatio}` }, ...imageParts] },
                  config: { responseModalities: [Modality.IMAGE] },
                });
                const imagePart = imageResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
                if (!imagePart?.inlineData) continue;
                
                const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

                // Generate animation prompt
                setLoadingMessage(`Membuat prompt animasi untuk adegan ${i + 1}...`);
                const animPromptResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Anda adalah prompter animasi ahli. Berdasarkan deskripsi adegan, gaya visual, dan dialog berikut, buat prompt animasi yang terperinci. Strukturkan prompt dengan bagian-bagian berikut, masing-masing pada baris baru dan diberi label dengan emoji yang sesuai:\n👉 Subjek utama: \n👉 Aksi atau Gerakan: \n👉 Latar / Lingkungan: \n🧑‍🎨 Gaya Visual: \n👉 Suasana / Pencahayaan: \n👉 Sudut Kamera / Gerakan Kamera: \n\nInformasi:\n- Deskripsi Adegan: "${scene.scene_description}"\n- Gaya Visual Keseluruhan: "${style}"\n- Dialog/Narasi: "${scene.dialogue_or_narration}"\n\nBuat prompt sekarang. Jangan sertakan dialog/narasi di dalam prompt animasi, hanya deskripsi visual.`,
                });
                
                generatedResults.push({
                    shot: i + 1,
                    imageUrl,
                    animationPrompt: `${animPromptResponse.text}\n\nDialog: "${scene.dialogue_or_narration}"`,
                    dialogue: scene.dialogue_or_narration,
                });
                setResults([...generatedResults]); // Update UI progressively
            }

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'Terjadi kesalahan yang tidak diketahui. Pastikan naskah Anda jelas dan coba lagi.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };
    
    return (
        <>
            <h1 className="text-3xl font-bold mb-6 text-white">Storyboard Generation</h1>
            <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
                <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
                    <StoryboardParameterSidebar
                        style={style}
                        onStyleChange={setStyle}
                        aspectRatio={aspectRatio}
                        onAspectRatioChange={setAspectRatio}
                    />
                </div>
                <div className="w-full lg:w-2/3 xl:w-3/4">
                    <StoryboardMainContentArea
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                        error={error}
                        characterRefs={characterRefs}
                        onCharacterChange={handleCharacterChange}
                        script={script}
                        onScriptChange={setScript}
                        onGenerate={handleGenerate}
                        results={results}
                    />
                </div>
            </div>
        </>
    );
};

export default StoryboardCreationPage;
