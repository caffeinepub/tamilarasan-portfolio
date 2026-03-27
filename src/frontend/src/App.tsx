import { Badge } from "@/components/ui/badge";
import {
  Braces,
  ChevronUp,
  Code2,
  Cpu,
  FlaskConical,
  Globe,
  GraduationCap,
  Mail,
  Menu,
  Phone,
  Terminal,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Particle Canvas ───────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const N = Math.floor((canvas.width * canvas.height) / 12000);
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(51,214,255,0.6)";
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(168,85,247,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}

// ─── Scroll animation hook ─────────────────────────────────────────────────────
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ─── Animated skill bar ───────────────────────────────────────────────────────
function SkillBar({ level, delay = 0 }: { level: number; delay?: number }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(level), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [level, delay]);

  return (
    <div
      ref={barRef}
      className="w-full h-1.5 rounded-full"
      style={{ background: "oklch(0.20 0.03 258)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: `${width}%`,
          background: "linear-gradient(90deg, #33D6FF, #A855F7)",
        }}
      />
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Languages", href: "#languages" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNav = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "oklch(0.07 0.02 260 / 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid oklch(0.25 0.04 258 / 0.5)"
          : "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          type="button"
          className="text-xl font-bold gradient-text cursor-pointer bg-transparent border-none p-0"
          data-ocid="nav.link"
          onClick={() => handleNav("#home")}
        >
          TAMILARASAN.
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                data-ocid="nav.link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(l.href);
                }}
                className="text-sm font-medium transition-colors duration-200 cursor-pointer"
                style={{ color: "oklch(0.73 0.04 250)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#33D6FF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "oklch(0.73 0.04 250)";
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md"
          style={{ color: "oklch(0.73 0.04 250)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          data-ocid="nav.toggle"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-4"
          style={{ background: "oklch(0.07 0.02 260 / 0.98)" }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                handleNav(l.href);
              }}
              className="text-sm font-medium py-2 border-b cursor-pointer"
              style={{
                color: "oklch(0.73 0.04 250)",
                borderColor: "oklch(0.25 0.04 258)",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, oklch(0.10 0.04 260) 0%, oklch(0.07 0.02 260) 60%)",
      }}
    >
      <ParticleCanvas />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "oklch(0.82 0.15 200 / 0.06)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "oklch(0.60 0.25 310 / 0.08)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <p className="section-label mb-4">Welcome to my portfolio</p>

        <h1
          className="font-black gradient-text mb-4"
          style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", lineHeight: 1.1 }}
        >
          TAMILARASAN
        </h1>

        <p
          className="text-xl md:text-2xl font-medium mb-6"
          style={{ color: "oklch(0.73 0.04 250)" }}
        >
          Software Developer &amp; Graduate
        </p>

        <p
          className="text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "oklch(0.65 0.04 250)" }}
        >
          Passionate about building intelligent systems and solving complex
          problems with code. Specializing in Java, Python, and Machine Learning
          applications.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() =>
              document
                .querySelector("#projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #33D6FF, #A855F7)",
              color: "oklch(0.07 0.02 260)",
              boxShadow: "0 0 25px oklch(0.82 0.15 200 / 0.4)",
            }}
            data-ocid="hero.primary_button"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 0 40px oklch(0.82 0.15 200 / 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 0 25px oklch(0.82 0.15 200 / 0.4)";
            }}
          >
            View Projects
          </button>

          <button
            type="button"
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer"
            style={{
              background: "transparent",
              color: "#33D6FF",
              border: "1.5px solid #33D6FF",
            }}
            data-ocid="hero.secondary_button"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 0 20px oklch(0.82 0.15 200 / 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Contact Me
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div
          className="w-0.5 h-10 rounded-full"
          style={{
            background: "linear-gradient(180deg, #33D6FF, transparent)",
          }}
        />
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const ref = useFadeUp();
  return (
    <section
      id="about"
      className="py-24 px-6"
      style={{ background: "oklch(0.09 0.025 258)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="fade-up">
          <p className="section-label mb-3">Get to know me</p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-12"
            style={{ color: "oklch(0.95 0.02 250)" }}
          >
            About <span className="gradient-text">Me</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Avatar */}
            <div className="flex justify-center">
              <div
                className="relative w-64 h-64 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.12 0.03 258), oklch(0.15 0.03 258))",
                  border: "1px solid oklch(0.25 0.04 258)",
                  boxShadow:
                    "0 0 60px oklch(0.82 0.15 200 / 0.15), 0 0 120px oklch(0.60 0.25 310 / 0.1)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-black text-6xl gradient-text"
                    style={{ lineHeight: 1 }}
                  >
                    T
                  </span>
                </div>
                <div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #33D6FF, #A855F7)",
                  }}
                />
                <div
                  className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full"
                  style={{ background: "#A855F7" }}
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <p
                className="text-lg leading-relaxed mb-6"
                style={{ color: "oklch(0.73 0.04 250)" }}
              >
                Hello! I'm Tamilarasan, a passionate and driven software
                developer who recently completed my undergraduate studies. I
                enjoy exploring the intersections of programming, machine
                learning, and real-world problem solving.
              </p>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: "oklch(0.73 0.04 250)" }}
              >
                My journey in tech began with curiosity and has grown into a
                dedicated pursuit of building impactful, intelligent software
                solutions.
              </p>

              <div
                className="rounded-xl p-5 gradient-border"
                style={{ background: "oklch(0.12 0.03 258)" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-2.5 rounded-lg mt-0.5 flex-shrink-0"
                    style={{ background: "oklch(0.82 0.15 200 / 0.15)" }}
                  >
                    <GraduationCap size={20} style={{ color: "#33D6FF" }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-1"
                      style={{ color: "#33D6FF" }}
                    >
                      Education
                    </p>
                    <p
                      className="font-semibold mb-0.5"
                      style={{ color: "oklch(0.95 0.02 250)" }}
                    >
                      Bachelor of Science — Computer Science
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "oklch(0.73 0.04 250)" }}
                    >
                      Sankara College of Science and Commerce, Coimbatore
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "oklch(0.55 0.04 250)" }}
                    >
                      Under Graduate — Completed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
const SKILLS = [
  {
    name: "Java",
    level: 85,
    icon: Braces,
    desc: "Object-oriented programming, data structures, Spring ecosystem",
  },
  {
    name: "Python",
    level: 90,
    icon: Terminal,
    desc: "Data analysis, ML libraries, scripting and automation",
  },
  {
    name: "C",
    level: 78,
    icon: Cpu,
    desc: "Low-level programming, memory management, system fundamentals",
  },
  {
    name: "C++",
    level: 80,
    icon: Code2,
    desc: "OOP concepts, STL, competitive programming",
  },
];

function Skills() {
  const ref = useFadeUp();
  return (
    <section
      id="skills"
      className="py-24 px-6"
      style={{ background: "oklch(0.07 0.02 260)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="fade-up">
          <p className="section-label mb-3">What I work with</p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-14"
            style={{ color: "oklch(0.95 0.02 250)" }}
          >
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SKILLS.map((skill, i) => (
              <SkillCard key={skill.name} skill={skill} delay={i * 120} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillCard({
  skill,
  delay,
}: { skill: (typeof SKILLS)[number]; delay: number }) {
  const Icon = skill.icon;
  return (
    <div
      className="rounded-2xl p-6 card-hover gradient-border"
      style={{ background: "oklch(0.12 0.03 258)" }}
      data-ocid="skills.card"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.82 0.15 200 / 0.2), oklch(0.60 0.25 310 / 0.2))",
        }}
      >
        <Icon size={22} style={{ color: "#33D6FF" }} />
      </div>
      <h3
        className="text-lg font-bold mb-1"
        style={{ color: "oklch(0.95 0.02 250)" }}
      >
        {skill.name}
      </h3>
      <p
        className="text-xs mb-4 leading-relaxed"
        style={{ color: "oklch(0.60 0.04 250)" }}
      >
        {skill.desc}
      </p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: "#33D6FF" }}>
          Proficiency
        </span>
        <span
          className="text-xs font-semibold"
          style={{ color: "oklch(0.73 0.04 250)" }}
        >
          {skill.level}%
        </span>
      </div>
      <SkillBar level={skill.level} delay={delay} />
    </div>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function Projects() {
  const ref = useFadeUp();
  return (
    <section
      id="projects"
      className="py-24 px-6"
      style={{ background: "oklch(0.09 0.025 258)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="fade-up">
          <p className="section-label mb-3">What I've built</p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-14"
            style={{ color: "oklch(0.95 0.02 250)" }}
          >
            Featured <span className="gradient-text">Project</span>
          </h2>

          <div
            className="rounded-2xl overflow-hidden gradient-border card-hover"
            style={{ background: "oklch(0.12 0.03 258)" }}
            data-ocid="projects.card"
          >
            <div className="grid md:grid-cols-5">
              {/* Visual block */}
              <div
                className="md:col-span-2 flex items-center justify-center p-10"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.10 0.04 260) 0%, oklch(0.12 0.06 280) 100%)",
                }}
              >
                <div className="text-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.82 0.15 200 / 0.2), oklch(0.60 0.25 310 / 0.3))",
                      boxShadow: "0 0 40px oklch(0.82 0.15 200 / 0.2)",
                    }}
                  >
                    <FlaskConical size={36} style={{ color: "#33D6FF" }} />
                  </div>
                  <p
                    className="text-xs font-medium uppercase tracking-widest"
                    style={{ color: "oklch(0.55 0.04 250)" }}
                  >
                    ML · NLP
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-3 p-8">
                <p className="section-label mb-2">Featured Project</p>
                <h3
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ color: "oklch(0.95 0.02 250)" }}
                >
                  Fake News Detection
                </h3>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "oklch(0.73 0.04 250)" }}
                >
                  A machine learning based system that detects and classifies
                  fake news articles using NLP techniques including text
                  preprocessing, feature extraction, and classification
                  algorithms. Built to combat misinformation in digital media by
                  providing accurate, real-time classification of news content.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Python",
                    "Machine Learning",
                    "NLP",
                    "Scikit-learn",
                    "Pandas",
                  ].map((tag) => (
                    <Badge
                      key={tag}
                      className="text-xs font-medium px-3 py-1"
                      style={{
                        background: "oklch(0.82 0.15 200 / 0.1)",
                        color: "#33D6FF",
                        border: "1px solid oklch(0.82 0.15 200 / 0.3)",
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Languages ────────────────────────────────────────────────────────────────
const LANGUAGES = [
  { name: "English", flag: "🇬🇧", level: "Fluent" },
  { name: "Tamil", flag: "🇮🇳", level: "Native" },
  { name: "Malayalam", flag: "🇮🇳", level: "Conversational" },
];

function Languages() {
  const ref = useFadeUp();
  return (
    <section
      id="languages"
      className="py-24 px-6"
      style={{ background: "oklch(0.07 0.02 260)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div ref={ref} className="fade-up">
          <p className="section-label mb-3">Communication</p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-14"
            style={{ color: "oklch(0.95 0.02 250)" }}
          >
            Languages <span className="gradient-text">Known</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.name}
                className="flex flex-col items-center rounded-2xl px-10 py-8 card-hover gradient-border"
                style={{
                  background: "oklch(0.12 0.03 258)",
                  minWidth: "180px",
                }}
                data-ocid="languages.card"
              >
                <span className="text-5xl mb-4">{lang.flag}</span>
                <p
                  className="font-bold text-lg mb-1"
                  style={{ color: "oklch(0.95 0.02 250)" }}
                >
                  {lang.name}
                </p>
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#A855F7" }}
                >
                  {lang.level}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const ref = useFadeUp();
  return (
    <section
      id="contact"
      className="py-24 px-6"
      style={{ background: "oklch(0.09 0.025 258)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div ref={ref} className="fade-up">
          <p className="section-label mb-3">Let's connect</p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-14"
            style={{ color: "oklch(0.95 0.02 250)" }}
          >
            Get In <span className="gradient-text">Touch</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <a
              href="mailto:tamilarasancbscit2025@sankara.ac.in"
              className="flex items-center gap-5 rounded-2xl p-7 card-hover gradient-border no-underline"
              style={{ background: "oklch(0.12 0.03 258)" }}
              data-ocid="contact.email.button"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "oklch(0.82 0.15 200 / 0.15)",
                  boxShadow: "0 0 20px oklch(0.82 0.15 200 / 0.2)",
                }}
              >
                <Mail size={24} style={{ color: "#33D6FF" }} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: "oklch(0.55 0.04 250)" }}
                >
                  Email
                </p>
                <p
                  className="font-semibold text-sm break-all"
                  style={{ color: "oklch(0.95 0.02 250)" }}
                >
                  tamilarasancbscit2025@sankara.ac.in
                </p>
              </div>
            </a>

            <a
              href="tel:9790373167"
              className="flex items-center gap-5 rounded-2xl p-7 card-hover gradient-border no-underline"
              style={{ background: "oklch(0.12 0.03 258)" }}
              data-ocid="contact.phone.button"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "oklch(0.60 0.25 310 / 0.15)",
                  boxShadow: "0 0 20px oklch(0.60 0.25 310 / 0.2)",
                }}
              >
                <Phone size={24} style={{ color: "#A855F7" }} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: "oklch(0.55 0.04 250)" }}
                >
                  Mobile
                </p>
                <p
                  className="font-semibold text-xl"
                  style={{ color: "oklch(0.95 0.02 250)" }}
                >
                  9790373167
                </p>
              </div>
            </a>
          </div>

          <div
            className="mt-10 rounded-2xl p-8 text-center gradient-border"
            style={{ background: "oklch(0.12 0.03 258)" }}
          >
            <Globe
              size={32}
              className="mx-auto mb-4"
              style={{ color: "#33D6FF" }}
            />
            <p
              className="text-lg font-semibold mb-2"
              style={{ color: "oklch(0.95 0.02 250)" }}
            >
              Open to Opportunities
            </p>
            <p
              className="text-sm leading-relaxed max-w-lg mx-auto"
              style={{ color: "oklch(0.65 0.04 250)" }}
            >
              I'm actively looking for exciting roles in software development
              and ML engineering. Feel free to reach out via email or phone —
              I'd love to connect!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="py-8 px-6 text-center"
      style={{
        background: "oklch(0.07 0.02 260)",
        borderTop: "1px solid oklch(0.20 0.03 258)",
      }}
    >
      <p className="text-sm" style={{ color: "oklch(0.50 0.04 250)" }}>
        © {year} TAMILARASAN. Built with{" "}
        <span style={{ color: "#A855F7" }}>♥</span> using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#33D6FF" }}
          className="hover:underline"
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}

// ─── Scroll To Top ────────────────────────────────────────────────────────────
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible ? (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #33D6FF, #A855F7)",
        boxShadow: "0 0 25px oklch(0.82 0.15 200 / 0.4)",
      }}
      data-ocid="scroll_top.button"
      aria-label="Scroll to top"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <ChevronUp size={20} style={{ color: "oklch(0.07 0.02 260)" }} />
    </button>
  ) : null;
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      className="min-h-screen font-poppins"
      style={{ background: "oklch(0.07 0.02 260)" }}
    >
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Languages />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
