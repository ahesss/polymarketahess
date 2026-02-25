import { useState, useEffect } from 'react';
import {
    Wallet, TrendingUp, ShieldCheck, Activity,
    BarChart2, Brain, Power, RefreshCw
} from 'lucide-react';

export default function Dashboard() {
    const [isActive, setIsActive] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [btcPrice, setBtcPrice] = useState('65,470.56');

    // Dummy log generator for UI
    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            const isBlock = Math.random() > 0.7;
            const time = new Date().toLocaleTimeString('id-ID', { hour12: false });

            if (isBlock) {
                setLogs(prev => [`[LIVE] GEO-BLOCKED: Trading restricted in your region, please refer to available regions - https://docs.polymarket.com/developers/CLOB/geoblock`, ...prev]);
            } else {
                setLogs(prev => [`[AI] BTC=$65530 | 5 markets -> 2 signals -> 0 trades (LIVE)`, ...prev]);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div className="max-w-md mx-auto min-h-screen pb-10 p-4 space-y-4">

            {/* Top Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Wallet Value */}
                <div className="glass-panel p-4">
                    <div className="flex items-center text-polymarket-textMuted text-xs mb-2 uppercase tracking-wide">
                        <Wallet className="w-4 h-4 mr-2" />
                        Wallet Value
                    </div>
                    <div className="text-2xl font-bold text-polymarket-green">$1.30</div>
                    <div className="text-xs text-polymarket-textMuted mt-1">0.0000 MATIC</div>
                </div>

                {/* Total Profit */}
                <div className="glass-panel p-4">
                    <div className="flex items-center text-polymarket-textMuted text-xs mb-2 uppercase tracking-wide">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Total Profit
                    </div>
                    <div className="text-2xl font-bold text-polymarket-green">$6.42</div>
                    <div className="text-xs text-polymarket-textMuted mt-1">16 trades</div>
                </div>

                {/* Win Rate */}
                <div className="glass-panel p-4">
                    <div className="flex items-center text-polymarket-textMuted text-xs mb-2 uppercase tracking-wide">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Win Rate
                    </div>
                    <div className="text-xl font-bold text-polymarket-green">100%</div>
                    <div className="text-xs text-polymarket-textMuted mt-1">16/16 wins</div>
                </div>

                {/* BTC Price */}
                <div className="glass-panel p-4">
                    <div className="flex items-center text-polymarket-textMuted text-xs mb-2 uppercase tracking-wide">
                        <Activity className="w-4 h-4 mr-2" />
                        BTC Price
                    </div>
                    <div className="text-xl font-bold text-polymarket-blue">${btcPrice}</div>
                    <div className="text-xs text-polymarket-textMuted mt-1">Live Binance</div>
                </div>

                {/* Avg Profit */}
                <div className="glass-panel p-4">
                    <div className="flex items-center text-polymarket-textMuted text-xs mb-2 uppercase tracking-wide">
                        <BarChart2 className="w-4 h-4 mr-2" />
                        Avg Profit/Trade
                    </div>
                    <div className="text-xl font-bold text-[#F59E0B]">$0.40</div>
                    <div className="text-xs text-polymarket-textMuted mt-1">Per trade</div>
                </div>
            </div>

            {/* AI Agent Control Panel */}
            <div className="glass-panel p-5 mt-6 border-polymarket-border/50">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <Brain className="w-6 h-6 text-polymarket-green mr-3" />
                        <h2 className="font-bold text-lg">AI Agent &mdash; BTC 5min</h2>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className={`text-xs font-bold ${isActive ? 'text-polymarket-green' : 'text-polymarket-textMuted'}`}>
                            &#x25CF; {isActive ? 'ACTIVE' : 'OFF'}
                        </div>

                        {/* Custom Toggle Switch */}
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${isActive ? 'bg-polymarket-green' : 'bg-gray-600'}`}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                {/* Scanning Status */}
                <div className={`rounded-xl p-3 mb-4 flex items-center justify-center text-sm ${isActive ? 'bg-[#064E3B]/40 text-polymarket-green border border-polymarket-green/20' : 'bg-polymarket-card text-polymarket-textMuted'}`}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isActive ? 'animate-spin' : ''}`} />
                    {isActive ? 'SCANNING... \u2022 Cycle #3 \u2022 0 trades' : 'AGENT STANDBY'}
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-polymarket-card/50 rounded-lg p-2 text-center border border-polymarket-border/30">
                        <div className="text-[10px] text-polymarket-textMuted uppercase mb-1">BTC</div>
                        <div className="font-semibold text-sm">$65.458</div>
                    </div>
                    <div className="bg-polymarket-card/50 rounded-lg p-2 text-center border border-polymarket-border/30">
                        <div className="text-[10px] text-polymarket-textMuted uppercase mb-1">Markets</div>
                        <div className="font-semibold text-sm">5</div>
                    </div>
                    <div className="bg-polymarket-card/50 rounded-lg p-2 text-center border border-polymarket-border/30">
                        <div className="text-[10px] text-polymarket-textMuted uppercase mb-1">Signals</div>
                        <div className="font-semibold text-sm text-polymarket-green">2</div>
                    </div>
                </div>

                {/* Active Predictions List */}
                <div className="space-y-2">
                    {/* Item 1 */}
                    <div className="border border-polymarket-green/30 bg-[#064E3B]/20 rounded-lg p-3 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm">NO @ $0.4950</span>
                            <span className="text-polymarket-green text-sm">72%</span>
                        </div>
                        <div className="text-[10px] text-polymarket-textMuted">Bitcoin Up or Down - February 26, 5:15AM-5:20AM ET</div>
                        {/* Progress bar background */}
                        <div className="absolute bottom-0 left-0 h-0.5 bg-polymarket-green/30 w-full">
                            <div className="h-full bg-polymarket-green" style={{ width: '72%' }}></div>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="border border-polymarket-green/30 bg-[#064E3B]/20 rounded-lg p-3 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm">NO @ $0.4950</span>
                            <span className="text-polymarket-green text-sm">71%</span>
                        </div>
                        <div className="text-[10px] text-polymarket-textMuted">Bitcoin Up or Down - February 26, 5:20AM-5:25AM ET</div>
                        {/* Progress bar background */}
                        <div className="absolute bottom-0 left-0 h-0.5 bg-polymarket-green/30 w-full">
                            <div className="h-full bg-polymarket-green" style={{ width: '71%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bot Logs Terminal */}
            <div className="glass-panel mt-6 flex flex-col h-64 border-polymarket-border">
                <div className="flex items-center px-4 py-3 border-b border-polymarket-border/50 bg-[#1A1D24] rounded-t-xl">
                    <Power className="w-4 h-4 mr-2 text-polymarket-textMuted" />
                    <h3 className="font-semibold text-sm">Bot Logs</h3>
                </div>
                <div className="p-4 overflow-y-auto flex-1 font-mono text-xs space-y-2 flex flex-col-reverse">
                    {logs.length === 0 ? (
                        <div className="text-polymarket-textMuted italic text-center my-auto">Waiting for agent to activate...</div>
                    ) : (
                        logs.map((log, i) => (
                            <div key={i} className={`pb-1 ${log.includes('GEO-BLOCKED') ? 'text-red-500' : 'text-polymarket-blue'}`}>
                                <span className="mr-2 opacity-50">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
                                {log}
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}
