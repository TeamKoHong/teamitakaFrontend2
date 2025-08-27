export const sendVerificationCode = async (emailData) => {
    try {
        const response = await fetch('/api/auth/send-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        });

        if (!response.ok) {
            throw new Error('HTTP error! status: ${response.status}');
        }

        return response.json();
    } catch (error) {
        throw new Error('인증번호 전송에 실패했습니다.');
    }
}