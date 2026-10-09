import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Headphones,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  UserRound,
  UsersRound,
  WalletCards,
  WashingMachine,
  X,
  type LucideIcon,
} from "lucide-react";

type Role = "customer" | "employee" | "admin";
type View = "home" | Role;
type BookingStatus = "Pending" | "Confirmed" | "In progress" | "Completed";

type Service = {
  name: string;
  price: number;
  unit: string;
  icon: LucideIcon;
  note?: string;
};

type Booking = {
  id: string;
  service: string;
  customer: string;
  provider: string;
  date: string;
  time: string;
  location: string;
  price: number;
  depositPaid: boolean;
  status: BookingStatus;
};

const heroImage = "/images/professional-cleaner.jpg";

const services: Service[] = [
  { name: "House cleaning", price: 1000, unit: "from", icon: Home },
  { name: "Office cleaning", price: 2000, unit: "from", icon: Building2 },
  { name: "Carpet cleaning", price: 400, unit: "per room", icon: Sparkles, note: "Free pickup" },
  { name: "Laundry care", price: 60, unit: "per kg", icon: WashingMachine, note: "Free pickup" },
  { name: "Mama Fua", price: 800, unit: "per basket", icon: ShoppingBasket, note: "Popular" },
  { name: "Errands", price: 400, unit: "from", icon: PackageCheck },
];

const initialBookings: Booking[] = [
  {
    id: "JH-2048",
    service: "House cleaning",
    customer: "Grace Wanjiku",
    provider: "Mercy A.",
    date: "24 Jun 2025",
    time: "9:00 AM",
    location: "Kilimani, Nairobi",
    price: 2400,
    depositPaid: true,
    status: "Confirmed",
  },
  {
    id: "JH-2047",
    service: "Office cleaning",
    customer: "Acacia Studio",
    provider: "David K.",
    date: "24 Jun 2025",
    time: "1:00 PM",
    location: "Westlands, Nairobi",
    price: 4500,
    depositPaid: true,
    status: "In progress",
  },
  {
    id: "JH-2046",
    service: "Laundry care",
    customer: "Brian Otieno",
    provider: "Unassigned",
    date: "25 Jun 2025",
    time: "10:00 AM",
    location: "Lavington, Nairobi",
    price: 1200,
    depositPaid: false,
    status: "Pending",
  },
  {
    id: "JH-2041",
    service: "Carpet cleaning",
    customer: "Grace Wanjiku",
    provider: "John M.",
    date: "18 Jun 2025",
    time: "11:00 AM",
    location: "Kilimani, Nairobi",
    price: 1800,
    depositPaid: true,
    status: "Completed",
  },
];

const money = (value: number) => `KSh ${value.toLocaleString()}`;

function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "gold" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      className={`button button-${variant} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function Logo({ compact = false, onClick }: { compact?: boolean; onClick?: () => void }) {
  return (
    <button className={`logo ${compact ? "logo-compact" : ""}`} onClick={onClick} aria-label="J Home and Office Care">
      <span className="logo-mark">
        <Home />
        <span>J</span>
      </span>
      {!compact && (
        <span className="logo-type">
          <b>J HOME &amp; OFFICE</b>
          <small>CARE</small>
        </span>
      )}
    </button>
  );
}

function Badge({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "gold" | "blue" | "gray" | "red" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const tone = status === "Completed" ? "green" : status === "In progress" ? "blue" : status === "Confirmed" ? "gold" : "gray";
  return <Badge tone={tone}>{status}</Badge>;
}

function Field({
  label,
  placeholder,
  type = "text",
  defaultValue,
  required,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} placeholder={placeholder} defaultValue={defaultValue} required={required} />
    </label>
  );
}

function Modal({ children, close, wide = false }: { children: ReactNode; close: () => void; wide?: boolean }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={close}>
      <div className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button modal-close" onClick={close} aria-label="Close dialog"><X /></button>
        {children}
      </div>
    </div>
  );
}

function AuthModal({ close, onLogin }: { close: () => void; onLogin: (role: Role) => void }) {
  const [role, setRole] = useState<Role>("customer");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onLogin(role);
  };

  return (
    <Modal close={close}>
      <div className="auth-head">
        <Logo />
        <span className="eyebrow">{mode === "login" ? "WELCOME BACK" : "JOIN OUR COMMUNITY"}</span>
        <h2>{mode === "login" ? "Log in to your account" : "Create your account"}</h2>
        <p>Manage bookings, payments and conversations in one secure place.</p>
      </div>
      <div className="role-picker">
        {(["customer", "employee", "admin"] as Role[]).map((item) => (
          <button className={role === item ? "active" : ""} key={item} onClick={() => setRole(item)}>
            {item === "customer" ? <UserRound /> : item === "employee" ? <BriefcaseBusiness /> : <ShieldCheck />}
            <span>{item}</span>
          </button>
        ))}
      </div>
      <form className="auth-form" onSubmit={submit}>
        {mode === "signup" && <Field label="Full name" placeholder="Your full name" required />}
        <Field label="Email address" type="email" placeholder="you@example.com" defaultValue={`${role}@jhome.co.ke`} required />
        <Field label="Password" type="password" placeholder="Enter your password" defaultValue="jhome2025" required />
        <div className="auth-options">
          <label><input type="checkbox" defaultChecked /> Remember me</label>
          <button type="button">Forgot password?</button>
        </div>
        <Button type="submit" className="full">
          {mode === "login" ? `Continue as ${role}` : "Create account"} <ArrowRight />
        </Button>
      </form>
      <p className="auth-switch">
        {mode === "login" ? "New to J Home?" : "Already have an account?"}
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Create account" : "Log in"}</button>
      </p>
      <div className="demo-note"><ShieldCheck /> Demo mode: choose any role and continue with the pre-filled credentials.</div>
    </Modal>
  );
}

function BookingModal({
  close,
  onComplete,
}: {
  close: () => void;
  onComplete: (booking: Booking) => void;
}) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(services[0]);
  const [paid, setPaid] = useState(false);
  const [success, setSuccess] = useState(false);
  const deposit = Math.ceil(service.price * 0.1);

  const finish = () => {
    if (!paid) {
      setPaid(true);
      return;
    }
    const booking: Booking = {
      id: `JH-${2050 + Math.floor(Math.random() * 99)}`,
      service: service.name,
      customer: "Grace Wanjiku",
      provider: "Matching in progress",
      date: "28 Jun 2025",
      time: "9:00 AM",
      location: "Kilimani, Nairobi",
      price: service.price,
      depositPaid: true,
      status: "Confirmed",
    };
    onComplete(booking);
    setSuccess(true);
  };

  if (success) {
    return (
      <Modal close={close}>
        <div className="success-panel">
          <span><CheckCircle2 /></span>
          <div className="eyebrow">BOOKING CONFIRMED</div>
          <h2>You’re all set.</h2>
          <p>Your deposit is confirmed. We’ll notify you as soon as your professional accepts the booking.</p>
          <div className="success-reference"><small>REFERENCE</small><b>JH-20{50 + step}</b></div>
          <Button onClick={close}>View my bookings <ArrowRight /></Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal close={close} wide>
      <div className="wizard-head">
        <div><span className="eyebrow">BOOK WITH CONFIDENCE</span><h2>{["Choose a service", "Schedule your visit", "Review your booking", "Secure your booking"][step - 1]}</h2></div>
        <span>Step {step} of 4</span>
      </div>
      <div className="wizard-progress">{[1, 2, 3, 4].map((item) => <span className={item <= step ? "active" : ""} key={item} />)}</div>
      {step === 1 && (
        <div className="choice-grid">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <button className={`service-choice ${service.name === item.name ? "selected" : ""}`} key={item.name} onClick={() => setService(item)}>
                <span><Icon /></span>
                <div><b>{item.name}</b><small>{money(item.price)} {item.unit}</small></div>
                {service.name === item.name && <CheckCircle2 />}
              </button>
            );
          })}
        </div>
      )}
      {step === 2 && (
        <div className="schedule-form">
          <Field label="Area or estate" placeholder="e.g. Kilimani, Nairobi" defaultValue="Kilimani, Nairobi" />
          <Field label="Preferred date" type="date" defaultValue="2025-06-28" />
          <label className="field"><span>Preferred time</span><select defaultValue="9:00 AM"><option>9:00 AM</option><option>11:00 AM</option><option>2:00 PM</option></select></label>
          <label className="field"><span>Property size</span><select><option>1 bedroom</option><option>2 bedrooms</option><option>3+ bedrooms</option></select></label>
          <label className="field full-field"><span>Anything we should know?</span><textarea placeholder="Parking, access details, special requests..." /></label>
        </div>
      )}
      {step === 3 && (
        <div className="booking-review">
          <div className="review-service"><span><service.icon /></span><div><small>SERVICE</small><h3>{service.name}</h3><p>One-time service</p></div></div>
          <div className="review-details">
            <div><MapPin /><span><small>LOCATION</small><b>Kilimani, Nairobi</b></span></div>
            <div><CalendarDays /><span><small>DATE &amp; TIME</small><b>28 Jun · 9:00 AM</b></span></div>
          </div>
          <div className="cost-lines">
            <p><span>Service estimate</span><b>{money(service.price)}</b></p>
            <p><span>Deposit due today</span><b>{money(deposit)}</b></p>
            <small>Final pricing may change after your provider reviews the details.</small>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="payment-step">
          <div className="mpesa-card">
            <div><span className="mpesa-logo">M-PESA</span><Badge tone="green">Secure</Badge></div>
            <p>Pay your 10% booking deposit via M-Pesa STK Push.</p>
            <Field label="M-Pesa phone number" placeholder="07XX XXX XXX" defaultValue="0712 345 678" />
            <div className="amount-due"><span>Amount due</span><b>{money(deposit)}</b></div>
          </div>
          <div className="payment-note"><ShieldCheck /><p><b>Your money is protected.</b><br />The remaining balance is only due after your service is completed.</p></div>
        </div>
      )}
      <div className="wizard-footer">
        <Button variant="ghost" onClick={() => step === 1 ? close() : setStep(step - 1)}><ArrowLeft /> {step === 1 ? "Cancel" : "Back"}</Button>
        <Button onClick={() => step < 4 ? setStep(step + 1) : finish()}>
          {step < 4 ? "Continue" : paid ? "Confirm booking" : "Send STK push"} <ArrowRight />
        </Button>
      </div>
    </Modal>
  );
}

function PublicSite({ onBook, onLogin }: { onBook: () => void; onLogin: () => void }) {
  const [menu, setMenu] = useState(false);
  return (
    <div className="public-shell">
      <header className="public-header">
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
        <nav className={menu ? "open" : ""}>
          <a href="#services">Services</a><a href="#how">How it works</a><a href="#trust">Why J Home</a><a href="#contact">Contact</a>
        </nav>
        <div className="header-actions"><Button variant="ghost" onClick={onLogin}>Log in</Button><Button onClick={onBook}>Book a service <ArrowRight /></Button></div>
        <button className="mobile-menu" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">{menu ? <X /> : <Menu />}</button>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <Badge tone="green"><Check /> Trusted care, right at your door</Badge>
            <h1>We clean.<br /><em>You relax.</em></h1>
            <p>Reliable home and office care from verified professionals—booked around your schedule, anywhere in Nairobi.</p>
            <div className="hero-actions"><Button onClick={onBook}>Book a service <ArrowRight /></Button><a href="#services">Explore services <ChevronRight /></a></div>
            <div className="social-proof">
              <div className="avatar-stack"><span>GW</span><span>BO</span><span>AM</span></div>
              <div><span className="stars">★★★★★</span> <b>4.9</b><small>Loved by 500+ Nairobi homes</small></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image"><img src={heroImage} alt="Professional cleaner carrying supplies in a bright home" /></div>
            <div className="pickup-badge"><Truck /><b>FREE</b><span>Pick-up &amp; delivery</span></div>
            <div className="verified-float"><span><ShieldCheck /></span><div><b>Verified professionals</b><small>ID checked &amp; approved</small></div></div>
          </div>
        </section>
        <section className="service-section" id="services">
          <div className="section-head">
            <div><span className="eyebrow">MADE FOR REAL LIFE</span><h2>Help for home, office<br /><em>&amp; everything between.</em></h2></div>
            <p>From deep cleans to quick errands, choose what you need and a trusted professional will take care of the rest.</p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <button className={`service-card ${index < 2 ? "featured" : ""}`} key={service.name} onClick={onBook}>
                  <span className="service-icon"><Icon /></span>
                  <div><h3>{service.name}</h3><p>{money(service.price)} {service.unit}</p></div>
                  {service.note && <Badge tone={service.note === "Popular" ? "gold" : "green"}>{service.note}</Badge>}
                  <ArrowRight />
                </button>
              );
            })}
          </div>
        </section>
        <section className="how-section" id="how">
          <div className="how-photo"><img src={heroImage} alt="J Home care professional at work" /><span>“A clean space is<br />a clear mind.”</span></div>
          <div className="how-content">
            <span className="eyebrow">SIMPLE, SAFE &amp; SEAMLESS</span><h2>Care in four<br /><em>easy steps.</em></h2>
            {[
              ["01", "Choose a service", "Tell us what you need and when."],
              ["02", "Pick your professional", "Compare ratings and availability."],
              ["03", "Pay a small deposit", "Confirm with M-Pesa and unlock chat."],
              ["04", "Relax—we’ve got it", "Track progress and pay when complete."],
            ].map(([number, title, text]) => <div className="process-step" key={number}><b>{number}</b><span><h3>{title}</h3><p>{text}</p></span></div>)}
            <Button variant="gold" onClick={onBook}>Get started <ArrowRight /></Button>
          </div>
        </section>
        <section className="trust-section" id="trust">
          <div><span className="eyebrow">CARE YOU CAN COUNT ON</span><h2>Every booking,<br /><em>backed by trust.</em></h2></div>
          <div className="trust-grid">
            <article><ShieldCheck /><h3>Verified people</h3><p>Every professional is ID checked, interviewed and quality reviewed.</p></article>
            <article><WalletCards /><h3>Protected payments</h3><p>Pay a small deposit, then settle the balance when the work is done.</p></article>
            <article><Headphones /><h3>Real human support</h3><p>Our Nairobi support team is always ready to make things right.</p></article>
          </div>
        </section>
      </main>
      <footer id="contact">
        <div className="footer-cta"><div><span>Ready for a lighter day?</span><h2>Leave the care to us.</h2></div><Button variant="gold" onClick={onBook}>Book a service <ArrowRight /></Button></div>
        <div className="footer-grid"><div><Logo /><p>Trusted home and office care for Nairobi’s busy people.</p></div><div><b>Explore</b><a href="#services">Services</a><a href="#how">How it works</a><a href="#trust">Why J Home</a></div><div><b>Contact</b><a href="tel:+254707089523">0707 089 523</a><a href="mailto:jhomeandofficecare@gmail.com">jhomeandofficecare@gmail.com</a><span>Nairobi, Kenya</span></div></div>
        <div className="copyright"><span>© 2025 J Home &amp; Office Care</span><span>Privacy · Terms</span></div>
      </footer>
      <a className="whatsapp" href="https://wa.me/254707089523" aria-label="Chat on WhatsApp"><MessageCircle /></a>
    </div>
  );
}

type NavItem = { label: string; icon: LucideIcon; count?: number };

function DashboardShell({
  role,
  active,
  setActive,
  onLogout,
  children,
}: {
  role: Role;
  active: string;
  setActive: (value: string) => void;
  onLogout: () => void;
  children: ReactNode;
}) {
  const [mobile, setMobile] = useState(false);
  const names = { customer: "Grace Wanjiku", employee: "Mercy Atieno", admin: "James Kamau" };
  const subtitles = { customer: "Customer account", employee: "Verified professional", admin: "Platform administrator" };
  const nav: Record<Role, NavItem[]> = {
    customer: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "My bookings", icon: CalendarDays, count: 2 },
      { label: "Messages", icon: MessageCircle, count: 1 },
      { label: "Payments", icon: CreditCard },
      { label: "Profile", icon: UserRound },
    ],
    employee: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Available jobs", icon: Search, count: 3 },
      { label: "My schedule", icon: CalendarDays },
      { label: "Messages", icon: MessageCircle, count: 2 },
      { label: "Earnings", icon: WalletCards },
      { label: "Profile", icon: BadgeCheck },
    ],
    admin: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Bookings", icon: CalendarDays, count: 3 },
      { label: "Customers", icon: UsersRound },
      { label: "Professionals", icon: BadgeCheck, count: 4 },
      { label: "Services", icon: Sparkles },
      { label: "Payments", icon: CircleDollarSign },
      { label: "Reports", icon: BarChart3 },
    ],
  };
  return (
    <div className={`dashboard role-${role}`}>
      <aside className={mobile ? "open" : ""}>
        <div className="sidebar-top"><Logo /><button className="sidebar-close" onClick={() => setMobile(false)}><X /></button></div>
        <div className="role-chip"><span>{role === "customer" ? <UserRound /> : role === "employee" ? <BriefcaseBusiness /> : <ShieldCheck />}</span><div><small>SIGNED IN AS</small><b>{role}</b></div></div>
        <nav className="dash-nav">
          {nav[role].map(({ label, icon: Icon, count }) => (
            <button className={active === label ? "active" : ""} key={label} onClick={() => { setActive(label); setMobile(false); }}>
              <Icon /><span>{label}</span>{count && <small>{count}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-help"><Headphones /><b>Need a hand?</b><p>Our support team is here for you.</p><button>Contact support</button></div>
        <button className="logout" onClick={onLogout}><LogOut /> Log out</button>
      </aside>
      <div className="dashboard-main">
        <header className="dash-header">
          <button className="dash-menu" onClick={() => setMobile(true)}><Menu /></button>
          <div className="dash-search"><Search /><input placeholder="Search anything..." /></div>
          <div className="dash-user">
            <button className="notification"><Bell /><span /></button>
            <span className="user-avatar">{names[role].split(" ").map((name) => name[0]).join("")}</span>
            <div><b>{names[role]}</b><small>{subtitles[role]}</small></div>
            <ChevronDown />
          </div>
        </header>
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}

function PageHead({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: ReactNode }) {
  return <div className="page-head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{action}</div>;
}

function StatCard({ icon: Icon, label, value, trend, tone = "green" }: { icon: LucideIcon; label: string; value: string; trend: string; tone?: string }) {
  return <article className="stat-card"><span className={`stat-icon ${tone}`}><Icon /></span><div><small>{label}</small><b>{value}</b><p>{trend}</p></div></article>;
}

function EmptySection({ title }: { title: string }) {
  return <div className="empty-section"><Settings /><h2>{title}</h2><p>This area is ready and connected to your workspace navigation.</p></div>;
}

function BookingList({ bookings, role, onStatus }: { bookings: Booking[]; role: Role; onStatus?: (id: string, status: BookingStatus) => void }) {
  return (
    <div className="data-card">
      <div className="table-head"><span>Booking</span><span>{role === "customer" ? "Professional" : "Customer"}</span><span>Schedule</span><span>Amount</span><span>Status</span><span /></div>
      {bookings.map((booking) => (
        <div className="table-row" key={booking.id}>
          <span><b>{booking.service}</b><small>{booking.id}</small></span>
          <span><b>{role === "customer" ? booking.provider : booking.customer}</b><small>{booking.location}</small></span>
          <span><b>{booking.date}</b><small>{booking.time}</small></span>
          <span><b>{money(booking.price)}</b><small>{booking.depositPaid ? "Deposit paid" : "Awaiting deposit"}</small></span>
          <span><StatusBadge status={booking.status} /></span>
          <span>
            {role === "admin" && booking.status !== "Completed" ? (
              <button className="row-action" onClick={() => onStatus?.(booking.id, booking.status === "Pending" ? "Confirmed" : booking.status === "Confirmed" ? "In progress" : "Completed")}><ChevronRight /></button>
            ) : <button className="row-action"><ChevronRight /></button>}
          </span>
        </div>
      ))}
    </div>
  );
}

function MessagesPanel({ unlocked = true }: { unlocked?: boolean }) {
  const [messages, setMessages] = useState(["Hello! I’ll arrive by 8:50 AM tomorrow.", "Perfect, the guard will let you in."]);
  const [draft, setDraft] = useState("");
  const send = () => {
    if (!draft.trim()) return;
    setMessages([...messages, draft]);
    setDraft("");
  };
  return (
    <div className="messages-layout">
      <div className="conversations">
        <div className="panel-title"><h2>Messages</h2><button><Plus /></button></div>
        <div className="conversation active"><span className="user-avatar">MA</span><div><b>Mercy Atieno</b><p>Perfect, see you then.</p></div><small>10:32</small></div>
        <div className="conversation"><span className="user-avatar gold">JM</span><div><b>John Mwangi</b><p>Thank you for the rating!</p></div><small>Mon</small></div>
      </div>
      <div className="chat-panel">
        <div className="chat-head"><span className="user-avatar">MA</span><div><b>Mercy Atieno <Badge tone="green">Verified</Badge></b><small>House cleaning · JH-2048</small></div><button><MessageCircle /></button></div>
        {unlocked ? (
          <>
            <div className="chat-body">
              <span className="chat-date">TODAY</span>
              {messages.map((message, index) => <div className={`bubble ${index % 2 ? "mine" : ""}`} key={`${message}-${index}`}>{message}<small>{index % 2 ? "10:32" : "10:28"}</small></div>)}
            </div>
            <div className="chat-input"><button><Plus /></button><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="Write a message..." /><button className="send" onClick={send}><Send /></button></div>
          </>
        ) : (
          <div className="locked-chat"><span><ShieldCheck /></span><h2>Chat unlocks after deposit</h2><p>Pay the booking deposit to securely message your professional.</p><Button>Pay deposit</Button></div>
        )}
      </div>
    </div>
  );
}

function CustomerDashboard({ bookings, onBook, onLogout }: { bookings: Booking[]; onBook: () => void; onLogout: () => void }) {
  const [active, setActive] = useState("Overview");
  const own = bookings.filter((booking) => booking.customer === "Grace Wanjiku");
  return (
    <DashboardShell role="customer" active={active} setActive={setActive} onLogout={onLogout}>
      {active === "Overview" && <>
        <PageHead eyebrow="CUSTOMER DASHBOARD" title="Good morning, Grace." text="Here’s what’s happening with your home care." action={<Button onClick={onBook}><Plus /> Book a service</Button>} />
        <div className="stats-grid customer-stats">
          <StatCard icon={CalendarDays} label="UPCOMING BOOKINGS" value="2" trend="Next visit: tomorrow" />
          <StatCard icon={CheckCircle2} label="COMPLETED SERVICES" value="12" trend="Across 5 service types" tone="blue" />
          <StatCard icon={Star} label="LOYALTY POINTS" value="840" trend="160 points to your reward" tone="gold" />
        </div>
        <div className="content-grid">
          <section className="content-card next-booking">
            <div className="card-heading"><div><span className="eyebrow">NEXT UP</span><h2>Your upcoming service</h2></div><StatusBadge status="Confirmed" /></div>
            <div className="next-service"><span><Home /></span><div><h3>House cleaning</h3><p>Booking JH-2048</p></div><b>KSh 2,400</b></div>
            <div className="booking-facts"><div><CalendarDays /><span><small>DATE &amp; TIME</small><b>Tue, 24 Jun · 9:00 AM</b></span></div><div><MapPin /><span><small>LOCATION</small><b>Kilimani, Nairobi</b></span></div></div>
            <div className="provider-line"><span className="user-avatar">MA</span><div><small>YOUR PROFESSIONAL</small><b>Mercy Atieno <Badge tone="green">4.9 ★</Badge></b></div><Button variant="secondary"><MessageCircle /> Message</Button></div>
          </section>
          <section className="content-card quick-actions"><div className="card-heading"><div><span className="eyebrow">SHORTCUTS</span><h2>Quick actions</h2></div></div>
            <button onClick={onBook}><span><Plus /></span><div><b>Book a new service</b><p>Choose from 11 care services</p></div><ChevronRight /></button>
            <button onClick={() => setActive("Messages")}><span><MessageCircle /></span><div><b>Message your provider</b><p>1 unread conversation</p></div><ChevronRight /></button>
            <button onClick={() => setActive("Payments")}><span><CreditCard /></span><div><b>View payments</b><p>Receipts and balances</p></div><ChevronRight /></button>
          </section>
        </div>
        <section className="section-block"><div className="card-heading"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>Your bookings</h2></div><button onClick={() => setActive("My bookings")}>View all <ArrowRight /></button></div><BookingList bookings={own} role="customer" /></section>
      </>}
      {active === "My bookings" && <><PageHead eyebrow="YOUR CARE HISTORY" title="My bookings" text="Track upcoming services and revisit completed care." action={<Button onClick={onBook}><Plus /> New booking</Button>} /><BookingList bookings={own} role="customer" /></>}
      {active === "Messages" && <><PageHead eyebrow="STAY CONNECTED" title="Messages" text="Chat securely with your assigned professionals." /><MessagesPanel /></>}
      {active === "Payments" && <><PageHead eyebrow="MONEY, MADE CLEAR" title="Payments" text="View deposits, balances and downloadable receipts." /><div className="stats-grid"><StatCard icon={Banknote} label="TOTAL SPENT" value="KSh 18,400" trend="Across 12 services" /><StatCard icon={CreditCard} label="UPCOMING BALANCE" value="KSh 2,160" trend="Due after service" tone="gold" /></div><BookingList bookings={own} role="customer" /></>}
      {active === "Profile" && <><PageHead eyebrow="YOUR ACCOUNT" title="Profile & preferences" text="Keep your contact and service information up to date." /><ProfileCard name="Grace Wanjiku" email="grace.wanjiku@example.com" phone="+254 712 345 678" /></>}
    </DashboardShell>
  );
}

function EmployeeDashboard({ bookings, onLogout }: { bookings: Booking[]; onLogout: () => void }) {
  const [active, setActive] = useState("Overview");
  const assigned = bookings.filter((booking) => booking.provider === "Mercy A.");
  return (
    <DashboardShell role="employee" active={active} setActive={setActive} onLogout={onLogout}>
      {active === "Overview" && <>
        <PageHead eyebrow="PROFESSIONAL DASHBOARD" title="Good morning, Mercy." text="You have two jobs scheduled today." action={<label className="availability"><span>Available for work</span><input type="checkbox" defaultChecked /><i /></label>} />
        <div className="stats-grid">
          <StatCard icon={BriefcaseBusiness} label="JOBS THIS WEEK" value="8" trend="+2 from last week" />
          <StatCard icon={WalletCards} label="WEEKLY EARNINGS" value="KSh 14,280" trend="+12% from last week" tone="gold" />
          <StatCard icon={Star} label="YOUR RATING" value="4.9" trend="From 86 customer reviews" tone="blue" />
        </div>
        <div className="content-grid">
          <section className="content-card today-schedule"><div className="card-heading"><div><span className="eyebrow">TUESDAY, 24 JUNE</span><h2>Today’s schedule</h2></div><button onClick={() => setActive("My schedule")}>Full schedule <ArrowRight /></button></div>
            {[["09:00", "House cleaning", "Grace Wanjiku", "Kilimani"], ["13:00", "Office cleaning", "Acacia Studio", "Westlands"]].map(([time, service, customer, area], index) => <div className="schedule-item" key={time}><b>{time}</b><span className="schedule-line" /><span className="service-dot"><Home /></span><div><h3>{service}</h3><p>{customer} · {area}</p></div><Badge tone={index ? "blue" : "green"}>{index ? "In progress" : "Confirmed"}</Badge><button><ChevronRight /></button></div>)}
          </section>
          <section className="content-card performance-card"><div className="card-heading"><div><span className="eyebrow">THIS MONTH</span><h2>Your performance</h2></div></div><div className="rating-ring"><span><b>4.9</b><small>OUT OF 5</small></span></div><div className="performance-lines"><p><span>On-time arrival</span><b>98%</b></p><p><span>Jobs accepted</span><b>92%</b></p><p><span>Repeat customers</span><b>67%</b></p></div></section>
        </div>
        <section className="section-block"><div className="card-heading"><div><span className="eyebrow">NEAR YOU</span><h2>Available jobs</h2></div><button onClick={() => setActive("Available jobs")}>Browse all <ArrowRight /></button></div><JobCards /></section>
      </>}
      {active === "Available jobs" && <><PageHead eyebrow="FIND YOUR NEXT JOB" title="Available jobs" text="Choose work that fits your skills, location and schedule." /><JobCards extended /></>}
      {active === "My schedule" && <><PageHead eyebrow="PLAN YOUR WEEK" title="My schedule" text="All accepted and completed jobs in one place." /><BookingList bookings={assigned.length ? assigned : bookings.slice(0, 2)} role="employee" /></>}
      {active === "Messages" && <><PageHead eyebrow="CUSTOMER CONVERSATIONS" title="Messages" text="Coordinate service details safely in-app." /><MessagesPanel /></>}
      {active === "Earnings" && <><PageHead eyebrow="YOUR MONEY" title="Earnings" text="Track payouts and performance over time." /><div className="stats-grid"><StatCard icon={WalletCards} label="AVAILABLE BALANCE" value="KSh 12,420" trend="Next payout: Friday" /><StatCard icon={TrendingUp} label="THIS MONTH" value="KSh 48,600" trend="+18% vs last month" tone="gold" /><StatCard icon={CheckCircle2} label="COMPLETED JOBS" value="27" trend="96% completion rate" tone="blue" /></div><BookingList bookings={bookings.filter((item) => item.status === "Completed" || item.status === "In progress")} role="employee" /></>}
      {active === "Profile" && <><PageHead eyebrow="PROFESSIONAL PROFILE" title="Profile & verification" text="Keep your credentials and service coverage current." /><ProfileCard name="Mercy Atieno" email="mercy.atieno@example.com" phone="+254 722 456 789" professional /></>}
    </DashboardShell>
  );
}

function JobCards({ extended = false }: { extended?: boolean }) {
  const [accepted, setAccepted] = useState<string[]>([]);
  const jobs = [
    ["Carpet cleaning", "Lavington", "Tomorrow · 10:00 AM", "2.4 km", "1,800"],
    ["House cleaning", "Kileleshwa", "Tomorrow · 2:00 PM", "3.1 km", "2,400"],
    ["Laundry care", "Kilimani", "Thu · 9:00 AM", "1.2 km", "1,200"],
    ["Office cleaning", "Upper Hill", "Fri · 8:00 AM", "4.8 km", "4,500"],
  ];
  return <div className="job-grid">{jobs.slice(0, extended ? 4 : 3).map(([service, area, date, distance, price]) => <article className="job-card" key={service + area}><div><span className="service-icon"><Sparkles /></span><Badge tone="green">{distance} away</Badge></div><h3>{service}</h3><p><MapPin /> {area}</p><p><Clock3 /> {date}</p><div><span><small>YOU EARN</small><b>KSh {price}</b></span><Button variant={accepted.includes(service + area) ? "secondary" : "primary"} onClick={() => setAccepted([...accepted, service + area])} disabled={accepted.includes(service + area)}>{accepted.includes(service + area) ? "Accepted" : "View job"}</Button></div></article>)}</div>;
}

function ProfileCard({ name, email, phone, professional = false }: { name: string; email: string; phone: string; professional?: boolean }) {
  return <div className="profile-card"><div className="profile-banner" /><div className="profile-main"><span className="profile-avatar">{name.split(" ").map((item) => item[0]).join("")}</span><div><h2>{name} {professional && <Badge tone="green">Verified</Badge>}</h2><p>{professional ? "Home & office care professional" : "J Home customer since 2023"}</p></div><Button variant="secondary">Edit profile</Button></div><div className="profile-fields"><div><Mail /><span><small>EMAIL ADDRESS</small><b>{email}</b></span></div><div><MessageCircle /><span><small>PHONE NUMBER</small><b>{phone}</b></span></div><div><MapPin /><span><small>SERVICE AREA</small><b>Nairobi, Kenya</b></span></div><div><ShieldCheck /><span><small>ACCOUNT SECURITY</small><b>Two-factor enabled</b></span></div></div></div>;
}

function AdminDashboard({ bookings, setBookings, onLogout }: { bookings: Booking[]; setBookings: (items: Booking[]) => void; onLogout: () => void }) {
  const [active, setActive] = useState("Overview");
  const updateStatus = (id: string, status: BookingStatus) => setBookings(bookings.map((booking) => booking.id === id ? { ...booking, status } : booking));
  const revenue = bookings.filter((item) => item.depositPaid).reduce((sum, item) => sum + item.price, 0);
  return (
    <DashboardShell role="admin" active={active} setActive={setActive} onLogout={onLogout}>
      {active === "Overview" && <>
        <PageHead eyebrow="ADMIN COMMAND CENTRE" title="Platform overview" text="Live operations across J Home & Office Care." action={<div className="date-filter"><CalendarDays /> 18–24 June 2025 <ChevronDown /></div>} />
        <div className="stats-grid admin-stats">
          <StatCard icon={CalendarDays} label="TOTAL BOOKINGS" value="1,284" trend="+14.2% this month" />
          <StatCard icon={CircleDollarSign} label="GROSS REVENUE" value="KSh 2.8M" trend="+18.6% this month" tone="gold" />
          <StatCard icon={UsersRound} label="ACTIVE CUSTOMERS" value="842" trend="+42 this month" tone="blue" />
          <StatCard icon={BadgeCheck} label="PROFESSIONALS" value="126" trend="4 awaiting approval" tone="purple" />
        </div>
        <div className="content-grid admin-grid">
          <section className="content-card revenue-card"><div className="card-heading"><div><span className="eyebrow">PERFORMANCE</span><h2>Revenue overview</h2></div><Badge tone="gray">Last 7 days</Badge></div><div className="chart"><div className="chart-scale"><span>500K</span><span>250K</span><span>0</span></div><div className="bars">{[54, 72, 60, 86, 68, 94, 82].map((height, index) => <span key={index}><i style={{ height: `${height}%` }} /><small>{["M", "T", "W", "T", "F", "S", "S"][index]}</small></span>)}</div></div></section>
          <section className="content-card service-breakdown"><div className="card-heading"><div><span className="eyebrow">DEMAND</span><h2>Top services</h2></div></div>{[["House cleaning", 38], ["Office cleaning", 24], ["Laundry care", 19], ["Carpet cleaning", 12]].map(([name, percent]) => <div className="breakdown-row" key={name}><span><b>{name}</b><small>{percent}%</small></span><i><b style={{ width: `${percent}%` }} /></i></div>)}</section>
        </div>
        <section className="section-block"><div className="card-heading"><div><span className="eyebrow">LIVE OPERATIONS</span><h2>Recent bookings</h2></div><button onClick={() => setActive("Bookings")}>Manage all <ArrowRight /></button></div><BookingList bookings={bookings} role="admin" onStatus={updateStatus} /></section>
      </>}
      {active === "Bookings" && <><PageHead eyebrow="OPERATIONS" title="All bookings" text="Assign providers, update statuses and resolve booking issues." action={<Button><Plus /> Create booking</Button>} /><div className="filter-row"><div><Search /><input placeholder="Search booking or customer..." /></div>{["All bookings", "Pending", "In progress", "Completed"].map((item) => <button className={item === "All bookings" ? "active" : ""} key={item}>{item}</button>)}</div><BookingList bookings={bookings} role="admin" onStatus={updateStatus} /></>}
      {active === "Customers" && <><PageHead eyebrow="COMMUNITY" title="Customers" text="Manage customer accounts and service history." /><PeopleTable type="customer" /></>}
      {active === "Professionals" && <><PageHead eyebrow="YOUR SERVICE TEAM" title="Professionals" text="Review applications, verification and performance." action={<Button><Plus /> Add professional</Button>} /><PeopleTable type="professional" /></>}
      {active === "Services" && <><PageHead eyebrow="CATALOGUE" title="Services & pricing" text="Keep the J Home service catalogue clear and competitive." action={<Button><Plus /> Add service</Button>} /><div className="admin-service-grid">{services.map(({ name, price, unit, icon: Icon }) => <article key={name}><span><Icon /></span><div><h3>{name}</h3><p>{money(price)} {unit}</p></div><Badge tone="green">Active</Badge><button><Settings /></button></article>)}</div></>}
      {active === "Payments" && <><PageHead eyebrow="FINANCIAL OPERATIONS" title="Payments" text="Monitor deposits, balances, payouts and reconciliation." /><div className="stats-grid"><StatCard icon={CircleDollarSign} label="BOOKING VALUE" value={money(revenue)} trend="From current records" /><StatCard icon={WalletCards} label="PROVIDER PAYOUTS" value="KSh 1.9M" trend="96% reconciled" tone="gold" /><StatCard icon={Banknote} label="PLATFORM FEES" value="KSh 284K" trend="+16% this month" tone="blue" /></div><BookingList bookings={bookings} role="admin" /></>}
      {active === "Reports" && <><PageHead eyebrow="BUSINESS INTELLIGENCE" title="Reports" text="Understand demand, quality and growth across the platform." /><EmptySection title="Custom reports are ready" /></>}
    </DashboardShell>
  );
}

function PeopleTable({ type }: { type: "customer" | "professional" }) {
  const people = type === "customer"
    ? [["Grace Wanjiku", "grace.w@example.com", "12 bookings", "Kilimani"], ["Brian Otieno", "brian.o@example.com", "8 bookings", "Lavington"], ["Amina Noor", "amina.n@example.com", "5 bookings", "Parklands"]]
    : [["Mercy Atieno", "House cleaning", "4.9 rating", "Verified"], ["David Kimani", "Office cleaning", "4.8 rating", "Verified"], ["John Mwangi", "Carpet cleaning", "4.9 rating", "Verified"], ["Faith Akinyi", "Laundry care", "New applicant", "Review"]];
  return <div className="people-grid">{people.map(([name, detail, meta, status], index) => <article key={name}><span className={`user-avatar ${index % 2 ? "gold" : ""}`}>{name.split(" ").map((item) => item[0]).join("")}</span><div><h3>{name}</h3><p>{detail}</p></div><small>{meta}</small><Badge tone={status === "Review" ? "gold" : "green"}>{status || "Active"}</Badge><button><ChevronRight /></button></article>)}</div>;
}

function App() {
  const [view, setView] = useState<View>("home");
  const [auth, setAuth] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookings, setBookings] = useState(initialBookings);
  const current = useMemo(() => bookings, [bookings]);
  const login = (role: Role) => { setAuth(false); setView(role); };
  const logout = () => setView("home");
  const completeBooking = (item: Booking) => { setBookings([item, ...bookings]); setView("customer"); };
  return (
    <>
      {view === "home" && <PublicSite onBook={() => setBooking(true)} onLogin={() => setAuth(true)} />}
      {view === "customer" && <CustomerDashboard bookings={current} onBook={() => setBooking(true)} onLogout={logout} />}
      {view === "employee" && <EmployeeDashboard bookings={current} onLogout={logout} />}
      {view === "admin" && <AdminDashboard bookings={current} setBookings={setBookings} onLogout={logout} />}
      {auth && <AuthModal close={() => setAuth(false)} onLogin={login} />}
      {booking && <BookingModal close={() => setBooking(false)} onComplete={completeBooking} />}
    </>
  );
}

export default App;
