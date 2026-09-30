export interface CarouselTab {
  id: string;
  tabLabel: string;
  tabTitle: string;
  badge: string;
  description: string;
  highlights: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  recommended?: boolean;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  ctaText: string;
  highlightCta?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  metric: string;
  avatarText: string;
  avatarBg: string;
}

export interface SimulatedInvoice {
  id: string;
  client: string;
  amount: number;
  currency: string;
  dueDate: string;
  daysOverdue: number;
  status: 'paid' | 'escalated' | 'reminded' | 'scheduled';
  channel: 'email' | 'whatsapp' | 'both';
  lastAction: string;
}
