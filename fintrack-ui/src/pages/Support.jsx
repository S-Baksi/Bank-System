import { useState } from 'react';
import { Phone, Mail, MessageCircle, ChevronDown, ChevronUp, Clock, MapPin, AlertTriangle, ShieldCheck, HelpCircle, FileText } from 'lucide-react';

const faqs = [
  {
    q: 'How do I transfer funds to another account?',
    a: 'Go to Transactions → click "Transfer Funds" → select your source account, destination account, enter the amount and description, then confirm. Transfers are processed instantly for internal accounts.',
  },
  {
    q: 'What are the transaction charges?',
    a: 'A flat fee of ₹0.50 applies to withdrawals and transfers. Deposits are free of charge. There are no monthly maintenance fees for Savings accounts.',
  },
  {
    q: 'How do I open a new bank account?',
    a: 'Navigate to My Accounts → click "Open Account" → choose the account type (Savings, Checking, Business, or Investment), provide an account name and initial deposit amount, then submit.',
  },
  {
    q: 'What should I do if I suspect unauthorized activity?',
    a: 'Immediately change your password and contact our 24/7 helpline at 1800-XXX-XXXX. You can also review all activity in the Audit Logs section. We recommend enabling Two-Factor Authentication for added security.',
  },
  {
    q: 'How do I download or print my account statement?',
    a: 'Go to Mini Statement from the sidebar → select your account → optionally filter by transaction type → click "Print Statement". A print-ready statement will open in a new window.',
  },
  {
    q: 'What is the daily transaction limit?',
    a: 'The default daily NEFT/RTGS limit is ₹10,00,000 for Savings accounts and ₹50,00,000 for Business accounts. Contact support to request a limit enhancement.',
  },
  {
    q: 'How long does it take for a deposit to reflect?',
    a: 'Deposits made through the portal reflect instantly in your account balance. For external transfers, processing time depends on the originating bank (typically 1–2 business days for NEFT).',
  },
  {
    q: 'How do I enable Two-Factor Authentication (2FA)?',
    a: 'Currently, 2FA settings are managed by your branch. Please visit your nearest FinTrack branch or call our helpline to enable or disable 2FA on your account.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--gray-100)' }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{q}</span>
        {open ? <ChevronUp size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> : <ChevronDown size={16} color="var(--gray-400)" style={{ flexShrink: 0 }} />}
      </button>
      {open && (
        <div style={{ padding: '0 22px 16px', fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.7, borderLeft: '3px solid var(--primary)', marginLeft: 22, marginBottom: 4 }}>
          {a}
        </div>
      )}
    </div>
  );
}

function ContactCard({ icon: Icon, title, value, sub, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 20px', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 10, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function Support() {
  return (
    <div>
      {/* Emergency Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: 'var(--danger-light)', border: '1px solid #f5c6c6', borderLeft: '4px solid var(--danger)', borderRadius: 10, marginBottom: 24 }}>
        <AlertTriangle size={18} color="var(--danger)" style={{ flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>Report Fraud / Block Card: </span>
          <span style={{ fontSize: 13, color: '#7b1c1c' }}>Call our 24/7 emergency helpline immediately at <strong>1800-XXX-XXXX</strong> (Toll Free)</span>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>
        {/* Contact Channels */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>Contact Us</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ContactCard icon={Phone} title="Customer Care (Toll Free)" value="1800-XXX-XXXX" sub="Available 24 hours, 7 days a week" color="var(--primary)" />
            <ContactCard icon={Mail} title="Email Support" value="support@fintrack.in" sub="Response within 24 business hours" color="var(--gold)" />
            <ContactCard icon={MessageCircle} title="Live Chat" value="Available on Portal" sub="Mon–Sat, 9:00 AM – 6:00 PM IST" color="var(--success)" />
            <ContactCard icon={MapPin} title="Branch Locator" value="Find Nearest Branch" sub="Over 500+ branches across India" color="var(--danger)" />
          </div>
        </div>

        {/* Business Hours + Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">Service Hours</div></div>
            <div className="card-body">
              {[
                { day: 'Internet Banking', hours: '24 × 7', ok: true },
                { day: 'Customer Care', hours: '24 × 7', ok: true },
                { day: 'Branch Services', hours: 'Mon–Fri: 10AM – 4PM', ok: true },
                { day: 'Branch (Saturday)', hours: '10AM – 2PM', ok: true },
                { day: 'Branch (Sunday & Holidays)', hours: 'Closed', ok: false },
              ].map(({ day, hours, ok }) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={13} color="var(--gray-400)" />
                    <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>{day}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: ok ? 'var(--success)' : 'var(--danger)' }}>{hours}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Quick Links</div></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: ShieldCheck, label: 'View Audit & Security Logs', href: '/audit' },
                { icon: FileText, label: 'Download Mini Statement', href: '/statement' },
                { icon: HelpCircle, label: 'Security Tips & Guidelines', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a key={label} href={href}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--gray-50)', border: '1px solid var(--gray-200)', textDecoration: 'none', color: 'var(--primary)', fontSize: 13, fontWeight: 500, transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--gray-50)'}>
                  <Icon size={15} />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Frequently Asked Questions</div>
            <div className="card-subtitle">Click on a question to expand the answer</div>
          </div>
        </div>
        {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
      </div>

      {/* Grievance */}
      <div style={{ marginTop: 20, padding: '18px 22px', background: 'var(--primary-light)', borderRadius: 10, border: '1px solid var(--gray-200)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>Grievance Redressal</div>
          <div style={{ fontSize: 12, color: 'var(--gray-600)', lineHeight: 1.7 }}>
            If your complaint is not resolved within 30 days, you may escalate to the Banking Ombudsman appointed by RBI.
            Visit <strong>rbi.org.in</strong> for more information. Our Nodal Officer can be reached at <strong>nodal@fintrack.in</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}
