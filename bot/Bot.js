import express from 'express';
import { PolymarketAPI } from './PolymarketAPI.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Initialize the Polymarket Trading Bot Instance
const pmBot = new PolymarketAPI();

// Middleware to check API key or authenticate the user session
// Here we would normally verify the email from the frontend login.
const checkAuth = (req, res, next) => {
    // Basic check for now
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "Unauthorized" });
    }
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
        // The private key should come from a secure vault or Env DB linked to the user's email
        const userPrivateKey = process.env.POLYGON_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001';

        console.log(`[SYS] Starting AI Agent...`);
        const result = await pmBot.init(userPrivateKey);

        if (result.status === 'success') {
            res.json({ message: "Bot started successfully", address: result.address });
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
 * Called by the frontend to update the scanning UI (BTC price, active markets).
 */
router.get('/scan', async (req, res) => {
    if (!pmBot.isActive) {
        return res.status(400).json({ error: "Bot is not active" });
    }

    // Call the "AI" Scanning logic
    const stats = await pmBot.scanMarkets();

    if (stats) {
        res.json(stats);
    } else {
        res.status(500).json({ error: "Failed to scan markets" });
    }
});

export default router;
