import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EmailIcon, LockIcon, EyeIcon, EyeSlashIcon, GoogleIcon, UserIcon } from './icons';
import { getUserByEmail, resetPassword } from '../services/database';

interface LoginModalProps {
    onClose: () => void;
}

// Sub-komponen untuk form Login
const LoginForm: React.FC<any> = ({
    username, setUsername,
    password, setPassword,
    showPassword, setShowPassword,
    handleLoginSubmit,
    setView,
    error,
    registerSuccess,
    resetSuccess
}) => (
    <>
        <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">Login ke Akun Anda</h1>
            <p className="mt-2 text-sm text-gray-400">
                Belum punya akun?{' '}
                <button type="button" onClick={() => setView('register')} className="font-semibold text-purple-400 hover:text-purple-300">Daftar</button>
            </p>
        </div>
        {registerSuccess && (
            <p className="text-sm text-green-400 text-center">Pendaftaran berhasil! Silakan login.</p>
        )}
        {resetSuccess && (
            <p className="text-sm text-green-400 text-center">Kata sandi berhasil direset! Silakan login.</p>
        )}

        <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <EmailIcon className="h-5 w-5 text-gray-500" />
                </span>
                <input id="username-modal" name="username" type="text" autoComplete="username" required value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full rounded-md border-0 bg-[#2a2a2a] py-2.5 pl-10 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm" placeholder="Email atau Nama Pengguna" />
            </div>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-500" />
                </span>
                <input id="password-modal" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md border-0 bg-[#2a2a2a] py-2.5 pl-10 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm" placeholder="Kata Sandi" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
            <div className="text-right text-sm">
                <button type="button" onClick={() => setView('forgotPassword')} className="font-semibold text-purple-400 hover:text-purple-300">Lupa kata sandi Anda?</button>
            </div>
            {error && !registerSuccess && !resetSuccess && (<p className="text-sm text-red-400 text-center">{error}</p>)}
            <div>
                <button type="submit" className="w-full justify-center rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500">
                    Login
                </button>
            </div>
            <p className="text-xs text-center text-gray-500">
                (Gunakan <code className="bg-gray-700 px-1 rounded">user1</code>/<code className="bg-gray-700 px-1 rounded">pass1</code> atau daftar akun baru)
            </p>
        </form>
    </>
);

// Sub-komponen untuk form Pendaftaran
const RegisterForm: React.FC<any> = ({
    newUsername, setNewUsername,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    showNewPassword, setShowNewPassword,
    showConfirmPassword, setShowConfirmPassword,
    handleRegisterSubmit,
    setView,
    error
}) => (
    <>
        <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">Buat Akun Baru</h1>
            <p className="mt-2 text-sm text-gray-400">
                Sudah punya akun?{' '}
                <button type="button" onClick={() => setView('login')} className="font-semibold text-purple-400 hover:text-purple-300">Login di sini</button>
            </p>
        </div>
        <form className="space-y-4 pt-6" onSubmit={handleRegisterSubmit}>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <EmailIcon className="h-5 w-5 text-gray-500" />
                </span>
                <input id="reg-username-modal" name="username" type="text" required value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="block w-full rounded-md border-0 bg-[#2a2a2a] py-2.5 pl-10 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm" placeholder="Pilih username unik" />
            </div>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-500" />
                </span>
                <input id="reg-password-modal" name="password" type={showNewPassword ? 'text' : 'password'} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="block w-full rounded-md border-0 bg-[#2a2a2a] py-2.5 pl-10 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm" placeholder="Kata Sandi (min. 4 karakter)" />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300">
                    {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-500" />
                </span>
                <input id="reg-confirm-password-modal" name="confirm-password" type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full rounded-md border-0 bg-[#2a2a2a] py-2.5 pl-10 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm" placeholder="Konfirmasi Kata Sandi" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300">
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
            {error && (<p className="text-sm text-red-400 text-center">{error}</p>)}
            <div>
                <button type="submit" className="w-full mt-2 justify-center rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500">
                    Daftar
                </button>
            </div>
        </form>
    </>
);

// Sub-komponen untuk Lupa Kata Sandi
const ForgotPasswordForm: React.FC<any> = ({ setView, handleForgotSubmit, forgotEmail, setForgotEmail, error }) => (
    <>
        <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">Lupa Kata Sandi</h1>
            <p className="mt-2 text-sm text-gray-400">
                Masukkan email Anda. Kami akan (mensimulasikan) mengirim kode verifikasi.
            </p>
        </div>
        <form className="space-y-4 pt-6" onSubmit={handleForgotSubmit}>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <EmailIcon className="h-5 w-5 text-gray-500" />
                </span>
                <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="block w-full rounded-md border-0 bg-[#2a2a2a] py-2.5 pl-10 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm" placeholder="Email Anda" />
            </div>
            {error && (<p className="text-sm text-red-400 text-center">{error}</p>)}
            <div>
                <button type="submit" className="w-full mt-2 justify-center rounded-full bg-purple-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700">
                    Kirim Kode
                </button>
            </div>
            <div className="text-center">
                <button type="button" onClick={() => setView('login')} className="text-sm font-semibold text-purple-400 hover:text-purple-300">Kembali ke Login</button>
            </div>
        </form>
    </>
);

// Sub-komponen untuk Masukkan Kode
const EnterCodeForm: React.FC<any> = ({ setView, handleCodeSubmit, code, setCode, error, resetUsername }) => (
    <>
        <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">Masukkan Kode Verifikasi</h1>
            <p className="mt-2 text-sm text-gray-400">
                Kode telah dikirim (secara simulasi) ke email yang terhubung dengan <span className="font-bold text-white">{resetUsername}</span>.
            </p>
        </div>
        <form className="space-y-4 pt-6" onSubmit={handleCodeSubmit}>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-500" />
                </span>
                <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} className="block w-full rounded-md border-0 bg-[#2a2a2a] py-2.5 pl-10 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm" placeholder="Kode Verifikasi" />
            </div>
            {error && (<p className="text-sm text-red-400 text-center">{error}</p>)}
             <p className="text-xs text-center text-gray-500">
                (Kode simulasi adalah <code className="bg-gray-700 px-1 rounded">123456</code>)
            </p>
            <div>
                <button type="submit" className="w-full mt-2 justify-center rounded-full bg-purple-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700">
                    Verifikasi
                </button>
            </div>
             <div className="text-center">
                <button type="button" onClick={() => setView('login')} className="text-sm font-semibold text-purple-400 hover:text-purple-300">Batal</button>
            </div>
        </form>
    </>
);

// Sub-komponen untuk Reset Kata Sandi
const ResetPasswordForm: React.FC<any> = ({ handleResetSubmit, newPassword, setNewPassword, confirmPassword, setConfirmPassword, showNewPassword, setShowNewPassword, showConfirmPassword, setShowConfirmPassword, error, setView }) => (
    <>
        <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">Atur Ulang Kata Sandi</h1>
            <p className="mt-2 text-sm text-gray-400">
                Masukkan kata sandi baru Anda.
            </p>
        </div>
        <form className="space-y-4 pt-6" onSubmit={handleResetSubmit}>
             <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-500" />
                </span>
                <input type={showNewPassword ? 'text' : 'password'} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="block w-full rounded-md border-0 bg-[#2a2a2a] py-2.5 pl-10 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm" placeholder="Kata Sandi Baru" />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300">
                    {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-500" />
                </span>
                <input type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full rounded-md border-0 bg-[#2a2a2a] py-2.5 pl-10 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm" placeholder="Konfirmasi Kata Sandi Baru" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300">
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
            {error && (<p className="text-sm text-red-400 text-center">{error}</p>)}
            <div>
                <button type="submit" className="w-full mt-2 justify-center rounded-full bg-purple-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700">
                    Simpan & Login
                </button>
            </div>
        </form>
    </>
);


const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
    const [view, setView] = useState<'login' | 'register' | 'forgotPassword' | 'enterCode' | 'resetPassword'>('login');
    
    // Login state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Register state
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Forgot Password State
    const [forgotEmail, setForgotEmail] = useState('');
    const [resetUsername, setResetUsername] = useState('');
    const [code, setCode] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const { login, register, loginWithGoogle } = useAuth();

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login(username, password);
        } catch (err) {
            setError("Username atau sandi anda salah");
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (newPassword !== confirmPassword) {
            setError("Sandi tidak cocok. Silakan coba lagi.");
            return;
        }
        try {
            await register(newUsername, newPassword);
            setRegisterSuccess(true);
            handleSetView('login');
            setNewUsername('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
             if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Terjadi error yang tidak diketahui saat pendaftaran.');
            }
        }
    };

    const handleForgotSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const user = getUserByEmail(forgotEmail);
        if (user) {
            setResetUsername(user.username);
            handleSetView('enterCode');
            setForgotEmail(''); // Clear input for next use
        } else {
            setError('Email tidak ditemukan.');
        }
    };

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (code === '123456') { // Mock code
            handleSetView('resetPassword');
            setCode('');
        } else {
            setError('Kode verifikasi salah.');
        }
    };

    const handleResetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (newPassword !== confirmPassword) {
            setError("Sandi tidak cocok. Silakan coba lagi.");
            return;
        }
        try {
            resetPassword(resetUsername, newPassword);
            setResetSuccess(true);
            handleSetView('login');
            // Clear all related states
            setNewPassword('');
            setConfirmPassword('');
            setResetUsername('');
        } catch (err) {
             if (err instanceof Error) setError(err.message);
        }
    };

    const handleSetView = (newView: 'login' | 'register' | 'forgotPassword' | 'enterCode' | 'resetPassword') => {
        setError(null);
        if(newView === 'login') {
          // Keep success messages when transitioning to login
        } else {
          setRegisterSuccess(false);
          setResetSuccess(false);
        }
        setView(newView);
    };
    
    const handleGoogleLogin = async () => {
        setError(null);
        setRegisterSuccess(false);
        setResetSuccess(false);
        try {
            await loginWithGoogle();
        } catch (err) {
             setError("Gagal login dengan Google.");
        }
    };

    const renderForm = () => {
        switch (view) {
            case 'register':
                return <RegisterForm
                            newUsername={newUsername} setNewUsername={setNewUsername}
                            newPassword={newPassword} setNewPassword={setNewPassword}
                            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                            showNewPassword={showNewPassword} setShowNewPassword={setShowNewPassword}
                            showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword}
                            handleRegisterSubmit={handleRegisterSubmit}
                            setView={handleSetView}
                            error={error}
                        />;
            case 'forgotPassword':
                return <ForgotPasswordForm
                            forgotEmail={forgotEmail} setForgotEmail={setForgotEmail}
                            handleForgotSubmit={handleForgotSubmit}
                            setView={handleSetView}
                            error={error}
                        />
            case 'enterCode':
                return <EnterCodeForm 
                            resetUsername={resetUsername}
                            code={code} setCode={setCode}
                            handleCodeSubmit={handleCodeSubmit}
                            setView={handleSetView}
                            error={error}
                        />
            case 'resetPassword':
                return <ResetPasswordForm
                            newPassword={newPassword} setNewPassword={setNewPassword}
                            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                            showNewPassword={showNewPassword} setShowNewPassword={setShowNewPassword}
                            showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword}
                            handleResetSubmit={handleResetSubmit}
                            setView={handleSetView}
                            error={error}
                        />
            case 'login':
            default:
                return <LoginForm
                            username={username} setUsername={setUsername}
                            password={password} setPassword={setPassword}
                            showPassword={showPassword} setShowPassword={setShowPassword}
                            handleLoginSubmit={handleLoginSubmit}
                            setView={handleSetView}
                            error={error}
                            registerSuccess={registerSuccess}
                            resetSuccess={resetSuccess}
                        />;
        }
    }


    return (
        <div className="fixed inset-0 bg-black z-50">
             <div className="w-full h-full lg:grid lg:grid-cols-2">
                {/* Kolom Kiri: Video Latar (hanya di desktop) */}
                <div className="hidden lg:block relative w-full h-full bg-black">
                    <video 
                        src="https://adecz3xeo23imyin.public.blob.vercel-storage.com/vidgenius-bg.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Kolom Kanan: Form (desktop) / Konten Modal (mobile) */}
                <div className="relative w-full h-full flex items-center justify-center bg-[#1c1c1c] lg:bg-black p-4">
                     <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-10" aria-label="Close modal">
                        &#x2715;
                    </button>
                    <div className="w-full max-w-sm">
                        <div className="flex justify-center items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center font-bold text-2xl">
                                V
                            </div>
                            <span className="text-3xl font-bold tracking-tighter">VidGenius</span>
                        </div>
                        
                        <div className="space-y-6">
                           {renderForm()}
                           
                           {/* Pemisah dan Tombol Google hanya muncul di tampilan Login/Register */}
                           {(view === 'login' || view === 'register') && (
                               <>
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-gray-700" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-[#1c1c1c] lg:bg-black px-2 text-gray-500">atau</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        className="w-full flex items-center justify-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 transition-colors"
                                    >
                                        <GoogleIcon />
                                        Lanjutkan dengan Google
                                    </button>
                                </div>
                               </>
                           )}
                        </div>
                        
                         <p className="pt-8 text-xs text-center text-gray-600">
                            Dengan masuk, Anda setuju dengan Persyaratan Layanan dan Kebijakan Privasi kami.
                        </p>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default LoginModal;