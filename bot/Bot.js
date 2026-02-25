import express from 'express';
import { PolymarketAPI } from './PolymarketAPI.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Initialize the Polymarket Trading Bot Instance
const pmBot = new PolymarketAPI();

// Middleware to check Private Key
const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized: Missing Private Key" });
    }
    const token = authHeader.split(' ')[1];
    req.privateKey = token;
    next();
};

/* -------------------------------------------------------------------------- */
/*                                 BOT ROUTES                                 */
/* -------------------------------------------------------------------------- */

/**
 * 1. STATUS
 * Check if the bot is currently active or scanning.
 */
router.get('/status', (req, res) => {
    res.json({
        active: pmBot.isActive,
        address: pmBot.wallet ? pmBot.wallet.address : null,
        chainId: pmBot.chainId
    });
});

/**
 * 2. START BOT
 * Activates the bot, connects to Polymarket, and starts the AI Agent loop.
 */
router.post('/start', checkAuth, async (req, res) => {
    try {
        const userPrivateKey = req.privateKey;
        const { tradeSize } = req.body;

        console.log(`[SYS] Starting AI Agent... Trade Size Set To ${tradeSize}`);
        const result = await pmBot.init(userPrivateKey, tradeSize);

        if (result.status === 'success') {
            res.json({ message: "Bot started successfully", address: result.address, balance: result.balance });
        } else {
            res.status(500).json({ error: "Failed to initialize bot", details: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 3. STOP BOT
 * Deactivates the AI Agent and trading loop.
 */
router.post('/stop', checkAuth, (req, res) => {
    pmBot.isActive = false;
    console.log(`[SYS] AI Agent Stopped.`);
    res.json({ message: "Bot stopped" });
});

/**
 * 4. GET MARKET STATS 
 * Called by the frontend to update the scanning UI and wallet balance.
 */
router.get('/scan', checkAuth, async (req, res) => {
    if (!pmBot.isActive) {
        return res.status(400).json({ error: "Bot is not active" });
    }

    // Call the "AI" Scanning logic and fetch balance
    const stats = await pmBot.scanMarkets();

    if (stats) {
        res.json(stats);
    } else {
        res.status(500).json({ error: "Failed to scan markets" });
    }
});

export default router;
