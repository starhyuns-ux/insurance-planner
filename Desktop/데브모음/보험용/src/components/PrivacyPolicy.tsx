import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="modal-content glass" 
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="text-gradient">{title}</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div className="policy-text">
            {content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </motion.div>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        .modal-content {
          width: 100%;
          max-width: 500px;
          max-height: 80vh;
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .modal-header {
          padding: 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .modal-header h3 { margin: 0; font-size: 20px; font-weight: 800; }
        .close-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); transition: var(--transition-smooth); }
        .close-btn:hover { color: white; transform: rotate(90deg); }
        .modal-body {
          padding: 32px;
          overflow-y: auto;
          font-size: 14px;
          line-height: 1.8;
          color: var(--text-muted);
        }
        .policy-text p { margin-bottom: 16px; }
      `}</style>
    </div>
  );
};

export const TERMS_TEXTS = {
  collection: `
[개인정보 수집 및 이용 동의]
1. 수집 항목: 성명, 휴대전화번호
2. 수집 목적: 보험 보장 분석 서비스 제공 및 상담
3. 보유 및 이용 기간: 서비스 제공 완료 후 1년 또는 정보주체의 삭제 요청 시까지
4. 동의 거부 권리: 귀하는 동의를 거부할 권리가 있으나, 거부 시 서비스 이용이 제한됩니다.
  `,
  thirdParty: `
[개인정보 제3자 제공 동의]
1. 제공받는 자: 담당 보험 설계사(플래너)
2. 제공 목적: 보험 보장 분석 결과 확인 및 맞춤형 상담 제공
3. 제공 항목: 성명, 휴대전화번호, 보험 분석 결과(점수, 보장 항목 등)
4. 보유 및 이용 기간: 상담 목적 달성 시까지 또는 1년
  `
};

export const LEGAL_DISCLAIMER = "본 서비스는 보험 설계사의 보장 분석 업무를 지원하는 IT 솔루션입니다. 분석 결과는 입력된 데이터를 바탕으로 한 시뮬레이션이며, 실제 보장 내용 및 보상 여부는 해당 보험사의 약관 및 심사 결과에 따라 달라질 수 있습니다. 본 서비스는 직접적인 보험 판매나 중개를 수행하지 않으며, 모든 상담 책임은 담당 설계사에게 있습니다.";
