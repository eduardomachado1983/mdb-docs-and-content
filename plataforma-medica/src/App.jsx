import React, { useState, useRef, useCallback, useEffect } from "react";

/* ============================================================
   DESIGN SYSTEM — iOS 27 / iPadOS 27 / macOS 27 Golden Gate
   Liquid Glass refinado · SF Pro · HIG 2026
   ============================================================ */
const SF      = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Helvetica, Arial, sans-serif`;
const SF_MONO = `"SF Mono", ui-monospace, "JetBrains Mono", Menlo, monospace`;

/* ── Paleta ── */
const C = {
  /* Backgrounds */
  bg:            "#F2F2F7",   // systemBackground iOS 27
  bgAlt:         "#E5E5EA",   // secondarySystemBackground
  bgTertiary:    "#FFFFFF",   // tertiarySystemBackground
  panel:         "#FFFFFF",
  panelGlass:    "rgba(255,255,255,0.80)",

  /* Labels */
  ink:           "#000000",   // label
  inkSoft:       "#3C3C43",   // secondaryLabel (opacity .6 over white)
  inkTertiary:   "#787880",   // tertiaryLabel
  inkQuaternary: "#C7C7CC",   // quaternaryLabel

  /* Separators */
  line:          "rgba(60,60,67,0.12)",  // separator
  lineSoft:      "rgba(60,60,67,0.06)",  // opaqueSeparator

  /* Accent — SystemMint (mantido da identidade Sua Logo) */
  primary:       "#00BA84",
  primarySoft:   "rgba(0,186,132,0.12)",
  primaryDark:   "#009E70",
  primaryGlass:  "rgba(0,186,132,0.18)",

  /* System colours */
  blue:          "#007AFF",
  blueSoft:      "rgba(0,122,255,0.10)",
  amber:         "#FF9F0A",
  amberSoft:     "rgba(255,159,10,0.10)",
  red:           "#FF3B30",
  redSoft:       "rgba(255,59,48,0.10)",
  sage:          "#34C759",
  sageSoft:      "rgba(52,199,89,0.12)",
  purple:        "#AF52DE",
  purpleSoft:    "rgba(175,82,222,0.10)",

  /* Fill (iOS 27 fill colours) */
  fill:          "rgba(120,120,128,0.20)",
  fillSecondary: "rgba(120,120,128,0.16)",
  fillTertiary:  "rgba(120,120,128,0.12)",
};

/* ── Raios — iOS 27 cantos mais arredondados e consistentes ── */
const RADIUS = {
  xs:   8,
  sm:   12,
  md:   14,   // inputs, chips
  lg:   20,   // cards
  xl:   28,   // modais, sheets
  pill: 9999,
};

/* ── Hit target mínimo Apple HIG ── */
const HIT_MIN = 44;

/* ── Liquid Glass refinado (iOS/macOS 27)
       Contraste melhorado, bordas com gradiente, sombra com profundidade ── */
const glass = {
  background:           "rgba(255,255,255,0.72)",
  WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.05)",
  backdropFilter:       "blur(40px) saturate(200%) brightness(1.05)",
  border:               "1px solid rgba(255,255,255,0.55)",
  boxShadow:            [
    "0 2px  0  0 rgba(255,255,255,0.60) inset",   /* highlight topo */
    "0 -1px 0  0 rgba(0,0,0,0.04) inset",          /* borda base */
    "0 8px 32px -8px rgba(0,0,0,0.10)",             /* sombra suave */
    "0 1px  3px  0   rgba(0,0,0,0.06)",             /* sombra próxima */
  ].join(", "),
};

/* Glass mais opaco para cards de conteúdo */
const glassPanel = {
  background:           "rgba(255,255,255,0.82)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
  backdropFilter:       "blur(40px) saturate(180%)",
  border:               "1px solid rgba(255,255,255,0.60)",
  boxShadow:            [
    "0 2px  0  0 rgba(255,255,255,0.80) inset",
    "0 1px  0  0 rgba(0,0,0,0.04) inset",
    "0 4px 24px -6px rgba(0,0,0,0.08)",
    "0 1px  4px  0   rgba(0,0,0,0.05)",
  ].join(", "),
};

/* ── Escala tipográfica SF Pro (HIG 2026) ── */
const TYPE = {
  largeTitle:  { fontSize: 34, fontWeight: 700, letterSpacing: "-0.4px", lineHeight: "41px" },
  title1:      { fontSize: 28, fontWeight: 700, letterSpacing: "-0.3px", lineHeight: "34px" },
  title2:      { fontSize: 22, fontWeight: 700, letterSpacing: "-0.2px", lineHeight: "28px" },
  title3:      { fontSize: 20, fontWeight: 600, letterSpacing: "-0.1px", lineHeight: "25px" },
  headline:    { fontSize: 17, fontWeight: 600, letterSpacing:  "0px",   lineHeight: "22px" },
  body:        { fontSize: 17, fontWeight: 400, letterSpacing:  "0px",   lineHeight: "22px" },
  callout:     { fontSize: 16, fontWeight: 400, letterSpacing:  "0px",   lineHeight: "21px" },
  subhead:     { fontSize: 15, fontWeight: 400, letterSpacing:  "0px",   lineHeight: "20px" },
  footnote:    { fontSize: 13, fontWeight: 400, letterSpacing:  "0px",   lineHeight: "18px" },
  caption1:    { fontSize: 12, fontWeight: 400, letterSpacing:  "0px",   lineHeight: "16px" },
  caption2:    { fontSize: 11, fontWeight: 400, letterSpacing:  "0.07px",lineHeight: "13px" },
};

/* ── Sombras iOS 27 (mais refinadas e com profundidade) ── */
const SHADOW = {
  xs:  "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  sm:  "0 2px 8px -2px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
  md:  "0 4px 16px -4px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
  lg:  "0 8px 28px -6px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
  xl:  "0 16px 48px -8px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)",
};

/* ============================================================
   TOAST SYSTEM
   ============================================================ */
const ToastCtx = React.createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const push = useCallback((message, variant = "info") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4800);
  }, []);

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div style={{
        position: "fixed", top: 16, left: "50%", zIndex: 9999,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        width: "100%", maxWidth: 420, padding: "0 16px", transform: "translateX(-50%)",
        pointerEvents: "none"
      }}>
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function useToast() {
  return React.useContext(ToastCtx);
}

function Toast({ toast, onClose }) {
  const variants = {
    error: { icon: "✕", iconBg: C.red },
    warn: { icon: "!", iconBg: C.amber },
    success: { icon: "✓", iconBg: C.sage },
    info: { icon: "i", iconBg: C.primary },
  };
  const v = variants[toast.variant] || variants.info;
  return (
    <div
      role="status"
      style={{
        background: "rgba(255,255,255,0.82)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        backdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(0,0,0,0.05)",
        borderRadius: RADIUS.pill,
        padding: "10px 18px 10px 10px",
        display: "flex",
        gap: 10,
        alignItems: "center",
        boxShadow: "0 12px 28px -8px rgba(0,0,0,0.18), 0 2px 8px -2px rgba(0,0,0,0.08)",
        animation: "toastIn 0.45s cubic-bezier(.34,1.4,.4,1)",
        pointerEvents: "auto",
        maxWidth: "100%",
        width: "fit-content",
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: "50%", background: v.iconBg, color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700, flexShrink: 0, fontFamily: SF
      }}>{v.icon}</div>
      <div style={{ flex: 1, fontSize: 13.5, lineHeight: 1.4, color: C.ink, fontFamily: SF, fontWeight: 500 }}>
        {toast.message}
      </div>
      <button
        onClick={onClose}
        aria-label="Fechar notificação"
        style={{
          background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", color: C.inkSoft,
          fontSize: 11, padding: 0, lineHeight: 1, flexShrink: 0,
          width: 20, height: 20, borderRadius: "50%", display: "flex",
          alignItems: "center", justifyContent: "center"
        }}
      >✕</button>
    </div>
  );
}

/* ============================================================
   VALIDATION HELPERS
   ============================================================ */
function validCPF(cpf) {
  const digits = (cpf || "").replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rev = (sum * 10) % 11;
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rev = (sum * 10) % 11;
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(digits[10]);
}

function maskCPF(v) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.replace(/(\d{0,2})/, "($1");
  if (d.length <= 7) return d.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

function maskDate(v) {
  return v.replace(/\D/g, "").slice(0, 8)
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
}

function isAdult(dateStr) {
  const m = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return false;
  const [, dd, mm, yyyy] = m;
  const birth = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
  if (birth.getMonth() !== parseInt(mm) - 1) return false;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const md = today.getMonth() - birth.getMonth();
  if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 18 && age < 130;
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function countWords(v) {
  return v.trim().split(/\s+/).filter(Boolean).length;
}

/* ============================================================
   SHARED UI PRIMITIVES
   ============================================================ */
function Field({ label, hint, error, children, required, style }) {
  return (
    <div style={{ marginBottom: 18, ...style }}>
      <label style={{
        display: "block", fontSize: 13, fontWeight: 600, color: C.ink,
        marginBottom: 6, fontFamily: SF
      }}>
        {label}{required && <span style={{ color: C.red }}> *</span>}
      </label>
      {children}
      {hint && !error && (
        <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 5 }}>{hint}</div>
      )}
      {error && (
        <div style={{ fontSize: 12, color: C.red, marginTop: 5, fontWeight: 500 }}>{error}</div>
      )}
    </div>
  );
}

const inputBase = {
  width: "100%",
  minHeight: HIT_MIN,
  padding: "12px 16px",
  fontSize: 17,            // Body — Apple HIG
  fontFamily: SF,
  fontWeight: 400,
  border: `1.5px solid ${C.line}`,
  borderRadius: RADIUS.md,
  outline: "none",
  background: C.fillTertiary,   /* iOS 27: fills em vez de branco puro */
  color: C.ink,
  boxSizing: "border-box",
  transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
  WebkitAppearance: "none",
  appearance: "none",
};

function TextInput(props) {
  const { error, style, ...rest } = props;
  const [focus, setFocus] = useState(false);
  return (
    <input
      {...rest}
      onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
      onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
      style={{
        ...inputBase,
        background: focus ? "#fff" : C.fillTertiary,
        borderColor: error ? C.red : focus ? C.primary : C.line,
        boxShadow: focus
          ? `0 0 0 3.5px ${error ? "rgba(255,59,48,0.18)" : C.primaryGlass}`
          : error ? `0 0 0 3.5px rgba(255,59,48,0.10)` : "none",
        ...style,
      }}
    />
  );
}

function TextArea(props) {
  const { error, style, ...rest } = props;
  const [focus, setFocus] = useState(false);
  return (
    <textarea
      {...rest}
      onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
      onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
      style={{
        ...inputBase,
        resize: "vertical",
        minHeight: 96,
        background: focus ? "#fff" : C.fillTertiary,
        borderColor: error ? C.red : focus ? C.primary : C.line,
        boxShadow: focus ? `0 0 0 3.5px ${C.primaryGlass}` : "none",
        ...style,
      }}
    />
  );
}

function Button({ children, variant = "primary", onClick, style, full, size = "md", icon }) {
  const [pressed, setPressed] = useState(false);
  const variants = {
    primary: {
      bg: C.primary,
      color: "#fff",
      border: "transparent",
      shadow: `0 2px 8px -2px rgba(0,186,132,0.40), 0 1px 3px rgba(0,186,132,0.30)`,
    },
    ghost: {
      bg: C.primarySoft,
      color: C.primary,
      border: "transparent",
      shadow: "none",
    },
    subtle: {
      bg: C.fill,
      color: C.ink,
      border: "transparent",
      shadow: "none",
    },
    danger: {
      bg: C.red,
      color: "#fff",
      border: "transparent",
      shadow: `0 2px 8px -2px rgba(255,59,48,0.40)`,
    },
  };
  const v = variants[variant] || variants.primary;
  const sizes = {
    sm:  { padding: "8px 14px",  fontSize: 14, fontWeight: 600, borderRadius: RADIUS.sm,  minHeight: 34 },
    md:  { padding: "11px 20px", fontSize: 16, fontWeight: 600, borderRadius: RADIUS.md,  minHeight: HIT_MIN },
    lg:  { padding: "14px 24px", fontSize: 17, fontWeight: 700, borderRadius: RADIUS.md,  minHeight: HIT_MIN + 4 },
  };
  const s = sizes[size] || sizes.md;
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        width: full ? "100%" : "auto",
        background: v.bg,
        color: v.color,
        border: `1.5px solid ${v.border}`,
        boxShadow: v.shadow,
        fontFamily: SF,
        cursor: "pointer",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        opacity: pressed ? 0.88 : 1,
        transition: "transform 0.12s, opacity 0.12s, box-shadow 0.15s",
        ...s,
        ...style,
      }}
    >{icon && <span>{icon}</span>}{children}</button>
  );
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: C.fill,        color: C.inkSoft },
    primary: { bg: C.primarySoft, color: C.primaryDark },
    sage:    { bg: C.sageSoft,    color: "#1A7F37" },
    amber:   { bg: C.amberSoft,   color: "#92500A" },
    red:     { bg: C.redSoft,     color: C.red },
    blue:    { bg: C.blueSoft,    color: C.blue },
    purple:  { bg: C.purpleSoft,  color: C.purple },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: RADIUS.pill,
      background: t.bg, color: t.color,
      fontSize: 12, fontWeight: 600, fontFamily: SF,
      letterSpacing: "0.02em", whiteSpace: "nowrap",
    }}>{children}</span>
  );
}


/* ============================================================
   CUSTODY STRIP — signature element
   Shows the document's journey through the 5 gates
   ============================================================ */
const STAGES = [
  { key: "cadastro",  label: "Cadastro",  icon: "📋" },
  { key: "pagamento", label: "Pagamento", icon: "💳" },
  { key: "medico",    label: "Consulta",  icon: "🩺" },
  { key: "admin",     label: "Validação", icon: "✅" },
  { key: "liberado",  label: "Liberado",  icon: "🎉" },
];

const C_AMBER = "#B96A00";

const STATUS_MESSAGES = {
  cadastro_incompleto:    { text: "Complete seu cadastro para iniciar a consulta.", color: C_AMBER },
  aguardando_homologacao: { text: "Pagamento recebido! Seu caso está sendo preparado para o médico.", color: "#0055CC" },
  aguardando_medico:      { text: "Seu caso está com o médico. Normalmente respondemos em até 2 horas.", color: "#0055CC" },
  retido_admin:           { text: "O médico emitiu seus documentos. Aguardando validação final.", color: "#7C3AED" },
  concluido:              { text: "Tudo certo! Seus documentos estão disponíveis para download.", color: "#0B8C63" },
};

function stageIndex(status) {
  const map = {
    cadastro_incompleto: 0,
    aguardando_homologacao: 1,
    aguardando_medico: 2,
    retido_admin: 3,
    concluido: 4,
  };
  return map[status] ?? 0;
}

function CustodyStrip({ status, compact }) {
  const idx = stageIndex(status);
  const msg = STATUS_MESSAGES[status];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        {STAGES.map((s, i) => {
          const done = i < idx || status === "concluido";
          const active = i === idx && status !== "concluido";
          const isLast = i === STAGES.length - 1;
          return (
            <React.Fragment key={s.key}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: compact ? 9 : 28, height: compact ? 9 : 28, borderRadius: "50%",
                  background: done ? C.sage : active ? "#FF9F0A" : C.line,
                  border: active ? `2px solid #FF9F0A55` : "none",
                  boxShadow: active ? `0 0 0 4px rgba(255,159,10,0.15)` : "none",
                  flexShrink: 0,
                  display: compact ? "block" : "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13,
                  transition: "all 0.3s",
                }}>
                  {!compact && (done ? "✓" : active ? s.icon : "")}
                </div>
                {!compact && (
                  <span style={{
                    fontSize: 10.5, fontFamily: SF, fontWeight: active ? 700 : 500,
                    color: done ? C.sage : active ? "#B96A00" : C.inkSoft, whiteSpace: "nowrap"
                  }}>{s.label}</span>
                )}
              </div>
              {!isLast && (
                <div style={{
                  flex: 1, height: 2,
                  background: i < idx ? C.sage : C.line,
                  marginBottom: compact ? 0 : 16, minWidth: 8,
                  transition: "background 0.3s",
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {!compact && msg && (
        <div style={{
          marginTop: 12, padding: "10px 14px", borderRadius: RADIUS.md,
          background: `${msg.color}0D`, border: `1px solid ${msg.color}33`,
          fontSize: 13, fontFamily: SF, color: msg.color, lineHeight: 1.5,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>
            {status === "concluido" ? "🎉" : status === "cadastro_incompleto" ? "📝" : "ℹ️"}
          </span>
          {msg.text}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ROOT APP STATE
   A single "patient record" object flows through all 3 roles
   ============================================================ */
const emptyPatient = () => ({
  id: "PNT-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
  status: "cadastro_incompleto", // cadastro_incompleto -> aguardando_homologacao -> aguardando_medico -> retido_admin -> concluido
  personal: null,
  triage: null,
  docs: { identityUploaded: false, identityFile: null, addressUploaded: false, addressFile: null },
  payment: { confirmed: false, confirmedAt: null },
  admin: { identityApproved: false, identityRejected: false, financeApproved: false, clinicalApproved: false },
  clinical: { receita: "", laudo: "", savedByDoctor: false, savedAt: null },
  chatHistory: [],
});

/* ============================================================
   SITE CONTENT (simula tabela "conteudo_home" gerenciada pelo Admin)
   ============================================================ */
const defaultSiteContent = () => ({
  heroHeadline: "Sua consulta médica, do diagnóstico aos documentos, em um só lugar.",
  heroSubheadline: "Triagem, atendimento e emissão de receitas e laudos com validação de identidade e segurança em cada etapa.",
  steps: [
    { title: "Cadastro", text: "Preencha seus dados pessoais com segurança." },
    { title: "Triagem", text: "Conte o que está sentindo para o time médico." },
    { title: "Documentos", text: "Envie identidade e comprovante de residência." },
    { title: "Pagamento", text: "Confirme o pagamento simulado via Pix." },
  ],
});

/* ============================================================
   HASH ROUTING — #/paciente, #/medico, #/admin, #/
   ============================================================ */
function useHashRoute() {
  const getRoute = () => {
    const h = window.location.hash.replace(/^#\/?/, "");
    return h || "";
  };
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path ? `/${path}` : "/";
  }, []);

  return [route, navigate];
}

const STAFF_PROFILES = {
  medico: { nome: "Dra. Helena Vasconcelos", titulo: "Médica", crm: "CRM/SC 34344", especialidade: "Clínica Geral" },
  admin:  { nome: "Administrador", titulo: "Administrador", crm: null, especialidade: null },
};

function App() {
  const [session, setSession] = useState(null); // { role, nome, patientId? }
  const [route, navigate] = useHashRoute();
  const [patients, setPatients] = useState(() => {
    const demo = emptyPatient();
    demo.personal = {
      nome: "Eduardo Machado",
      telefone: "(48) 99999-0000",
      cpf: "001.743.300-22",
      rg: "9999999999",
      nascimento: "01/01/1990",
      email: "contato@em.art.br",
      senha: "A1234567",
      confirmarSenha: "A1234567",
    };
    demo.triage = {
      sintomas: "Dor de cabeça persistente há 3 dias, piora à tarde.",
      dorLocal: "Região frontal e temporal",
      dorIntensidade: "6",
      historico: "Sem alergias conhecidas. Não usa medicamentos regularmente.",
    };
    demo.docs = {
      identityUploaded: true,
      identityFile: "rg_eduardo.pdf",
      addressUploaded: true,
      addressFile: "comprovante_residencia.pdf",
    };
    demo.payment = { confirmed: true, method: "pix", confirmedAt: new Date().toISOString() };
    demo.status = "aguardando_homologacao";
    return [demo];
  });
  const [activePatientId, setActivePatientId] = useState(null);
  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  const [section, setSection] = useState(null);
  const [afterPayment, setAfterPayment] = useState(false);

  useEffect(() => {
    setActivePatientId((id) => id || patients[0]?.id);
  }, [patients]);

  // Sempre que o papel muda, volta para a primeira seção do menu daquele papel.
  useEffect(() => {
    if (session) {
      const first = ROLE_MENUS[session.role]?.[0]?.key || null;
      setSection(first);
    } else {
      setSection(null);
    }
  }, [session?.role]);

  const activePatient = patients.find((p) => p.id === activePatientId) || patients[0];

  const updatePatient = useCallback((id, updater) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? updater(p) : p)));
  }, []);

  const addNewPatient = () => {
    const np = emptyPatient();
    setPatients((prev) => [...prev, np]);
    setActivePatientId(np.id);
  };

  const registerAndLoginPatient = () => {
    const np = emptyPatient();
    setPatients((prev) => [...prev, np]);
    setActivePatientId(np.id);
    setSession({ role: "paciente", nome: "Novo paciente", patientId: np.id });
    navigate("paciente");
  };

  // A partir da landing, escolher um acesso leva para a tela de login daquele papel.
  const goToLogin = (role) => navigate(`login/${role}`);

  // Login simulado: valida e-mail/senha e, se ok, abre o acesso correspondente.
  const loginAs = (role, email, senha) => {
    if (!email.trim() || !senha.trim()) {
      return { ok: false, reason: "empty" };
    }
    if (!validEmail(email)) {
      return { ok: false, reason: "invalid-email" };
    }

    if (role === "paciente") {
      const match = patients.find(
        (p) => p.personal?.email?.toLowerCase() === email.toLowerCase() && p.personal?.senha === senha
      );
      if (match) {
        setActivePatientId(match.id);
        setSession({ role: "paciente", nome: match.personal.nome, patientId: match.id });
        navigate("paciente");
        return { ok: true };
      }
      return { ok: false, reason: "not-found" };
    }

    // Médico/Admin: não há cadastro no protótipo — qualquer e-mail/senha válidos entram.
    setSession({ role, nome: STAFF_PROFILES[role]?.nome || role });
    navigate(role);
    return { ok: true };
  };

  const logout = () => {
    setSession(null);
    setAfterPayment(false);
    navigate("");
  };

  const onPaymentDone = () => {
    setSession(null);
    setAfterPayment(true);
    navigate("login/paciente");
  };

  // Se a sessão existir mas a rota divergir (ex: editou a URL manualmente),
  // a sessão é a fonte da verdade e a URL é corrigida.
  useEffect(() => {
    if (session && route !== session.role && !route.startsWith("login/")) {
      navigate(session.role);
    }
  }, [route, session, navigate]);

  // Scroll ao topo em toda navegação — só mobile
  useEffect(() => {
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [route]);

  const isLoginRoute = route.startsWith("login/");
  const loginRole = isLoginRoute ? route.slice("login/".length) : null;

  if (!session) {
    if (isLoginRoute && ["paciente", "medico", "admin"].includes(loginRole)) {
      return (
        <ToastProvider>
          <GlobalStyle />
          <LoginPage
            role={loginRole}
            onLogin={(email, senha) => loginAs(loginRole, email, senha)}
            onBack={() => { setAfterPayment(false); navigate(""); }}
            showAttentionBanner={afterPayment && loginRole === "paciente"}
            onCadastrar={() => { setAfterPayment(false); registerAndLoginPatient(); }}
            onEnterAs={goToLogin}
          />
        </ToastProvider>
      );
    }
    return (
      <ToastProvider>
        <GlobalStyle />
        <LandingPage
          siteContent={siteContent}
          onStartTriagem={registerAndLoginPatient}
          onEnterAs={goToLogin}
          navigate={navigate}
        />
      </ToastProvider>
    );
  }

  const role = session.role;

  const inRegistration = role === "paciente" && activePatient?.status === "cadastro_incompleto";

  return (
    <ToastProvider>
      <div style={{
        minHeight: "100vh", background: C.bg, fontFamily: SF,
        color: C.ink, paddingBottom: 60
      }}>
        <GlobalStyle />

        {/* Um único header — LP-style durante cadastro, logado nos demais casos */}
        {inRegistration
          ? <TopNav
              session={null}
              navigate={navigate}
              onEnterAs={(role) => { logout(); navigate(`login/${role}`); }}
              onStartTriagem={registerAndLoginPatient}
              isHome={true}
              onHome={() => { logout(); navigate(""); }}
            />
          : <TopNav session={session} onLogout={logout} navigate={navigate} section={section} onSectionChange={setSection} />
        }

        <div key={role + activePatientId} style={{ animation: "fadeUp 0.3s ease" }}>
          {role === "paciente" && (
            <PatientView
              patient={activePatient}
              update={(fn) => updatePatient(activePatient.id, fn)}
              navigate={navigate}
              onEnterAs={goToLogin}
              onStartTriagem={registerAndLoginPatient}
              onPaymentDone={onPaymentDone}
              section={section}
              onSectionChange={setSection}
            />
          )}
          {role === "medico" && (
            <DoctorView
              patients={patients}
              updatePatient={updatePatient}
              section={section}
              onSectionChange={setSection}
            />
          )}
          {role === "admin" && (
            <AdminView
              patients={patients}
              updatePatient={updatePatient}
              siteContent={siteContent}
              setSiteContent={setSiteContent}
              section={section}
              onSectionChange={setSection}
            />
          )}
        </div>
      </div>
    </ToastProvider>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      *, *::before, *::after {
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }

      :root {
        --c-bg:           ${C.bg};
        --c-panel:        ${C.panel};
        --c-ink:          ${C.ink};
        --c-ink-soft:     ${C.inkSoft};
        --c-primary:      ${C.primary};
        --c-line:         ${C.line};
        --radius-md:      ${RADIUS.md}px;
        --radius-lg:      ${RADIUS.lg}px;
        --radius-xl:      ${RADIUS.xl}px;
      }

      body {
        background: ${C.bg};
        color: ${C.ink};
        font-family: ${SF};
        font-size: 17px;
        line-height: 1.47;
      }

      /* Animações iOS 27 — spring + fade */
      @keyframes toastIn {
        0%   { opacity: 0; transform: translateY(-14px) scale(0.90); }
        60%  { opacity: 1; transform: translateY(3px)  scale(1.02); }
        100% { opacity: 1; transform: translateY(0)    scale(1); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(20px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.94); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes pulse {
        0%,80%,100% { opacity:0.3; transform:scale(0.8); }
        40%          { opacity:1;   transform:scale(1); }
      }

      /* Seleção */
      ::selection { background: ${C.primaryGlass}; color: ${C.ink}; }

      /* Placeholders */
      input::placeholder, textarea::placeholder {
        color: ${C.inkQuaternary};
        font-weight: 400;
      }

      /* Tap highlight */
      button, a { -webkit-tap-highlight-color: transparent; }

      /* Scrollbar minimalista (macOS 27) */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb {
        background: ${C.fill};
        border-radius: 999px;
      }
      ::-webkit-scrollbar-thumb:hover { background: ${C.inkTertiary}; }

      /* Responsive grid helper */
      @media (max-width: 520px) {
        .detail-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}

const PAGE_TITLES = {
  paciente: "Painel do Paciente",
  medico: "",
  admin: "Painel do Administrador",
};

/* Navbar guest standalone — usada no TopNav (LP/cadastro) E no LoginPage */
function GuestNavbar({ onHome, onEnterAs, onStartTriagem, isHome = true }) {
  const [loginDropOpen, setLoginDropOpen] = useState(false);
  const items = [
    { key: "paciente", label: "Paciente" },
    { key: "medico", label: "Médico" },
    { key: "admin", label: "Administrador" },
  ];
  return (
    <div className="app-topnav" style={{
      ...glass,
      borderBottom: `1px solid ${C.line}`,
      position: "relative", zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1300, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 20, padding: "15px 80px",
      }}>
        <button onClick={onHome} style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          fontFamily: SF, fontWeight: 700, fontSize: 22, color: C.ink,
        }}>Sua Logo</button>

        <div style={{ display: "flex", alignItems: "center", gap: 48, fontSize: 16, fontWeight: 600, fontFamily: SF, flexWrap: "wrap" }}>
          <button onClick={onHome} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            color: isHome ? "#00BA84" : C.ink, fontWeight: 600, fontSize: 16, fontFamily: SF,
          }}>Home</button>
          {isHome && <a href="#sobre" style={{ color: C.ink, textDecoration: "none" }}>Sobre nós</a>}
          {isHome && <a href="#como-funciona" style={{ color: C.ink, textDecoration: "none" }}>Como funciona</a>}

          {/* Login dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setLoginDropOpen((o) => !o)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: C.ink, fontWeight: 600, fontSize: 16, fontFamily: SF }}
            >Login ▾</button>
            {loginDropOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 10px)", right: 0,
                background: "#fff", borderRadius: RADIUS.md, minWidth: 190,
                boxShadow: "0 8px 32px -8px rgba(0,0,0,0.18)",
                border: `1px solid ${C.line}`, overflow: "hidden", zIndex: 200,
              }}>
                {items.map((item) => (
                  <button key={item.key}
                    onClick={() => { onEnterAs?.(item.key); setLoginDropOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", textAlign: "left",
                      padding: "12px 18px", background: "none", border: "none",
                      cursor: "pointer", fontSize: 15, fontWeight: 600, fontFamily: SF, color: C.ink,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.primarySoft; e.currentTarget.style.color = C.primary; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = C.ink; }}
                  >
                    {ROLE_META[item.key]?.icon} {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <button onClick={() => onStartTriagem?.()} style={{
            borderRadius: 12, background: "#00BA84", color: "#fff",
            padding: "11px 20px", border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 600, fontFamily: SF, width: 157,
          }}>Primeira consulta</button>
        </div>
      </div>
    </div>
  );
}

// Itens de navegação específicos de cada papel, exibidos no menu (drawer/desktop) após login.
const ROLE_MENUS = {
  paciente: [
    { key: "dashboard", label: "Minha consulta", icon: "📋" },
    { key: "assistente", label: "Assistente", icon: "🤖" },
  ],
  medico: [
    { key: "fila", label: "Fila de atendimento", icon: "🩺" },
    { key: "pacientes", label: "Lista de pacientes", icon: "👥" },
  ],
  admin: [
    { key: "liberacao", label: "Liberação de prontuário", icon: "✅" },
    { key: "site", label: "Gerenciar site", icon: "🖥️" },
  ],
};

function TopNav({ session, onLogout, navigate, section, onSectionChange, onEnterAs, onStartTriagem, isHome = true, onHome }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth >= 640) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const roleLabel = session?.role === "medico"
    ? `${STAFF_PROFILES.medico.especialidade} · ${STAFF_PROFILES.medico.crm}`
    : { paciente: "Paciente", admin: "Administrador" }[session?.role] || "";
  const pageTitle = session ? PAGE_TITLES[session.role] : null;
  const menuItems = session ? (ROLE_MENUS[session.role] || []) : [];
  const guestAccessItems = [
    { key: "paciente", label: "Paciente" },
    { key: "medico", label: "Médico" },
    { key: "admin", label: "Administrador" },
  ];

  const goHome = () => { navigate(""); setMenuOpen(false); };
  const doLogout = () => { onLogout?.(); setMenuOpen(false); };
  const effectiveGoHome = onHome ? () => { onHome(); setMenuOpen(false); } : goHome;
  const selectSection = (key) => {
    onSectionChange?.(key);
    setMenuOpen(false);
    requestAnimationFrame(() => {
      document.getElementById(key)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const chooseAccess = (key) => { onEnterAs?.(key); setMenuOpen(false); };

  /* ---- GUEST DESKTOP — usa GuestNavbar standalone ---- */
  const GuestDesktopNav = () => (
    <GuestNavbar
      onHome={effectiveGoHome}
      onEnterAs={onEnterAs}
      onStartTriagem={onStartTriagem}
      isHome={isHome}
    />
  );

  /* ---- LOGGED-IN DESKTOP — layout da imagem ---- */
  const LoggedDesktopNav = () => {
    const initials = (session?.nome || "?").split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
    const roleSubtitle = {
      paciente: `CPF ${session?.cpf || ""}`,
      medico: "Médico CRM 34344",
      admin: "Administrador",
    }[session?.role] || roleLabel;

    return (
      <div className="app-topnav" style={{
        borderBottom: `1px solid rgba(0,186,132,0.12)`,
        background: "rgba(255,255,255,0.75)", WebkitBackdropFilter: "blur(40px) saturate(200%)", backdropFilter: "blur(40px) saturate(200%)",
        position: "relative", zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1300, margin: "0 auto", padding: "12px 80px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24
        }}>
          {/* Logo */}
          <button onClick={goHome} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            fontFamily: SF, fontWeight: 700, fontSize: 22, color: C.ink,
            letterSpacing: "-0.01em", flexShrink: 0, minHeight: HIT_MIN,
            display: "flex", alignItems: "center"
          }}>
            Sua Logo
          </button>

          {/* Nav central — links sem pill */}
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {menuItems.map((item) => {
              const active = section === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => selectSection(item.key)}
                  aria-current={active ? "page" : undefined}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: "4px 0",
                    fontSize: 15, fontWeight: 700, fontFamily: SF,
                    color: active ? "#00BA84" : C.ink,
                    borderBottom: active ? "2px solid #00BA84" : "2px solid transparent",
                    transition: "color 0.15s",
                    whiteSpace: "nowrap", minHeight: HIT_MIN, display: "flex", alignItems: "center"
                  }}
                >{item.label}</button>
              );
            })}
          </nav>

          {/* Usuário + sair */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
              background: C.primarySoft, border: `2px solid ${C.primary}22`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: SF, fontWeight: 700, fontSize: 14, color: C.primary,
            }}>{initials}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: SF, color: C.ink, lineHeight: 1.2 }}>
                {session?.nome}
              </div>
              <div style={{ fontSize: 11.5, color: C.inkSoft, fontFamily: SF, marginTop: 1 }}>
                {roleLabel}
              </div>
            </div>
            <button
              onClick={doLogout}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "none", border: "none", cursor: "pointer",
                fontFamily: SF, fontWeight: 700, fontSize: 14, color: C.ink,
                minHeight: HIT_MIN, padding: "0 4px", marginLeft: 8,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sair
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {!isMobile ? (
        session ? <LoggedDesktopNav /> : <GuestDesktopNav />
      ) : (
        /* ---- MOBILE: barra topo ---- */
        <div className="app-topnav" style={{
          borderBottom: `1px solid rgba(0,186,132,0.12)`,
          background: "rgba(255,255,255,0.75)", WebkitBackdropFilter: "blur(40px) saturate(200%)", backdropFilter: "blur(40px) saturate(200%)",
          position: "relative", zIndex: 100,
        }}>
          <div style={{
            padding: "12px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12
          }}>
            {/* Logo */}
            <button onClick={effectiveGoHome} style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              fontFamily: SF, fontWeight: 700, fontSize: 18, color: C.ink,
              minHeight: HIT_MIN, display: "flex", alignItems: "center", flexShrink: 0
            }}>
              Sua Logo
            </button>

            {/* Hambúrguer */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              style={{
                width: HIT_MIN, height: HIT_MIN, borderRadius: RADIUS.sm, border: "none",
                background: "rgba(0,186,132,0.10)", cursor: "pointer",
                color: C.ink, fontSize: 19, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >☰</button>
          </div>
        </div>
      )}

      {isMobile && (
        <MobileDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          session={session}
          menuItems={menuItems}
          roleLabel={roleLabel}
          pageTitle={pageTitle}
          section={section}
          onLogout={doLogout}
          onGoHome={effectiveGoHome}
          onSelectSection={selectSection}
          onEnterAs={onEnterAs}
          onStartTriagem={onStartTriagem}
          isHome={isHome}
        />
      )}
    </>
  );
}

function MobileDrawer({ open, onClose, session, menuItems, roleLabel, pageTitle, section, onLogout, onGoHome, onSelectSection, onEnterAs, onStartTriagem, isHome = true }) {
  const guestAccessItems = [
    { key: "paciente", label: "Paciente", icon: "🧑‍🦰" },
    { key: "medico", label: "Médico", icon: "🩺" },
    { key: "admin", label: "Administrador", icon: "🛡️" },
  ];
  const chooseAccess = (key) => { onEnterAs?.(key); onClose(); };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 199,
          background: "rgba(0,0,0,0.32)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 200,
        width: "82%", maxWidth: 320,
        background: session ? "rgba(244,252,251,0.98)" : "rgba(255,255,255,0.95)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        backdropFilter: "blur(24px) saturate(180%)",
        boxShadow: "-8px 0 32px -8px rgba(0,0,0,0.15)",
        borderLeft: "1px solid rgba(0,186,132,0.12)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.32s cubic-bezier(.32,.94,.6,1)",
        display: "flex", flexDirection: "column", padding: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <button onClick={onGoHome} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            fontFamily: SF, fontWeight: 700, fontSize: 18, color: C.ink
          }}>Sua Logo</button>
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            style={{
              width: 40, height: 40, borderRadius: RADIUS.sm, border: "none",
              background: "rgba(0,186,132,0.10)", cursor: "pointer", color: C.ink, fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >✕</button>
        </div>

        {session && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 14px", borderRadius: RADIUS.md, background: C.primarySoft, marginBottom: 18
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
              background: "#fff", border: `2px solid ${C.primary}22`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: SF, fontWeight: 700, fontSize: 14, color: C.primary,
            }}>
              {(session.nome || "?").split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: SF, color: C.ink }}>{session.nome}</div>
              <div style={{ fontSize: 11.5, color: C.inkSoft, fontWeight: 500, marginTop: 1 }}>{roleLabel}</div>
            </div>
          </div>
        )}

        {session && menuItems.length > 0 && (session?.role === "admin" || session?.role === "medico") && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
              Navegação
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 20 }}>
              {menuItems.map((item) => {
                const active = section === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => onSelectSection(item.key)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "13px 14px",
                      borderRadius: RADIUS.md, minHeight: HIT_MIN, border: "none", cursor: "pointer",
                      background: active ? "rgba(0,186,132,0.08)" : "transparent",
                      color: active ? "#00BA84" : C.ink,
                      fontWeight: 700, fontSize: 15, fontFamily: SF, textAlign: "left",
                      borderLeft: active ? "3px solid #00BA84" : "3px solid transparent",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {session?.role !== "admin" && session?.role !== "medico" && (
          <button onClick={onGoHome} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
            borderRadius: RADIUS.md, minHeight: HIT_MIN, background: "transparent", border: "none",
            color: C.ink, fontWeight: 600, fontSize: 15, fontFamily: SF, cursor: "pointer", textAlign: "left"
          }}>
            <span style={{ fontSize: 18 }}>🏠</span> Página inicial
          </button>
        )}

        {!session && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8, marginTop: 16 }}>
              Acessar a plataforma
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
              {guestAccessItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => chooseAccess(item.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                    borderRadius: RADIUS.md, minHeight: HIT_MIN, border: "none", cursor: "pointer",
                    background: "transparent", color: C.ink,
                    fontWeight: 600, fontSize: 15, fontFamily: SF, textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}

        {!session && isHome && onStartTriagem && (
          <button
            onClick={() => { onStartTriagem(); onClose(); }}
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 12, border: "none",
              background: "#00BA84", color: "#fff", fontFamily: SF,
              fontWeight: 700, fontSize: 15, cursor: "pointer", minHeight: HIT_MIN,
              marginTop: 8,
            }}
          >Iniciar minha consulta →</button>
        )}

        <div style={{ flex: 1 }} />

        {session && (
          <button
            onClick={onLogout}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "13px 16px", borderRadius: RADIUS.md,
              background: "none", border: `1.5px solid ${C.line}`,
              cursor: "pointer", fontFamily: SF, fontWeight: 700, fontSize: 15, color: C.ink,
              minHeight: HIT_MIN,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sair
          </button>
        )}
      </div>
    </>
  );
}

function PatientSwitcher({ patients, activeId, setActiveId, onAdd }) {
  return (
    <div style={{
      display: "flex", gap: 8, alignItems: "center", padding: "16px 0",
      overflowX: "auto", flexWrap: "wrap"
    }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: C.inkSoft, marginRight: 4 }}>
        Pacientes simulados:
      </span>
      {patients.map((p) => (
        <button
          key={p.id}
          onClick={() => setActiveId(p.id)}
          style={{
            padding: "6px 12px", borderRadius: 999, border: `1.5px solid ${p.id === activeId ? C.primary : C.line}`,
            background: p.id === activeId ? C.primarySoft : "#fff",
            color: p.id === activeId ? C.primary : C.inkSoft,
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: SF_MONO
          }}
        >
          {p.personal?.nome ? p.personal.nome.split(" ")[0] : p.id}
        </button>
      ))}
      <button
        onClick={onAdd}
        style={{
          padding: "6px 12px", borderRadius: 999, border: `1.5px dashed ${C.line}`,
          background: "transparent", color: C.inkSoft, fontSize: 12, fontWeight: 600, cursor: "pointer"
        }}
      >+ novo paciente</button>
    </div>
  );
}

/* ============================================================
   LANDING PAGE — RF01: vitrine + login único
   ============================================================ */
/* ============================================================
   LOGIN PAGE — tela de login simulado por papel
   ============================================================ */
const ROLE_META = {
  paciente: { label: "Paciente", icon: "🧑‍🦰", desc: "Acesse seu cadastro, triagem e documentos." },
  medico: { label: "Médico", icon: "🩺", desc: "Acesse a fila de atendimento e o prontuário." },
  admin: { label: "Administrador", icon: "🛡️", desc: "Acesse a validação final e o gerenciamento do site." },
};

function LoginPage({ role, onLogin, onBack, showAttentionBanner, onCadastrar, onEnterAs }) {
  const toast = useToast();
  const meta = ROLE_META[role];
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSubmit = () => {
    const result = onLogin(email, senha);
    if (result.ok) {
      toast(`Bem-vindo(a)! Entrando como ${meta.label.toLowerCase()}...`, "success");
      return;
    }
    if (result.reason === "empty") {
      toast("Por favor, preencha os campos de e-mail e senha para prosseguir.", "warn");
    } else if (result.reason === "invalid-email") {
      toast("O formato do e-mail inserido não é válido (ex: nome@email.com).", "error");
    } else if (result.reason === "not-found") {
      toast("Usuário ou senha incorretos. Verifique os dados e tente novamente.", "error");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F0F0F0",
      fontFamily: SF, color: C.ink,
      display: "flex", flexDirection: "column",
    }}>
      <GlobalStyle />

      {/* Mesmo menu da LP — desktop completo, mobile com hambúrguer */}
      <TopNav
        session={null}
        navigate={(_) => onBack()}
        onEnterAs={onEnterAs}
        onStartTriagem={onCadastrar}
        isHome={false}
        onHome={onBack}
      />

      {/* Conteúdo central */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: isMobile ? "24px 16px" : "40px 20px"
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Ícone + título acima do card */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button
              onClick={onBack}
              style={{
                width: 44, height: 44, borderRadius: RADIUS.md, background: "rgba(0,186,132,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                border: "none", cursor: "pointer", color: "#0B8C63",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div style={{ fontFamily: SF, fontWeight: 700, fontSize: isMobile ? 20 : 24, color: C.ink, letterSpacing: "-0.01em" }}>
              {isMobile ? "Acessar plataforma" : `Entrar como ${meta.label}`}
            </div>
          </div>

          {/* Card de login */}
          <div style={{
            background: "#fff", borderRadius: isMobile ? 16 : 20,
            padding: isMobile ? "24px 20px" : 32,
            boxShadow: "0 4px 32px -8px rgba(0,0,0,0.10)",
          }}>
          {/* Banner amarelo */}
          {bannerVisible && (
            <div style={{
              background: "#FEFBCC", border: "1px solid #E8D84B",
              borderRadius: 12, padding: "14px 16px",
              display: "flex", gap: 10, alignItems: "flex-start",
              marginBottom: 20, position: "relative",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>ⓘ</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 3 }}>Atenção</div>
                <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.5 }}>
                  {role === "paciente"
                    ? "Use e-mail e senha definidos no seu cadastro."
                    : role === "medico"
                    ? "Acesso restrito a médicos credenciados. Use suas credenciais institucionais."
                    : "Acesso restrito ao administrador do sistema. Use suas credenciais de administrador."}
                </div>
              </div>
              <button
                onClick={() => setBannerVisible(false)}
                style={{
                  position: "absolute", top: 12, right: 12,
                  background: "none", border: "none", cursor: "pointer",
                  color: C.inkSoft, fontSize: 15,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 24, height: 24,
                }}
              >✕</button>
            </div>
          )}

          {/* Entrar como X — só no mobile, dentro do card */}
          {isMobile && (
            <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 18, color: C.ink, marginBottom: 20 }}>
              Entrar como {meta.label}
            </div>
          )}

          {/* Campos */}
          <Field label="E-mail">
            <TextInput type="email" placeholder="voce@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Senha">
            <PasswordInput
              value={senha}
              show={showSenha}
              onToggle={() => setShowSenha((v) => !v)}
              placeholder="••••••••"
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </Field>

          {/* Botões */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              onClick={role === "paciente" ? onCadastrar : onBack}
              style={{
                flex: 1, padding: "14px 16px", borderRadius: 12,
                background: "#fff", border: "2px solid #00BA84",
                color: C.ink, fontFamily: SF, fontWeight: 700, fontSize: 15,
                cursor: "pointer", minHeight: HIT_MIN,
              }}
            >{role === "paciente" ? "Cadastrar" : "Voltar"}</button>
            <button
              onClick={handleSubmit}
              style={{
                flex: 1, padding: "14px 16px", borderRadius: 12,
                background: "#00BA84", border: "none",
                color: "#fff", fontFamily: SF, fontWeight: 700, fontSize: 15,
                cursor: "pointer", minHeight: HIT_MIN,
              }}
            >Acessar</button>
          </div>

          {/* Esqueci minha senha */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              onClick={() => toast("Um link de redefinição de senha será enviado para o seu e-mail cadastrado.", "info")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#00BA84", fontFamily: SF, fontWeight: 600, fontSize: 13.5,
                textDecoration: "underline", padding: 4,
              }}
            >Esqueci minha senha</button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg viewBox="0 0 420 380" width="100%" style={{ maxWidth: 420 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="heroBlob" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00BA84" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#00BA84" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="heroCard" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* Background blob */}
        <ellipse cx="210" cy="190" rx="190" ry="170" fill="url(#heroBlob)" />

        {/* Main card — consultation panel */}
        <rect x="70" y="60" width="240" height="170" rx="20" fill="url(#heroCard)" stroke="rgba(0,0,0,0.06)" />
        {/* card header dots */}
        <circle cx="96" cy="86" r="4" fill="#FF3B30" opacity="0.5" />
        <circle cx="112" cy="86" r="4" fill="#FF9F0A" opacity="0.5" />
        <circle cx="128" cy="86" r="4" fill="#00BA84" opacity="0.7" />
        {/* avatar */}
        <circle cx="120" cy="135" r="22" fill="#00BA84" opacity="0.16" />
        <circle cx="120" cy="128" r="9" fill="#00BA84" />
        <path d="M101 152 Q120 136 139 152" stroke="#00BA84" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* text lines */}
        <rect x="156" y="118" width="120" height="8" rx="4" fill="#000000" opacity="0.85" />
        <rect x="156" y="134" width="90" height="7" rx="3.5" fill="#3C3C43" opacity="0.5" />
        <rect x="156" y="150" width="100" height="7" rx="3.5" fill="#3C3C43" opacity="0.35" />
        {/* pill button */}
        <rect x="156" y="172" width="84" height="26" rx="13" fill="#00BA84" />
        <rect x="172" y="182" width="52" height="6" rx="3" fill="#fff" opacity="0.9" />

        {/* Floating document card (top right) */}
        <g transform="translate(255,18)">
          <rect width="120" height="84" rx="16" fill="url(#heroCard)" stroke="rgba(0,0,0,0.06)" />
          <rect x="16" y="18" width="60" height="7" rx="3.5" fill="#000000" opacity="0.7" />
          <rect x="16" y="32" width="88" height="6" rx="3" fill="#3C3C43" opacity="0.4" />
          <rect x="16" y="44" width="88" height="6" rx="3" fill="#3C3C43" opacity="0.4" />
          <rect x="16" y="56" width="60" height="6" rx="3" fill="#3C3C43" opacity="0.4" />
          <circle cx="98" cy="20" r="11" fill="#00BA84" />
          <path d="M93 20l3.5 3.5L103 16" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Floating status pill (bottom left) */}
        <g transform="translate(40,232)">
          <rect width="150" height="50" rx="25" fill="url(#heroCard)" stroke="rgba(0,0,0,0.06)" />
          <circle cx="26" cy="25" r="13" fill="#00BA84" opacity="0.18" />
          <path d="M20 25l4 4 8-8" stroke="#00BA84" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="48" y="16" width="84" height="7" rx="3.5" fill="#000000" opacity="0.75" />
          <rect x="48" y="29" width="60" height="6" rx="3" fill="#3C3C43" opacity="0.4" />
        </g>

        {/* Floating mint cross badge (bottom right) */}
        <g transform="translate(255,250)">
          <circle cx="40" cy="40" r="40" fill="#00BA84" />
          <rect x="34" y="20" width="12" height="40" rx="4" fill="#fff" />
          <rect x="20" y="34" width="40" height="12" rx="4" fill="#fff" />
        </g>

        {/* small decorative dots */}
        <circle cx="350" cy="160" r="4" fill="#00BA84" opacity="0.4" />
        <circle cx="60" cy="190" r="3" fill="#00BA84" opacity="0.3" />
        <circle cx="200" cy="340" r="3" fill="#00BA84" opacity="0.3" />
      </svg>
    </div>
  );
}

function LandingPage({ siteContent, onStartTriagem, onEnterAs, navigate }) {
  const [faqOpen, setFaqOpen] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const ConsultaTypes = [
    { icon: "🩺", title: "Clínica Geral", desc: "Avaliação completa de sintomas, orientações e encaminhamentos sem sair de casa." },
    { icon: "💊", title: "Renovação de Receitas", desc: "Receitas para medicamentos de uso contínuo com agilidade e segurança." },
    { icon: "📋", title: "Laudos Médicos", desc: "Laudos para afastamento, seguro, concurso e demais fins com validade legal." },
    { icon: "🧠", title: "Saúde Mental", desc: "Suporte inicial, triagem e orientação em saúde emocional e psicológica." },
    { icon: "👶", title: "Pediatria", desc: "Atendimento para crianças com orientação especializada para pais e responsáveis." },
    { icon: "🔬", title: "Interpretação de Exames", desc: "Análise de resultados e orientação sobre próximos passos com seu médico." },
  ];

  const Steps = [
    { n: "01", icon: "📝", title: "Cadastre-se", desc: "Preencha seus dados pessoais, responda a triagem e envie seus documentos em poucos minutos." },
    { n: "02", icon: "💬", title: "Converse com o Assistente", desc: "Nosso assistente virtual guia você com uma pergunta por vez, preparando tudo para o médico." },
    { n: "03", icon: "🩺", title: "Atendimento Médico", desc: "O médico recebe seu histórico completo e emite receita e laudo personalizados." },
    { n: "04", icon: "📄", title: "Documentos em um Só Lugar", desc: "Receita, laudo e histórico ficam disponíveis no seu painel, organizados e seguros." },
  ];

  const Depoimentos = [
    { nome: "Maria Clara S.", cidade: "São Paulo, SP", texto: "Finalmente consegui renovar minha receita sem perder meio dia em fila. Em 20 minutos tudo resolvido, e o médico foi super atencioso.", estrelas: 5 },
    { nome: "Ricardo M.", cidade: "Belo Horizonte, MG", texto: "O assistente virtual é incrível. Ele foi me fazendo perguntas certeiras e quando chegou no médico, ele já sabia exatamente o que eu tinha.", estrelas: 5 },
    { nome: "Andressa L.", cidade: "Porto Alegre, RS", texto: "Precisava de laudo para o trabalho com urgência. A plataforma foi clara em cada etapa e meu laudo ficou disponível no mesmo dia.", estrelas: 5 },
    { nome: "José A.", cidade: "Recife, PE", texto: "Tenho 63 anos e achei que seria difícil. Mas é simples demais — o assistente me guia passo a passo. Recomendo demais.", estrelas: 5 },
  ];

  const Faqs = [
    { q: "Como funciona a consulta facilitada?", a: "Nossa plataforma guia você do início ao fim: cadastro, triagem inteligente com assistente virtual, atendimento médico online e emissão dos documentos — tudo em um único lugar, sem burocracia." },
    { q: "Os documentos têm validade legal?", a: "Sim. Receitas e laudos emitidos pelos médicos da plataforma seguem todas as normas do CFM e possuem validade jurídica em todo o território nacional." },
    { q: "Quanto tempo demora para ser atendido?", a: "Em geral o médico retorna em até 2 horas após o pagamento confirmado. Em horários de pico pode levar um pouco mais." },
    { q: "Como acesso meus documentos depois?", a: "No painel do paciente você encontra receitas, laudos e histórico de conversas com o assistente — organizados e disponíveis para download a qualquer momento." },
    { q: "Meus dados ficam seguros?", a: "Sim. Usamos criptografia e seguimos a LGPD. Seus dados médicos são confidenciais e só são acessados pelo médico responsável pelo seu atendimento." },
  ];

  const MINT = "#00BA84";

  const SectionLabel = ({ children }) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{ width: 20, height: 2, background: MINT, borderRadius: 999 }} />
      <span style={{ fontSize: 13, fontWeight: 700, color: MINT, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: SF }}>{children}</span>
      <div style={{ width: 20, height: 2, background: MINT, borderRadius: 999 }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: SF, color: C.ink, overflowX: "hidden" }}>
      <GlobalStyle />
      <TopNav session={null} navigate={navigate} onEnterAs={onEnterAs} onStartTriagem={onStartTriagem} isHome={true} />

      {/* ════════════════════════════════
          HERO
          ════════════════════════════════ */}
      <section style={{
        background: `linear-gradient(135deg, rgba(0,186,132,0.06) 0%, rgba(0,186,132,0.02) 50%, ${C.bg} 100%)`,
        borderBottom: `1px solid ${C.line}`,
        padding: isMobile ? "56px 24px 48px" : "96px 80px 80px",
        textAlign: isMobile ? "center" : "left",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 64, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 400px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
              background: "rgba(0,186,132,0.10)", borderRadius: RADIUS.pill,
              padding: "6px 14px",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: MINT, display: "inline-block" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: MINT, fontFamily: SF }}>Telemedicina simplificada</span>
            </div>
            <h1 style={{
              fontFamily: SF, fontWeight: 800, fontSize: isMobile ? 32 : 48,
              lineHeight: 1.15, letterSpacing: "-0.03em", color: C.ink, margin: "0 0 20px",
            }}>
              Consulta médica facilitada,<br />
              <span style={{ color: MINT }}>do início ao documento final.</span>
            </h1>
            <p style={{
              fontSize: isMobile ? 16 : 18, color: C.inkSoft, lineHeight: 1.65,
              margin: "0 0 36px", maxWidth: 520,
            }}>
              Triagem inteligente, atendimento médico online e emissão de receitas e laudos — com validação completa e histórico em um só lugar.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
              <button onClick={onStartTriagem} style={{
                background: MINT, color: "#fff", border: "none",
                borderRadius: RADIUS.md, padding: "16px 28px",
                fontFamily: SF, fontWeight: 700, fontSize: 16, cursor: "pointer",
                boxShadow: "0 4px 16px -4px rgba(0,186,132,0.45)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 8px 24px -4px rgba(0,186,132,0.50)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 16px -4px rgba(0,186,132,0.45)"; }}
              >Iniciar minha consulta →</button>
              <button onClick={() => onEnterAs?.("paciente")} style={{
                background: "rgba(0,186,132,0.08)", color: MINT, border: `1.5px solid rgba(0,186,132,0.25)`,
                borderRadius: RADIUS.md, padding: "16px 24px",
                fontFamily: SF, fontWeight: 600, fontSize: 16, cursor: "pointer",
              }}>Já sou paciente</button>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 32, flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
              {[["4.9 ★", "Avaliação média"], ["< 2h", "Tempo de retorno"], ["100%", "Online, sem fila"]].map(([v, l]) => (
                <div key={l} style={{ textAlign: isMobile ? "center" : "left" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em" }}>{v}</div>
                  <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {!isMobile && (
            <div style={{ flex: "0 0 380px", position: "relative" }}>
              {/* Card mockup da área do paciente */}
              <div style={{ ...glassPanel, borderRadius: RADIUS.xl, padding: 24, position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,186,132,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: MINT }}>EM</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>Eduardo Machado</div>
                    <div style={{ fontSize: 12, color: C.inkSoft }}>Protocolo PNT-8F2K1</div>
                  </div>
                  <span style={{ marginLeft: "auto", padding: "4px 10px", borderRadius: RADIUS.pill, background: "rgba(0,186,132,0.12)", color: MINT, fontSize: 11.5, fontWeight: 600 }}>✓ Concluído</span>
                </div>
                {/* Mini custody strip */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: 18, gap: 4 }}>
                  {["📋","💳","🩺","✅","🎉"].map((ic, i) => (
                    <React.Fragment key={i}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,186,132,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{ic}</div>
                      {i < 4 && <div style={{ flex: 1, height: 2, background: "rgba(0,186,132,0.25)", borderRadius: 999 }} />}
                    </React.Fragment>
                  ))}
                </div>
                {[["📄", "Receita médica", "Disponível"], ["🩺", "Laudo médico", "Disponível"]].map(([ic, label, status]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{ic}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 12, color: MINT, fontWeight: 600 }}>{status} ↓</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(0,186,132,0.06)", borderRadius: RADIUS.sm }}>
                  <div style={{ fontSize: 12, color: MINT, fontWeight: 600 }}>🎉 Documentos liberados</div>
                  <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 3 }}>Tudo certo! Seus documentos estão disponíveis para download.</div>
                </div>
              </div>
              {/* Bubble flutuante */}
              <div style={{ position: "absolute", top: -20, right: -20, background: MINT, borderRadius: RADIUS.lg, padding: "10px 16px", boxShadow: "0 8px 24px -4px rgba(0,186,132,0.45)", zIndex: 3 }}>
                <div style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>🤖 Assistente virtual</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>Guia você passo a passo</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════
          QUEM SOMOS
          ════════════════════════════════ */}
      <section id="sobre" style={{ padding: isMobile ? "56px 24px" : "88px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 340px" }}>
            <div style={{
              width: isMobile ? "100%" : 380, height: isMobile ? 220 : 300,
              borderRadius: RADIUS.xl, background: `linear-gradient(135deg, rgba(0,186,132,0.12), rgba(0,186,132,0.04))`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 60 : 80,
              border: `1px solid rgba(0,186,132,0.15)`,
            }}>🏥</div>
          </div>
          <div style={{ flex: "1 1 400px", textAlign: isMobile ? "center" : "left" }}>
            <SectionLabel>Quem somos</SectionLabel>
            <h2 style={{ fontFamily: SF, fontWeight: 800, fontSize: isMobile ? 26 : 36, letterSpacing: "-0.02em", color: C.ink, margin: "0 0 16px", lineHeight: 1.2 }}>
              Medicina de qualidade,<br />acessível a todos
            </h2>
            <p style={{ fontSize: 16, color: C.inkSoft, lineHeight: 1.7, marginBottom: 16 }}>
              A <strong style={{ color: C.ink }}>Sua Logo</strong> nasceu para eliminar as barreiras entre o paciente e o atendimento médico. Unimos tecnologia e medicina para criar uma experiência de consulta que é ao mesmo tempo <strong style={{ color: C.ink }}>simples, segura e completa</strong>.
            </p>
            <p style={{ fontSize: 16, color: C.inkSoft, lineHeight: 1.7, marginBottom: 24 }}>
              Nossa plataforma é a primeira no Brasil a combinar triagem guiada por IA, atendimento médico humano e entrega de documentos com validação administrativa — tudo em um único ambiente, pensado para ser intuitivo do primeiro ao último clique.
            </p>
            {[["👨‍⚕️", "Médicos verificados e credenciados pelo CFM"], ["🔒", "Dados protegidos com criptografia e conformidade LGPD"], ["⚡", "Processo 100% digital, sem filas e sem deslocamento"]].map(([ic, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{ic}</span>
                <span style={{ fontSize: 14, color: C.inkSoft }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          TIPOS DE CONSULTAS
          ════════════════════════════════ */}
      <section style={{ padding: isMobile ? "56px 24px" : "88px 80px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel>Especialidades</SectionLabel>
          <h2 style={{ fontFamily: SF, fontWeight: 800, fontSize: isMobile ? 26 : 36, letterSpacing: "-0.02em", color: C.ink, margin: "0 auto 12px", lineHeight: 1.2 }}>
            Tipos de consulta disponíveis
          </h2>
          <p style={{ fontSize: 16, color: C.inkSoft, maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.6 }}>
            Da renovação de receita ao laudo especializado — encontre o atendimento certo para cada momento.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {ConsultaTypes.map((ct) => (
              <div key={ct.title} style={{
                ...glassPanel, borderRadius: RADIUS.lg, padding: "22px 20px",
                textAlign: "left", transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{ct.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 6 }}>{ct.title}</div>
                <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.55 }}>{ct.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          COMO FUNCIONA
          ════════════════════════════════ */}
      <section id="como-funciona" style={{ padding: isMobile ? "56px 24px" : "88px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionLabel>Como funciona</SectionLabel>
            <h2 style={{ fontFamily: SF, fontWeight: 800, fontSize: isMobile ? 26 : 36, letterSpacing: "-0.02em", color: C.ink, margin: "0 0 12px", lineHeight: 1.2 }}>
              Consulta guiada, do início ao fim
            </h2>
            <p style={{ fontSize: 16, color: C.inkSoft, maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
              Cada etapa foi desenhada para ser clara, rápida e sem burocracia — com usabilidade e interação pensadas para você.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: isMobile ? 20 : 24, position: "relative" }}>
            {Steps.map((s, i) => (
              <div key={s.n} style={{ position: "relative" }}>
                <div style={{ ...glassPanel, borderRadius: RADIUS.lg, padding: "24px 20px", height: "100%" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: RADIUS.sm, background: "rgba(0,186,132,0.10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, marginBottom: 16,
                  }}>{s.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: MINT, marginBottom: 6, letterSpacing: "0.06em" }}>ETAPA {s.n}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: C.ink, marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
                {!isMobile && i < 3 && (
                  <div style={{ position: "absolute", top: 34, right: -16, fontSize: 18, color: MINT, zIndex: 2, fontWeight: 700 }}>→</div>
                )}
              </div>
            ))}
          </div>

          {/* Destaque Área do Paciente */}
          <div style={{
            marginTop: 40, borderRadius: RADIUS.xl, overflow: "hidden",
            background: `linear-gradient(120deg, rgba(0,186,132,0.08), rgba(0,186,132,0.03))`,
            border: `1px solid rgba(0,186,132,0.15)`,
            padding: isMobile ? "28px 20px" : "36px 48px",
            display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap",
          }}>
            <div style={{ fontSize: isMobile ? 48 : 64 }}>📱</div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontWeight: 800, fontSize: isMobile ? 18 : 22, color: C.ink, marginBottom: 8, letterSpacing: "-0.01em" }}>
                Área do paciente: tudo em um só lugar
              </div>
              <p style={{ fontSize: 15, color: C.inkSoft, lineHeight: 1.65, margin: "0 0 16px" }}>
                No seu painel você encontra o <strong style={{ color: C.ink }}>histórico de consultas</strong>, conversa com o <strong style={{ color: C.ink }}>assistente virtual</strong>, acompanha o <strong style={{ color: C.ink }}>status do atendimento em tempo real</strong> e baixa receitas e laudos — tudo sem precisar entrar em contato.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Atendimento médico", "Histórico completo", "Documentos online", "Assistente 24h"].map(tag => (
                  <span key={tag} style={{ padding: "4px 12px", borderRadius: RADIUS.pill, background: "rgba(0,186,132,0.12)", color: MINT, fontSize: 12.5, fontWeight: 600 }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          BANNER CTA
          ════════════════════════════════ */}
      <section style={{
        background: MINT,
        padding: isMobile ? "56px 24px" : "80px 80px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: isMobile ? 36 : 52, marginBottom: 16 }}>🩺</div>
          <h2 style={{ fontFamily: SF, fontWeight: 800, fontSize: isMobile ? 26 : 38, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
            Pronto para sua consulta?
          </h2>
          <p style={{ fontSize: isMobile ? 15 : 17, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: 32 }}>
            Cadastre-se agora, responda a triagem guiada e receba atendimento médico com receita e laudo — sem sair de casa.
          </p>
          <button onClick={onStartTriagem} style={{
            background: "#fff", color: MINT, border: "none",
            borderRadius: RADIUS.md, padding: isMobile ? "16px 28px" : "18px 40px",
            fontFamily: SF, fontWeight: 700, fontSize: isMobile ? 16 : 18,
            cursor: "pointer", boxShadow: "0 8px 28px -4px rgba(0,0,0,0.20)",
            transition: "transform 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform="scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
          >Iniciar minha primeira consulta →</button>
          <div style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.70)" }}>
            Sem mensalidade · Pague apenas pela consulta · Resultado em até 2 horas
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          DEPOIMENTOS
          ════════════════════════════════ */}
      <section style={{ padding: isMobile ? "56px 24px" : "88px 80px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Depoimentos</SectionLabel>
            <h2 style={{ fontFamily: SF, fontWeight: 800, fontSize: isMobile ? 26 : 36, letterSpacing: "-0.02em", color: C.ink, margin: 0, lineHeight: 1.2 }}>
              O que nossos pacientes dizem
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 20 }}>
            {Depoimentos.map((d) => (
              <div key={d.nome} style={{ ...glassPanel, borderRadius: RADIUS.lg, padding: "24px 22px" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i} style={{ color: "#FF9F0A", fontSize: 16 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 15, color: C.ink, lineHeight: 1.65, margin: "0 0 16px", fontStyle: "italic" }}>"{d.texto}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(0,186,132,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: MINT }}>
                    {d.nome.split(" ").slice(0,2).map(w=>w[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{d.nome}</div>
                    <div style={{ fontSize: 12, color: C.inkSoft }}>{d.cidade}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FAQ — FICOU COM DÚVIDAS?
          ════════════════════════════════ */}
      <section style={{ padding: isMobile ? "56px 24px" : "88px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Dúvidas</SectionLabel>
            <h2 style={{ fontFamily: SF, fontWeight: 800, fontSize: isMobile ? 26 : 36, letterSpacing: "-0.02em", color: C.ink, margin: "0 0 12px", lineHeight: 1.2 }}>
              Ficou com dúvidas?
            </h2>
            <p style={{ fontSize: 16, color: C.inkSoft, margin: 0, lineHeight: 1.6 }}>
              As perguntas mais comuns respondidas para você.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Faqs.map((faq, i) => {
              const open = faqOpen === i;
              return (
                <div key={i} style={{
                  ...glassPanel, borderRadius: RADIUS.lg, overflow: "hidden",
                  border: open ? `1.5px solid rgba(0,186,132,0.30)` : `1px solid ${C.line}`,
                  transition: "border-color 0.2s",
                }}>
                  <button onClick={() => setFaqOpen(open ? null : i)} style={{
                    width: "100%", textAlign: "left", background: "none", border: "none",
                    padding: "18px 20px", cursor: "pointer", fontFamily: SF,
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
                  }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: C.ink, lineHeight: 1.4 }}>{faq.q}</span>
                    <span style={{ fontSize: 18, color: open ? MINT : C.inkSoft, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                  </button>
                  {open && (
                    <div style={{ padding: "0 20px 18px", fontSize: 15, color: C.inkSoft, lineHeight: 1.7 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contato */}
          <div style={{
            marginTop: 40, borderRadius: RADIUS.xl, background: `linear-gradient(120deg, rgba(0,186,132,0.06), rgba(0,186,132,0.02))`,
            border: `1px solid rgba(0,186,132,0.15)`, padding: isMobile ? "24px 20px" : "32px 36px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: C.ink, marginBottom: 8 }}>Ainda tem dúvidas?</div>
            <p style={{ fontSize: 15, color: C.inkSoft, marginBottom: 20, lineHeight: 1.6 }}>
              Nossa equipe está disponível para ajudar você antes, durante e após a consulta.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="mailto:contato@sualogo.com.br" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "12px 20px", borderRadius: RADIUS.md,
                background: MINT, color: "#fff", fontFamily: SF, fontWeight: 600, fontSize: 14,
                textDecoration: "none",
              }}>✉️ contato@sualogo.com.br</a>
              <a href="https://wa.me/5548999999999" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "12px 20px", borderRadius: RADIUS.md,
                background: "rgba(0,186,132,0.10)", color: MINT, fontFamily: SF, fontWeight: 600, fontSize: 14,
                textDecoration: "none", border: `1.5px solid rgba(0,186,132,0.25)`,
              }}>💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FOOTER
          ════════════════════════════════ */}
      <footer style={{
        background: C.ink, color: "rgba(255,255,255,0.75)",
        padding: isMobile ? "48px 24px 32px" : "64px 80px 40px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: SF, fontWeight: 800, fontSize: 22, color: "#fff", marginBottom: 12 }}>Sua Logo</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "rgba(255,255,255,0.60)", maxWidth: 260 }}>
                Telemedicina simplificada. Consulta facilitada, documentação completa e histórico em um só lugar.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                {["📧", "💬", "📸"].map((ic, i) => (
                  <button key={i} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", cursor: "pointer", fontSize: 14 }}>{ic}</button>
                ))}
              </div>
            </div>
            {[
              { title: "Plataforma", links: ["Iniciar consulta", "Área do paciente", "Área do médico", "Como funciona"] },
              { title: "Empresa", links: ["Quem somos", "Médicos parceiros", "Seja um parceiro", "Blog"] },
              { title: "Legal", links: ["Termos de uso", "Privacidade e LGPD", "Política de cookies", "CFM e regulação"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>{col.title}</div>
                {col.links.map(link => (
                  <div key={link} style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", marginBottom: 8, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.color="#fff"}
                    onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.55)"}
                  >{link}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.40)" }}>
              © {new Date().getFullYear()} Sua Logo Telemedicina. Todos os direitos reservados.
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              CRM verificado · LGPD compliant · SSL seguro
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


function PatientView({ patient, update, navigate, onEnterAs, onStartTriagem, onPaymentDone, section, onSectionChange }) {
  const [step, setStep] = useState(() => {
    if (!patient.personal) return 0;
    if (!patient.triage) return 1;
    if (!(patient.docs.identityUploaded && patient.docs.addressUploaded)) return 2;
    if (!patient.payment.confirmed) return 3;
    return 4;
  });

  const cardRef = React.useRef(null);
  const goToStep = (n) => {
    setStep(n);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  if (patient.status !== "cadastro_incompleto" || step === 4) {
    if (section === "assistente") {
      return <PatientAssistant patient={patient} update={update} />;
    }
    return <PatientDashboard patient={patient} update={update} section={section} />;
  }

  return (
    <div>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 20px 60px" }}>
        <Header
          eyebrow="Atendimento"
          title="Cadastro do paciente"
          sub="Preencha as etapas abaixo para liberar sua consulta."
        />
        <StepIndicator step={step} onGoToStep={goToStep} />
        <div ref={cardRef} style={{
          ...glassPanel, borderRadius: RADIUS.lg,
          padding: "32px 36px", marginTop: 20,
          scrollMarginTop: 90,
        }}>
          {step === 0 && <Step1Personal patient={patient} update={update} onNext={() => goToStep(1)} />}
          {step === 1 && <Step2Triage patient={patient} update={update} onNext={() => goToStep(2)} onBack={() => goToStep(0)} />}
          {step === 2 && <Step3Docs patient={patient} update={update} onNext={() => goToStep(3)} onBack={() => goToStep(1)} />}
          {step === 3 && <Step4Payment patient={patient} update={update} onDone={onPaymentDone || (() => goToStep(4))} onBack={() => goToStep(2)} />}
        </div>
      </div>
      <style>{`@media(max-width:600px){.form-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

function Header({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {eyebrow && (
        <div style={{
          fontSize: 13, fontWeight: 600, color: C.primary, letterSpacing: "0.01em",
          marginBottom: 6, fontFamily: SF
        }}>{eyebrow}</div>
      )}
      <h1 style={{
        fontFamily: SF, fontWeight: 700, fontSize: 28, color: C.ink, margin: 0,
        lineHeight: 1.15, letterSpacing: "-0.01em"
      }}>{title}</h1>
      {sub && <p style={{ color: C.inkSoft, fontSize: 15, marginTop: 8, lineHeight: 1.5, fontFamily: SF }}>{sub}</p>}
    </div>
  );
}

function StepIndicator({ step, onGoToStep }) {
  const steps = [
    { label: "Dados pessoais", short: "Pessoal" },
    { label: "Consulta médica", short: "Consulta" },
    { label: "Documentação", short: "Documentação" },
    { label: "Pagamento", short: "Pagamento" },
  ];
  const total = steps.length;

  return (
    <div style={{ marginTop: 24 }} role="navigation" aria-label="Progresso do cadastro">
      {/* Desktop: node + connector + label */}
      <div className="stepper-desktop" style={{ display: "flex", alignItems: "flex-start" }}>
        {steps.map((s, i) => {
          const done = i < step;
          const active = i === step;
          const clickable = done && onGoToStep;
          return (
            <React.Fragment key={s.label}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 52 }}>
                {/* Node */}
                <button
                  onClick={clickable ? () => onGoToStep(i) : undefined}
                  aria-current={active ? "step" : undefined}
                  aria-label={`${s.label}${done ? ", concluído" : active ? ", etapa atual" : ", pendente"}`}
                  disabled={!clickable && !active}
                  style={{
                    width: 36, height: 36, borderRadius: "50%", border: "none",
                    cursor: clickable ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: SF, fontWeight: 700, fontSize: 14,
                    transition: "all 0.25s cubic-bezier(.34,1.4,.4,1)",
                    background: done ? C.primary : active ? "#fff" : C.bgAlt,
                    color: done ? "#fff" : active ? C.primary : C.inkTertiary,
                    boxShadow: active
                      ? `0 0 0 4px ${C.primarySoft}, 0 0 0 2px ${C.primary}`
                      : done ? "0 2px 8px rgba(16,185,129,0.25)"
                      : "none",
                    flexShrink: 0,
                  }}
                >
                  {done
                    ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <span>{i + 1}</span>
                  }
                </button>
                {/* Label */}
                <div style={{
                  marginTop: 8, fontSize: 11, fontWeight: active ? 700 : done ? 600 : 500,
                  color: done ? C.primary : active ? C.ink : C.inkTertiary,
                  textAlign: "center", lineHeight: 1.3, whiteSpace: "nowrap",
                  transition: "color 0.2s"
                }}>{s.short}</div>
              </div>

              {/* Connector */}
              {i < total - 1 && (
                <div style={{
                  flex: 1, height: 2, marginTop: 17, position: "relative",
                  background: C.line, borderRadius: 99, overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: 99,
                    background: C.primary,
                    transform: done ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.4s cubic-bezier(.34,1,.6,1)"
                  }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: compact text counter + progress bar */}
      <div className="stepper-mobile" style={{ display: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, fontFamily: SF }}>
            {steps[step]?.label}
          </span>
          <span style={{ fontSize: 12, color: C.inkSoft, fontFamily: SF }}>
            Etapa {step + 1} de {total}
          </span>
        </div>
        <div style={{ height: 4, background: C.line, borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99, background: C.primary,
            width: `${((step + 1) / total) * 100}%`,
            transition: "width 0.4s cubic-bezier(.34,1,.6,1)"
          }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 520px) {
          .stepper-desktop { display: none !important; }
          .stepper-mobile { display: block !important; }
        }
      `}</style>
    </div>
  );
}

function EyeIcon({ show }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show
        ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      }
    </svg>
  );
}

function PasswordInput({ value, show, onToggle, placeholder, error, onChange, onKeyDown }) {
  return (
    <div style={{ position: "relative" }}>
      <TextInput
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        error={error}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={{ paddingRight: 44 }}
      />
      <button
        type="button"
        onClick={onToggle}
        tabIndex={-1}
        style={{
          position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer",
          color: C.inkSoft, display: "flex", alignItems: "center", padding: 4,
        }}
      >
        <EyeIcon show={show} />
      </button>
    </div>
  );
}

/* ---- Step 1: Dados Pessoais ---- */
function Step1Personal({ patient, update, onNext }) {
  const toast = useToast();
  const [form, setForm] = useState(patient.personal || {
    nome: "", telefone: "", cpf: "", rg: "", nascimento: "", email: "", senha: "", confirmarSenha: ""
  });
  const [errors, setErrors] = useState({});
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const inlineCheck = (k, v) => {
    let err = null;
    if (k === "email" && v && !validEmail(v)) err = "E-mail inválido";
    if (k === "cpf" && v.replace(/\D/g, "").length === 11 && !validCPF(v)) err = "CPF inválido — confira o dígito";
    if (k === "telefone" && v.replace(/\D/g, "").length > 0 && v.replace(/\D/g, "").length < 11) err = "Telefone incompleto";
    if (k === "senha" && v.length > 0 && !(v.length >= 8 && /[0-9]/.test(v) && /[A-Z]/.test(v))) err = "Mín. 8 chars, 1 número e 1 maiúscula";
    if (k === "confirmarSenha" && v && v !== form.senha) err = "Senhas não coincidem";
    setErrors((e) => ({ ...e, [k]: err || undefined }));
  };

  const validate = () => {
    const e = {};
    if (countWords(form.nome) < 2) e.nome = "Informe nome e sobrenome (mínimo 2 palavras).";
    if (form.telefone.replace(/\D/g, "").length < 11) e.telefone = "Telefone incompleto. Formato: (DD) 9XXXX-XXXX.";
    if (!validCPF(form.cpf)) e.cpf = "CPF inválido — confira o dígito verificador.";
    if (!(form.rg.trim().length > 0 && form.rg.trim().length <= 12)) e.rg = "RG obrigatório (até 12 caracteres).";
    if (!isAdult(form.nascimento)) e.nascimento = "Data inválida ou paciente menor de idade.";
    if (!validEmail(form.email)) e.email = "Formato de e-mail inválido.";
    if (!(form.senha.length >= 8 && /[0-9]/.test(form.senha) && /[A-Z]/.test(form.senha)))
      e.senha = "Mínimo 8 caracteres, 1 número e 1 letra maiúscula.";
    if (!e.senha && form.confirmarSenha !== form.senha)
      e.confirmarSenha = "As senhas não coincidem.";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast(`Não foi possível avançar: ${Object.values(e)[0]}`, "error");
      return;
    }
    update((p) => ({ ...p, personal: form }));
    toast("Dados pessoais salvos com sucesso.", "success");
    onNext();
  };

  return (
    <div>
      <SectionTitle>📑 Etapa 1 · Dados pessoais</SectionTitle>

      {/* Grid 2 colunas */}
      <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <Field label="Nome completo" required error={errors.nome} style={{ gridColumn: "1 / -1" }}>
          <TextInput placeholder="Maria da Silva" value={form.nome} error={errors.nome}
            onChange={(e) => set("nome", e.target.value)} />
        </Field>

        <Field label="Telefone / WhatsApp" required error={errors.telefone}>
          <TextInput placeholder="(48) 99999-0000" value={form.telefone} error={errors.telefone}
            onChange={(e) => set("telefone", maskPhone(e.target.value))}
            onBlur={(e) => inlineCheck("telefone", e.target.value)} />
        </Field>

        <Field label="Data de nascimento" required hint="DD/MM/AAAA" error={errors.nascimento}>
          <TextInput placeholder="01/01/1990" value={form.nascimento} error={errors.nascimento}
            onChange={(e) => set("nascimento", maskDate(e.target.value))} />
        </Field>

        <Field label="CPF" required error={errors.cpf}>
          <TextInput placeholder="000.000.000-00" value={form.cpf} error={errors.cpf}
            onChange={(e) => set("cpf", maskCPF(e.target.value))}
            onBlur={(e) => inlineCheck("cpf", e.target.value)}
            style={{ fontFamily: SF_MONO }} />
        </Field>

        <Field label="RG" required hint="Até 12 caracteres" error={errors.rg}>
          <TextInput placeholder="00.000.000-0" value={form.rg} maxLength={12} error={errors.rg}
            onChange={(e) => set("rg", e.target.value)}
            style={{ fontFamily: SF_MONO }} />
        </Field>
      </div>

      {/* Divisor */}
      <div style={{ borderTop: `1px solid ${C.line}`, margin: "8px 0 20px" }} />

      {/* Email e senhas — full width abaixo */}
      <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <Field label="E-mail" required error={errors.email} style={{ gridColumn: "1 / -1" }}>
          <TextInput type="email" placeholder="maria@email.com" value={form.email} error={errors.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={(e) => inlineCheck("email", e.target.value)} />
        </Field>

        <Field label="Senha" required hint="Mínimo 8 caracteres, 1 número e 1 maiúscula." error={errors.senha}>
          <PasswordInput
            value={form.senha} show={showSenha} onToggle={() => setShowSenha((v) => !v)}
            placeholder="••••••••" error={errors.senha}
            onChange={(e) => set("senha", e.target.value)}
          />
        </Field>

        <Field label="Confirmar senha" required error={errors.confirmarSenha}>
          <PasswordInput
            value={form.confirmarSenha} show={showConfirm} onToggle={() => setShowConfirm((v) => !v)}
            placeholder="••••••••" error={errors.confirmarSenha}
            onChange={(e) => set("confirmarSenha", e.target.value)}
          />
        </Field>
      </div>

      <Button full size="lg" onClick={handleNext} style={{ marginTop: 16 }}>
        Avançar para consulta médica →
      </Button>
    </div>
  );
}

/* ---- Step 2: Triagem Médica ---- */
function Step2Triage({ patient, update, onNext, onBack }) {
  const toast = useToast();
  const [form, setForm] = useState(patient.triage || {
    sintomas: "", dorLocal: "", dorIntensidade: "", historico: ""
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (form.sintomas.trim().length < 20) e.sintomas = `Descreva com mais detalhes (mínimo 20 caracteres — atual: ${form.sintomas.trim().length}).`;
    if (!form.dorLocal.trim()) e.dorLocal = "Informe onde dói (ou \"Não sinto dor\").";
    if (!form.dorIntensidade) e.dorIntensidade = "Selecione a intensidade da dor de 1 a 10.";
    if (!form.historico.trim()) e.historico = "Escreva \"Nenhuma\" caso não tenha doenças, alergias ou medicamentos.";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast(`Não foi possível avançar: ${Object.values(e)[0]}`, "error");
      return;
    }
    update((p) => ({ ...p, triage: form }));
    toast("Triagem médica registrada.", "success");
    onNext();
  };

  return (
    <div>
      <SectionTitle>🩺 Etapa 2 · Triagem médica</SectionTitle>
      <Field label="Situação atual / sintomas" required
        hint={`O que você está sentindo hoje? (mínimo 20 caracteres — atual: ${form.sintomas.trim().length})`}
        error={errors.sintomas}>
        <TextArea placeholder="Descreva os sintomas, há quanto tempo começaram, etc."
          value={form.sintomas} error={errors.sintomas}
          onChange={(e) => set("sintomas", e.target.value)} />
      </Field>
      <Field label="Onde dói?" required error={errors.dorLocal}>
        <TextInput placeholder="Ex: cabeça, lombar, abdômen..." value={form.dorLocal} error={errors.dorLocal}
          onChange={(e) => set("dorLocal", e.target.value)} />
      </Field>
      <Field label="Intensidade da dor (1 a 10)" required error={errors.dorIntensidade}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[...Array(10)].map((_, i) => {
            const val = String(i + 1);
            const sel = form.dorIntensidade === val;
            return (
              <button key={val} onClick={() => set("dorIntensidade", val)}
                style={{
                  width: 36, height: 36, borderRadius: 8, cursor: "pointer",
                  border: `1.5px solid ${sel ? C.primary : C.line}`,
                  background: sel ? C.primary : "#fff",
                  color: sel ? "#fff" : C.ink, fontWeight: 600, fontSize: 13, fontFamily: SF_MONO
                }}>{val}</button>
            );
          })}
        </div>
      </Field>
      <Field label="Doenças preexistentes, alergias ou medicamentos em uso" required
        hint='Caso não tenha nenhuma, escreva "Nenhuma".' error={errors.historico}>
        <TextArea placeholder="Ex: Hipertensão, alergia a dipirona, uso de losartana... ou 'Nenhuma'."
          value={form.historico} error={errors.historico}
          onChange={(e) => set("historico", e.target.value)} />
      </Field>
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <Button variant="ghost" onClick={onBack}>← Voltar</Button>
        <Button full onClick={handleNext}>Avançar para documentação →</Button>
      </div>
    </div>
  );
}

/* ---- Step 3: Upload de Documentação ---- */
function Step3Docs({ patient, update, onNext, onBack }) {
  const toast = useToast();
  const [docs, setDocs] = useState(patient.docs);

  const handleFile = (kind, file) => {
    if (!file) return;
    const okTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!okTypes.includes(file.type)) {
      toast("Formato inválido. Envie um arquivo PDF, PNG ou JPG.", "error");
      return;
    }
    if (kind === "identity" && file.size > 5 * 1024 * 1024) {
      toast("Arquivo muito grande. O documento de identidade deve ter no máximo 5MB.", "error");
      return;
    }
    setDocs((d) => ({
      ...d,
      [kind === "identity" ? "identityUploaded" : "addressUploaded"]: true,
      [kind === "identity" ? "identityFile" : "addressFile"]: file.name,
    }));
    toast(`${kind === "identity" ? "Documento de identidade" : "Comprovante de residência"} anexado.`, "success");
  };

  const handleNext = () => {
    if (!docs.identityUploaded) {
      toast("Não foi possível avançar: envie o documento de identidade (RG ou CNH).", "error");
      return;
    }
    if (!docs.addressUploaded) {
      toast("Não foi possível avançar: envie o comprovante de residência.", "error");
      return;
    }
    update((p) => ({ ...p, docs }));
    toast("Documentos enviados para validação.", "success");
    onNext();
  };

  return (
    <div>
      <SectionTitle>🗂️ Etapa 3 · Upload de documentação</SectionTitle>
      <UploadCard
        label="Documento de identidade"
        hint="Frente e verso do RG ou CNH. Formatos: PDF, PNG, JPG. Máx: 5MB."
        uploaded={docs.identityUploaded}
        fileName={docs.identityFile}
        onFile={(f) => handleFile("identity", f)}
      />
      <UploadCard
        label="Comprovante de residência"
        hint="Emitido nos últimos 90 dias. Formatos: PDF, PNG, JPG."
        uploaded={docs.addressUploaded}
        fileName={docs.addressFile}
        onFile={(f) => handleFile("address", f)}
      />
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <Button variant="ghost" onClick={onBack}>← Voltar</Button>
        <Button full onClick={handleNext}>Avançar para pagamento →</Button>
      </div>
    </div>
  );
}

function UploadCard({ label, hint, uploaded, fileName, onFile }) {
  const toast = useToast();

  const handleSimulate = () => {
    // Dentro do iframe do Claude o acesso a arquivos é bloqueado.
    // Simula o envio com um nome de arquivo fictício para o protótipo funcionar.
    const fakeFile = { name: `documento-${Date.now()}.pdf`, type: "application/pdf", size: 102400 };
    onFile(fakeFile);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, fontFamily: SF }}>
        {label}<span style={{ color: C.red }}> *</span>
      </div>
      <div
        onClick={handleSimulate}
        style={{
          border: `1.5px dashed ${uploaded ? C.sage : "rgba(0,0,0,0.12)"}`,
          background: uploaded ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.6)",
          borderRadius: RADIUS.md, padding: "16px", cursor: "pointer", minHeight: HIT_MIN,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: RADIUS.sm, flexShrink: 0,
            background: uploaded ? C.sage : "#fff", border: `1px solid ${uploaded ? C.sage : C.line}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: uploaded ? "#fff" : C.inkSoft, fontWeight: 700, fontSize: 18,
          }}>{uploaded ? "✓" : "↑"}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: uploaded ? C.primaryDark : C.ink, fontFamily: SF }}>
              {uploaded ? fileName : "Toque para simular envio"}
            </div>
            <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>
              {uploaded ? hint : hint}
            </div>
          </div>
        </div>
        <div style={{
          padding: "8px 14px", borderRadius: RADIUS.sm, fontSize: 13.5, fontWeight: 600,
          fontFamily: SF, border: `1.5px solid ${uploaded ? C.line : C.primary}`,
          color: uploaded ? C.inkSoft : C.primary,
          background: "#fff", flexShrink: 0,
          transition: "all 0.15s",
        }}>
          {uploaded ? "Trocar" : "Enviar"}
        </div>
      </div>
    </div>
  );
}

/* Temporizador Pix — 30 minutos regressivos */
function PixTimer() {
  const TOTAL = 30 * 60;
  const [secs, setSecs] = useState(TOTAL);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const pct = secs / TOTAL;
  const expired = secs <= 0;
  const urgent = secs < 5 * 60;

  return (
    <div style={{
      background: expired ? "rgba(255,59,48,0.06)" : urgent ? "rgba(255,159,10,0.08)" : C.primarySoft,
      border: `1px solid ${expired ? "#FF3B30" : urgent ? "#FF9F0A" : "#00BA84"}22`,
      borderRadius: RADIUS.md, padding: "14px 18px",
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{ flexShrink: 0, position: "relative", width: 48, height: 48 }}>
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke={expired ? "#FF3B3022" : "#00BA8422"} strokeWidth="4" />
          <circle
            cx="24" cy="24" r="20" fill="none"
            stroke={expired ? "#FF3B30" : urgent ? "#FF9F0A" : "#00BA84"}
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct)}`}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "24px 24px", transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, fontFamily: SF_MONO,
          color: expired ? "#FF3B30" : urgent ? "#FF9F0A" : "#00BA84",
        }}>{expired ? "00" : mm}</div>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: SF, color: C.ink, marginBottom: 2 }}>
          {expired ? "Código expirado" : `${mm}:${ss} restantes`}
        </div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.5 }}>
          {expired ? "Gere um novo código Pix para continuar." : "O código Pix expira em 30 minutos."}
        </div>
      </div>
    </div>
  );
}

function Step4Payment({ patient, update, onDone, onBack }) {
  const toast = useToast();
  const [confirmed, setConfirmed] = useState(patient.payment.confirmed);
  const [showSuccess, setShowSuccess] = useState(false);
  const [method, setMethod] = useState("pix");
  const [cardType, setCardType] = useState("credito");
  const [card, setCard] = useState({ numero: "", nome: "", validade: "", cvv: "" });
  const [cardErrors, setCardErrors] = useState({});
  const [bannerOpen, setBannerOpen] = useState(true); // ← movido para antes do early return

  const pixCode = "00020126580014BR.GOV.BCB.PIX0136" + patient.id + "5204000053039865802BR5913SUA LOGO6009SAO PAULO62070503***6304A1B2";

  const maskCardNum = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const maskValidade = (v) => v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");

  const copyPix = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(pixCode).catch(() => {});
    toast("Código Pix copiado para a área de transferência.", "success");
  };

  const validateCard = () => {
    const e = {};
    if (card.numero.replace(/\s/g, "").length < 16) e.numero = "Número do cartão inválido.";
    if (card.nome.trim().split(" ").length < 2) e.nome = "Informe o nome como está no cartão.";
    if (!/^\d{2}\/\d{2}$/.test(card.validade)) e.validade = "Validade inválida (MM/AA).";
    if (card.cvv.replace(/\D/g, "").length < 3) e.cvv = "CVV inválido.";
    return e;
  };

  const confirmPayment = () => {
    if (confirmed) { toast("Pagamento já confirmado.", "info"); return; }

    if (method === "cartao") {
      const e = validateCard();
      setCardErrors(e);
      if (Object.keys(e).length > 0) {
        toast(`Verifique os dados do cartão: ${Object.values(e)[0]}`, "error");
        return;
      }
    }

    setConfirmed(true);
    setShowSuccess(true);
    update((p) => ({
      ...p,
      payment: { confirmed: true, method: method === "pix" ? "pix" : cardType, confirmedAt: new Date().toISOString() },
      status: "aguardando_homologacao",
    }));
  };

  // Tela de sucesso — exibida após confirmação, antes do redirecionamento
  if (showSuccess) {
    return (
      <div style={{ textAlign: "center", padding: "32px 16px" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", background: "rgba(0,186,132,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 36,
        }}>✓</div>
        <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 22, color: C.ink, marginBottom: 10 }}>
          Pagamento confirmado!
        </div>
        <div style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.6, marginBottom: 28, maxWidth: 320, margin: "0 auto 28px" }}>
          Seu cadastro foi concluído com sucesso. Faça login com o e-mail e senha que você cadastrou para acompanhar o status da sua consulta.
        </div>
        <button
          onClick={onDone}
          style={{
            width: "100%", padding: "16px", borderRadius: 12, border: "none",
            background: "#00BA84", color: "#fff", fontFamily: SF,
            fontWeight: 700, fontSize: 16, cursor: "pointer",
          }}
        >Ir para o login →</button>
      </div>
    );
  }

  const methods = [
    { key: "pix", label: "⚡ Pix" },
    { key: "cartao", label: "💳 Cartão" },
  ];

  return (
    <div>
      <SectionTitle>💳 Etapa 4 · Pagamento</SectionTitle>

      {/* Banner informativo — acima do valor, com fechar */}
      {bannerOpen && (
        <div style={{
          background: "#FEFBCC", border: "1px solid #E8D84B", borderRadius: RADIUS.md,
          padding: "13px 16px", marginBottom: 16,
          display: "flex", gap: 10, alignItems: "flex-start", position: "relative",
        }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>ⓘ</span>
          <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.55, fontFamily: SF, paddingRight: 24 }}>
            Assim que for realizado o pagamento, o nosso sistema identificará automaticamente e o médico logo lhe atenderá.
          </div>
          <button
            onClick={() => setBannerOpen(false)}
            style={{
              position: "absolute", top: 10, right: 10,
              background: "none", border: "none", cursor: "pointer",
              color: C.inkSoft, fontSize: 15, lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 24, height: 24, padding: 0,
            }}
          >✕</button>
        </div>
      )}

      {/* Valor */}
      <div style={{
        background: C.primarySoft, borderRadius: RADIUS.md, padding: "14px 18px",
        display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.inkSoft }}>Valor da consulta</span>
        <span style={{ fontFamily: SF, fontWeight: 700, fontSize: 24, color: C.primary }}>R$ 120,00</span>
      </div>

      {/* Tabs Pix / Cartão */}
      <div style={{ display: "flex", borderRadius: RADIUS.md, overflow: "hidden", border: `1.5px solid ${C.line}`, marginBottom: 22 }}>
        {methods.map((m, i) => {
          const active = method === m.key;
          return (
            <button
              key={m.key}
              onClick={() => { setMethod(m.key); setCardErrors({}); }}
              style={{
                flex: 1, padding: "13px 10px", border: "none",
                borderLeft: i > 0 ? `1.5px solid ${C.line}` : "none",
                background: active ? "#00BA84" : "#fff", cursor: "pointer",
                fontSize: 14, fontWeight: 700, fontFamily: SF,
                color: active ? "#fff" : C.inkSoft,
                transition: "all 0.15s",
              }}
            >{m.label}</button>
          );
        })}
      </div>

      {/* Conteúdo: Pix */}
      {method === "pix" && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ background: C.bgAlt, borderRadius: RADIUS.md, padding: 20, textAlign: "center", marginBottom: 16 }}>
            <div style={{ width: 168, height: 168, margin: "0 auto 14px", background: "#fff", borderRadius: RADIUS.md, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
              <QrPlaceholder seed={patient.id} />
            </div>
            <div style={{ fontFamily: SF_MONO, fontSize: 10.5, color: C.inkSoft, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 10px", wordBreak: "break-all", textAlign: "left", marginBottom: 10 }}>
              {pixCode}
            </div>
            <Button variant="subtle" size="sm" onClick={copyPix}>Copiar código Pix</Button>
          </div>

          {/* Temporizador */}
          <PixTimer />
        </div>
      )}

      {/* Conteúdo: Cartão */}
      {method === "cartao" && (
        <div style={{ marginBottom: 18 }}>
          {/* Seletor Débito / Crédito */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {[{ key: "credito", label: "Crédito" }, { key: "debito", label: "Débito" }].map((t) => {
              const active = cardType === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setCardType(t.key)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: RADIUS.md,
                    border: `2px solid ${active ? "#00BA84" : C.line}`,
                    background: active ? C.primarySoft : "#fff",
                    color: active ? "#00BA84" : C.ink,
                    fontFamily: SF, fontWeight: 700, fontSize: 14, cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >{t.label}</button>
              );
            })}
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 14 }}>
            Cartão de {cardType === "credito" ? "crédito" : "débito"}
          </div>

          <Field label="Número do cartão" required error={cardErrors.numero}>
            <TextInput
              placeholder="0000 0000 0000 0000"
              value={card.numero} error={cardErrors.numero}
              style={{ fontFamily: SF_MONO, letterSpacing: "0.08em" }}
              onChange={(e) => setCard((c) => ({ ...c, numero: maskCardNum(e.target.value) }))}
            />
          </Field>
          <Field label="Nome no cartão" required error={cardErrors.nome}>
            <TextInput
              placeholder="MARIA DA SILVA"
              value={card.nome} error={cardErrors.nome}
              style={{ textTransform: "uppercase" }}
              onChange={(e) => setCard((c) => ({ ...c, nome: e.target.value.toUpperCase() }))}
            />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Validade" required error={cardErrors.validade}>
              <TextInput
                placeholder="MM/AA" value={card.validade} error={cardErrors.validade}
                style={{ fontFamily: SF_MONO }}
                onChange={(e) => setCard((c) => ({ ...c, validade: maskValidade(e.target.value) }))}
              />
            </Field>
            <Field label="CVV" required error={cardErrors.cvv}>
              <TextInput
                placeholder="123" value={card.cvv} maxLength={4} error={cardErrors.cvv}
                style={{ fontFamily: SF_MONO }}
                onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
              />
            </Field>
          </div>
        </div>
      )}

      {/* Botão confirmar */}
      <Button full size="lg" onClick={confirmPayment}>
        {method === "pix" ? "Acessar plataforma do paciente" : "Confirmar pagamento"}
      </Button>

      <div style={{ marginTop: 12 }}>
        <Button variant="ghost" onClick={onBack}>← Voltar</Button>
      </div>
    </div>
  );
}

function QrPlaceholder({ seed }) {
  // Deterministic fake QR pattern from seed string
  const size = 12;
  const cells = [];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      h = (h * 1103515245 + 12345) >>> 0;
      cells.push((h >> 16) % 5 === 0);
    }
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
      <rect width={size} height={size} fill="#fff" />
      {cells.map((on, i) => on && (
        <rect key={i} x={i % size} y={Math.floor(i / size)} width={1} height={1} fill={C.primaryDark} />
      ))}
      {/* corner finder patterns for realism */}
      {[[0, 0], [size - 3, 0], [0, size - 3]].map(([fx, fy], idx) => (
        <g key={idx}>
          <rect x={fx} y={fy} width={3} height={3} fill={C.primaryDark} />
          <rect x={fx + 0.6} y={fy + 0.6} width={1.8} height={1.8} fill="#fff" />
          <rect x={fx + 1} y={fy + 1} width={1} height={1} fill={C.primaryDark} />
        </g>
      ))}
    </svg>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontFamily: SF, fontWeight: 700, fontSize: 19, margin: "0 0 18px", color: C.ink
    }}>{children}</h2>
  );
}

/* ---- Patient Dashboard (post-registration) ---- */
/* ============================================================
   ASSISTENTE MÉDICO VIRTUAL — chatbot com Claude AI
   ============================================================ */
function PatientAssistant({ patient, update }) {
  const [messages, setMessages] = useState(() => patient.chatHistory || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const systemPrompt = `Você é um assistente médico virtual da plataforma Sua Logo. Seu papel é acolher o paciente e coletar informações sobre seus sintomas de forma empática, como uma conversa natural.

Informações do paciente:
- Nome: ${patient.personal?.nome || "Paciente"}
- Data de nascimento: ${patient.personal?.nascimento || "Não informado"}

REGRA PRINCIPAL: Faça APENAS UMA pergunta por mensagem. Nunca faça duas perguntas ao mesmo tempo.

Fluxo da conversa (siga esta ordem, uma pergunta por vez):
1. Cumprimente e pergunte qual é o principal sintoma ou motivo da consulta
2. Pergunte há quanto tempo está com esse sintoma
3. Pergunte a intensidade da dor/desconforto de 0 a 10
4. Pergunte onde exatamente está o sintoma (localização)
5. Pergunte se tem outros sintomas relacionados
6. Pergunte sobre histórico médico relevante, alergias ou medicamentos em uso
7. Agradeça e apresente o "📋 RESUMO PARA O MÉDICO:" com tudo que foi coletado de forma estruturada

Regras adicionais:
- Responda de forma curta e direta — no máximo 2 frases antes da pergunta
- Seja acolhedor e humano, não robótico
- NÃO diagnostique nem prescreva medicamentos
- Responda sempre em português brasileiro`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "Desculpe, não consegui processar sua mensagem.";
      const assistantMsg = { role: "assistant", content: reply };
      const updated = [...next, assistantMsg];
      setMessages(updated);

      // Salva histórico no prontuário do paciente
      update((p) => ({ ...p, chatHistory: updated }));
    } catch (err) {
      toast("Erro ao conectar com o assistente. Tente novamente.", "error");
      setMessages(next);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    update((p) => ({ ...p, chatHistory: [] }));
    toast("Conversa reiniciada.", "info");
  };

  return (
    <div id="assistente" style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px 60px", scrollMarginTop: 90 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <Header
          eyebrow="Assistente médico virtual"
          title="Como posso te ajudar?"
          sub="Converse sobre seus sintomas. O histórico ficará disponível para o médico."
        />
        {messages.length > 0 && (
          <button onClick={clearChat} style={{
            background: "none", border: `1px solid ${C.line}`, borderRadius: RADIUS.sm,
            cursor: "pointer", fontSize: 12, color: C.inkSoft, fontFamily: SF,
            padding: "6px 10px", flexShrink: 0, marginTop: 4,
          }}>Limpar</button>
        )}
      </div>

      {/* Área do chat */}
      <div style={{
        ...glassPanel, borderRadius: RADIUS.lg,
        height: 420, display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Mensagens */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.length === 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, opacity: 0.7 }}>
              <div style={{ fontSize: 40 }}>🤖</div>
              <div style={{ fontSize: 14, color: C.inkSoft, textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>
                Olá, {patient.personal?.nome?.split(" ")[0] || "paciente"}! Sou o assistente virtual da Sua Logo. Como você está se sentindo hoje?
              </div>
              {/* Sugestões rápidas */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 }}>
                {["Dor de cabeça", "Febre", "Dor no corpo", "Falta de ar"].map((s) => (
                  <button key={s} onClick={() => setInput(s)} style={{
                    padding: "6px 12px", borderRadius: RADIUS.pill, fontSize: 12.5, fontWeight: 600,
                    fontFamily: SF, border: `1px solid ${C.primary}`, color: C.primary,
                    background: C.primarySoft, cursor: "pointer",
                  }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: 8, alignItems: "flex-end",
            }}>
              {msg.role === "assistant" && (
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: C.primarySoft,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, flexShrink: 0,
                }}>🤖</div>
              )}
              <div style={{
                maxWidth: "78%", padding: "10px 14px", borderRadius: 16,
                borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                borderBottomLeftRadius: msg.role === "assistant" ? 4 : 16,
                background: msg.role === "user" ? "#00BA84" : "#fff",
                color: msg.role === "user" ? "#fff" : C.ink,
                fontSize: 14, fontFamily: SF, lineHeight: 1.55,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: "#00BA84",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0, fontFamily: SF,
                }}>
                  {(patient.personal?.nome || "P")[0].toUpperCase()}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.primarySoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
              <div style={{ padding: "10px 16px", borderRadius: 16, borderBottomLeftRadius: 4, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%", background: C.inkSoft,
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          borderTop: `1px solid ${C.line}`, padding: "12px 16px",
          display: "flex", gap: 10, alignItems: "flex-end", background: "#fff",
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Descreva seus sintomas..."
            rows={1}
            style={{
              flex: 1, border: `1.5px solid ${C.line}`, borderRadius: 12,
              padding: "10px 14px", fontFamily: SF, fontSize: 14, color: C.ink,
              resize: "none", outline: "none", lineHeight: 1.5, maxHeight: 100,
              overflowY: "auto", background: C.bg,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              width: 42, height: 42, borderRadius: "50%", border: "none", flexShrink: 0,
              background: input.trim() && !loading ? "#00BA84" : C.line,
              color: "#fff", cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,80%,100%{opacity:0.3;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}

function PatientDashboard({ patient, update }) {
  const toast = useToast();
  const released = patient.status === "concluido";
  const isWaiting = patient.status === "aguardando_homologacao" || patient.status === "aguardando_medico";

  /* ---- Minha consulta: edição dos dados pessoais ---- */
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState(patient.personal || {});
  const setInfo = (k, v) => setInfoForm((f) => ({ ...f, [k]: v }));

  const saveInfo = () => {
    if (countWords(infoForm.nome || "") < 2) { toast("Informe nome e sobrenome.", "error"); return; }
    if (!validEmail(infoForm.email || "")) { toast("E-mail inválido.", "error"); return; }
    update((p) => ({ ...p, personal: { ...p.personal, ...infoForm } }));
    setEditingInfo(false);
    toast("Informações atualizadas com sucesso.", "success");
  };

  /* ---- Documentos: reupload ---- */
  const [editingDocs, setEditingDocs] = useState(false);
  const [docsForm, setDocsForm] = useState({
    identityUploaded: patient.docs.identityUploaded,
    identityFile: patient.docs.identityFile,
    addressUploaded: patient.docs.addressUploaded,
    addressFile: patient.docs.addressFile,
  });
  const identityRef = useRef(null);
  const addressRef = useRef(null);

  const handleDocFile = (kind, file) => {
    if (!file) return;
    const ok = ["application/pdf", "image/png", "image/jpeg"].includes(file.type);
    if (!ok) { toast("Formato inválido. Use PDF, PNG ou JPG.", "error"); return; }
    if (kind === "identity" && file.size > 5 * 1024 * 1024) { toast("Arquivo muito grande (máx 5MB).", "error"); return; }
    setDocsForm((d) => ({
      ...d,
      [kind === "identity" ? "identityUploaded" : "addressUploaded"]: true,
      [kind === "identity" ? "identityFile" : "addressFile"]: file.name,
    }));
    toast(`${kind === "identity" ? "Documento de identidade" : "Comprovante"} selecionado.`, "success");
  };

  const saveDocs = () => {
    if (!docsForm.identityUploaded) { toast("Envie o documento de identidade.", "error"); return; }
    if (!docsForm.addressUploaded) { toast("Envie o comprovante de residência.", "error"); return; }
    update((p) => ({ ...p, docs: { ...p.docs, ...docsForm } }));
    setEditingDocs(false);
    toast("Documentos atualizados.", "success");
  };

  const download = (kind) => {
    if (released) { toast(`Baixando ${kind}.pdf...`, "success"); return; }
    if (!patient.clinical.savedByDoctor) {
      toast("Seus documentos ainda não foram emitidos pelo médico. Aguarde a consulta.", "warn"); return;
    }
    toast("Seus documentos estão aguardando a validação final do Administrador.", "warn");
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px 60px" }}>
      <Header eyebrow="Meu atendimento" title={patient.personal?.nome?.split(" ")[0] || "Paciente"}
        sub={`Protocolo ${patient.id}`} />

      {/* ---- SEÇÃO: MINHA CONSULTA ---- */}
      <div id="dashboard" style={{ ...glassPanel, borderRadius: RADIUS.lg, padding: 24, marginTop: 20, scrollMarginTop: 90 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 16, color: C.ink }}>Status da consulta</div>
          <StatusBadge status={patient.status} />
        </div>
        <CustodyStrip status={patient.status} />

        {/* Dados cadastrais — editáveis */}
        {isWaiting && (
          <div style={{ marginTop: 22, borderTop: `1px solid ${C.line}`, paddingTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 14, color: C.ink }}>Informações cadastradas</div>
              {!editingInfo ? (
                <Button size="sm" variant="ghost" onClick={() => setEditingInfo(true)}>Editar</Button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <Button size="sm" variant="subtle" onClick={() => { setInfoForm(patient.personal || {}); setEditingInfo(false); }}>Cancelar</Button>
                  <Button size="sm" onClick={saveInfo}>Salvar</Button>
                </div>
              )}
            </div>

            {!editingInfo ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }} className="detail-grid">
                {[
                  { label: "Nome", value: patient.personal?.nome },
                  { label: "E-mail", value: patient.personal?.email },
                  { label: "Telefone", value: patient.personal?.telefone },
                  { label: "CPF", value: patient.personal?.cpf },
                  { label: "Data de nascimento", value: patient.personal?.nascimento },
                  { label: "RG", value: patient.personal?.rg },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{value || "—"}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="detail-grid">
                <Field label="Nome completo" required>
                  <TextInput value={infoForm.nome || ""} onChange={(e) => setInfo("nome", e.target.value)} placeholder="Nome completo" />
                </Field>
                <Field label="E-mail" required>
                  <TextInput type="email" value={infoForm.email || ""} onChange={(e) => setInfo("email", e.target.value)} placeholder="E-mail" />
                </Field>
                <Field label="Telefone">
                  <TextInput value={infoForm.telefone || ""} onChange={(e) => setInfo("telefone", maskPhone(e.target.value))} placeholder="(00) 00000-0000" />
                </Field>
                <Field label="Data de nascimento">
                  <TextInput value={infoForm.nascimento || ""} onChange={(e) => setInfo("nascimento", maskDate(e.target.value))} placeholder="DD/MM/AAAA" />
                </Field>
              </div>
            )}
          </div>
        )}

        {/* Triagem resumida */}
        {isWaiting && patient.triage && (
          <div style={{ marginTop: 16, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
            <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 10 }}>Triagem médica</div>
            <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.6 }}>
              <strong>Sintomas:</strong> {patient.triage.sintomas}<br />
              <strong>Dor:</strong> {patient.triage.dorLocal} — intensidade {patient.triage.dorIntensidade}/10
            </div>
          </div>
        )}
      </div>

      {/* ---- SEÇÃO: DOCUMENTOS ---- */}
      <div id="documentos" style={{ ...glassPanel, borderRadius: RADIUS.lg, padding: 24, marginTop: 16, scrollMarginTop: 90 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 16, color: C.ink }}>Documentos</div>
          {isWaiting && !editingDocs && (
            <Button size="sm" variant="ghost" onClick={() => setEditingDocs(true)}>Editar</Button>
          )}
          {isWaiting && editingDocs && (
            <div style={{ display: "flex", gap: 8 }}>
              <Button size="sm" variant="subtle" onClick={() => { setDocsForm({ identityUploaded: patient.docs.identityUploaded, identityFile: patient.docs.identityFile, addressUploaded: patient.docs.addressUploaded, addressFile: patient.docs.addressFile }); setEditingDocs(false); }}>Cancelar</Button>
              <Button size="sm" onClick={saveDocs}>Salvar</Button>
            </div>
          )}
        </div>

        {/* Documentos enviados pelo paciente */}
        {[
          { key: "identity", label: "Documento de identidade", hint: "RG ou CNH — frente e verso", uploaded: docsForm.identityUploaded, file: docsForm.identityFile, ref: identityRef },
          { key: "address", label: "Comprovante de residência", hint: "Emitido nos últimos 90 dias", uploaded: docsForm.addressUploaded, file: docsForm.addressFile, ref: addressRef },
        ].map((doc) => (
          <div key={doc.key} style={{ padding: "14px 0", borderBottom: `1px solid ${C.line}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: RADIUS.sm, flexShrink: 0,
                  background: doc.uploaded ? C.sageSoft : C.bgAlt,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
                }}>{doc.uploaded ? "✓" : "📄"}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{doc.label}</div>
                  <div style={{ fontSize: 12, color: doc.uploaded ? C.sage : C.inkSoft, fontWeight: 500, marginTop: 2 }}>
                    {doc.uploaded ? doc.file : "Não enviado"}
                  </div>
                </div>
              </div>
              {editingDocs && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => doc.ref.current?.click()}>
                    {doc.uploaded ? "Trocar" : "Enviar"}
                  </Button>
                  <input ref={doc.ref} type="file" accept=".pdf,.png,.jpg,.jpeg" style={{ display: "none" }}
                    onChange={(e) => handleDocFile(doc.key, e.target.files?.[0])} />
                </>
              )}
            </div>
            <div style={{ fontSize: 11.5, color: C.inkTertiary, marginTop: 4, paddingLeft: 48 }}>{doc.hint}</div>
          </div>
        ))}

        {/* Receita e Laudo médicos */}
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 16, marginBottom: 8 }}>
            Emitidos pelo médico
          </div>
          {[
            { kind: "receita", icon: "℞", label: "Receita médica" },
            { kind: "laudo", icon: "🩺", label: "Laudo médico" },
          ].map(({ kind, icon, label }) => (
            <div key={kind} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.line}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: released ? C.sageSoft : C.bgAlt,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
                }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: 12, color: released ? C.sage : C.inkSoft, fontWeight: 500 }}>
                    {released ? "Liberado" : "Aguardando validação do médico"}
                  </div>
                </div>
              </div>
              {released && (
                <Button variant="primary" size="sm" onClick={() => download(kind)}>
                  Baixar
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`@media(max-width:520px){.detail-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

function DocRow({ icon, label, ready, onClick }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 0", borderBottom: `1px solid ${C.line}`
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: ready ? C.sageSoft : C.bgAlt,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
        }}>{icon}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: 12, color: ready ? C.sage : C.inkSoft, fontWeight: 600 }}>
            {ready ? "Liberado" : "Pendente de validação"}
          </div>
        </div>
      </div>
      <Button variant={ready ? "primary" : "ghost"} size="sm" onClick={onClick}>
        Baixar {label.split(" ")[0]}
      </Button>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    cadastro_incompleto: { label: "Cadastro incompleto", tone: "neutral" },
    aguardando_homologacao: { label: "Aguardando homologação geral", tone: "amber" },
    aguardando_medico: { label: "Na fila do médico", tone: "amber" },
    retido_admin: { label: "Retido pelo admin", tone: "amber" },
    concluido: { label: "Concluído", tone: "sage" },
  };
  const m = map[status] || map.cadastro_incompleto;
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

/* ============================================================
   DOCTOR VIEW — conditional queue + prontuário
   ============================================================ */
function DoctorView({ patients, updatePatient, section, onSectionChange }) {
  const toast = useToast();
  const [openId, setOpenId] = useState(null);
  const [openMode, setOpenMode] = useState(null); // "record" | "detail"

  const eligible = patients.filter((p) =>
    p.personal && p.triage && p.docs.identityUploaded && p.docs.addressUploaded && p.payment.confirmed
  );

  useEffect(() => {
    eligible.forEach((p) => {
      if (p.status === "aguardando_homologacao") {
        updatePatient(p.id, (pp) => ({ ...pp, status: "aguardando_medico" }));
      }
    });
  }, [patients.length, patients.map((p) => p.status).join(",")]);

  const openRecord = (id) => { setOpenId(id); setOpenMode("record"); };
  const openDetail = (id) => { setOpenId(id); setOpenMode("detail"); };
  const closeOpen = () => { setOpenId(null); setOpenMode(null); };

  const openPatient = patients.find((p) => p.id === openId);

  if (openPatient && openMode === "record") {
    return <DoctorRecord patient={openPatient} onBack={closeOpen} updatePatient={updatePatient} />;
  }
  if (openPatient && openMode === "detail") {
    return <PatientDetailPage patient={openPatient} onBack={closeOpen} role="medico" />;
  }

  const showAll = section === "pacientes";

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 60px" }}>
      <Header eyebrow="Central do médico"
        title={showAll ? "Lista de pacientes" : "Fila de atendimento"}
        sub={showAll
          ? "Todos os pacientes cadastrados com informações de cadastro, atendimento e pagamento."
          : "Pacientes que concluíram cadastro, triagem, documentação e pagamento."} />

      {!showAll ? (
        eligible.length === 0 ? (
          <EmptyState
            title="Nenhum paciente na fila"
            text="Pacientes só aparecem aqui após concluir as 3 etapas de cadastro e confirmar o pagamento simulado."
          />
        ) : (
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {eligible.map((p) => (
              <QueueCard key={p.id} patient={p} onOpen={() => openRecord(p.id)} />
            ))}
          </div>
        )
      ) : (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {patients.length === 0 && (
            <EmptyState title="Nenhum paciente ainda" text="Os pacientes aparecerão aqui após se cadastrarem." />
          )}
          {patients.map((p) => (
            <PatientFullCard key={p.id} patient={p} onOpen={() => openDetail(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

/* Card completo para Lista de pacientes do médico */
function PatientFullCard({ patient, onOpen }) {
  const initials = (patient.personal?.nome || "?")
    .split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

  const statusColors = {
    cadastro_incompleto:     { bg: "rgba(142,142,147,0.12)", color: "#3C3C43" },
    aguardando_homologacao:  { bg: "rgba(255,159,10,0.12)",  color: "#B96A00" },
    aguardando_medico:       { bg: "rgba(255,159,10,0.12)",  color: "#B96A00" },
    retido_admin:            { bg: "rgba(0,122,255,0.10)",   color: "#0055CC" },
    concluido:               { bg: "rgba(16,185,129,0.12)",  color: "#0B8C63" },
  };
  const sc = statusColors[patient.status] || statusColors.cadastro_incompleto;

  const Row = ({ icon, label, value, green }) => value ? (
    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{ fontSize: 12, color: C.inkSoft, flexShrink: 0 }}>{label}:</span>
      <span style={{ fontSize: 12.5, color: green ? "#00BA84" : C.ink, fontWeight: 500 }}>{value}</span>
    </div>
  ) : null;

  return (
    <div style={{
      background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16,
      padding: "18px 20px", boxShadow: "0 2px 8px -4px rgba(0,0,0,0.07)",
    }}>
      {/* Cabeçalho */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: "rgba(16,185,129,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: SF, fontWeight: 700, fontSize: 16, color: "#0B8C63",
        }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: SF, color: C.ink }}>{patient.personal?.nome || "Cadastro incompleto"}</div>
          <div style={{ fontSize: 11.5, color: C.inkSoft, fontFamily: SF, marginTop: 1 }}>{patient.id}</div>
        </div>
        <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, fontFamily: SF, background: sc.bg, color: sc.color, flexShrink: 0 }}>
          {{ cadastro_incompleto: "Incompleto", aguardando_homologacao: "Aguardando", aguardando_medico: "Na fila", retido_admin: "Retido admin", concluido: "Concluído" }[patient.status] || patient.status}
        </span>
      </div>

      {/* Grid de informações */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", borderTop: `1px solid ${C.line}`, paddingTop: 12 }} className="detail-grid">
        {/* Cadastro */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Cadastro</div>
          <Row icon="📧" label="E-mail" value={patient.personal?.email} />
          <Row icon="📞" label="Tel" value={patient.personal?.telefone} />
          <Row icon="🪪" label="CPF" value={patient.personal?.cpf} />
          <Row icon="🎂" label="Nasc." value={patient.personal?.nascimento} />
        </div>
        {/* Triagem */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Triagem</div>
          <Row icon="🤒" label="Sintomas" value={patient.triage?.sintomas ? patient.triage.sintomas.slice(0, 50) + (patient.triage.sintomas.length > 50 ? "…" : "") : null} />
          <Row icon="📍" label="Local" value={patient.triage?.dorLocal} />
          <Row icon="🔢" label="Intensidade" value={patient.triage?.dorIntensidade ? patient.triage.dorIntensidade + "/10" : null} />
        </div>
      </div>

      {/* Badges de status */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.line}`, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: patient.docs.identityUploaded ? "rgba(16,185,129,0.12)" : C.bgAlt, color: patient.docs.identityUploaded ? "#0B8C63" : C.inkSoft }}>
            {patient.docs.identityUploaded ? "✓ Docs enviados" : "Docs pendentes"}
          </span>
          <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: patient.payment.confirmed ? "rgba(16,185,129,0.12)" : C.bgAlt, color: patient.payment.confirmed ? "#0B8C63" : C.inkSoft }}>
            {patient.payment.confirmed ? `✓ Pago (${patient.payment.method || "—"})` : "Pgto pendente"}
          </span>
          {patient.clinical?.savedByDoctor && (
            <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: "rgba(0,122,255,0.1)", color: "#0055CC" }}>✓ Prontuário emitido</span>
          )}
        </div>
        <button
          onClick={onOpen}
          style={{
            padding: "8px 18px", borderRadius: 10, border: "none",
            background: "#00BA84", color: "#fff", fontFamily: SF,
            fontWeight: 700, fontSize: 13.5, cursor: "pointer", flexShrink: 0,
          }}
        >Visualizar</button>
      </div>

      <style>{"@media(max-width:520px){.detail-grid{grid-template-columns:1fr!important;}}"}</style>
    </div>
  );
}

function QueueCard({ patient, onOpen }) {
  const initials = (patient.personal?.nome || "?")
    .split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${C.line}`,
      borderRadius: 16,
      padding: "18px 20px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      boxShadow: "0 2px 12px -4px rgba(0,0,0,0.08)",
    }}>
      {/* Avatar */}
      <div style={{
        width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
        background: "rgba(16,185,129,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: SF, fontWeight: 700, fontSize: 17, color: "#0B8C63",
      }}>{initials}</div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 16, fontFamily: SF, color: C.ink, marginBottom: 4 }}>
          {patient.personal.nome}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ fontSize: 13.5, color: C.inkSoft, fontFamily: SF }}>
            {patient.personal.email}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13.5, color: C.inkSoft, fontFamily: SF }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.05 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.9v2.02z"/>
            </svg>
            {patient.personal.telefone}
          </span>
        </div>
        {/* Badges */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            padding: "4px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, fontFamily: SF,
            background: "rgba(255,159,10,0.15)", color: "#B96A00",
          }}>
            {({ aguardando_medico: "Na fila do médico", retido_admin: "Retido pelo admin", concluido: "Concluído" }[patient.status]) || "Na fila"}
          </span>
          {patient.payment.confirmed && (
            <span style={{
              padding: "4px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, fontFamily: SF,
              background: "rgba(16,185,129,0.12)", color: "#0B8C63",
            }}>Pago</span>
          )}
          {patient.docs.identityUploaded && patient.docs.addressUploaded && (
            <span style={{
              padding: "4px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, fontFamily: SF,
              background: "rgba(16,185,129,0.12)", color: "#0B8C63",
            }}>Docs enviados</span>
          )}
        </div>
      </div>

      {/* Botão Visualizar */}
      <button
        onClick={onOpen}
        style={{
          flexShrink: 0, padding: "13px 22px",
          background: "#00BA84", border: "none", borderRadius: 12,
          color: "#fff", fontFamily: SF, fontWeight: 700, fontSize: 15,
          cursor: "pointer", minHeight: HIT_MIN,
          boxShadow: "0 4px 12px -4px rgba(0,186,132,0.4)",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >Visualizar</button>
    </div>
  );
}

/* Card rico para "Todos os pacientes" — médico e admin */
function PatientCard({ patient, onOpen, secondaryAction }) {
  const initials = (patient.personal?.nome || "?")
    .split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  return (
    <div style={{
      ...glassPanel, borderRadius: RADIUS.lg,
      padding: "18px 20px",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      gap: isMobile ? 12 : 16,
    }}>
      {/* Linha topo: avatar + info */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0, width: "100%" }}>
        {/* Avatar */}
        <div style={{
          width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
          background: C.primarySoft,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: SF, fontWeight: 700, fontSize: 17, color: C.primary,
        }}>{initials}</div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: SF, color: C.ink,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {patient.personal?.nome || "Cadastro incompleto"}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
            {patient.personal?.email && (
              <span style={{ fontSize: 12, color: C.inkSoft, fontFamily: SF }}>
                {patient.personal.email}
              </span>
            )}
            {patient.personal?.telefone && (
              <span style={{ fontSize: 12, color: C.inkSoft }}>
                📞 {patient.personal.telefone}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
            <StatusBadge status={patient.status} />
            {patient.payment.confirmed && <Badge tone="sage">Pago</Badge>}
            {patient.docs.identityUploaded && <Badge tone="primary">Docs enviados</Badge>}
          </div>
        </div>

        {/* Ações — direita no desktop */}
        {!isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
            <Button size="sm" variant="primary" onClick={onOpen}>Visualizar</Button>
            {secondaryAction && (
              <Button size="sm" variant="ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Botão abaixo dos badges — só mobile */}
      {isMobile && (
        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          <Button full size="sm" variant="primary" onClick={onOpen}>Visualizar</Button>
          {secondaryAction && (
            <Button full size="sm" variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* Página de detalhe completo do paciente */
/* Wrapper para subpáginas — scroll ao topo ao abrir, padding consistente */
/* Header de página interna — só desktop, ícone voltar + título */
function DesktopPageHeader({ onBack, title }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "18px 0 12px", marginBottom: 8,
      borderBottom: `1px solid ${C.line}`,
    }}>
      <button
        onClick={onBack}
        style={{
          width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${C.line}`,
          background: "#fff", cursor: "pointer", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.ink, transition: "all 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = C.primarySoft; e.currentTarget.style.borderColor = "#00BA84"; e.currentTarget.style.color = "#00BA84"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.ink; }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <span style={{ fontFamily: SF, fontWeight: 700, fontSize: 18, color: C.ink, letterSpacing: "-0.01em" }}>
        {title}
      </span>
    </div>
  );
}

function SubPage({ children, onBack, backLabel = "← Voltar" }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 60px" }}>
      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        color: "#00BA84", fontWeight: 600, fontSize: 13.5, fontFamily: SF,
        display: "flex", alignItems: "center", gap: 4, marginBottom: 20, minHeight: HIT_MIN,
      }}>{backLabel}</button>
      {children}
    </div>
  );
}

function PatientDetailPage({ patient, onBack, role }) {
  const p = patient;
  const hasPersonal = !!p.personal;
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const content = (
    <div>
      {/* Header do paciente */}
      <div style={{ ...glassPanel, borderRadius: RADIUS.lg, padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", background: C.primarySoft,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: SF, fontWeight: 700, fontSize: 20, color: C.primary, flexShrink: 0
          }}>
            {(p.personal?.nome || "?").split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")}
          </div>
          <div>
            <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 20, color: C.ink }}>
              {p.personal?.nome || "Cadastro incompleto"}
            </div>
            <div style={{ fontSize: 12, color: C.inkSoft, fontFamily: SF_MONO, marginTop: 2 }}>
              {p.id}
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <StatusBadge status={p.status} />
          </div>
        </div>
        <CustodyStrip status={p.status} />
      </div>

      {/* Dados pessoais */}
      {hasPersonal && (
        <DetailSection title="📑 Dados pessoais">
          <DetailGrid>
            <DetailItem label="Nome completo" value={p.personal.nome} />
            <DetailItem label="E-mail" value={p.personal.email} />
            <DetailItem label="Telefone" value={p.personal.telefone} />
            <DetailItem label="CPF" value={p.personal.cpf} mono />
            <DetailItem label="RG" value={p.personal.rg} mono />
            <DetailItem label="Data de nascimento" value={p.personal.nascimento} />
          </DetailGrid>
        </DetailSection>
      )}

      {/* Triagem médica */}
      {p.triage && (
        <DetailSection title="🩺 Triagem médica">
          <DetailItem label="Sintomas" value={p.triage.sintomas} full />
          <DetailGrid>
            <DetailItem label="Local da dor" value={p.triage.dorLocal} />
            <DetailItem label="Intensidade" value={`${p.triage.dorIntensidade}/10`} />
          </DetailGrid>
          <DetailItem label="Histórico / alergias / medicamentos" value={p.triage.historico} full />
        </DetailSection>
      )}

      {/* Documentação */}
      <DetailSection title="🗂️ Documentação">
        <DetailGrid>
          <DetailItem
            label="Documento de identidade"
            value={p.docs.identityUploaded ? p.docs.identityFile : "Não enviado"}
            tone={p.docs.identityUploaded ? "sage" : "neutral"}
          />
          <DetailItem
            label="Comprovante de residência"
            value={p.docs.addressUploaded ? p.docs.addressFile : "Não enviado"}
            tone={p.docs.addressUploaded ? "sage" : "neutral"}
          />
        </DetailGrid>
      </DetailSection>

      {/* Pagamento */}
      <DetailSection title="💳 Pagamento">
        <DetailItem
          label="Status"
          value={p.payment.confirmed ? "Confirmado pelo paciente" : "Aguardando confirmação"}
          tone={p.payment.confirmed ? "sage" : "amber"}
        />
      </DetailSection>

      {/* Prontuário (só se médico salvou) */}
      {p.clinical.savedByDoctor && (
        <DetailSection title="℞ Prontuário médico">
          <DetailItem label="Receita" value={p.clinical.receita || "—"} full />
          <DetailItem label="Laudo" value={p.clinical.laudo || "—"} full />
        </DetailSection>
      )}

      {/* Histórico do assistente virtual */}
      {p.chatHistory?.length > 0 && (
        <DetailSection title="🤖 Histórico — Assistente virtual">
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 320, overflowY: "auto" }}>
            {p.chatHistory.map((msg, i) => (
              <div key={i} style={{
                padding: "8px 12px", borderRadius: 10,
                background: msg.role === "user" ? C.primarySoft : C.bgAlt,
                fontSize: 13, fontFamily: SF, lineHeight: 1.55, color: C.ink,
              }}>
                <span style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", color: msg.role === "user" ? C.primary : C.inkSoft }}>
                  {msg.role === "user" ? `${p.personal?.nome?.split(" ")[0] || "Paciente"}` : "Assistente"}
                </span>
                <div style={{ marginTop: 3, whiteSpace: "pre-wrap" }}>{msg.content}</div>
              </div>
            ))}
          </div>
        </DetailSection>
      )}
    </div>
  );

  if (isMobile) return <SubPage onBack={onBack}>{content}</SubPage>;
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 60px" }}>
      <DesktopPageHeader onBack={onBack} title={`Perfil — ${p.personal?.nome || "Paciente"}`} />
      {content}
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <div style={{ ...glassPanel, borderRadius: RADIUS.lg, padding: 22, marginBottom: 14 }}>
      <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 15, marginBottom: 16, color: C.ink }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function DetailGrid({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}
      className="detail-grid">
      <style>{`@media(max-width:520px){.detail-grid{grid-template-columns:1fr!important;}}`}</style>
      {children}
    </div>
  );
}

function DetailItem({ label, value, mono, full, tone }) {
  const color = tone === "sage" ? C.sage : tone === "amber" ? C.amber : tone === "red" ? C.red : C.ink;
  return (
    <div style={full ? { marginBottom: 12 } : {}}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase",
        letterSpacing: "0.04em", marginBottom: 4 }}>{label}</div>
      <div style={{
        fontSize: 14, fontFamily: mono ? SF_MONO : SF, color,
        lineHeight: 1.5, wordBreak: "break-word"
      }}>{value || "—"}</div>
    </div>
  );
}

function DoctorRecord({ patient, onBack, updatePatient }) {
  const toast = useToast();
  const [receita, setReceita] = useState(patient.clinical.receita);
  const [laudo, setLaudo] = useState(patient.clinical.laudo);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 640
  );

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const nome  = patient.personal?.nome  || "Paciente";
  const sints = patient.triage?.sintomas || "";
  const dorL  = patient.triage?.dorLocal || "";

  const receitaSugg = [
    "Dipirona Sódica 500mg — 1 comprimido a cada 6h por 5 dias em caso de dor ou febre acima de 37,8°C.\nIbuprofeno 400mg — 1 comprimido a cada 8h por 3 dias se necessário para dor " + (dorL || "localizada") + ".\nOriento repouso e hidratação adequada.",
    "Paracetamol 750mg — 1 comprimido a cada 6h se necessário, máximo 4x/dia.\nNão utilizar com bebidas alcoólicas. Retornar se não houver melhora em 48h.",
    "Sem medicamentos prescritos neste momento.\nOriento mudanças de hábito e retorno em 7 dias para reavaliação.",
  ];

  const laudoSugg = [
    "Paciente " + nome + " compareceu à teleconsulta referindo " + (sints || "queixas descritas na triagem") + ". Ao exame clínico remoto, paciente em bom estado geral, consciente e orientado(a).\n\nHipótese diagnóstica: quadro compatível com os sintomas relatados. Sem sinais de alarme identificados nesta avaliação.\n\nConduta: tratamento sintomático conforme prescrição. Retorno em 7 dias ou antes se piora dos sintomas.",
    "Consulta de telemedicina realizada. Paciente relata " + (sints || "sintomas descritos em triagem") + ". Exame físico remoto sem alterações significativas.\n\nPaciente orientado(a) quanto ao tratamento prescrito e sinais de alarme para busca de atendimento presencial.",
  ];

  const handleSave = () => {
    if (!receita.trim() && !laudo.trim()) {
      toast("Preencha ao menos a receita ou o laudo antes de salvar.", "error");
      return;
    }
    updatePatient(patient.id, (p) => ({
      ...p,
      clinical: { receita, laudo, savedByDoctor: true, savedAt: new Date().toISOString() },
      status: "retido_admin",
    }));
    toast("Documentos salvos. Status alterado para Retido pelo Admin.", "success");
    onBack();
  };

  const initials   = nome.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  const statusLabel = { aguardando_medico: "Na fila do médico", retido_admin: "Retido pelo admin", concluido: "Concluído" }[patient.status] || "Na fila";

  const CARD = { background: "#fff", borderRadius: 16, padding: 22, marginBottom: 12, boxShadow: "0 2px 12px -4px rgba(0,0,0,0.07)", border: `1px solid ${C.line}` };
  const LBL  = { fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 };
  const VAL  = { fontSize: 14, color: C.ink, lineHeight: 1.5, fontFamily: SF };

  const SugBtn = ({ label, onClick }) => (
    <button onClick={onClick} style={{ padding: "5px 12px", borderRadius: RADIUS.pill, fontSize: 12, fontWeight: 600, fontFamily: SF, border: `1px solid ${C.primary}`, color: C.primary, background: C.primarySoft, cursor: "pointer" }}>{label}</button>
  );
  const ZeroBtn = ({ onClick }) => (
    <button onClick={onClick} style={{ padding: "5px 12px", borderRadius: RADIUS.pill, fontSize: 12, fontWeight: 600, fontFamily: SF, border: `1px solid ${C.line}`, color: C.inkSoft, background: "#fff", cursor: "pointer" }}>Escrever do zero</button>
  );

  const body = (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ ...CARD, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SF, fontWeight: 700, fontSize: 16, color: "#0B8C63" }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 17, fontFamily: SF, color: C.ink }}>{nome}</div>
            <div style={{ fontSize: 12, color: C.inkSoft, fontFamily: SF, marginTop: 1 }}>{patient.id}</div>
          </div>
          <span style={{ padding: "5px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, fontFamily: SF, background: "rgba(255,159,10,0.15)", color: "#B96A00", flexShrink: 0 }}>{statusLabel}</span>
        </div>
        <CustodyStrip status={patient.status} />
      </div>

      {/* ── Dados pessoais ── */}
      <div style={CARD}>
        <div style={{ fontWeight: 700, fontSize: 15, fontFamily: SF, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>📋 Dados pessoais</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 32px" }} className="detail-grid">
          {[["Nome completo", patient.personal.nome], ["E-mail", patient.personal.email], ["Telefone", patient.personal.telefone], ["CPF", patient.personal.cpf], ["RG", patient.personal.rg], ["Nascimento", patient.personal.nascimento]].map(([l, v]) => (
            <div key={l}><div style={LBL}>{l}</div><div style={VAL}>{v || "—"}</div></div>
          ))}
        </div>
      </div>

      {/* ── Triagem ── */}
      <div style={CARD}>
        <div style={{ fontWeight: 700, fontSize: 15, fontFamily: SF, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>🩺 Triagem médica</div>
        <div style={{ marginBottom: 12 }}><div style={LBL}>Sintomas</div><div style={VAL}>{patient.triage?.sintomas || "—"}</div></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 32px" }} className="detail-grid">
          <div><div style={LBL}>Local da dor</div><div style={VAL}>{patient.triage?.dorLocal || "—"}</div></div>
          <div><div style={LBL}>Intensidade</div><div style={VAL}>{patient.triage?.dorIntensidade ? patient.triage.dorIntensidade + "/10" : "—"}</div></div>
        </div>
        <div style={{ marginTop: 12 }}><div style={LBL}>Histórico / alergias / medicamentos</div><div style={VAL}>{patient.triage?.historico || "—"}</div></div>
      </div>

      {/* ── Documentação com Visualizar ── */}
      <div style={CARD}>
        <div style={{ fontWeight: 700, fontSize: 15, fontFamily: SF, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>🗂️ Documentação</div>
        {[
          { label: "Documento de identidade",   file: patient.docs.identityFile, ok: patient.docs.identityUploaded },
          { label: "Comprovante de residência",  file: patient.docs.addressFile,  ok: patient.docs.addressUploaded  },
        ].map((doc) => (
          <div key={doc.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.line}`, gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: doc.ok ? "rgba(0,186,132,0.1)" : C.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{doc.ok ? "✓" : "📄"}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{doc.label}</div>
                <div style={{ fontSize: 12, color: doc.ok ? "#00BA84" : C.inkSoft, marginTop: 2, fontWeight: 500 }}>{doc.file || "Não enviado"}</div>
              </div>
            </div>
            {doc.ok && (
              <button onClick={() => toast(`Visualizando ${doc.file} — em produção abrirá o arquivo real.`, "info")} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #00BA84", background: "#fff", color: "#00BA84", fontFamily: SF, fontWeight: 600, fontSize: 13, cursor: "pointer", flexShrink: 0 }}>Visualizar</button>
            )}
          </div>
        ))}
      </div>

      {/* ── Pagamento ── */}
      <div style={CARD}>
        <div style={{ fontWeight: 700, fontSize: 15, fontFamily: SF, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>💳 Pagamento</div>
        <div style={LBL}>Status</div>
        <div style={{ fontSize: 14, color: patient.payment.confirmed ? "#00BA84" : C.inkSoft, fontWeight: 600, fontFamily: SF }}>{patient.payment.confirmed ? "Confirmado pelo paciente" : "Aguardando confirmação"}</div>
      </div>

      {/* ── Histórico assistente ── */}
      {patient.chatHistory?.length > 0 && (
        <div style={CARD}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: SF, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>🤖 Histórico — Assistente virtual</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto" }}>
            {patient.chatHistory.map((msg, i) => (
              <div key={i} style={{ padding: "8px 12px", borderRadius: 10, background: msg.role === "user" ? "rgba(0,186,132,0.08)" : "#F7F7F7", fontSize: 13, fontFamily: SF, lineHeight: 1.55 }}>
                <div style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", color: msg.role === "user" ? "#00BA84" : C.inkSoft, marginBottom: 3 }}>{msg.role === "user" ? nome.split(" ")[0] : "Assistente"}</div>
                <div style={{ whiteSpace: "pre-wrap", color: C.ink }}>{msg.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Banner azul informativo ── */}
      <div style={{ background: "rgba(0,122,255,0.06)", border: "1px solid rgba(0,122,255,0.2)", borderRadius: RADIUS.md, padding: "12px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
        <span style={{ fontSize: 13.5, color: "#0055CC", fontFamily: SF, fontWeight: 500, lineHeight: 1.5 }}>Ao salvar, os documentos ficam retidos até validação do Administrador.</span>
      </div>

      {/* ── Emitir documentos ── */}
      <div style={CARD}>
        <div style={{ fontWeight: 700, fontSize: 17, fontFamily: SF, marginBottom: 18, color: C.ink }}>Emitir documentos</div>

        <Field label="Receita">
          <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 8 }}>Sugestões baseadas na triagem:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {receitaSugg.map((s, i) => <SugBtn key={i} label={"Sugestão " + (i + 1)} onClick={() => setReceita(s)} />)}
            <ZeroBtn onClick={() => setReceita("")} />
          </div>
          <TextArea placeholder="Descreva a prescrição médica ou selecione uma sugestão acima..." value={receita} onChange={(e) => setReceita(e.target.value)} style={{ minHeight: 120, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10 }} />
        </Field>

        <Field label="Laudo">
          <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 8 }}>Sugestões baseadas na triagem:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {laudoSugg.map((s, i) => <SugBtn key={i} label={"Sugestão " + (i + 1)} onClick={() => setLaudo(s)} />)}
            <ZeroBtn onClick={() => setLaudo("")} />
          </div>
          <TextArea placeholder="Descreva o laudo médico ou selecione uma sugestão acima..." value={laudo} onChange={(e) => setLaudo(e.target.value)} style={{ minHeight: 120, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10 }} />
        </Field>

        <button onClick={handleSave} style={{ width: "100%", padding: "16px", borderRadius: 12, border: "none", background: "#00BA84", color: "#fff", fontFamily: SF, fontWeight: 700, fontSize: 16, cursor: "pointer", marginTop: 4, boxShadow: "0 4px 16px -4px rgba(0,186,132,0.35)" }}>Salvar prontuário</button>
      </div>

      <style>{"@media(max-width:520px){.detail-grid{grid-template-columns:1fr!important;}}"}</style>
    </div>
  );

  if (isMobile) return <SubPage onBack={onBack}>{body}</SubPage>;
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 60px" }}>
      <DesktopPageHeader onBack={onBack} title={`Prontuário — ${nome}`} />
      {body}
    </div>
  );
}


function InfoRow({ label, value }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.03em" }}>
        {label}
      </div>
      <div style={{ fontSize: 13.5, marginTop: 3, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div style={{
      background: C.bgAlt, border: `1px dashed ${C.line}`, borderRadius: RADIUS.lg,
      padding: "40px 24px", textAlign: "center", marginTop: 20
    }}>
      <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: C.inkSoft, maxWidth: 380, margin: "0 auto", lineHeight: 1.5 }}>{text}</div>
    </div>
  );
}

/* ============================================================
   ADMIN VIEW — super-validação (3 pilares)
   ============================================================ */
function AdminView({ patients, updatePatient, siteContent, setSiteContent, section, onSectionChange }) {
  const retained = patients.filter((p) => p.status === "retido_admin" || p.status === "concluido");
  const [openId, setOpenId] = useState(null);
  const [openMode, setOpenMode] = useState(null); // "validate" | "detail"
  const tab = section || "liberacao";

  const openPatient = patients.find((p) => p.id === openId);

  if (openPatient && openMode === "validate") {
    return <AdminRecord patient={openPatient} onBack={() => { setOpenId(null); setOpenMode(null); }} updatePatient={updatePatient} />;
  }
  if (openPatient && openMode === "detail") {
    return <PatientDetailPage patient={openPatient} onBack={() => { setOpenId(null); setOpenMode(null); }} role="admin" />;
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 60px" }}>
      <Header eyebrow="Painel administrativo"
        title={tab === "liberacao" ? "Liberação de prontuário" : "Gerenciar site"}
        sub={tab === "liberacao"
          ? "Documentos emitidos pelo médico ficam retidos até a validação dos 3 pilares: identidade, financeiro e clínico."
          : "Edite o conteúdo institucional exibido na landing page."} />

      {tab === "liberacao" ? (
        retained.length === 0 ? (
          <EmptyState
            title="Nenhum documento retido"
            text="Assim que um médico salvar receita ou laudo de um paciente, ele aparecerá aqui para validação final."
          />
        ) : (
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            {retained.map((p) => (
              <PatientCard
                key={p.id}
                patient={p}
                onOpen={() => { setOpenId(p.id); setOpenMode("validate"); }}
              />
            ))}
          </div>
        )
      ) : (
        <ManageSitePanel siteContent={siteContent} setSiteContent={setSiteContent} />
      )}
    </div>
  );
}

function ManageSitePanel({ siteContent, setSiteContent }) {
  const toast = useToast();
  const [form, setForm] = useState(siteContent);

  const setStep = (i, key, value) => {
    setForm((f) => {
      const steps = [...f.steps];
      steps[i] = { ...steps[i], [key]: value };
      return { ...f, steps };
    });
  };

  const handleSave = () => {
    const blank =
      !form.heroHeadline.trim() ||
      !form.heroSubheadline.trim() ||
      form.steps.some((s) => !s.title.trim() || !s.text.trim());

    if (blank) {
      toast("Não é possível salvar seções vazias. Preencha todos os campos da Home.", "warn");
      return;
    }
    setSiteContent(form);
    toast("Página inicial atualizada com sucesso!", "success");
  };

  return (
    <div style={{
      ...glassPanel, borderRadius: RADIUS.lg, padding: 24, marginTop: 16
    }}>
      <SectionTitle>Seção hero</SectionTitle>
      <Field label="Headline">
        <TextInput value={form.heroHeadline} onChange={(e) => setForm((f) => ({ ...f, heroHeadline: e.target.value }))} />
      </Field>
      <Field label="Subheadline">
        <TextArea value={form.heroSubheadline} onChange={(e) => setForm((f) => ({ ...f, heroSubheadline: e.target.value }))} />
      </Field>

      <SectionTitle>Como funciona (4 passos)</SectionTitle>
      {form.steps.map((s, i) => (
        <div key={i} style={{
          border: `1px solid ${C.line}`, borderRadius: RADIUS.md, padding: 14, marginBottom: 12, background: C.bgAlt
        }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>
            PASSO {i + 1}
          </div>
          <Field label="Título">
            <TextInput value={s.title} onChange={(e) => setStep(i, "title", e.target.value)} />
          </Field>
          <Field label="Texto">
            <TextInput value={s.text} onChange={(e) => setStep(i, "text", e.target.value)} />
          </Field>
        </div>
      ))}

      <Button full size="lg" onClick={handleSave} style={{ marginTop: 6 }}>
        Salvar alterações da home
      </Button>
    </div>
  );
}

function AdminRecord({ patient, onBack, updatePatient }) {
  const toast = useToast();
  const [admin, setAdmin] = useState(patient.admin);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const CARD = { background: "#fff", borderRadius: 16, padding: 22, marginBottom: 12, boxShadow: "0 2px 12px -4px rgba(0,0,0,0.07)", border: `1px solid ${C.line}` };
  const LBL  = { fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 };
  const VAL  = { fontSize: 14, color: C.ink, lineHeight: 1.5, fontFamily: SF };

  const pillars = [
    { key: "identity", label: "Validação de identidade",  desc: "Documento de identidade e comprovante de residência.", ok: admin.identityApproved },
    { key: "finance",  label: "Validação financeira",     desc: "Confirmação do pagamento.",                           ok: patient.payment.confirmed, auto: true },
    { key: "clinical", label: "Validação clínica",        desc: "Receita e laudo emitidos pelo médico.",               ok: admin.clinicalApproved },
  ];

  const toggle = (key) => setAdmin((a) => {
    if (key === "identity") return { ...a, identityApproved: !a.identityApproved };
    if (key === "clinical") return { ...a, clinicalApproved: !a.clinicalApproved };
    return a;
  });

  const release = () => {
    const missing = pillars.filter((p) => !p.ok);
    if (missing.length > 0) { toast(`Pendente: ${missing[0].label}.`, "error"); return; }
    updatePatient(patient.id, (p) => ({ ...p, admin, status: "concluido" }));
    toast("Documentos liberados para o paciente. Status: Concluído.", "success");
    onBack();
  };

  const alreadyReleased = patient.status === "concluido";
  const initials = patient.personal.nome.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  const statusLabel = { retido_admin: "Retido pelo admin", concluido: "Concluído", aguardando_medico: "Na fila do médico" }[patient.status] || "—";

  const body = (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ ...CARD, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SF, fontWeight: 700, fontSize: 16, color: "#0B8C63" }}>{initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 17, fontFamily: SF, color: C.ink }}>{patient.personal.nome}</div>
              <div style={{ fontSize: 12, color: C.inkSoft, fontFamily: SF, marginTop: 1 }}>{patient.id}</div>
            </div>
            <span style={{ padding: "5px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, fontFamily: SF, background: "rgba(255,159,10,0.15)", color: "#B96A00", flexShrink: 0 }}>{statusLabel}</span>
          </div>
          <CustodyStrip status={patient.status} />
        </div>

        {/* Dados pessoais */}
        <div style={CARD}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: SF, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>📋 Dados pessoais</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 32px" }} className="detail-grid">
            {[["Nome completo", patient.personal.nome], ["E-mail", patient.personal.email], ["Telefone", patient.personal.telefone], ["CPF", patient.personal.cpf], ["RG", patient.personal.rg], ["Nascimento", patient.personal.nascimento]].map(([l, v]) => (
              <div key={l}><div style={LBL}>{l}</div><div style={VAL}>{v || "—"}</div></div>
            ))}
          </div>
        </div>

        {/* Triagem */}
        <div style={CARD}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: SF, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>🩺 Triagem médica</div>
          <div style={{ marginBottom: 12 }}><div style={LBL}>Sintomas</div><div style={VAL}>{patient.triage?.sintomas || "—"}</div></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 32px" }} className="detail-grid">
            <div><div style={LBL}>Local da dor</div><div style={VAL}>{patient.triage?.dorLocal || "—"}</div></div>
            <div><div style={LBL}>Intensidade</div><div style={VAL}>{patient.triage?.dorIntensidade ? patient.triage.dorIntensidade + "/10" : "—"}</div></div>
          </div>
          <div style={{ marginTop: 12 }}><div style={LBL}>Histórico / alergias / medicamentos</div><div style={VAL}>{patient.triage?.historico || "—"}</div></div>
        </div>

        {/* Documentos com Visualizar */}
        <div style={CARD}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: SF, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>🗂️ Documentos do paciente</div>
          {[
            { label: "Documento de identidade",  file: patient.docs.identityFile, ok: patient.docs.identityUploaded },
            { label: "Comprovante de residência", file: patient.docs.addressFile,  ok: patient.docs.addressUploaded  },
          ].map((doc) => (
            <div key={doc.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.line}`, gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: doc.ok ? "rgba(0,186,132,0.1)" : C.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{doc.ok ? "✓" : "📄"}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{doc.label}</div>
                  <div style={{ fontSize: 12, color: doc.ok ? "#00BA84" : C.inkSoft, marginTop: 2, fontWeight: 500 }}>{doc.file || "Não enviado"}</div>
                </div>
              </div>
              {doc.ok && (
                <button onClick={() => toast(`Visualizando ${doc.file} — em produção abrirá o arquivo real.`, "info")} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #00BA84", background: "#fff", color: "#00BA84", fontFamily: SF, fontWeight: 600, fontSize: 13, cursor: "pointer", flexShrink: 0 }}>Visualizar</button>
              )}
            </div>
          ))}
        </div>

        {/* Pagamento */}
        <div style={CARD}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: SF, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>💳 Pagamento</div>
          <div style={LBL}>Status</div>
          <div style={{ fontSize: 14, color: patient.payment.confirmed ? "#00BA84" : C.inkSoft, fontWeight: 600, fontFamily: SF }}>{patient.payment.confirmed ? "Confirmado pelo paciente" : "Aguardando confirmação"}</div>
        </div>

        {/* Prontuário médico */}
        {patient.clinical?.savedByDoctor && (
          <div style={CARD}>
            <div style={{ fontWeight: 700, fontSize: 15, fontFamily: SF, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>℞ Prontuário médico</div>
            <div style={{ marginBottom: 14 }}><div style={LBL}>Receita</div><div style={{ ...VAL, whiteSpace: "pre-wrap" }}>{patient.clinical.receita || "—"}</div></div>
            <div><div style={LBL}>Laudo</div><div style={{ ...VAL, whiteSpace: "pre-wrap" }}>{patient.clinical.laudo || "—"}</div></div>
          </div>
        )}

        {/* 3 Pilares */}
        <div style={CARD}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: SF, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>✅ Os 3 pilares do atendimento</div>
          {pillars.map((p) => (
            <div key={p.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: `1px solid ${C.line}` }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{p.desc}</div>
              </div>
              {p.auto
                ? <Badge tone={p.ok ? "sage" : "amber"}>{p.ok ? "Confirmado" : "Pendente"}</Badge>
                : <Button size="sm" variant={p.ok ? "subtle" : "ghost"} onClick={() => toggle(p.key)}>{p.ok ? "✓ Aprovado" : "Aprovar"}</Button>
              }
            </div>
          ))}

          <Button full size="lg" style={{ marginTop: 18 }}
            onClick={alreadyReleased ? () => toast("Este prontuário já foi liberado para o paciente.", "info") : release}>
            {alreadyReleased ? "Documentos já liberados" : "Liberar documentos para o paciente"}
          </Button>
        </div>

        <style>{"@media(max-width:520px){.detail-grid{grid-template-columns:1fr!important;}}"}</style>
      </div>
  );

  if (isMobile) return <SubPage onBack={onBack}>{body}</SubPage>;
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 60px" }}>
      <DesktopPageHeader onBack={onBack} title={`Validação — ${patient.personal.nome}`} />
      {body}
    </div>
  );
}

export default App;
