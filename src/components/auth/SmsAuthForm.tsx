import React, { useEffect } from 'react';
import { useSmsAuth } from '../../hooks/useSmsAuth';
import { LuCheck, LuLoader, LuTimer, LuRefreshCw, LuSmartphone } from 'react-icons/lu';

interface SmsAuthFormProps {
    onVerificationSuccess?: () => void;
}

export const SmsAuthForm: React.FC<SmsAuthFormProps> = ({ onVerificationSuccess }) => {
    const {
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
    } = useSmsAuth();

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (step === 'VERIFIED') {
            if (onVerificationSuccess) {
                onVerificationSuccess();
            }
        }
    }, [step, onVerificationSuccess]);

    if (step === 'VERIFIED') {
        return (
            <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-green-50 rounded-xl border border-green-100 animate-in fade-in zoom-in duration-300">
                <LuCheck className="w-16 h-16 text-green-500" />
                <h3 className="text-xl font-bold text-green-700">Verification Complete</h3>
                <p className="text-green-600">Your phone number has been verified.</p>
                <button
                    onClick={reset}
                    className="text-sm text-green-600 underline hover:text-green-800"
                >
                    Verify another number
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
                <LuSmartphone className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-800">Phone Verification</h2>
            </div>

            <div className="space-y-4">
                {/* Phone Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <div className="relative">
                        <input
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            disabled={step === 'INPUT_CODE' || isLoading}
                            placeholder="010-1234-5678"
                            className={`w-full px-4 py-3 rounded-lg border ${error && step === 'INPUT_PHONE' ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-200'
                                } focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:text-gray-500`}
                        />
                        {step === 'INPUT_CODE' && (
                            <button
                                onClick={reset}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-600 font-medium hover:text-indigo-800"
                            >
                                Change
                            </button>
                        )}
                    </div>
                </div>

                {/* Code Input (Visible only in INPUT_CODE step) */}
                {step === 'INPUT_CODE' && (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Verification Code
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={code}
                                onChange={handleCodeChange}
                                disabled={isLoading}
                                placeholder="1234"
                                maxLength={4}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-center tracking-widest text-lg font-medium"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-sm text-gray-500 font-mono">
                                <LuTimer className="w-4 h-4" />
                                <span className={timer < 30 ? 'text-red-500' : ''}>{formatTimer(timer)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start">
                        <span className="mr-2">⚠️</span>
                        {error}
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={step === 'INPUT_PHONE' ? sendSms : verifySms}
                    disabled={isLoading || (step === 'INPUT_PHONE' && phone.length < 12)} // Simple length check
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-sm transition-all flex items-center justify-center space-x-2
            ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'}`}
                >
                    {isLoading ? (
                        <>
                            <LuLoader className="w-5 h-5 animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : step === 'INPUT_PHONE' ? (
                        <span>Send Verification Code</span>
                    ) : (
                        <span>Verify Code</span>
                    )}
                </button>

                {/* Resend Logic */}
                {step === 'INPUT_CODE' && timer === 0 && !isLoading && (
                    <button
                        onClick={sendSms}
                        className="w-full py-2 text-sm text-gray-500 flex items-center justify-center space-x-1 hover:text-indigo-600 transition-colors"
                    >
                        <LuRefreshCw className="w-4 h-4" />
                        <span>Resend Code</span>
                    </button>
                )}
            </div>
        </div>
    );
};

