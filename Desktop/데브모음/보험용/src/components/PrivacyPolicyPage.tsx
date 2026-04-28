import React from 'react';
import { ShieldCheck, ArrowLeft, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  return (
    <div className="privacy-page">
      <header className="privacy-header glass">
        <div className="header-content">
          <button onClick={onBack} className="back-btn glass-hover">
            <ArrowLeft size={20} />
            <span>돌아가기</span>
          </button>
          <div className="logo">
            <ShieldCheck size={28} color="var(--primary)" />
            <span className="text-gradient">Genesis CRM</span>
          </div>
        </div>
      </header>

      <main className="privacy-main">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="content-card glass"
        >
          <section className="document-header">
            <h1>개인정보 처리방침</h1>
            <p className="last-updated">최종 개정일: 2026년 4월 25일</p>
          </section>

          <div className="prose">
            <p>
              주식회사 제네시스(이하 "회사")는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </p>

            <h2>제1조 개인정보의 처리 목적</h2>
            <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <ul>
              <li><strong>서비스 제공:</strong> 보험 보장 분석, 리모델링 제안, 설계 지원 시스템 제공</li>
              <li><strong>고객 관리:</strong> 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정이용 방지와 비인가 사용 방지, 가입 의사 확인, 고충처리</li>
              <li><strong>마케팅 및 광고:</strong> 신규 서비스(제품) 개발 및 특화, 이벤트 등 광고성 정보 전달 (선택 동의 시)</li>
            </ul>

            <h2>제2조 처리하는 개인정보의 항목</h2>
            <p>회사는 서비스 제공을 위해 최소한의 개인정보를 수집하고 있습니다.</p>
            <div className="table-wrapper glass">
              <table>
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>수집 항목</th>
                    <th>수집 목적</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>필수</td>
                    <td>성명, 휴대전화번호, 생년월일</td>
                    <td>본인 식별 및 상담 지원</td>
                  </tr>
                  <tr>
                    <td>필수</td>
                    <td>보험 가입 내역(상품명, 보장금액 등)</td>
                    <td>보험 보장 분석 서비스 제공</td>
                  </tr>
                  <tr>
                    <td>자동 수집</td>
                    <td>IP주소, 쿠키, 서비스 이용기록</td>
                    <td>부정 이용 방지 및 서비스 최적화</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>제3조 개인정보의 처리 및 보유 기간</h2>
            <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
            <ul>
              <li><strong>보유 기간:</strong> 서비스 이용 종료 시 또는 파기 요청 시까지</li>
              <li><strong>예외 보존:</strong> 상법 등 관련 법령의 규정에 의하여 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보존합니다.</li>
            </ul>

            <h2>제4조 개인정보의 제3자 제공</h2>
            <p>회사는 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
            <div className="table-wrapper glass">
              <table>
                <thead>
                  <tr>
                    <th>제공받는 자</th>
                    <th>제공 목적</th>
                    <th>제공 항목</th>
                    <th>보유 기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>담당 보험 설계사(플래너)</td>
                    <td>맞춤형 보험 상담 및 컨설팅</td>
                    <td>성명, 연락처, 보장분석 결과</td>
                    <td>상담 목적 달성 시까지</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>제5조 개인정보의 파기 절차 및 방법</h2>
            <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다. 전자적 파일은 복구 및 재생이 불가능한 방법으로 영구 삭제하며, 종이 문서는 분쇄하거나 소각합니다.</p>

            <h2>제6조 정보주체의 권리·의무 및 행사 방법</h2>
            <p>정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다. 권리 행사는 서면, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치합니다.</p>

            <h2>제7조 개인정보의 안전성 확보 조치</h2>
            <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            <ul>
              <li><strong>관리적 조치:</strong> 내부관리계획 수립 및 시행, 정기적 직원 교육</li>
              <li><strong>기술적 조치:</strong> 개인정보처리시스템 등의 접근권한 관리, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
              <li><strong>물리적 조치:</strong> 전산실, 자료보관실 등의 접근통제</li>
            </ul>

            <h2>제8조 개인정보 보호책임자</h2>
            <div className="contact-card glass">
              <div className="contact-item">
                <Mail size={18} color="var(--primary)" />
                <div>
                  <p className="label">개인정보 보호책임자</p>
                  <p className="value">김제네 (대표이사)</p>
                </div>
              </div>
              <div className="contact-item">
                <Mail size={18} color="var(--primary)" />
                <div>
                  <p className="label">이메일</p>
                  <p className="value">privacy@genesis-crm.com</p>
                </div>
              </div>
              <div className="contact-item">
                <Phone size={18} color="var(--primary)" />
                <div>
                  <p className="label">전화번호</p>
                  <p className="value">02-1234-5678</p>
                </div>
              </div>
            </div>

            <h2>부칙</h2>
            <p>이 개인정보 처리방침은 2026년 4월 25일부터 적용됩니다.</p>
          </div>
        </motion.div>
      </main>

      <footer className="privacy-footer">
        <p>&copy; 2026 Genesis CRM. All rights reserved.</p>
      </footer>

      <style>{`
        .privacy-page {
          min-height: 100vh;
          background: var(--bg-space);
          color: var(--text-main);
          padding-top: 80px;
        }
        .privacy-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          z-index: 100;
          display: flex;
          align-items: center;
          padding: 0 40px;
          border-bottom: 1px solid var(--border);
        }
        .header-content {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .back-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          font-size: 20px;
        }
        .privacy-main {
          max-width: 900px;
          margin: 40px auto;
          padding: 0 20px;
        }
        .content-card {
          padding: 60px;
          border-radius: var(--radius-xl);
        }
        .document-header {
          text-align: center;
          margin-bottom: 60px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 40px;
        }
        .document-header h1 {
          font-size: 40px;
          margin-bottom: 16px;
        }
        .last-updated {
          color: var(--text-dim);
          font-size: 14px;
        }
        .prose h2 {
          font-size: 24px;
          margin: 48px 0 24px;
          padding-left: 12px;
          border-left: 4px solid var(--primary);
        }
        .prose p {
          margin-bottom: 20px;
          color: var(--text-muted);
          line-height: 1.8;
        }
        .prose ul {
          margin-bottom: 24px;
          padding-left: 20px;
        }
        .prose li {
          margin-bottom: 12px;
          color: var(--text-muted);
        }
        .table-wrapper {
          margin: 32px 0;
          overflow-x: auto;
          border-radius: var(--radius-md);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        th {
          background: rgba(255, 255, 255, 0.05);
          text-align: left;
          padding: 16px;
          color: var(--text-main);
          font-weight: 700;
          border-bottom: 1px solid var(--border);
        }
        td {
          padding: 16px;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
        }
        .contact-card {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          padding: 32px;
          margin-top: 24px;
        }
        .contact-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .contact-item .label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .contact-item .value {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-main);
        }
        .privacy-footer {
          text-align: center;
          padding: 60px 0;
          color: var(--text-dim);
          font-size: 13px;
        }
        @media (max-width: 768px) {
          .content-card { padding: 40px 24px; }
          .document-header h1 { font-size: 28px; }
          .prose h2 { font-size: 20px; }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicyPage;
