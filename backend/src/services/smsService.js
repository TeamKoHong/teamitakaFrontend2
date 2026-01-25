const NodeCache = require('node-cache');
const { SolapiMessageService } = require('solapi');
require('dotenv').config();

// Cache for storing verification codes (TTL: 180 seconds - 3 minutes)
const verificationCache = new NodeCache({ stdTTL: 180, checkperiod: 60 });

class SmsService {
    constructor() {
        // Solapi setup
        // Ensure you have SOLAPI_API_KEY and SOLAPI_API_SECRET in .env
        if (process.env.SOLAPI_API_KEY && process.env.SOLAPI_API_SECRET) {
            this.messageService = new SolapiMessageService(
                process.env.SOLAPI_API_KEY,
                process.env.SOLAPI_API_SECRET
            );
        } else {
            console.warn('Solapi credentials not found in env. SMS sending will fail (or use mock).');
        }
    }

    normalizePhone(phone) {
        return phone.replace(/[^0-9]/g, '');
    }

    generateCode() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    async sendVerificationCode(phone) {
        const normalizedPhone = this.normalizePhone(phone);
        const code = this.generateCode();

        // Store code in cache
        // Key: phone number, Value: code
        verificationCache.set(normalizedPhone, code);

        // Prepare message
        const message = {
            to: normalizedPhone,
            from: process.env.SOLAPI_SENDER_NUM, // Must be registered in Solapi
            text: `[TeamItaka] Authentication Code: [${code}]. Valid for 3 minutes.`
        };

        console.log(`[DEV_LOG] Sending SMS to ${normalizedPhone}: ${code}`); // For checking in dev console

        try {
            if (this.messageService) {
                const result = await this.messageService.sendOne(message);
                return result;
            } else {
                console.log('[MOCK_SEND] Solapi service not initialized. Treating as sent.');
                return { statusCode: '2000', statusMessage: 'Normal (Mock)' };
            }
        } catch (error) {
            console.error('Solapi Send Error:', error);
            throw new Error('Failed to send SMS.');
        }
    }

    verifyCode(phone, code) {
        const normalizedPhone = this.normalizePhone(phone);
        const cachedCode = verificationCache.get(normalizedPhone);

        if (!cachedCode) {
            // Expired or never sent
            return false;
        }

        if (cachedCode === code) {
            // Match! Delete from cache to prevent reuse
            verificationCache.del(normalizedPhone);
            return true;
        }

        return false;
    }
}

module.exports = new SmsService();
