const smsService = require('../services/smsService');
const { sendSmsSchema, verifySmsSchema } = require('../validations/smsValidation');

const sendVerificationCode = async (req, res) => {
    try {
        // 1. Validation (Joi)
        const { error, value } = sendSmsSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { phone } = value;

        // 2. Service Call
        await smsService.sendVerificationCode(phone);

        return res.status(200).json({
            message: 'Verification code sent successfully.',
            expiresIn: 180
        });

    } catch (error) {
        console.error('Controller Send Error:', error);
        return res.status(500).json({ message: 'Server error. Failed to send code.' });
    }
};

const verifyCode = (req, res) => {
    try {
        // 1. Validation
        const { error, value } = verifySmsSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { phone, code } = value;

        // 2. Service Call
        const isValid = smsService.verifyCode(phone, code);

        if (isValid) {
            return res.status(200).json({ message: 'Phone verification successful.' });
        } else {
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }

    } catch (error) {
        console.error('Controller Verify Error:', error);
        return res.status(500).json({ message: 'Server error. Failed to verify code.' });
    }
};

module.exports = {
    sendVerificationCode,
    verifyCode
};
