import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight, ShieldAlert } from 'lucide-react';

export default function Login() {
    const [privateKey, setPrivateKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation for Polygon Private Key
        // Usually starts with 0x and is 66 chars long, or 64 without 0x
        let keyToSave = privateKey.trim();
        if (!keyToSave.startsWith('0x') && keyToSave.length === 64) {
            keyToSave = '0x' + keyToSave;
        }

        if (keyToSave.length !== 66 || !keyToSave.startsWith('0x')) {
            setError('Invalid Private Key. Must be 64 characters hex.');
            setLoading(false);
            return;
        }

        // Save securely to localStorage for the session
        localStorage.setItem('pm_private_key', keyToSave);

        // Setup initial default trading sizes
        if (!localStorage.getItem('pm_trade_size')) {
            localStorage.setItem('pm_trade_size', '5');
        }

        setLoading(false);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-polymarket-green/20 rounded-full blur-[50px] pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-polymarket-blue/20 rounded-full blur-[50px] pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="w-16 h-16 mx-auto bg-[#0F1216] border border-polymarket-border rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <KeyRound className="w-8 h-8 text-polymarket-green" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Connect Wallet</h1>
                    <p className="text-polymarket-textMuted text-sm">Polymarket AutoTrade - AI Agent Edition</p>
                </div>

                <div className="bg-[#502e13]/20 border border-[#b45309]/30 rounded-lg p-4 mb-6 relative z-10 flex items-start space-x-3">
                    <ShieldAlert className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
                    <div className="text-xs text-[#fbbf24] leading-relaxed">
                        <p className="font-semibold mb-1">Security Notice</p>
                        Your Private Key is stored locally in your browser and is only sent to your own server during active trading. Never share this key with anyone.
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <div>
                        <label htmlFor="privateKey" className="block text-sm font-medium text-polymarket-textMuted mb-2">
                            Polygon Private Key
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                id="privateKey"
                                required
                                value={privateKey}
                                onChange={(e) => setPrivateKey(e.target.value)}
                                className={`block w-full px-4 py-3 border ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-polymarket-border focus:ring-polymarket-green/50'} rounded-lg bg-[#0F1216] text-white placeholder-polymarket-textMuted focus:outline-none focus:ring-1 transition-all`}
                                placeholder="0x..."
                            />
                        </div>
                        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !privateKey}
                        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-[#0F1216] bg-polymarket-green hover:bg-[#2DD4BF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-polymarket-green focus:ring-offset-[#0F1216] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                    >
                        {loading ? 'Connecting...' : 'Secure Connect'}
                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
