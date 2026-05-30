import ContactForm from "@/components/contact-form";

const features = [
  { icon: "🤖", title: "Atlas AI Asistan",    desc: "Piyasa analizi, değerleme ve mahalle raporu — yapay zeka destekli." },
  { icon: "⚖️", title: "Hukuki Danışmanlık",  desc: "Tapu, ipotek, imar hukuku — platform içi avukat ağı." },
  { icon: "🏦", title: "Kredi & Sigorta",      desc: "BDDK uyumlu kredi, DASK ve konut sigortası tek tıkla." },
  { icon: "🔨", title: "Canlı Müzayede",       desc: "Gerçek zamanlı teklif sistemi, anlık bildirimler." },
  { icon: "🎨", title: "Beyaz Etiket Panel",   desc: "Kendi markanızla subdomain ve özelleştirilebilir panel." },
  { icon: "🌍", title: "TR & UK Pazarı",       desc: "Türkiye ve İngiltere'de entegre gayrimenkul ekosistemi." },
];

export default function HomePage() {
  return (
    <>
      <style>{`
        @keyframes sevenReveal {
          0%   { opacity: 0; transform: translateY(40px) scale(0.85); }
          60%  { opacity: 1; transform: translateY(-6px) scale(1.03); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes filReveal {
          0%   { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes fadeUp {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.08); opacity: 0.85; }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1; }
        }
        .seven {
          display: inline-block;
          font-family: Georgia, serif;
          font-size: clamp(96px, 18vw, 180px);
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(90deg, #f5c842 0%, #ffe97a 40%, #f5c842 60%, #c9991a 100%);
          background-size: 400px 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: sevenReveal 0.9s cubic-bezier(0.22,1,0.36,1) both,
                     shimmer 3s linear 1s infinite;
        }
        .fil {
          display: inline-block;
          font-family: Georgia, serif;
          font-size: clamp(96px, 18vw, 180px);
          font-weight: 900;
          line-height: 1;
          color: #fff;
          animation: filReveal 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s both;
        }
        .coming-soon-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(245,200,66,0.12);
          border: 1px solid rgba(245,200,66,0.35);
          border-radius: 100px;
          padding: 8px 20px;
          font-size: 13px;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          animation: fadeUp 0.6s ease both;
        }
        .coming-dot {
          width: 7px;
          height: 7px;
          background: var(--gold);
          border-radius: 50%;
          animation: dotBlink 1.4s ease-in-out infinite;
        }
        .tagline {
          animation: fadeUp 0.7s ease 0.5s both;
        }
        .subtext {
          animation: fadeUp 0.7s ease 0.7s both;
        }
        .stat-card {
          animation: fadeUp 0.7s ease 0.9s both;
        }
        .feature-grid {
          animation: fadeUp 0.7s ease 1s both;
        }
        .contact-section {
          animation: fadeUp 0.7s ease 1.1s both;
        }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        background: "var(--ink)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(245,200,66,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Coming Soon badge */}
        <div className="coming-soon-badge" style={{ marginBottom: 40 }}>
          <span className="coming-dot" />
          Yakında Geliyor
        </div>

        {/* Logo */}
        <div style={{ marginBottom: 28, lineHeight: 1 }}>
          <span className="seven">7</span>
          <span className="fil">fil</span>
        </div>

        {/* Tagline */}
        <h2 className="tagline" style={{
          fontSize: "clamp(16px, 3vw, 22px)",
          fontWeight: 400,
          color: "rgba(255,255,255,0.75)",
          margin: "0 0 16px",
          letterSpacing: "0.02em",
        }}>
          Türkiye &amp; UK&apos;nin Entegre Gayrimenkul Ekosistemi
        </h2>

        <p className="subtext" style={{
          maxWidth: 560,
          color: "rgba(255,255,255,0.4)",
          fontSize: 15,
          lineHeight: 1.7,
          margin: "0 0 48px",
        }}>
          İlan, hukuk, finans, müzayede, değerleme ve yapay zeka — tek platformda.
          Ajanslar için tam SaaS çözümü. Beta erişimi için kaydolun.
        </p>

        {/* Stats */}
        <div className="stat-card" style={{
          display: "flex",
          gap: 0,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 64,
        }}>
          {[
            { num: "Eylül 2025", label: "Lansman" },
            { num: "1.000",      label: "Kurucu Ajans" },
            { num: "TR + UK",    label: "Pazar" },
          ].map((s, i, arr) => (
            <div key={s.label} style={{
              padding: "20px 36px",
              borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              background: "rgba(255,255,255,0.03)",
            }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>
                {s.num}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Down arrow */}
        <a href="#iletisim" style={{
          color: "rgba(255,255,255,0.2)",
          fontSize: 22,
          textDecoration: "none",
          animation: "pulse 2s ease-in-out infinite",
        }}>
          ↓
        </a>
      </div>

      {/* ── Özellikler ── */}
      <div className="feature-grid" style={{ background: "var(--ink)", padding: "72px 32px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, color: "#fff" }}>
              Tek Platformda Her Şey
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", marginTop: 8, fontSize: 15 }}>
              Sahibinden, Rightmove ve Zoopla&apos;nın ötesinde — entegre ekosistem
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "24px 22px",
                transition: "border-color 0.2s",
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── İletişim / Bekleme Listesi ── */}
      <div id="iletisim" className="contact-section" style={{
        background: "linear-gradient(180deg, var(--ink) 0%, #0f0f1e 100%)",
        padding: "80px 32px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(45,212,191,0.1)",
            border: "1px solid rgba(45,212,191,0.25)",
            borderRadius: 100,
            padding: "6px 16px",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--teal)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}>
            Ajanslar & Kurumsal
          </div>

          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(24px, 5vw, 36px)",
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 14px",
            lineHeight: 1.25,
          }}>
            Kurucu Ajans Olun
          </h2>

          <p style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 15,
            lineHeight: 1.7,
            margin: "0 0 12px",
          }}>
            Eylül lansmanında <strong style={{ color: "var(--gold)" }}>1.000 ₺ hoşgeldin kredisi</strong> ile
            platforma ücretsiz katılın. İlk 1.000 ajansa özel kurucu fiyatı geçerlidir.
          </p>

          <p style={{ margin: "0 0 40px" }}>
            <a
              href="mailto:info@7fil.com.tr"
              style={{
                color: "var(--teal)",
                fontSize: 14,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              info@7fil.com.tr
            </a>
          </p>

          <ContactForm />
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        background: "#0a0a14",
        padding: "28px 32px",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: 20,
          fontWeight: 700,
          color: "var(--gold)",
          marginBottom: 8,
        }}>
          7fil
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          © 2025 7fil. Tüm hakları saklıdır. &nbsp;·&nbsp; info@7fil.com.tr
        </div>
      </div>
    </>
  );
}
