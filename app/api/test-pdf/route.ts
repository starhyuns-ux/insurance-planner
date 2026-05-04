import { NextResponse } from 'next/server';
import { generateClaimPDF } from '@/lib/pdf-generator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company') || '현대해상';

  const mockClaim = {
    insurance_company: company,
    customer_name: '홍길동',
    policyholder_name: '김철수',
    resident_number: '900101-1234567',
    policyholder_resident_number: '800101-1234567',
    customer_phone: '010-1234-5678',
    address: '서울특별시 강남구 테헤란로 123 4층',
    accident_date: '2026-05-01',
    accident_detail: '계단에서 넘어져 우측 발목 염좌 발생 (테스트)',
    bank_name: '신한은행',
    bank_account: '110-123-456789',
    bank_holder: '홍길동',
    created_at: new Date().toISOString(),
    image_urls: [] // 서명 이미지가 없으면 생략됨
  };

  try {
    const pdfBuffer = await generateClaimPDF(mockClaim, {});
    
    // 한글 파일명 인코딩 처리
    const safeFilename = encodeURIComponent(`test_${company}.pdf`);
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename*=UTF-8''${safeFilename}`,
      },
    });
  } catch (error: any) {
    console.error('PDF Generation test error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
