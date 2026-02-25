import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login for now
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-polymarket-text mb-2">AutoTrade Polymarket</h1>
                    <p className="text-polymarket-textMuted">AI Agent - BTC 5min</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-polymarket-textMuted mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-polymarket-textMuted" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-polymarket-border rounded-lg bg-[#0F1216] text-polymarket-text placeholder-polymarket-textMuted focus:outline-none focus:ring-2 focus:ring-polymarket-blue"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-polymarket-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-polymarket-blue focus:ring-offset-[#161920] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Connecting...' : 'Continue'}
                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
