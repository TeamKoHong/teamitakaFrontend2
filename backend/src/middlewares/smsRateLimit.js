const NodeCache = require('node-cache');

// Cache instance for rate limiting
// 1 day = 86400 seconds. We'll store daily counts here.
const rawRateLimitCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

// Helper to normalize phone number (remove specific characters)
const normalizePhone = (phone) => {
    return phone.replace(/[^0-9]/g, '');
};

const smsRateLimit = (req, res, next) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            // If phone is missing, validation middleware should catch it, 
            // but if misplaced, we just proceed or return 400.
            return res.status(400).json({ message: 'Phone number is required for rate limiting check.' });
        }

        const normalizedPhone = normalizePhone(phone);
        const dailyKey = `limit_daily_${normalizedPhone}`;
        const minKey = `limit_min_${normalizedPhone}`;

        // 1. Check Minute Limit (1 req / min)
        // If key exists, it means they requested < 60s ago.
        if (rawRateLimitCache.get(minKey)) {
            return res.status(429).json({ message: 'Too many requests. Please try again after 1 minute.' });
        }

        // 2. Check Daily Limit (5 req / day)
        const dailyCount = rawRateLimitCache.get(dailyKey) || 0;
        if (dailyCount >= 5) {
            return res.status(429).json({ message: 'Daily SMS limit exceeded (5 requests/day).' });
        }

        // 3. Update Counters
        // Set minute lock (60s)
        rawRateLimitCache.set(minKey, true, 60);
        // Increment daily count (keep existing TTL if possible, or reset to 1 day if new)
        // node-cache doesn't support "increment without resetting TTL" easily without `ttl`.
        // For simplicity, we just set/update with remaining TTL or default.
        // However, `set` resets TTL. Let's just use fixed TTL for simplicity or getTtl.

        const currentTtl = rawRateLimitCache.getTtl(dailyKey);
        // If it exists, we want to preserve expiration. 
        // If getTtl returns undefined or 0 (if expired), use default 86400.
        // Date.now() is ms, getTtl returns ms epoch.
        let ttlSeconds = 86400;
        if (currentTtl && currentTtl > Date.now()) {
            ttlSeconds = Math.floor((currentTtl - Date.now()) / 1000);
        }

        rawRateLimitCache.set(dailyKey, dailyCount + 1, ttlSeconds);

        next();
    } catch (error) {
        console.error('Rate Limit Error:', error);
        next(error);
    }
};

module.exports = smsRateLimit;
