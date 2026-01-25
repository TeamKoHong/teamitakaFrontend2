import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

type SmsAuthStep = 'INPUT_PHONE' | 'INPUT_CODE' | 'VERIFIED';

interface UseSmsAuthReturn {
    phone: string;
    code: string;
    step: SmsAuthStep;
    timer: number;
    isLoading: boolean;
    error: string | null;
    handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    sendSms: () => Promise<void>;
    verifySms: () => Promise<void>;
    reset: () => void;
}

const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

export const useSmsAuth = (): UseSmsAuthReturn => {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<SmsAuthStep>('INPUT_PHONE');
    const [timer, setTimer] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
        setError(null);
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow only numbers and max 4 digits
        const val = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
        setCode(val);
        setError(null);
    };

    const sendSms = async () => {
        const plainPhone = phone.replace(/-/g, '');
        const phoneRegex = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;

        if (!phoneRegex.test(plainPhone)) {
            setError('Please enter a valid phone number (010-XXXX-XXXX).');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await axios.post('/api/auth/sms/send', { phone: plainPhone });
            setStep('INPUT_CODE');
            setTimer(180); // 3 minutes
        } catch (err: any) {
            if (err.response?.status === 429) {
                setError('Too many requests. Please try again later.');
            } else if (err.response?.status === 400) {
                setError(err.response.data.message || 'Validation error.');
            } else {
                setError('Server error. Failed to send verification code.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const verifySms = async () => {
        if (code.length !== 4) {
            setError('Please enter the 4-digit code.');
            return;
        }

        setIsLoading(true);
        setError(null);
        const plainPhone = phone.replace(/-/g, '');

        try {
            await axios.post('/api/auth/sms/verify', { phone: plainPhone, code });
            setStep('VERIFIED');
            setTimer(0);
        } catch (err: any) {
            if (err.response?.status === 400 || err.response?.status === 401) {
                setError('Invalid verification code.');
            } else {
                setError('Verification failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const reset = useCallback(() => {
        setPhone('');
        setCode('');
        setStep('INPUT_PHONE');
        setTimer(0);
        setError(null);
    }, []);

    return {
        phone,
        code,
        step,
        timer,
        isLoading,
        error,
        handlePhoneChange,
        handleCodeChange,
        sendSms,
        verifySms,
        reset,
    };
};
