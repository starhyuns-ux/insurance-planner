'use client'

import { 
  CalculatorIcon, 
  ChatBubbleLeftRightIcon, 
  PhoneIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function QuickLinks() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const links = [
    { id: 'premium-calc', label: '보험료 계산', icon: CalculatorIcon, color: 'bg-primary-50 text-primary-600 border-primary-100' },
    { id: 'silbi-calc', label: '실비 계산', icon: SparklesIcon, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { id: 'customer-center', label: '고객센터', icon: PhoneIcon, color: 'bg-blue-50 text-blue-600 border-blue-100' }
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-10">
      {links.map((link) => (
        <button
          key={link.id}
          onClick={() => scrollTo(link.id)}
          className={`${link.color} flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all hover:scale-105 active:scale-95 group`}
        >
          <link.icon className="w-6 h-6 mb-2 group-hover:animate-bounce" />
          <span className="text-xs font-black tracking-tighter whitespace-nowrap">{link.label}</span>
        </button>
      ))}
    </div>
  );
}
