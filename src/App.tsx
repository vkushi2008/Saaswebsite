import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";

type IconName =
  | "arrow"
  | "bolt"
  | "check"
  | "chevron"
  | "close"
  | "command"
  | "grid"
  | "layers"
  | "menu"
  | "spark"
  | "users";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    bolt: <path d="m13 2-9 11h7l-1 9 10-12h-7z" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    command: <><path d="M18 9a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3z" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    layers: <><path d="m12 2 9 5-9 5-9-5z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    spark: <><path d="m12 3-1.3 4.7L6 9l4.7 1.3L12 15l1.3-4.7L18 9l-4.7-1.3z" /><path d="m5 15-.6 2.4L2 18l2.4.6L5 21l.6-2.4L8 18l-2.4-.6z" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const features = [
  { icon: "spark" as IconName, number: "01", title: "Ideas become action", text: "Turn loose conversations into clear decisions, owners, and next steps—without another status meeting." },
  { icon: "grid" as IconName, number: "02", title: "One focused workspace", text: "Projects, docs, and priorities live together in a calm system your whole team can understand." },
  { icon: "bolt" as IconName, number: "03", title: "Momentum, automated", text: "NOVA surfaces blockers, nudges handoffs, and builds a concise daily briefing around what matters." },
  { icon: "users" as IconName, number: "04", title: "Built for real teams", text: "Flexible enough for every workflow, consistent enough to keep everyone moving in the same direction." },
];

const plans = [
  { name: "Launch", monthly: 12, copy: "For small teams finding their rhythm.", features: ["Up to 5 members", "Unlimited projects", "Core automations", "7-day history"] },
  { name: "Scale", monthly: 24, copy: "For growing teams ready to move faster.", features: ["Up to 25 members", "Advanced workflows", "NOVA intelligence", "Unlimited history", "Priority support"], popular: true },
  { name: "Studio", monthly: 42, copy: "For organizations that need control.", features: ["Unlimited members", "Custom permissions", "Dedicated workspace", "SSO & audit logs", "Onboarding support"] },
];

const faqs = [
  ["Is NOVA a real product?", "This page is a fully functional concept created for the SkillBlade B01 challenge. The signup flow and pricing are clearly presented as demo experiences."],
  ["Can I try the signup experience?", "Yes. Choose any plan or select a primary CTA to open the demo signup form. It validates your details and simulates a successful workspace request."],
  ["What happens to submitted data?", "Nothing leaves your browser. This static demo does not send, store, or share your form data."],
  ["Does the yearly plan lock me in?", "No real purchase is made in this demo. The yearly toggle simply demonstrates pricing behavior and an annual discount."],
];

const reviews = [
  { quote: "The daily focus view makes it obvious where I should spend my attention first.", initials: "RK", name: "Riley Kim", role: "Fictional design lead" },
  { quote: "We can see decisions, owners, and deadlines without digging through five different tools.", initials: "JT", name: "Jordan Tate", role: "Fictional operations manager" },
  { quote: "NOVA feels calm even when the project is moving quickly. That clarity is the real value.", initials: "MS", name: "Morgan Shah", role: "Fictional product founder" },
];

function Logo() {
  return <a className="logo" href="#top" aria-label="NOVA home"><span className="logo-mark"><span /></span>NOVA</a>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Scale");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    if (modalOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      window.requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("input, button")?.focus());
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      if (modalOpen) previousFocusRef.current?.focus();
    };
  }, [modalOpen]);

  const openSignup = (plan = "Scale") => {
    setSelectedPlan(plan);
    setStatus("idle");
    setFormError("");
    setMenuOpen(false);
    setModalOpen(true);
  };

  const submitSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const name = String(form.get("name") || "").trim();
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Enter your name and a valid work email.");
      setStatus("error");
      return;
    }
    setFormError("");
    setStatus("loading");
    window.setTimeout(() => setStatus("success"), 900);
  };

  const keepFocusInDialog = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled)");
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div id="top" className="site-shell">
      <header className="nav-wrap">
        <nav className="nav container" aria-label="Primary navigation">
          <Logo />
          <div className="nav-links">
            <a href="#features">Features</a><a href="#story">Stories</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a>
          </div>
          <button className="button button-dark nav-cta" onClick={() => openSignup()}><span>Get started</span><Icon name="arrow" size={17} /></button>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close menu" : "Open menu"}><Icon name={menuOpen ? "close" : "menu"} /></button>
        </nav>
        {menuOpen && <div className="mobile-menu" id="mobile-navigation">
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a><a href="#story" onClick={() => setMenuOpen(false)}>Stories</a><a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a><a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <button className="button button-jade" onClick={() => openSignup()}>Get started <Icon name="arrow" size={17} /></button>
        </div>}
      </header>

      <main>
        <section className="hero section-pad">
          <div className="hero-glow" />
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <div className="eyebrow"><span className="eyebrow-dot" />The intelligent team workspace</div>
              <h1>The team workspace<br />that turns plans into <em>progress.</em></h1>
              <p><strong>A smarter way to work together.</strong> NOVA brings projects, decisions, and daily priorities into one clear place, so your team knows what matters and what to do next.</p>
              <div className="hero-actions">
                <button className="button button-jade button-large" onClick={() => openSignup()}>Start building free <Icon name="arrow" size={18} /></button>
                <a className="button button-ghost button-large" href="#how-it-works">See how it works <Icon name="arrow" size={17} /></a>
              </div>
              <div className="hero-note"><span className="avatar-stack"><i>AL</i><i>KM</i><i>JR</i></span><span><strong>Built for ambitious teams</strong><br />No card required · Demo experience</span></div>
            </div>

            <div className="preview-wrap reveal" id="product" aria-label="Animated NOVA product preview">
              <div className="preview-orbit orbit-one" /><div className="preview-orbit orbit-two" />
              <div className="preview-card">
                <div className="preview-topbar"><div className="preview-brand"><span className="mini-mark" />NOVA</div><div className="preview-search">⌘ &nbsp; Search anything</div><div className="preview-face">NS</div></div>
                <div className="preview-body">
                  <aside className="preview-side"><div className="side-active"><Icon name="grid" size={14} /> Overview</div><div><Icon name="layers" size={14} /> Projects</div><div><Icon name="users" size={14} /> Team</div><small>WORKSPACES</small><div><span className="tiny-dot gold" /> Orion</div><div><span className="tiny-dot blue" /> Monocle</div></aside>
                  <div className="preview-main">
                    <div className="preview-heading"><div><span>Monday, 18 May</span><h3>Good morning, Nora.</h3></div><span className="preview-add" aria-hidden="true">+</span></div>
                    <div className="briefing"><div className="briefing-icon"><Icon name="spark" size={17} /></div><div><b>Your daily focus</b><p>3 priorities need your attention today.</p></div><span>View briefing →</span></div>
                    <div className="metric-row"><div><span>ACTIVE PROJECTS</span><strong>08</strong><small>+2 this month</small></div><div><span>TEAM MOMENTUM</span><strong>94%</strong><small>On track</small></div></div>
                    <div className="task-head"><b>Today</b><span>View all</span></div>
                    <div className="task-row"><i className="check-dot"><Icon name="check" size={11} /></i><div><b>Finalize launch narrative</b><span>Orion launch</span></div><small>Today</small></div>
                    <div className="task-row"><i /><div><b>Review product prototype</b><span>Mobile experience</span></div><small>2:30 PM</small></div>
                  </div>
                </div>
                <div className="scan-line" />
              </div>
              <div className="float-card float-a"><span className="pulse-ring"><Icon name="check" size={13} /></span><div><b>Milestone complete</b><small>Launch plan approved</small></div></div>
              <div className="float-card float-b"><span className="float-spark"><Icon name="spark" size={14} /></span><div><b>NOVA Insight</b><small>You're 2 days ahead.</small></div></div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Demo trust indicators">
          <div className="container trust-inner"><span>DEMO TEAMS BUILDING WITH NOVA</span><div className="wordmarks"><b>MONOCLE</b><b>northstar</b><b>FORM&FIELD</b><b>APERTURE</b><b>orion°</b></div></div>
        </section>

        <section className="workflow section-pad" id="how-it-works">
          <div className="container">
            <div className="workflow-intro">
              <div><span className="kicker">How NOVA works</span><h2>From scattered ideas<br />to <em>clear action.</em></h2></div>
              <div><p>NOVA gives every piece of work a simple path forward. Your team can understand the whole system in minutes—not weeks.</p><button className="text-action" onClick={() => openSignup()}>Try the demo workflow <Icon name="arrow" size={17} /></button></div>
            </div>
            <div className="workflow-steps">
              <article><span className="step-number">01</span><div className="step-visual capture-visual"><span>Launch planning</span><i /><span>Customer research</span><i /><span>Website refresh</span></div><h3>Capture everything</h3><p>Bring projects, notes, tasks, and decisions into one organized workspace.</p></article>
              <article><span className="step-number">02</span><div className="step-visual align-visual"><div><Icon name="spark" size={18} /></div><strong>Today’s focus</strong><span>3 priorities · 1 blocker</span></div><h3>See what matters</h3><p>NOVA turns activity into a focused daily view, so everyone knows what needs attention.</p></article>
              <article><span className="step-number">03</span><div className="step-visual progress-visual"><div><span>Launch readiness</span><b>84%</b></div><i><span /></i><small>On track for Friday</small></div><h3>Move work forward</h3><p>Clear owners, timely nudges, and visible progress keep every handoff moving.</p></article>
            </div>
            <div className="workflow-summary"><Icon name="check" size={18} /><span><b>The result:</b> fewer status meetings, clearer priorities, and more time for meaningful work.</span></div>
          </div>
        </section>

        <section className="features section-pad" id="features">
          <div className="container">
            <div className="section-heading"><div><span className="kicker">Built for momentum</span><h2>Less managing.<br /><em>More making.</em></h2></div><p>NOVA brings structure to the messy middle—so your team spends less time coordinating work and more time doing work that matters.</p></div>
            <div className="feature-grid">
              {features.map((feature) => <article className="feature-card" key={feature.title}><span className="feature-number">{feature.number}</span><div className="icon-box"><Icon name={feature.icon} size={24} /></div><h3>{feature.title}</h3><p>{feature.text}</p><a href="#pricing" aria-label={`Explore ${feature.title}`}>Explore feature <Icon name="arrow" size={16} /></a></article>)}
            </div>
          </div>
        </section>

        <section className="use-case section-pad" id="example">
          <div className="container">
            <div className="use-case-heading">
              <div><span className="kicker">NOVA in action · Demo example</span><h2>See a launch move<br />from <em>idea to done.</em></h2></div>
              <p>Imagine a small product team preparing a new mobile app. Here’s how they could use NOVA to replace scattered updates with one shared plan.</p>
            </div>
            <div className="example-grid">
              <div className="example-timeline">
                <div className="example-project"><span className="project-symbol">O</span><div><small>DEMO PROJECT</small><h3>Orion mobile launch</h3></div><span className="status-pill">On track</span></div>
                <div className="timeline-item complete"><span><Icon name="check" size={13} /></span><div><small>MONDAY · CAPTURE</small><h4>Team adds research, goals, and launch tasks</h4><p>NOVA organizes the work into a clear project plan with owners.</p></div></div>
                <div className="timeline-item active"><span><Icon name="spark" size={14} /></span><div><small>WEDNESDAY · ALIGN</small><h4>NOVA flags an approval blocker</h4><p>The right teammate gets a timely nudge before the blocker affects launch.</p></div></div>
                <div className="timeline-item"><span>3</span><div><small>FRIDAY · DELIVER</small><h4>The launch checklist reaches 100%</h4><p>Everyone sees what shipped, what changed, and what happens next.</p></div></div>
              </div>
              <div className="analytics-card">
                <div className="analytics-top"><div><small>ILLUSTRATIVE USAGE</small><h3>Team activity</h3></div><span className="analytics-period">8 weeks</span></div>
                <div className="analytics-metrics"><div><span>Tasks completed</span><strong>128</strong><small>Demo total</small></div><div><span>Active teammates</span><strong>12</strong><small>Demo total</small></div><div><span>On-time work</span><strong>84%</strong><small>Illustrative rate</small></div></div>
                <div className="chart-area" aria-label="Illustrative eight-week activity chart">
                  <div className="chart-axis"><span>120</span><span>80</span><span>40</span><span>0</span></div>
                  <div className="chart-plot">
                    <div className="chart-lines"><i /><i /><i /><i /></div>
                    <svg viewBox="0 0 600 180" preserveAspectRatio="none" role="img" aria-label="Demo activity rises gradually over eight weeks">
                      <defs><linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#13a477" stopOpacity=".28" /><stop offset="100%" stopColor="#13a477" stopOpacity="0" /></linearGradient></defs>
                      <path d="M0 150 C45 142 55 120 90 125 S145 104 180 108 S235 87 270 94 S325 72 360 78 S415 58 450 64 S510 34 540 45 S580 25 600 30 L600 180 L0 180Z" fill="url(#area-fill)" />
                      <path d="M0 150 C45 142 55 120 90 125 S145 104 180 108 S235 87 270 94 S325 72 360 78 S415 58 450 64 S510 34 540 45 S580 25 600 30" fill="none" stroke="#0b6b55" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                      {[["0","150"],["90","125"],["180","108"],["270","94"],["360","78"],["450","64"],["540","45"],["600","30"]].map(([cx,cy]) => <circle key={cx} cx={cx} cy={cy} r="4" fill="#f4f1e8" stroke="#0b6b55" strokeWidth="3" vectorEffect="non-scaling-stroke" />)}
                    </svg>
                    <div className="chart-labels">{["W1","W2","W3","W4","W5","W6","W7","W8"].map((week) => <span key={week}>{week}</span>)}</div>
                  </div>
                </div>
                <div className="analytics-note"><Icon name="spark" size={16} /><span><b>Demo insight:</b> activity is trending upward while on-time completion remains steady.</span></div>
              </div>
            </div>
            <div className="example-disclaimer">All names, activity, and statistics in this example are fictional and shown only to demonstrate the NOVA product experience.</div>
          </div>
        </section>

        <section className="reviews section-pad" aria-labelledby="reviews-title">
          <div className="container">
            <div className="reviews-heading"><div><span className="kicker">What it could feel like</span><h2 id="reviews-title">Clarity teams<br /><em>can feel.</em></h2></div><p>Illustrative reviews written for this concept demo. These are not endorsements from real customers.</p></div>
            <div className="review-grid">
              {reviews.map((review, index) => <article key={review.name}><div className="review-mark">“</div><blockquote>{review.quote}</blockquote><div className="review-person"><span>{review.initials}</span><div><b>{review.name}</b><small>{review.role}</small></div></div><div className="review-index">0{index + 1}</div></article>)}
            </div>
          </div>
        </section>

        <section className="story section-pad" id="story">
          <div className="container story-grid">
            <div className="story-visual">
              <div className="story-label">DEMO CUSTOMER STORY</div>
              <div className="story-monogram">N<span>/</span>S</div>
              <div className="story-chart"><span>TEAM MOMENTUM</span><div className="bars">{[36, 52, 44, 64, 59, 77, 71, 88].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div><small>8 WEEK VIEW <b>↑ Trending steadily</b></small></div>
            </div>
            <div className="story-copy"><span className="kicker kicker-light">The human side of progress</span><blockquote>“NOVA gave our work a rhythm everyone could feel. Monday meetings got shorter—and the thinking got better.”</blockquote><div className="quote-person"><div>AM</div><p><b>Alex Morgan</b><span>Fictional product lead, Northstar Studio</span></p></div><div className="demo-disclaimer">Illustrative testimonial for demonstration purposes. No real customer or performance claim is represented.</div></div>
          </div>
        </section>

        <section className="pricing section-pad" id="pricing">
          <div className="container">
            <div className="pricing-head"><div><span className="kicker">Simple, transparent pricing</span><h2>Choose your<br /><em>pace.</em></h2><p>Demo pricing shown for the concept experience. No payment will be collected.</p></div>
              <div className="toggle-wrap"><span className={!yearly ? "active" : ""}>Monthly</span><button className={`toggle ${yearly ? "on" : ""}`} onClick={() => setYearly(!yearly)} role="switch" aria-checked={yearly} aria-label="Bill yearly"><i /></button><span className={yearly ? "active" : ""}>Yearly <small>Save 20%</small></span></div>
            </div>
            <div className="pricing-grid">
              {plans.map((plan) => {
                const price = yearly ? Math.round(plan.monthly * .8) : plan.monthly;
                return <article className={`price-card ${plan.popular ? "popular" : ""}`} key={plan.name}>{plan.popular && <div className="popular-tag">MOST POPULAR</div>}<h3>{plan.name}</h3><p>{plan.copy}</p><div className="price"><span>$</span><strong>{price}</strong><small>/ user / mo</small></div><div className="billing-note">{yearly ? `Billed yearly at $${price * 12}` : "Billed monthly"} · Demo only</div><button className={`button ${plan.popular ? "button-mint" : "button-outline"} price-button`} onClick={() => openSignup(plan.name)}>Choose {plan.name} <Icon name="arrow" size={17} /></button><ul>{plan.features.map((item) => <li key={item}><Icon name="check" size={16} />{item}</li>)}</ul></article>;
              })}
            </div>
          </div>
        </section>

        <section className="faq section-pad" id="faq">
          <div className="container faq-grid"><div><span className="kicker">Questions, answered</span><h2>Good to<br /><em>know.</em></h2><p>Still curious? <a href="mailto:hello@nova-demo.example">Send us a note</a> and the demo team will point you in the right direction.</p></div>
            <div className="accordion">{faqs.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? "open" : ""}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`}><span>{question}</span><Icon name="chevron" size={19} /></button><div className="faq-answer" id={`faq-answer-${index}`} aria-hidden={openFaq !== index}><p>{answer}</p></div></div>)}</div>
          </div>
        </section>

        <section className="closing"><div className="closing-grid" /><div className="container closing-inner"><span className="kicker kicker-light">Your best work is ahead</span><h2>Turn ambition<br />into <em>momentum.</em></h2><p>Give your team one beautiful place to think clearly, move quickly, and build what’s next.</p><button className="button button-mint button-large" onClick={() => openSignup()}>Start building free <Icon name="arrow" size={18} /></button><small>Free demo · No card required · Setup in minutes</small></div></section>
      </main>

      <footer><div className="container footer-top"><div className="footer-brand"><Logo /><p>A smarter way to work together.<br />Built for teams with somewhere to go.</p></div><div className="footer-links"><div><b>Product</b><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#story">Customer story</a></div><div><b>Company</b><a href="mailto:hello@nova-demo.example">Contact</a><button onClick={() => openSignup()}>Join the demo</button><a href="#faq">About this demo</a></div><div><b>Follow</b><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://www.x.com" target="_blank" rel="noreferrer">X / Twitter ↗</a><a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram ↗</a></div></div></div><div className="container footer-bottom"><span>© 2025 NOVA · Concept experience</span><div><button onClick={() => alert("Privacy policy placeholder — this demo stores no personal data.")}>Privacy (placeholder)</button><button onClick={() => alert("Terms placeholder — this is a non-commercial demo experience.")}>Terms (placeholder)</button></div></div></footer>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setModalOpen(false)}><div className="modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" onKeyDown={keepFocusInDialog}>
        <button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Close signup"><Icon name="close" /></button>
        {status === "success" ? <div className="success-state"><span><Icon name="check" size={28} /></span><div className="eyebrow">Demo request received</div><h2 id="modal-title">You’re on the list.</h2><p>This was a demo interaction—no information was transmitted or stored. Your future workspace would be on the <b>{selectedPlan}</b> plan.</p><button className="button button-jade" onClick={() => setModalOpen(false)}>Back to NOVA</button></div> :
        <><div className="eyebrow"><span className="eyebrow-dot" />Demo signup</div><h2 id="modal-title">Build your<br /><em>next chapter.</em></h2><p>Try the {selectedPlan} plan experience. Your details stay in this browser and are never submitted.</p><form onSubmit={submitSignup} noValidate onChange={() => status === "error" && setStatus("idle")}><label>Full name<input name="name" type="text" autoComplete="name" placeholder="Nora Silva" minLength={2} required disabled={status === "loading"} aria-invalid={status === "error"} aria-describedby={status === "error" ? "signup-error" : undefined} /></label><label>Work email<input name="email" type="email" autoComplete="email" placeholder="nora@company.com" required disabled={status === "loading"} aria-invalid={status === "error"} aria-describedby={status === "error" ? "signup-error" : undefined} /></label>{status === "error" && <div className="form-error" id="signup-error" role="alert">{formError}</div>}<button className="button button-jade button-large form-submit" type="submit" disabled={status === "loading"}>{status === "loading" ? <><span className="spinner" />Creating demo workspace…</> : <>Create demo workspace <Icon name="arrow" size={18} /></>}</button><small>By continuing, you acknowledge this is a portfolio demo only.</small></form></>}
      </div></div>}
    </div>
  );
}

export default App;
