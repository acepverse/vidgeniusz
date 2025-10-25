import React, { useState } from 'react';
import ProfilePageWrapper from './ProfilePageWrapper';
import { useAuth } from '../../contexts/AuthContext';
import { EmailIcon, ClipboardIcon, PaperAirplaneIcon } from '../icons';

interface SupportPageProps {
    onBack: () => void;
}

const SupportPage: React.FC<SupportPageProps> = ({ onBack }) => {
    const { user } = useAuth();
    const supportEmail = "vidgeniusaio@gmail.com";
    const [copyButtonText, setCopyButtonText] = useState('Salin');
    
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(supportEmail);
        setCopyButtonText('Disalin!');
        setTimeout(() => setCopyButtonText('Salin'), 2000);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionStatus('idle'); // Reset status
        
        // Simulate sending a message
        setTimeout(() => {
            setSubmissionStatus('success');
            setSubject('');
            setMessage('');
        }, 1000);
    };

    return (
        <ProfilePageWrapper title="Pusat Dukungan" onBack={onBack}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Kolom Kiri: Info Kontak & Tips */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-3">Hubungi via Email</h2>
                        <p className="text-gray-400 mb-4">
                            Untuk pertanyaan mendetail atau masalah teknis, cara terbaik untuk menghubungi kami adalah melalui email.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                             <a href={`mailto:${supportEmail}`} className="flex-grow flex items-center justify-center gap-3 bg-[#2a2a2a] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors hover:bg-gray-700">
                                <EmailIcon />
                                <span>{supportEmail}</span>
                            </a>
                            <button onClick={handleCopyEmail} className="flex items-center justify-center gap-2 bg-teal-500/80 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors hover:bg-teal-500/100 w-full sm:w-auto">
                                <ClipboardIcon />
                                <span>{copyButtonText}</span>
                            </button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Tips untuk Laporan yang Efektif</h3>
                        <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                            <li>Sertakan <span className="font-semibold text-gray-300">username</span> Anda: ({user?.username || 'mohon login'})</li>
                            <li>Berikan <span className="font-semibold text-gray-300">deskripsi masalah</span> yang jelas dan terperinci.</li>
                            <li>Jika memungkinkan, sertakan <span className="font-semibold text-gray-300">screenshot atau rekaman layar</span>.</li>
                            <li>Sebutkan <span className="font-semibold text-gray-300">langkah-langkah</span> yang Anda ambil sebelum masalah terjadi.</li>
                        </ul>
                    </div>
                </div>

                {/* Kolom Kanan: Formulir Kontak */}
                <div className="bg-[#2a2a2a]/50 p-6 rounded-lg border border-gray-700">
                     <h2 className="text-xl font-bold text-white mb-4">Kirim Pesan Langsung</h2>
                     <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                             <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subjek</label>
                             <input 
                                type="text" 
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                className="w-full bg-[#1c1c1c] border border-gray-600 rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Contoh: Masalah saat membuat video"
                             />
                        </div>
                         <div>
                             <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Pesan Anda</label>
                             <textarea 
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={5}
                                className="w-full bg-[#1c1c1c] border border-gray-600 rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                placeholder="Jelaskan masalah atau pertanyaan Anda di sini..."
                             />
                        </div>
                        <div>
                             <button type="submit" className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70" disabled={!subject || !message}>
                                <PaperAirplaneIcon className="w-5 h-5" />
                                Kirim Pesan
                            </button>
                        </div>
                         {submissionStatus === 'success' && (
                             <p className="text-sm text-center text-green-400">Pesan Anda telah terkirim! Tim kami akan segera menghubungi Anda.</p>
                         )}
                     </form>
                </div>
            </div>
        </ProfilePageWrapper>
    );
};
export default SupportPage;