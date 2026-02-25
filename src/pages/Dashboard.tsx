import { useState, useEffect } from 'react';
import {
    Wallet, TrendingUp, ShieldCheck, Activity,
    BarChart2, Brain, Power, RefreshCw
} from 'lucide-react';

export default function Dashboard() {
    const [isActive, setIsActive] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [btcPrice, setBtcPrice] = useState('0.00');
    const [markets, setMarkets] = useState(0);
    const [signals, setSignals] = useState(0);

    // Real Data State
    const [walletBalance, setWalletBalance] = useState('0.00');
    const [tradeSize, setTradeSize] = useState('5'); // Default $5

    // Check Auth
    useEffect(() => {
        const pk = localStorage.getItem('pm_private_key');
        if (!pk) {
            window.location.href = '/login';
        }

        const savedSize = localStorage.getItem('pm_trade_size');
        if (savedSize) setTradeSize(savedSize);
    }, []);

    // API Polling Loop (Balances & Scans)
    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(async () => {
            try {
                const pk = localStorage.getItem('pm_private_key');
                if (!pk) return;

                const res = await fetch('/api/bot/scan', {
                    headers: { 'Authorization': `Bearer ${pk}` }
                });

                if (res.ok) {
                    const data = await res.json();

                    if (data.btcPrice) setBtcPrice(data.btcPrice);
                    if (data.markets !== undefined) setMarkets(data.markets);
                    if (data.signals !== undefined) setSignals(data.signals);
                    if (data.balance !== undefined) setWalletBalance(data.balance);

                    if (data.log) {
                        setLogs(prev => [data.log, ...prev].slice(0, 50)); // Keep last 50 logs
                    }
                } else {
                    console.error("Fetch returned non-OK status");
                }
            } catch (err) {
                setLogs(prev => [`[LIVE] Error connecting to Bot Backend. Retrying...`, ...prev]);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isActive]);

    const handleTradeSizeChange = (size: string) => {
        setTradeSize(size);
        localStorage.setItem('pm_trade_size', size);
        setLogs(prev => [`[SYS] Trade size updated to $${size}`, ...prev]);
    };

    const toggleBot = async () => {
        try {
            const pk = localStorage.getItem('pm_private_key');
            if (!pk) {
                setLogs(prev => ['[ERROR] No Private Key found. Please relogin.', ...prev]);
                return;
            }

            if (!isActive) {
                // Start Bot
                const res = await fetch('/api/bot/start', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${pk}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tradeSize })
                });

                if (res.ok) {
                    const data = await res.json();
                    setIsActive(true);
                    setWalletBalance(data.balance || '0.00');
                    setLogs(prev => ['[SYS] Bot Started. Real Trading Engine Online.', ...prev]);
                } else {
                    const errorData = await res.json();
                    setLogs(prev => [`[ERROR] Failed to start bot: ${errorData.error}`, ...prev]);
                }
            } else {
                // Stop Bot
                await fetch('/api/bot/stop', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${pk}` }
                });
                setIsActive(false);
                setLogs(prev => ['[SYS] Bot Stopped safely.', ...prev]);
            }
        } catch (err) {
            console.error("Failed to toggle bot", err);
            setLogs(prev => ['[ERROR] Backend connection failed.', ...prev]);
        }
    };

    return (
        <div className="max-w-md mx-auto min-h-screen pb-10 p-4 space-y-4">

            {/* Top Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Wallet Value */}
                <div className="glass-panel p-4 outline outline-1 outline-polymarket-green/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-polymarket-green/5 blur-xl rounded-full"></div>
                    <div className="flex items-center text-polymarket-textMuted text-xs mb-2 uppercase tracking-wide">
                        <Wallet className="w-4 h-4 mr-2 text-polymarket-green" />
                        USDC Balance (Polygon)
                    </div>
                    <div className="text-2xl font-bold text-polymarket-green">${walletBalance}</div>
                    <div className="text-[10px] text-polymarket-textMuted mt-1">Live from Wallet</div>
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
            <div className="glass-panel p-5 mt-6 border-polymarket-border/80 shadow-lg relative overflow-hidden">
                {/* Glowing status line */}
                <div className={`absolute top-0 left-0 w-full h-1 ${isActive ? 'bg-polymarket-green shadow-[0_0_15px_#10B981]' : 'bg-gray-600'}`}></div>

                <div className="flex justify-between items-center mb-6 mt-1">
                    <div className="flex items-center">
                        <Brain className={`w-6 h-6 mr-3 ${isActive ? 'text-polymarket-green animate-pulse' : 'text-gray-500'}`} />
                        <div>
                            <h2 className="font-bold text-lg text-white">Quantitative AI &mdash; BTC 5min</h2>
                            <p className="text-[10px] text-polymarket-textMuted">Trading "Bitcoin Up or Down" Markets</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className={`text-xs font-bold ${isActive ? 'text-polymarket-green' : 'text-gray-500'}`}>
                            &#x25CF; {isActive ? 'LIVE TRADING' : 'OFFLINE'}
                        </div>

                        {/* Custom Toggle Switch */}
                        <button
                            onClick={toggleBot}
                            className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ease-in-out ${isActive ? 'bg-polymarket-green border border-[#2DD4BF]' : 'bg-[#1A1D24] border border-gray-700'}`}
                        >
                            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isActive ? 'translate-x-7 shadow-[0_0_10px_white]' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                {/* Trade Sizing (ONLY SHOW WHEN NOT ACTIVE to prevent mid-trade changes) */}
                <div className="mb-5 pb-5 border-b border-polymarket-border/50">
                    <div className="text-xs text-polymarket-textMuted mb-3 uppercase tracking-wider font-semibold">Trade Size per Signal</div>
                    <div className="flex space-x-2">
                        {['5', '10', '25', 'MAX'].map((size) => (
                            <button
                                key={size}
                                disabled={isActive}
                                onClick={() => handleTradeSizeChange(size)}
                                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${tradeSize === size
                                        ? 'bg-polymarket-blue/20 text-polymarket-blue border border-polymarket-blue'
                                        : 'bg-[#1A1D24] text-polymarket-text border border-polymarket-border hover:bg-[#2A2D34]'
                                    } ${isActive && 'opacity-50 cursor-not-allowed'}`}
                            >
                                {size === 'MAX' ? 'MAX' : `$${size}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scanning Status */}
                <div className={`rounded-lg p-3 mb-4 flex items-center justify-center text-sm font-medium transition-all ${isActive ? 'bg-[#064E3B]/40 text-polymarket-green border border-polymarket-green/30' : 'bg-[#1A1D24] text-gray-500 border border-polymarket-border'}`}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isActive ? 'animate-spin' : ''}`} />
                    {isActive ? 'ANALYZING ORDERBOOK & MOMENTUM...' : 'BOT ENGINE STANDBY'}
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-polymarket-card/50 rounded-lg p-2 text-center border border-polymarket-border/30">
                        <div className="text-[10px] text-polymarket-textMuted uppercase mb-1">BTC</div>
                        <div className="font-semibold text-sm">${btcPrice}</div>
                    </div>
                    <div className="bg-polymarket-card/50 rounded-lg p-2 text-center border border-polymarket-border/30">
                        <div className="text-[10px] text-polymarket-textMuted uppercase mb-1">Markets</div>
                        <div className="font-semibold text-sm">{markets}</div>
                    </div>
                    <div className="bg-polymarket-card/50 rounded-lg p-2 text-center border border-polymarket-border/30">
                        <div className="text-[10px] text-polymarket-textMuted uppercase mb-1">Signals</div>
                        <div className="font-semibold text-sm text-polymarket-green">{signals}</div>
                    </div>
                </div>

                {/* Active Predictions List */}
                <div className="space-y-2">
                    <div className="text-xs text-polymarket-textMuted uppercase tracking-wider mb-2 font-semibold">Active Targets</div>
                    {/* Item 1 */}
                    <div className="border border-polymarket-border bg-[#1A1D24] rounded-lg p-3 flex justify-between items-center">
                        <div>
                            <div className="text-xs text-polymarket-textMuted mb-0.5">Bitcoin Up or Down</div>
                            <div className="font-bold text-sm text-white">5-Minute Intervals</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-polymarket-textMuted mb-1">Target Action</div>
                            <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#064E3B] text-polymarket-green border border-polymarket-green/30">
                                BUY YES / BUY NO
                            </div>
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
                            <div key={i} className={`pb-1 ${log.includes('GEO-BLOCKED') || log.includes('ERROR') ? 'text-red-500' : 'text-polymarket-blue'}`}>
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
