import React, { useState } from 'react';
import ProfilePageWrapper from './ProfilePageWrapper';
import { ChevronDownIcon } from '../icons';

interface FAQPageProps {
    onBack: () => void;
}

const faqData = [
    {
        q: 'Apa itu VidGenius?',
        a: 'VidGenius adalah aplikasi web bertenaga AI yang memungkinkan Anda membuat video, gambar, dan audio berkualitas tinggi hanya dari deskripsi teks (prompt). Anda dapat menyesuaikan berbagai parameter untuk mendapatkan hasil yang Anda inginkan.',
    },
    {
        q: 'Apakah VidGenius gratis untuk digunakan?',
        a: 'Ya, VidGenius menawarkan tingkat penggunaan gratis dengan batasan tertentu. Untuk fitur yang lebih canggih dan kuota yang lebih besar, kami akan menawarkan paket "Pro" di masa mendatang.',
    },
    {
        q: 'Berapa lama waktu yang dibutuhkan untuk membuat video?',
        a: 'Waktu pembuatan video bervariasi tergantung pada model yang dipilih dan kerumitan prompt. Model "Veo Fast" biasanya selesai dalam beberapa menit, sedangkan "Veo HD" mungkin membutuhkan waktu lebih lama untuk kualitas yang lebih tinggi.',
    },
    {
        q: 'Di mana proyek saya disimpan?',
        a: 'Semua kreasi Anda secara otomatis disimpan di galeri pribadi Anda di bawah tab "My Projects". Hanya Anda yang dapat melihat dan mengelola proyek-proyek ini. Anda juga memiliki opsi untuk membagikannya ke halaman utama publik.',
    },
    {
        q: 'Apa itu "prompt" dan bagaimana cara menulis yang baik?',
        a: 'Prompt adalah instruksi teks yang Anda berikan kepada AI untuk menjelaskan apa yang ingin Anda buat. Prompt yang baik bersifat deskriptif dan spesifik. Sebutkan subjek, latar belakang, gaya (misalnya, "sinematik", "anime"), pencahayaan, dan detail penting lainnya untuk hasil terbaik.',
    },
    {
        q: 'Bisakah saya menggunakan gambar atau video saya sendiri?',
        a: 'Tentu! Banyak mode kami, seperti "Video Generation", "Style Fusion", dan "Templates", memungkinkan Anda mengunggah media Anda sendiri sebagai titik awal atau referensi gaya, memberikan Anda kontrol kreatif yang lebih besar.',
    },
];

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-5 px-2"
                aria-expanded={isOpen}
            >
                <span className="text-lg font-semibold text-white">{question}</span>
                <ChevronDownIcon 
                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="pb-5 px-2 text-gray-300 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
};


const FAQPage: React.FC<FAQPageProps> = ({ onBack }) => {
    return (
        <ProfilePageWrapper title="Pertanyaan yang Sering Diajukan (FAQ)" onBack={onBack}>
            <div className="space-y-2">
                {faqData.map((item, index) => (
                    <FAQItem key={index} question={item.q} answer={item.a} />
                ))}
            </div>
        </ProfilePageWrapper>
    );
};
export default FAQPage;