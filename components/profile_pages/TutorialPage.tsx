import React from 'react';
import ProfilePageWrapper from './ProfilePageWrapper';
import { 
    CursorClickIcon, 
    SlidersHorizontalIcon, 
    EditIcon, 
    SparklesIcon, 
    DownloadIcon 
} from '../icons';

interface TutorialPageProps {
    onBack: () => void;
}

const StepCard: React.FC<{
    stepNumber: number;
    icon: React.ReactNode;
    title: string;
    description: string;
}> = ({ stepNumber, icon, title, description }) => {
    return (
        <div className="flex items-start gap-6 bg-[#2a2a2a]/50 p-6 rounded-lg border border-gray-700">
            <div className="flex flex-col items-center flex-shrink-0">
                <div className="bg-gradient-to-br from-purple-600 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {stepNumber}
                </div>
                <div className="w-px h-6 bg-gray-600 my-2"></div>
                <div className="text-teal-400">
                    {icon}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};


const TutorialPage: React.FC<TutorialPageProps> = ({ onBack }) => {
    const steps = [
        {
            stepNumber: 1,
            icon: <CursorClickIcon className="w-7 h-7" />,
            title: 'Pilih Mode Kreasi',
            description: 'Mulai dengan memilih salah satu mode dari menu sidebar di sebelah kiri, seperti "Video Generation", "Image Generation", atau "Style Fusion" untuk memulai proyek baru Anda.',
        },
        {
            stepNumber: 2,
            icon: <SlidersHorizontalIcon className="w-7 h-7" />,
            title: 'Atur Parameter Anda',
            description: 'Di sidebar parameter, sesuaikan pengaturan seperti rasio aspek, gaya, resolusi, atau model AI. Pengaturan ini akan memengaruhi hasil akhir kreasi Anda.',
        },
        {
            stepNumber: 3,
            icon: <EditIcon className="w-7 h-7" />,
            title: 'Berikan Input Anda',
            description: 'Tulis deskripsi detail (prompt) tentang apa yang ingin Anda buat. Anda juga bisa mengunggah gambar atau video sebagai referensi, tergantung pada mode yang Anda pilih.',
        },
        {
            stepNumber: 4,
            icon: <SparklesIcon className="w-7 h-7" />,
            title: 'Hasilkan Kreasi Anda',
            description: 'Setelah semua parameter dan input diatur, klik tombol "Hasilkan". AI akan mulai memproses permintaan Anda. Ini mungkin memerlukan beberapa saat, terutama untuk video.',
        },
        {
            stepNumber: 5,
            icon: <DownloadIcon className="w-7 h-7" />,
            title: 'Unduh dan Simpan',
            description: 'Setelah proses selesai, hasilnya akan muncul di layar. Anda dapat mengunduh file ke perangkat Anda atau menyimpannya ke "My Projects" untuk diakses nanti.',
        }
    ];

    return (
        <ProfilePageWrapper title="Tutorial Cara Penggunaan" onBack={onBack}>
            <div className="space-y-6">
                {steps.map(step => (
                    <StepCard key={step.stepNumber} {...step} />
                ))}
            </div>
        </ProfilePageWrapper>
    );
};
export default TutorialPage;