import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'shared/shims/useNextRouterShim';
import UnifiedAdaptiveResultCard from 'features/type-test/components/UnifiedAdaptiveResultCard';
import { TYPE_METADATA } from 'features/type-test/lib/types';

export default function ResultPage() {
    const router = useRouter();
    const { type } = useParams();
    const rawTypeCode = type as string;
    const typeCode = rawTypeCode ? decodeURIComponent(rawTypeCode) : '';
    const [isLoading, setIsLoading] = useState(true);

    const typeMeta = TYPE_METADATA[typeCode];

    useEffect(() => {
        if (!typeMeta) {
            // notFound logic replacement -> navigate home or show error
            if (!isLoading) router.push('/');
            return;
        }
        setIsLoading(false);
    }, [typeMeta, typeCode, isLoading, router]);

    const handleRetest = () => {
        router.push('/type-test');
    };

    if (isLoading || !typeMeta) {
        return (
            <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center">
                <div className="tw-text-center">
                    <div className="tw-w-12 tw-h-12 tw-border-4 tw-border-primary tw-border-t-transparent tw-rounded-full tw-animate-spin tw-mx-auto tw-mb-4"></div>
                    <p className="tw-text-gray-500">결과를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="tw-min-h-screen result-page" style={{ backgroundColor: '#323030' }}>
            <div className="tw-max-w-sm tw-mx-auto tw-relative">
                <button
                    onClick={() => router.push('/')}
                    className="tw-absolute tw-z-10"
                    style={{
                        width: '63.12px', height: '63.12px',
                        backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                        top: '20px', right: '20px'
                    }}
                    aria-label="메인으로 이동"
                />
            </div>

            <main className="tw-pt-4 tw-pb-8" style={{ backgroundColor: '#323030' }}>
                <div className="tw-max-w-sm tw-mx-auto">
                    <UnifiedAdaptiveResultCard
                        typeMeta={typeMeta}
                        isDark={true}
                        onRetest={handleRetest}
                    />
                </div>
            </main>
        </div>
    );
}
