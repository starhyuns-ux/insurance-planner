/**
 * KakaoTalk SDK Share Utility
 */

export const initKakao = () => {
    if (typeof window !== 'undefined' && window.Kakao) {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }
    }
};

export const shareToKakao = ({ url, title, description, imageUrl }: { 
    url: string; 
    title: string; 
    description: string; 
    imageUrl?: string 
}) => {
    if (typeof window !== 'undefined' && window.Kakao) {
        initKakao();
        
        window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: title,
                description: description,
                imageUrl: imageUrl || 'https://stroy.kr/og-image.png',
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            },
            buttons: [
                {
                    title: '자세히 보기',
                    link: {
                        mobileWebUrl: url,
                        webUrl: url,
                    },
                },
            ],
        });
    } else {
        // Fallback to native share or clipboard
        if (navigator.share) {
            navigator.share({ title, text: description, url });
        } else {
            navigator.clipboard.writeText(url);
            alert('링크가 복사되었습니다.');
        }
    }
};

declare global {
    interface Window {
        Kakao: any;
    }
}
