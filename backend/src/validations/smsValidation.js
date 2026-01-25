const Joi = require('joi');

const phoneSchema = Joi.string()
    // Validates standard KR mobile numbers: 010, 011, 016, 017, 018, 019
    // Allow hyphens optionally
    .pattern(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/)
    .required()
    .messages({
        'string.pattern.base': 'Phone number must be a valid Korean mobile number (e.g., 010-1234-5678 or 01012345678).',
        'any.required': 'Phone number is required.'
    });

const sendSmsSchema = Joi.object({
    phone: phoneSchema
});

const verifySmsSchema = Joi.object({
    phone: phoneSchema,
    code: Joi.string().length(4).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'Verification code must be 4 digits.',
        'string.pattern.base': 'Verification code must be numeric.',
        'any.required': 'Verification code is required.'
    })
});

module.exports = {
    sendSmsSchema,
    verifySmsSchema
};
