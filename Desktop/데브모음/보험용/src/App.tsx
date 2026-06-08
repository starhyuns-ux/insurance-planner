import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  User, 
  LayoutDashboard,
  CheckCircle2,
  ChevronRight,
  Users,
  Send,
  BarChart3,
  Copy,
  MessageCircle,
  Check,
  Code,
  Key,
  Terminal,
  Zap,
  Lock,
  PieChart,
  Settings,
  Crown,
  Bell,
  ArrowRight,
  ExternalLink,
  Globe,
  AlertCircle,
  Calendar,
  Clock,
  Plus,
  Star,
  MapPin,
  Eye,
  EyeOff
} from "lucide-react";
import { analyzeCoverage, PRICING, PolicyData, AnalysisResult } from "./services/AnalysisEngine.js";
import { sendTelegramMessage } from "./services/messaging.js";
import { PrivacyPolicyModal, TERMS_TEXTS, LEGAL_DISCLAIMER } from "./components/PrivacyPolicy.js";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage.js";

// --- Types & Constants ---
type Role = "planner" | "customer";
type PlannerViewType = "Dashboard" | "Schedule" | "Analysis" | "Portals" | "Membership" | "Developers";

const INSURANCE_PORTALS = {
  life: [
    { name: "미래에셋생명", url: "http://www.loveageplan.com/" },
    { name: "한화생명", url: "https://hmp.hanwhalife.com/online/ga" },
    { name: "삼성생명", url: "https://connectplus.samsunglife.com:10443/gasso/login?contextType=external" },
    { name: "교보생명", url: "https://ga.kyobo.com" },
    { name: "흥국생명", url: "https://sales.heungkuklife.co.kr/login.html" },
    { name: "푸본현대생명", url: "https://wsfa.hyundailife.com/" },
    { name: "iM라이프(DGB)", url: "https://fgs.imlifeins.co.kr:8443/" },
    { name: "KDB생명", url: "http://kss.kdblife.co.kr" },
    { name: "KB라이프", url: "https://sfa.kblife.co.kr/" },
    { name: "DB생명", url: "http://etopia.dongbulife.com" },
    { name: "동양생명", url: "https://1004.myangel.co.kr/" },
    { name: "NH농협생명", url: "https://sfa.nhlife.co.kr:8443/websquare/websquare.jsp#w2xPath=/ui/sf/sc/SFSC0100M00.xml" },
    { name: "ABL생명", url: "https://ga.abllife.co.kr/" },
    { name: "BNP파리바카디프", url: "http://ga.cardif.co.kr" },
    { name: "AIA생명", url: "https://imap.aia.co.kr" },
    { name: "라이나생명", url: "https://ga.lina.co.kr" },
    { name: "메트라이프", url: "http://metplus.metlife.co.kr/" },
    { name: "IBK연금보험", url: "https://sf.ibki.co.kr/" },
    { name: "신한라이프", url: "https://ga.shinhanlife.co.kr/" },
    { name: "푸르덴셜(KB)", url: "https://ga2.prudential.co.kr" },
    { name: "처브라이프", url: "https://esmart.chubblife.co.kr/index.do" },
    { name: "하나생명", url: "https://ga.hanalife.co.kr" },
  ],
  nonLife: [
    { name: "메리츠화재", url: "http://sales.meritzfire.com" },
    { name: "한화손해보험", url: "http://portal.hwgeneralins.com" },
    { name: "롯데손해보험", url: "http://lottero.lotteins.co.kr" },
    { name: "MG손해보험", url: "https://mganet.mggeneralins.com" },
    { name: "흥국화재", url: "http://upride.heungkukfire.co.kr" },
    { name: "삼성화재", url: "https://erp.samsungfire.com/irj/servlet/prt/portal/prtroot/logon.LogonPage" },
    { name: "현대해상", url: "https://sp.hi.co.kr" },
    { name: "KB손해보험", url: "http://sales.kbinsure.co.kr" },
    { name: "DB손해보험", url: "https://www.mdbins.com" },
    { name: "AIG손해보험", url: "https://aigen-ga.aig.co.kr" },
    { name: "라이나손해(처브)", url: "https://ga.linagi.com/" },
    { name: "NH농협손보", url: "https://www.nhfire.co.kr/fc/fd.nhfire" },
    { name: "하나손해보험", url: "https://sfa.saleshana.com" },
  ]
};

interface CustomerRequest {
  id: string;
  phone: string;
  name: string;
  status: "pending" | "processing" | "authenticated" | "analyzed";
  insuranceCount?: number;
  analysis?: AnalysisResult;
  isPaid: boolean;
  timestamp: number;
  plannerName: string;
}

// --- App Component ---
const App: React.FC = () => {
  const [role, setRole] = useState<Role>("planner");
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const handleShowPrivacy = () => setShowPrivacy(true);
    window.addEventListener('showPrivacy', handleShowPrivacy);
    return () => window.removeEventListener('showPrivacy', handleShowPrivacy);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestId = params.get("requestId");
    if (requestId) {
      setRole("customer");
    } else {
      setRole("planner");
    }
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem("insuranceRequests");
      if (saved) setRequests(JSON.parse(saved));
    };
    window.addEventListener("storage", handleStorage);
    handleStorage();
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const saveRequests = (newRequests: CustomerRequest[]) => {
    setRequests(newRequests);
    localStorage.setItem("insuranceRequests", JSON.stringify(newRequests));
    window.dispatchEvent(new Event("storage"));
  };

  const addRequest = (phone: string, name: string) => {
    const newReq: CustomerRequest = {
      id: Math.random().toString(36).substr(2, 9),
      phone,
      name: name || "고객",
      status: "pending",
      isPaid: false,
      timestamp: Date.now(),
      plannerName: "김설계 위원",
    };
    saveRequests([newReq, ...requests]);
    showToast("신규 분석 요청이 전송되었습니다.");

    const message = `🔔 *신규 보장분석 요청*\n\n👤 고객명: ${newReq.name}\n📱 연락처: ${phone}\n🔗 [분석 링크](${window.location.origin}${window.location.pathname}?requestId=${newReq.id})`;
    sendTelegramMessage(message);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="app">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="toast glass">
            <CheckCircle2 size={16} color="var(--primary)" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPrivacy && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ position: 'fixed', inset: 0, zIndex: 3000 }}
          >
            <PrivacyPolicyPage onBack={() => setShowPrivacy(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {role === "planner" ? (
          <PlannerWorkspace 
            requests={requests} 
            onAdd={addRequest} 
            showToast={showToast}
            onSwitchToCustomer={() => setRole("customer")}
          />
        ) : (
          <CustomerWorkspaceWrapper 
            requests={requests}
            onResult={(id: string, policies: PolicyData[]) => {
              const analysis = analyzeCoverage(policies);
              const updated = requests.map(r => r.id === id ? { ...r, status: "analyzed" as const, insuranceCount: policies.length, analysis } : r);
              saveRequests(updated);

              const customer = requests.find(r => r.id === id);
              if (customer) {
                const message = `✅ *보장분석 완료*\n\n👤 고객명: ${customer.name}\n📊 점수: ${analysis.score}점\n📄 보험 개수: ${policies.length}건`;
                sendTelegramMessage(message);
              }
            }}
            onUnlock={(id: string) => {
              const updated = requests.map(r => r.id === id ? { ...r, isPaid: true } : r);
              saveRequests(updated);
              showToast("리포트가 잠금 해제되었습니다.");
            }}
            onSwitchToPlanner={() => setRole("planner")}
          />
        )}
      </main>

      <style>{`
        .toast { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: 40px; display: flex; align-items: center; gap: 10px; z-index: 1000; font-weight: 600; font-size: 14px; border: 1px solid var(--primary); }
      `}</style>
    </div>
  );
};

// --- Landing Page ---

const GenesisLanding: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="landing-view">
    <div className="landing-content">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
        <ShieldCheck size={80} color="var(--primary)" style={{ marginBottom: '24px', filter: 'drop-shadow(0 0 20px var(--primary-glow))' }} />
        <h1 className="text-gradient" style={{ fontSize: '64px', marginBottom: '16px' }}>Genesis CRM</h1>
        <p style={{ fontSize: '20px', color: 'var(--text-muted)', marginBottom: '48px', lineHeight: '1.6' }}>
          상위 1% 보험 설계사를 위한<br />AI 기반 스마트 영업 지원 솔루션
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '18px' }} onClick={onStart}>
            무료로 시작하기 <ArrowRight size={20} />
          </button>
          <button className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '18px' }}>
            서비스 소개
          </button>
        </div>
      </motion.div>
    </div>

    <footer className="landing-footer glass">
      <div className="footer-links">
        <button onClick={() => (window as any).showPrivacyPage()}>개인정보처리방침</button>
        <button>이용약관</button>
        <button>문의하기</button>
      </div>
      <p className="copyright">&copy; 2026 Genesis CRM. All rights reserved.</p>
    </footer>
    
    <style>{`
      .landing-view { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: radial-gradient(circle at center, #1E293B 0%, #0F172A 100%); position: relative; }
      .landing-content { flex: 1; display: flex; align-items: center; justify-content: center; }
      .landing-footer { width: 100%; padding: 24px 40px; display: flex; justify-content: space-between; align-items: center; border-radius: 0; border-left: none; border-right: none; border-bottom: none; }
      .footer-links { display: flex; gap: 24px; }
      .footer-links button { background: none; border: none; color: var(--text-muted); font-size: 14px; cursor: pointer; transition: var(--transition-smooth); }
      .footer-links button:hover { color: white; }
      .copyright { font-size: 13px; color: var(--text-dim); }
      @media (max-width: 768px) {
        .landing-footer { flex-direction: column; gap: 16px; padding: 32px 20px; }
        .footer-links { gap: 16px; }
      }
    `}</style>
  </div>
);

const CustomerWorkspaceWrapper: React.FC<any> = (props) => {
  const params = new URLSearchParams(window.location.search);
  const requestId = params.get("requestId");

  // Expose showPrivacy to landing page via global (simple for this SPA)
  (window as any).showPrivacyPage = () => {
    const event = new CustomEvent('showPrivacy');
    window.dispatchEvent(event);
  };

  if (!requestId) return <GenesisLanding onStart={props.onSwitchToPlanner} />;
  return <CustomerWorkspace {...props} />;
};

// --- [PLANNER] Workspace ---

const PlannerWorkspace: React.FC<any> = ({ requests, onAdd, showToast, onSwitchToCustomer }) => {
  const [activeTab, setActiveTab] = useState<PlannerViewType>("Dashboard");

  return (
    <div className="planner-layout">
      <aside className="sidebar glass">
        <div className="sidebar-logo">
          <ShieldCheck size={32} color="var(--primary)" />
          <span className="text-gradient">Genesis</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className={activeTab === "Dashboard" ? "active" : ""} onClick={() => setActiveTab("Dashboard")}>
            <LayoutDashboard size={20} /> <span>대시보드</span>
          </button>
          <button className={activeTab === "Schedule" ? "active" : ""} onClick={() => setActiveTab("Schedule")}>
            <Calendar size={20} /> <span>일정 관리</span>
          </button>
          <button className={activeTab === "Analysis" ? "active" : ""} onClick={() => setActiveTab("Analysis")}>
            <BarChart3 size={20} /> <span>보장분석</span>
          </button>
          <button className={activeTab === "Portals" ? "active" : ""} onClick={() => setActiveTab("Portals")}>
            <Globe size={20} /> <span>포탈 허브</span>
          </button>
          <button className={activeTab === "Membership" ? "active" : ""} onClick={() => setActiveTab("Membership")}>
            <Crown size={20} /> <span>멤버십</span>
          </button>
          <button className={activeTab === "Developers" ? "active" : ""} onClick={() => setActiveTab("Developers")}>
            <Code size={20} /> <span>개발자 API</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="customer-switch glass" onClick={onSwitchToCustomer}>
             <User size={18} /> 고객 모드 전환
          </button>
          <div className="user-info">
            <div className="avatar">김</div>
            <div>
              <p className="name">김설계 위원</p>
              <p className="plan">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      <section className="planner-main">
        <header className="main-header">
           <div className="header-title">
             <h1>{activeTab}</h1>
             <p>{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
           </div>
           <div className="header-actions">
              <button className="icon-btn glass"><Bell size={20} /></button>
              <button className="icon-btn glass"><Settings size={20} /></button>
           </div>
        </header>

        <div className="main-content">
          <AnimatePresence mode="wait">
            {activeTab === "Dashboard" && <PlannerDashboard key="dash" requests={requests} />}
            {activeTab === "Schedule" && <ScheduleTab key="schedule" />}
            {activeTab === "Analysis" && <AnalysisTab key="analysis" requests={requests} onAdd={onAdd} showToast={showToast} />}
            {activeTab === "Portals" && <PortalHub key="portals" showToast={showToast} />}
            {activeTab === "Membership" && <MembershipTab key="member" />}
            {activeTab === "Developers" && <DeveloperTab key="dev" />}
          </AnimatePresence>
        </div>
      </section>

      <style>{`
        .planner-layout { display: flex; height: 100vh; background: var(--bg-space); }
        .sidebar { width: 280px; display: flex; flex-direction: column; padding: 32px 16px; border-radius: 0; border-left: none; }
        .sidebar-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 48px; padding: 0 12px; font-size: 24px; font-weight: 800; }
        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .sidebar-nav button { background: none; border: none; display: flex; align-items: center; gap: 16px; padding: 14px 16px; border-radius: var(--radius-md); color: var(--text-muted); cursor: pointer; transition: var(--transition-smooth); font-size: 15px; font-weight: 500; }
        .sidebar-nav button:hover { background: rgba(255,255,255,0.05); color: white; }
        .sidebar-nav button.active { background: var(--primary); color: white; box-shadow: 0 4px 12px var(--primary-glow); }
        .sidebar-footer { margin-top: auto; display: flex; flex-direction: column; gap: 20px; }
        .customer-switch { border-radius: var(--radius-md); padding: 12px; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; color: white; }
        .user-info { display: flex; align-items: center; gap: 12px; padding: 0 8px; }
        .avatar { width: 40px; height: 40px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .user-info .name { font-size: 14px; font-weight: 700; }
        .user-info .plan { font-size: 12px; color: var(--text-muted); }

        .planner-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .main-header { padding: 40px 60px; display: flex; align-items: center; justify-content: space-between; }
        .header-title h1 { font-size: 32px; margin-bottom: 4px; }
        .header-title p { color: var(--text-muted); font-size: 14px; }
        .header-actions { display: flex; gap: 12px; }
        .icon-btn { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-muted); }
        .main-content { flex: 1; overflow-y: auto; padding: 0 60px 60px; }
      `}</style>
    </div>
  );
};

// --- Sub Views ---

const PlannerDashboard: React.FC<{ requests: CustomerRequest[] }> = ({ requests }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-view">
    <div className="stats-row">
       <div className="card glass">
          <p className="label">이번 달 분석</p>
          <h3>{requests.length}건</h3>
          <span className="trend positive">+12.5%</span>
       </div>
       <div className="card glass">
          <p className="label">리포트 전환율</p>
          <h3>84%</h3>
          <span className="trend positive">Excellent</span>
       </div>
       <div className="card glass highlight">
          <p className="label">예상 수익</p>
          <h3>{(requests.filter(r => r.isPaid).length * 4900).toLocaleString()}원</h3>
          <span className="trend">Beta Phase</span>
       </div>
    </div>
    
    <div className="main-grid">
       <div className="card glass activity">
          <h4>실시간 활동</h4>
          <div className="activity-list">
             {requests.slice(0, 4).map(r => (
               <div key={r.id} className="activity-item">
                  <div className={`status-dot ${r.status}`}></div>
                  <div className="text">
                    <strong>{r.name}</strong> 고객 {r.status === 'analyzed' ? '분석 완료' : '링크 확인 중'}
                    <span>{new Date(r.timestamp).toLocaleTimeString()}</span>
                  </div>
               </div>
             ))}
          </div>
       </div>
       <div className="card glass chart">
          <h4>주간 추이</h4>
          <div className="placeholder-chart"><PieChart size={40} /></div>
       </div>
    </div>

    <style>{`
      .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 32px; }
      .card.highlight { background: linear-gradient(135deg, var(--primary), var(--secondary)); border: none; }
      .label { font-size: 13px; color: var(--text-muted); margin-bottom: 8px; font-weight: 600; text-transform: uppercase; }
      .highlight .label { color: rgba(255,255,255,0.7); }
      h3 { font-size: 32px; font-weight: 800; margin-bottom: 4px; }
      .trend { font-size: 12px; font-weight: 700; color: #10B981; }
      .main-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; }
      .activity-list { margin-top: 24px; display: flex; flex-direction: column; gap: 20px; }
      .activity-item { display: flex; gap: 16px; align-items: center; }
      .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #94A3B8; }
      .status-dot.analyzed { background: #10B981; box-shadow: 0 0 10px #10B981; }
      .activity-item .text { font-size: 14px; }
      .activity-item .text span { display: block; font-size: 12px; color: var(--text-muted); }
      .placeholder-chart { height: 160px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
    `}</style>
  </motion.div>
);

const AnalysisTab: React.FC<any> = ({ requests, onAdd, showToast }) => {
  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="analysis-grid">
      <div className="form-column">
         <div className="card glass">
            <h4>신규 분석 요청</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>고객 정보를 입력하여 카카오톡으로 링크를 발송합니다.</p>
            <form onSubmit={e => { e.preventDefault(); onAdd(newPhone, newName); setNewPhone(""); setNewName(""); }}>
               <div className="form-group">
                 <label className="form-label">고객명</label>
                 <input className="form-input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="홍길동" />
               </div>
               <div className="form-group">
                 <label className="form-label">휴대폰 번호</label>
                 <input className="form-input" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="010-0000-0000" />
               </div>
               <button className="btn btn-primary" style={{ width: '100%' }}><Send size={18} /> 분석 요청 링크 생성</button>
            </form>
         </div>
      </div>
      <div className="list-column">
         <div className="section-header">
           <h4>최근 분석 리스트</h4>
           <div className="badge">{requests.length}</div>
         </div>
         <div className="requests-stack">
            {requests.map((r: any) => (
              <div key={r.id} className="card glass request-item">
                 <div className="info">
                    <p className="name">{r.name}</p>
                    <p className="phone">{r.phone}</p>
                 </div>
                 <div className="status">
                    <span className={`status-pill ${r.status}`}>{r.status === 'analyzed' ? '분석완료' : '진행중'}</span>
                 </div>
                 <div className="actions">
                    <button className="icon-btn glass" onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?requestId=${r.id}`);
                      showToast("분석 링크가 복사되었습니다.");
                    }}><Copy size={18} /></button>
                 </div>
              </div>
            ))}
         </div>
      </div>
      <style>{`
        .analysis-grid { display: grid; grid-template-columns: 360px 1fr; gap: 32px; }
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .badge { background: var(--primary); color: white; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .requests-stack { display: flex; flex-direction: column; gap: 12px; }
        .request-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; }
        .request-item .name { font-weight: 700; font-size: 16px; }
        .request-item .phone { font-size: 13px; color: var(--text-muted); }
        .status-pill { font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; background: rgba(255,255,255,0.05); color: var(--text-muted); }
        .status-pill.analyzed { background: rgba(16, 185, 129, 0.1); color: #10B981; }
      `}</style>
    </motion.div>
  );
};

const MembershipTab: React.FC = () => (
  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="pricing-container">
    <div className="pricing-grid">
       <div className="card glass pricing-card">
          <p className="p-type">Starter</p>
          <h2 className="p-price">0원<span>/월</span></h2>
          <ul className="p-list">
             <li><Check size={16} /> 월 분석 요청 10건</li>
             <li><Check size={16} /> 기본 보장 분석</li>
          </ul>
          <button className="btn btn-outline" style={{ width: '100%' }}>사용 중</button>
       </div>
       <div className="card glass pricing-card featured">
          <div className="featured-tag">BEST CHOICE</div>
          <p className="p-type">Professional</p>
          <h2 className="p-price">29,900원<span>/월</span></h2>
          <ul className="p-list">
             <li><Check size={16} /> 분석 요청 무제한</li>
             <li><Check size={16} /> AI 리모델링 제안</li>
             <li><Check size={16} /> 고객 읽음 실시간 알림</li>
          </ul>
          <button className="btn btn-primary" style={{ width: '100%' }}>업그레이드</button>
       </div>
    </div>
    <style>{`
      .pricing-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; max-width: 800px; margin: 40px auto; }
      .pricing-card { padding: 48px 32px; text-align: center; position: relative; }
      .pricing-card.featured { border: 2px solid var(--primary); box-shadow: 0 0 30px var(--primary-glow); }
      .featured-tag { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--primary); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; }
      .p-type { color: var(--text-muted); font-weight: 700; margin-bottom: 16px; }
      .p-price { font-size: 40px; margin-bottom: 32px; }
      .p-price span { font-size: 16px; color: var(--text-muted); }
      .p-list { list-style: none; margin-bottom: 40px; text-align: left; display: flex; flex-direction: column; gap: 16px; }
      .p-list li { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--text-muted); }
      .p-list li svg { color: var(--primary); }
    `}</style>
  </motion.div>
);

const PortalHub: React.FC<any> = ({ showToast }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [portalIds, setPortalIds] = useState<Record<string, string>>({});
  const [portalPws, setPortalPws] = useState<Record<string, string>>({});
  const [showPws, setShowPws] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedFavs = localStorage.getItem('portal_favorites');
    const savedIds = localStorage.getItem('portal_ids');
    const savedPws = localStorage.getItem('portal_pws');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    if (savedIds) setPortalIds(JSON.parse(savedIds));
    if (savedPws) setPortalPws(JSON.parse(savedPws));
  }, []);

  const toggleFavorite = (e: React.MouseEvent, portalName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavorites = favorites.includes(portalName)
      ? favorites.filter(f => f !== portalName)
      : [...favorites, portalName];
    setFavorites(newFavorites);
    localStorage.setItem('portal_favorites', JSON.stringify(newFavorites));
  };

  const handleIdChange = (portalName: string, id: string) => {
    const newIds = { ...portalIds, [portalName]: id };
    setPortalIds(newIds);
    localStorage.setItem('portal_ids', JSON.stringify(newIds));
  };

  const handlePwChange = (portalName: string, pw: string) => {
    const newPws = { ...portalPws, [portalName]: pw };
    setPortalPws(newPws);
    localStorage.setItem('portal_pws', JSON.stringify(newPws));
  };

  const toggleShowPw = (portalName: string) => {
    setShowPws(prev => ({ ...prev, [portalName]: !prev[portalName] }));
  };

  const copyToClipboard = (e: React.MouseEvent, text: string, label: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast(`${label}가 복사되었습니다! 로그인 창에 붙여넣기(Ctrl+V) 하세요.`);
  };

  const openAll = (mode: 'all' | 'favorites') => {
    const list = mode === 'all' 
      ? [...INSURANCE_PORTALS.life, ...INSURANCE_PORTALS.nonLife]
      : [...INSURANCE_PORTALS.life, ...INSURANCE_PORTALS.nonLife].filter(p => favorites.includes(p.name));
    
    if (list.length === 0) {
      showToast("열 대상이 없습니다. 즐겨찾기를 등록해 주세요.");
      return;
    }

    const confirm = window.confirm(`${mode === 'all' ? '전체' : '즐겨찾기'} ${list.length}개의 포탈을 엽니다. 브라우저 팝업 허용이 필요합니다. 계속하시겠습니까?`);
    if (confirm) {
      list.forEach((portal, index) => {
        setTimeout(() => window.open(portal.url, '_blank'), index * 250);
      });
      showToast(`${list.length}개의 포탈 사이트를 열고 있습니다.`);
    }
  };

  const PortalCard = ({ portal, isNonLife }: { portal: any, isNonLife?: boolean }) => {
    const isFav = favorites.includes(portal.name);
    const savedId = portalIds[portal.name] || '';
    const savedPw = portalPws[portal.name] || '';
    const isShowingPw = showPws[portal.name] || false;

    return (
      <div className={`portal-card card glass ${isFav ? 'favorite' : ''}`}>
        <button onClick={(e) => toggleFavorite(e, portal.name)} className="favorite-btn">
          <Star size={16} fill={isFav ? "var(--accent)" : "none"} color={isFav ? "var(--accent)" : "var(--text-muted)"} />
        </button>

        <div className="portal-info">
          <span className="portal-name">{portal.name}</span>
          <a href={portal.url} target="_blank" rel="noopener noreferrer" className="portal-link">
            포탈 바로가기 <ExternalLink size={12} />
          </a>
        </div>

        <div className="credentials-inputs">
          <div className="input-wrapper">
            <User size={14} className="input-icon" />
            <input 
              type="text" 
              placeholder="아이디(ID)" 
              value={savedId} 
              onChange={(e) => handleIdChange(portal.name, e.target.value)} 
              className="portal-input"
            />
            {savedId && (
              <button onClick={(e) => copyToClipboard(e, savedId, '아이디')} className="copy-btn" title="아이디 복사">
                <Copy size={14} />
              </button>
            )}
          </div>
          
          <div className="input-wrapper">
            <Lock size={14} className="input-icon" />
            <input 
              type={isShowingPw ? "text" : "password"} 
              placeholder="비밀번호(PW)" 
              value={savedPw} 
              onChange={(e) => handlePwChange(portal.name, e.target.value)} 
              className="portal-input"
            />
            <div className="input-actions">
              <button onClick={() => toggleShowPw(portal.name)} className="view-btn" title="비밀번호 표시/숨김">
                {isShowingPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              {savedPw && (
                <button onClick={(e) => copyToClipboard(e, savedPw, '비밀번호')} className="copy-btn" title="비밀번호 복사">
                  <Copy size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="portal-hub">
      <div className="hub-header card glass">
        <div className="info">
          <h3>보험사 포탈 매니저</h3>
          <p>보험사별 계정 정보를 안전하게 관리하고 편리하게 로그인하세요.</p>
        </div>
        <div className="hub-actions">
          <button className={`btn ${favorites.length > 0 ? 'btn-primary' : 'btn-outline'}`} onClick={() => openAll('favorites')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={16} fill={favorites.length > 0 ? "white" : "none"} /> 즐겨찾기 열기 ({favorites.length})
          </button>
          <button className="btn btn-outline" onClick={() => openAll('all')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ExternalLink size={16} /> 전체 포탈 열기
          </button>
        </div>
      </div>

      <div className="warning-box glass">
        <AlertCircle size={18} />
        <span>입력하신 계정 정보는 외부 서버로 전송되지 않고 <strong>본인의 브라우저(로컬 스토리지)에만 안전하게 저장</strong>됩니다.</span>
      </div>

      <div className="portal-grid">
        <div className="portal-section">
          <div className="section-title">
            <div className="dot life"></div>
            <h4>생명보험사 ({INSURANCE_PORTALS.life.length})</h4>
          </div>
          <div className="grid">
            {INSURANCE_PORTALS.life.map(p => (
              <PortalCard key={p.name} portal={p} />
            ))}
          </div>
        </div>

        <div className="portal-section">
          <div className="section-title">
            <div className="dot nonlife"></div>
            <h4>손해보험사 ({INSURANCE_PORTALS.nonLife.length})</h4>
          </div>
          <div className="grid">
            {INSURANCE_PORTALS.nonLife.map(p => (
              <PortalCard key={p.name} portal={p} isNonLife />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .portal-hub { display: flex; flex-direction: column; gap: 24px; }
        .hub-header { display: flex; justify-content: space-between; align-items: center; padding: 32px 40px; }
        .hub-header h3 { font-size: 24px; margin-bottom: 4px; }
        .hub-header p { color: var(--text-muted); font-size: 14px; }
        .hub-actions { display: flex; gap: 12px; }
        
        .warning-box { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 12px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); color: #60A5FA; font-size: 13px; }
        
        .portal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        .portal-section { display: flex; flex-direction: column; gap: 20px; }
        .section-title { display: flex; align-items: center; gap: 10px; }
        .section-title .dot { width: 8px; height: 8px; border-radius: 50%; }
        .section-title .dot.life { background: #3B82F6; box-shadow: 0 0 8px #3B82F6; }
        .section-title .dot.nonlife { background: #EC4899; box-shadow: 0 0 8px #EC4899; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        
        .portal-card { 
          position: relative;
          display: flex; 
          flex-direction: column;
          gap: 16px; 
          padding: 24px 20px 20px; 
          border-radius: 20px; 
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.02);
          transition: var(--transition-smooth); 
        }
        .portal-card:hover { 
          transform: translateY(-2px); 
          background: rgba(255, 255, 255, 0.05); 
          border-color: var(--border-bright); 
        }
        .portal-card.favorite {
          border-color: var(--accent);
          background: rgba(245, 158, 11, 0.03);
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.08);
        }
        
        .favorite-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }
        .favorite-btn:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .portal-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .portal-name { 
          font-size: 15px; 
          font-weight: 700; 
          color: var(--text-main);
        }
        .portal-link { 
          font-size: 12px; 
          color: var(--text-muted); 
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
          transition: var(--transition-smooth);
        }
        .portal-link:hover { 
          color: var(--primary); 
        }
        
        .credentials-inputs {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 0 10px;
          transition: var(--transition-smooth);
        }
        .input-wrapper:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-glow);
        }
        
        .input-icon {
          color: var(--text-dim);
          flex-shrink: 0;
        }
        
        .portal-input {
          width: 100%;
          background: transparent;
          border: none;
          color: var(--text-main);
          font-size: 12px;
          padding: 10px 8px;
          font-weight: 600;
        }
        .portal-input:focus {
          outline: none;
        }
        .portal-input::placeholder {
          color: var(--text-dim);
          font-weight: 500;
        }
        
        .input-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .copy-btn, .view-btn {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
          transition: var(--transition-smooth);
        }
        .copy-btn:hover, .view-btn:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.05);
        }

        @media (max-width: 1200px) {
          .portal-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .hub-header { flex-direction: column; align-items: flex-start; gap: 16px; padding: 24px; }
          .hub-actions { width: 100%; }
          .hub-actions button { flex: 1; }
        }
      `}</style>
    </motion.div>
  );
};

// --- [CUSTOMER] Workspace ---

const CustomerWorkspace: React.FC<any> = ({ requests, onResult, onUnlock, onSwitchToPlanner }) => {
  const [currentReq, setCurrentReq] = useState<CustomerRequest | null>(null);
  const [step, setStep] = useState<"Choice" | "Processing" | "Done">("Choice");
  const [consents, setConsents] = useState({ collection: false, thirdParty: false });
  const [modal, setModal] = useState<{ isOpen: boolean, title: string, content: string }>({ isOpen: false, title: "", content: "" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestId = params.get("requestId");
    const found = requests.find((r: any) => r.id === requestId);
    if (found) setCurrentReq(found);
    else if (requests.length > 0) setCurrentReq(requests[0]);
  }, [requests]);

  const handleAnalaysis = () => {
    setStep("Processing");
    setTimeout(() => {
      const mockResult: PolicyData[] = [{
        productName: "현대해상 퍼펙트보장",
        companyName: "현대해상",
        premium: 85000,
        coverageList: [{ name: "암진단비", amount: 20000000 }]
      }];
      if (currentReq) onResult(currentReq.id, mockResult);
      setStep("Done");
    }, 2500);
  };

  if (!currentReq) return <div className="customer-app glass"><p>요청을 찾을 수 없습니다.</p></div>;

  return (
    <div className="customer-view-mobile">
      <header className="c-header glass">
         <ShieldCheck size={28} color="var(--primary)" />
         <div className="branding">
            <p className="planner">{currentReq.plannerName}</p>
            <p className="tag">Certified Advisor</p>
         </div>
      </header>
      
      <main className="c-main">
        {step === "Choice" ? (
          <div className="content-card card glass">
             <h3>{currentReq.name}님을 위한<br />맞춤 보장 분석을 시작합니다.</h3>
             <p className="desc">정확한 분석을 위해 약관 동의가 필요합니다.</p>
             
             <div className="consents glass">
                <div className="consent-row">
                   <label><input type="checkbox" checked={consents.collection} onChange={e => setConsents({...consents, collection: e.target.checked})} /> <span>개인정보 수집 동의 (필수)</span></label>
                   <button onClick={() => setModal({ isOpen: true, title: "약관", content: TERMS_TEXTS.collection })}>보기</button>
                </div>
                <div className="consent-row">
                   <label><input type="checkbox" checked={consents.thirdParty} onChange={e => setConsents({...consents, thirdParty: e.target.checked})} /> <span>제3자 제공 동의 (필수)</span></label>
                   <button onClick={() => setModal({ isOpen: true, title: "약관", content: TERMS_TEXTS.thirdParty })}>보기</button>
                </div>
             </div>

             <button className="btn btn-primary" style={{ width: '100%', marginTop: '32px' }} disabled={!consents.collection || !consents.thirdParty} onClick={handleAnalaysis}>
                분석 시작하기
             </button>
          </div>
        ) : step === "Processing" ? (
          <div className="loading-card card glass">
             <div className="ai-scanner"></div>
             <h3>AI 정밀 분석 중</h3>
             <p>고객님의 보장 데이터를 확인하고 있습니다.</p>
          </div>
        ) : (
          <div className="result-card card glass">
             <div className="score-circle">
                <p>보장 점수</p>
                <h2>{currentReq.analysis?.score}</h2>
             </div>
             <div className={`lock-section ${!currentReq.isPaid ? 'locked' : ''}`}>
                {!currentReq.isPaid && (
                  <div className="lock-ui">
                     <Lock size={32} />
                     <p>상세 리포트 잠금 해제</p>
                     <button className="btn btn-primary" onClick={() => onUnlock(currentReq.id)}>무료로 보기</button>
                  </div>
                )}
                <div className="preview">
                   {currentReq.analysis?.tags.map((t: string) => <span key={t} className="tag glass">{t}</span>)}
                </div>
             </div>
          </div>
        )}
        <p className="disclaimer">{LEGAL_DISCLAIMER}</p>
      </main>

      <PrivacyPolicyModal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} title={modal.title} content={modal.content} />

      <style>{`
        .customer-view-mobile { background: #F8FAFC; min-height: 100vh; max-width: 480px; margin: 0 auto; color: #1E293B; display: flex; flex-direction: column; }
        .c-header { height: 80px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; background: white; border-radius: 0; }
        .branding .planner { font-weight: 800; font-size: 16px; }
        .branding .tag { font-size: 11px; font-weight: 700; color: var(--primary); }
        .c-main { flex: 1; padding: 32px 24px; }
        .desc { font-size: 14px; color: #64748B; margin: 12px 0 32px; }
        .consents { padding: 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 16px; background: #F1F5F9; border: none; }
        .consent-row { display: flex; align-items: center; justify-content: space-between; font-size: 14px; }
        .consent-row label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .consent-row button { background: none; border: none; color: #94A3B8; text-decoration: underline; font-size: 12px; }
        .loading-card { text-align: center; padding: 60px 24px; }
        .ai-scanner { width: 60px; height: 60px; border: 4px solid var(--primary); border-top-color: transparent; border-radius: 50%; margin: 0 auto 24px; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .score-circle { width: 160px; height: 160px; border-radius: 50%; background: white; border: 12px solid var(--primary); margin: 0 auto 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 30px var(--primary-glow); }
        .score-circle h2 { font-size: 48px; color: var(--primary); }
        .score-circle p { font-size: 14px; font-weight: 700; color: #64748B; }
        .lock-section { position: relative; }
        .lock-section.locked .preview { filter: blur(10px); opacity: 0.3; }
        .lock-ui { position: absolute; inset: 0; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
        .disclaimer { font-size: 11px; color: #94A3B8; margin-top: 40px; text-align: justify; line-height: 1.6; }
      `}</style>
    </div>
  );
};

const DeveloperTab: React.FC = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dev-tab">
    <div className="card glass">
      <h4>Developer API</h4>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>API 연동 및 외부 시스템 통합 설정을 관리합니다.</p>
      <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
        <p style={{ fontSize: '12px', fontFamily: 'monospace' }}>API_KEY: gns_live_********************</p>
      </div>
    </div>
  </motion.div>
);

// --- Schedule Management ---

const ScheduleTab: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  
  const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
  const WEEK_DATES = [20, 21, 22, 23, 24, 25, 26]; // Mock dates for April

  const WEEKLY_SCHEDULES = [
    { day: 1, time: "10:00", title: "삼성생명 교육", type: "meeting", isKey: true },
    { day: 1, time: "14:00", title: "이철수 고객 상담", type: "consult", isKey: false },
    { day: 2, time: "11:30", title: "현대해상 신상품 설명회", type: "education", isKey: true },
    { day: 3, time: "09:00", title: "주간 보상 청구 검토", type: "task", isKey: false },
    { day: 3, time: "16:00", title: "박지민 고객 보장 분석", type: "analysis", isKey: true },
    { day: 4, time: "13:00", title: "팀 미팅 (월말 실적)", type: "meeting", isKey: false },
    { day: 5, time: "10:00", title: "신규 분석 요청 확인", type: "task", isKey: false },
  ];

  const currentSchedules = WEEKLY_SCHEDULES.filter(s => s.day === selectedDay);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="schedule-view">
      <div className="schedule-header card glass">
        <div className="week-selector">
          {DAYS.map((day, i) => (
            <button 
              key={day} 
              className={`day-btn ${selectedDay === i ? 'active' : ''}`}
              onClick={() => setSelectedDay(i)}
            >
              <span className="day-name">{day}</span>
              <span className="day-date">{WEEK_DATES[i]}</span>
              {WEEKLY_SCHEDULES.some(s => s.day === i) && <div className="dot"></div>}
            </button>
          ))}
        </div>
      </div>

      <div className="schedule-content">
        <div className="main-col">
          <div className="section-header">
            <h4>{DAYS[selectedDay]}요일 일정</h4>
            <button className="btn btn-primary btn-sm"><Plus size={16} /> 일정 추가</button>
          </div>
          
          <div className="schedule-list">
            {currentSchedules.length > 0 ? (
              currentSchedules.map((s, i) => (
                <div key={i} className={`schedule-card glass ${s.isKey ? 'key' : ''}`}>
                  <div className="time">
                    <Clock size={14} />
                    <span>{s.time}</span>
                  </div>
                  <div className="info">
                    <p className="title">{s.title}</p>
                    <p className="type">{s.type === 'meeting' ? '미팅' : s.type === 'consult' ? '상담' : '일반 업무'}</p>
                  </div>
                  {s.isKey && <Star size={18} className="key-icon" />}
                  <button className="icon-btn glass sm"><ChevronRight size={16} /></button>
                </div>
              ))
            ) : (
              <div className="empty-state glass">
                <Calendar size={48} />
                <p>등록된 일정이 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="key-schedules">
          <h4>주간 주요 일정</h4>
          <div className="key-list">
            {WEEKLY_SCHEDULES.filter(s => s.isKey).map((s, i) => (
              <div key={i} className="key-item glass">
                <div className="day-badge">{DAYS[s.day]}</div>
                <div className="details">
                  <p className="t">{s.title}</p>
                  <p className="d">{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <style>{`
        .schedule-view { display: flex; flex-direction: column; gap: 24px; }
        .week-selector { display: flex; justify-content: space-between; padding: 12px; }
        .day-btn { background: none; border: none; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border-radius: 16px; cursor: pointer; color: var(--text-muted); transition: all 0.3s ease; flex: 1; position: relative; }
        .day-btn:hover { background: rgba(255,255,255,0.05); color: white; }
        .day-btn.active { background: var(--primary); color: white; box-shadow: 0 8px 20px var(--primary-glow); }
        .day-name { font-size: 12px; font-weight: 700; opacity: 0.7; }
        .day-date { font-size: 20px; font-weight: 800; }
        .day-btn .dot { position: absolute; bottom: 8px; width: 4px; height: 4px; background: currentColor; border-radius: 50%; }
        
        .schedule-content { display: grid; grid-template-columns: 1fr 320px; gap: 32px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .schedule-list { display: flex; flex-direction: column; gap: 16px; }
        .schedule-card { display: flex; align-items: center; gap: 24px; padding: 20px 24px; }
        .schedule-card.key { border-left: 4px solid var(--primary); }
        .schedule-card .time { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: var(--primary); min-width: 80px; }
        .schedule-card .info { flex: 1; }
        .schedule-card .title { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
        .schedule-card .type { font-size: 12px; color: var(--text-muted); }
        .key-icon { color: #F59E0B; margin: 0 12px; filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.4)); }
        
        .key-schedules h4 { margin-bottom: 24px; }
        .key-list { display: flex; flex-direction: column; gap: 12px; }
        .key-item { display: flex; align-items: center; gap: 16px; padding: 16px; }
        .day-badge { width: 36px; height: 36px; border-radius: 10px; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; }
        .key-item .t { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
        .key-item .d { font-size: 12px; color: var(--text-muted); }
        
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; gap: 20px; color: var(--text-muted); opacity: 0.5; }
        .btn-sm { padding: 8px 16px; font-size: 13px; }
        .icon-btn.sm { width: 32px; height: 32px; }
      `}</style>
    </motion.div>
  );
};

// --- Mount ---
const rootElement = document.getElementById("root");
if (rootElement) createRoot(rootElement).render(<App />);
