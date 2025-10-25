import React from 'react';
import {
    AspectRatioIcon,
    FaceSwapIcon,
    ThreeDIcon,
    UpscaleIcon,
    SlowMoIcon,
    ColorizeIcon,
    MusicIcon
} from '../icons';

interface Mode {
    id: string;
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    status: 'coming_soon' | 'active';
}

const modes: Mode[] = [
    {
        id: 'expand',
        title: 'Perluas Gambar/Video',
        description: 'Ubah rasio aspek media Anda. AI akan mengisi bagian yang kosong untuk mengubah potret menjadi lanskap tanpa memotong.',
        icon: AspectRatioIcon,
        status: 'coming_soon',
    },
    {
        id: 'face-swap',
        title: 'AI Face Swap',
        description: 'Tukar wajah dalam gambar atau video dengan mudah. Sempurna untuk meme, konten kreatif, atau proyek efek visual.',
        icon: FaceSwapIcon,
        status: 'coming_soon',
    },
    {
        id: 'multi-face-swap',
        title: 'Multi Face Swap',
        description: 'Tukar beberapa wajah sekaligus dalam satu adegan. Alat canggih untuk video atau foto grup yang kompleks.',
        icon: FaceSwapIcon,
        status: 'coming_soon',
    },
    {
        id: 'image-to-3d',
        title: 'Image to 3D',
        description: 'Unggah gambar 2D (seperti foto produk atau sketsa karakter) dan AI akan mengubahnya menjadi model 3D.',
        icon: ThreeDIcon,
        status: 'coming_soon',
    },
    {
        id: 'video-upscaling',
        title: 'Video Upscaling',
        description: 'Tingkatkan resolusi video lama dari 480p menjadi 1080p atau bahkan 4K dengan detail yang lebih tajam.',
        icon: UpscaleIcon,
        status: 'coming_soon',
    },
    {
        id: 'slow-motion',
        title: 'Super Slow-Motion',
        description: 'Ubah klip video biasa menjadi video gerak lambat yang sangat mulus dan sinematik.',
        icon: SlowMoIcon,
        status: 'coming_soon',
    },
    {
        id: 'colorization',
        title: 'Colorization',
        description: 'Secara otomatis menambahkan warna pada foto atau video hitam-putih untuk menghidupkannya kembali.',
        icon: ColorizeIcon,
        status: 'coming_soon',
    },
    {
        id: 'scene-generation',
        title: '3D Scene Generation',
        description: 'Buat lingkungan atau pemandangan 3D lengkap hanya dari deskripsi teks.',
        icon: ThreeDIcon,
        status: 'coming_soon',
    },
    {
        id: 'music-generation',
        title: 'Music Generation',
        description: 'Buat trek musik orisinal berdasarkan genre, mood, atau instrumen yang Anda deskripsikan.',
        icon: MusicIcon,
        status: 'coming_soon',
    },
];

const ModeCard: React.FC<Mode> = ({ title, description, icon: Icon, status }) => {
    const isComingSoon = status === 'coming_soon';
    return (
        <div className="relative bg-[#1c1c1c] rounded-xl p-6 border border-gray-800 hover:border-purple-500/70 transition-all duration-300 flex flex-col gap-4 group">
             {isComingSoon && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Segera Hadir
                </span>
            )}
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
                 <Icon className="w-6 h-6 text-teal-300" />
            </div>
            <div className="flex-grow">
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{description}</p>
            </div>
            <button
                disabled={isComingSoon}
                className="w-full mt-2 text-center font-semibold bg-[#2a2a2a] text-white py-2 rounded-lg transition-colors hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Coba Sekarang
            </button>
        </div>
    );
};

const MoreModesPage: React.FC = () => {
    return (
        <>
            <h1 className="text-3xl font-bold mb-2 text-white">Mode Lanjutan</h1>
            <p className="text-gray-400 mb-8">Alat canggih bertenaga AI untuk kreasi yang lebih kompleks dan unik.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {modes.map(mode => (
                    <ModeCard key={mode.id} {...mode} />
                ))}
            </div>
        </>
    );
};

export default MoreModesPage;
