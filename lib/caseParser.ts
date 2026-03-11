export type CaseItem = {
    nameMasked: string; // 김*수
    age: number;
    job: string;
    location: string; // 의정부 민락동 등
    rating: 5;
    quote: string;
};

const lastNames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "류", "문", "양", "변", "백", "허", "남", "심", "노", "하", "곽", "성", "차", "도", "위", "표", "명", "기", "엄", "천", "방", "구", "진", "나", "마", "사", "아", "우"];
const syllables = ["민", "수", "준", "현", "지", "우", "서", "연", "은", "하", "도", "윤", "재", "호", "진", "영", "성", "훈", "경", "태", "원", "주", "혜", "나", "율", "찬", "규", "빈", "솔", "온", "람", "결", "담", "혁"];

const regions = [
    "의정부 민락동", "대전 둔산동", "울산 삼산동", "부산 해운대구", "천안 신부동",
    "서울 강남구", "서울 서초구", "서울 송파구", "인천 송도동", "인천 청라동",
    "대구 수성구", "광주 상무지구", "수원 광교동", "용인 수지구", "성남 분당구",
    "창원 상남동", "전주 신시가지", "청주 오창읍", "세종 보람동", "제주 노형동",
    "고양 일산동구", "남양주 다산동", "파주 운정동", "김포 걸포동", "부천 중동",
    "안산 고잔동", "안양 평촌동", "포항 남구", "구미 진평동", "진주 혁신도시"
];

function randInt(max: number) {
    return Math.floor(Math.random() * max);
}

function makeMaskedName() {
    // 성 + (이름2글자 중 가운데 마스킹) → 김*수
    const ln = lastNames[randInt(lastNames.length)];
    const b = syllables[randInt(syllables.length)];
    return `${ln}*${b}`;
}

function getRandomRegion() {
    return regions[randInt(regions.length)];
}

export function parseCases(source: string): CaseItem[] {
    // 형식: "황○○ 44세 · 사업가 ★★★★★ “... ”"
    const re = /([가-힣]{1,3}○○)\s+(\d{1,3})세\s*·\s*([^★\n]+)\s*★★★★★\s*“([^”]+)”/g;

    const items: { age: number; job: string; quote: string }[] = [];
    let m: RegExpExecArray | null;

    while ((m = re.exec(source)) !== null) {
        items.push({
            age: Number(m[2]),
            job: (m[3] ?? "").trim(),
            quote: (m[4] ?? "").trim(),
        });
    }

    // 중복 제거: age+job+quote 동일하면 하나만
    const uniq = new Map<string, { age: number; job: string; quote: string }>();
    for (const it of items) {
        const key = `${it.age}|${it.job}|${it.quote}`;
        if (!uniq.has(key)) uniq.set(key, it);
    }

    // 이름은 “랜덤”
    return Array.from(uniq.values()).map((x) => ({
        nameMasked: makeMaskedName(),
        age: x.age,
        job: x.job,
        location: getRandomRegion(),
        rating: 5 as const,
        quote: x.quote,
    }));
}