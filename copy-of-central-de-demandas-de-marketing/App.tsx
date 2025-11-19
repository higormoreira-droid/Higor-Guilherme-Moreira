import * as React from "react";
import { useEffect, useMemo, useState, useCallback, Fragment } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./components/ui";
import {
  Home,
  Send,
  FileText,
  Layers,
  HelpCircle,
  Images,
  ClipboardList,
  Calendar,
  User,
  Phone,
  Building2,
  GraduationCap,
  ShieldAlert,
  UploadCloud,
  Eye,
  LogIn,
  LogOut,
  Filter,
  Search,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Clock4,
  Ticket as TicketIcon,
  Info,
  Paperclip
} from "lucide-react";

/**
 * Configurações (simula src/config.ts)
 */
const Config = {
  useGoogleFormEmbed: false,
  googleFormUrl: "https://docs.google.com/forms/d/e/placeholder/viewform?embedded=true"
};

/**
 * Identidade visual / CSS variables
 */
const GlobalStyles = () => {
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      :root {
        --brand-dark: #001A3A;
        --brand-blue: #0072C6;
        --brand-white: #FFFFFF;
        --brand-gray: #F3F6F9;
      }
      html, body, #root {
        height: 100%;
      }
      body {
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        background: hsl(var(--brand-white));
        color: hsl(var(--brand-dark));
      }
      a { color: var(--brand-blue); }
      .brand-gradient {
        background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-blue) 100%);
      }
      .fixed-header {
        position: sticky;
        top: 0;
        z-index: 50;
        backdrop-filter: saturate(180%) blur(8px);
        background-color: rgba(255, 255, 255, 0.95);
        border-bottom: 1px solid #e2e8f0;
      }
      .focus-ring:focus-visible {
        outline: 2px solid var(--brand-blue);
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return null;
};

/**
 * Utilitários de data e SLA
 */
type Prioridade = "Alta" | "Média" | "Baixa";
function isBusinessDay(date: Date) {
  const day = date.getDay();
  return day !== 0 && day !== 6; // 0 Dom, 6 Sáb
}
function addBusinessDays(start: Date, n: number) {
  const d = new Date(start);
  let added = 0;
  while (added < n) {
    d.setDate(d.getDate() + 1);
    if (isBusinessDay(d)) added++;
  }
  return d;
}
function diffBusinessDays(a: Date, b: Date) {
  const start = new Date(Math.min(a.getTime(), b.getTime()));
  const end = new Date(Math.max(a.getTime(), b.getTime()));
  let diff = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    if (isBusinessDay(cursor)) diff++;
    cursor.setDate(cursor.getDate() + 1);
  }
  // diff conta o dia inicial inclusive; ajusta para intervalo estrito
  return Math.max(0, diff - 1);
}
function estimateDueDate(tipo: string, prioridade: Prioridade) {
  // Base: 10 dias úteis para peças; eventos têm janela mínima de 5 dias úteis
  let base = 10;
  if (tipo === "Cobertura de evento") base = 5;
  let adj = 0;
  if (prioridade === "Alta") adj = -2;
  if (prioridade === "Média") adj = -1;
  if (prioridade === "Baixa") adj = 0;
  const days = Math.max(1, base + adj);
  return addBusinessDays(new Date(), days);
}
function formatDateBR(d?: Date | string | null) {
  if (!d) return "";
  const dd = typeof d === "string" ? new Date(d) : d;
  try {
    return dd.toLocaleDateString("pt-BR");
  } catch {
    return "";
  }
}

/**
 * Helpers adicionais
 */
function gerarTicketId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const pick = () => letters[Math.floor(Math.random() * letters.length)];
  const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${pick()}${pick()}${pick()}${pick()}${part()}`;
}
function toCSV(rows: any[], headers?: string[]) {
  if (!rows.length) return "";
  const cols = headers ?? Object.keys(rows[0]);
  const escape = (val: any) => {
    if (val == null) return "";
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [cols.join(",")];
  for (const row of rows) {
    lines.push(cols.map((c) => escape(row[c])).join(","));
  }
  return lines.join("\n");
}
function download(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

/**
 * Dados demo
 */
type TemplateItem = {
  id: string;
  titulo: string;
  tipo: "Cartaz" | "Post Instagram" | "Folder" | "Stories" | "Banner" | "Apresentação";
  url: string;
};
const templatesData: TemplateItem[] = [
  { id: "t1", titulo: "Cartaz Padrão", tipo: "Cartaz", url: "#" },
  { id: "t2", titulo: "Post Instagram", tipo: "Post Instagram", url: "#" },
  { id: "t3", titulo: "Folder Institucional", tipo: "Folder", url: "#" },
  { id: "t4", titulo: "Stories Evento", tipo: "Stories", url: "#" },
  { id: "t5", titulo: "Banner Site", tipo: "Banner", url: "#" },
  { id: "t6", titulo: "Apresentação Corporativa", tipo: "Apresentação", url: "#" }
];

type PortfolioItem = {
  id: string;
  titulo: string;
  unidade: "Unidade Centro" | "Unidade Norte" | "Unidade Sul";
  canal: "Instagram" | "Facebook" | "LinkedIn" | "Site" | "Interno" | "Impressos" | "WhatsApp";
  tipo: "Digital" | "Impresso";
  tags: string[];
  imagem: string;
  descricao?: string;
};
const portfolioData: PortfolioItem[] = [
  { id: "p1", titulo: "Campanha Matrículas 2025", unidade: "Unidade Centro", canal: "Instagram", tipo: "Digital", tags: ["Matrículas", "Social"], imagem: "https://picsum.photos/600/400?1", descricao: "Série de criativos para campanha de matrículas." },
  { id: "p2", titulo: "Folder Linha Industrial", unidade: "Unidade Norte", canal: "Impressos", tipo: "Impresso", tags: ["Vendas", "Indústria"], imagem: "https://picsum.photos/600/400?2", descricao: "Folder técnico para linha industrial." },
  { id: "p3", titulo: "Cobertura Feira Tech", unidade: "Unidade Sul", canal: "LinkedIn", tipo: "Digital", tags: ["Evento", "B2B"], imagem: "https://picsum.photos/600/400?3", descricao: "Cobertura fotográfica e posts de evento." },
  { id: "p4", titulo: "Banner Site Semana SENAI", unidade: "Unidade Centro", canal: "Site", tipo: "Digital", tags: ["Banner", "Institucional"], imagem: "https://picsum.photos/600/400?4", descricao: "Banner principal para destaque no site." },
  { id: "p5", titulo: "Cartaz Oficina Mecânica", unidade: "Unidade Norte", canal: "Interno", tipo: "Impresso", tags: ["Cartaz", "Operações"], imagem: "https://picsum.photos/600/400?5", descricao: "Cartaz de divulgação interno para oficina." }
];

/**
 * Tipos e Store de Tickets
 */
type PublicoAlvo = "Alunos" | "Indústria" | "Comunidade" | "Interno" | "Outro";
type CanalDivulgacao = "E-mail marketing" | "Instagram" | "Facebook" | "LinkedIn" | "Site" | "WhatsApp" | "Impressos" | "Outro";

type TicketStatus = "Recebido" | "Em andamento" | "Aguardando aprovação" | "Concluído";

type Ticket = {
  id: string;
  email: string;
  nome: string;
  telefone?: string;
  unidade: "Unidade Centro" | "Unidade Norte" | "Unidade Sul";
  area: "Comercial" | "Operações" | "RH" | "Diretoria";
  tipoPedido: "Peça de divulgação" | "Cobertura de evento" | "Template" | "Outro";
  produtoEvento: string;
  publicoAlvo: PublicoAlvo[];
  publicoOutro?: string;
  canais: CanalDivulgacao[];
  canalOutro?: string;
  material: "Impresso" | "Digital";
  dataDesejada: string; // ISO
  prioridade: Prioridade;
  justificativa?: string;
  impactoFaturamento?: boolean;
  anexos?: { name: string; size: number; type: string }[];
  briefing?: string;
  dependenciaExterna?: boolean; // COMAR/Sede
  modeloSugerido?: TemplateItem["tipo"];
  criadoEm: string; // ISO
  status: TicketStatus;
  responsavel?: string;
  notas?: string;
  estimativa?: string; // ISO
};

type TicketStore = {
  tickets: Ticket[];
  addTicket: (t: Ticket) => void;
  updateTicket: (id: string, patch: Partial<Ticket>) => void;
  removeTicket: (id: string) => void;
  reload: () => void;
};

const TicketStoreContext = React.createContext<TicketStore | null>(null);

function useTicketStore() {
  const ctx = React.useContext(TicketStoreContext);
  if (!ctx) throw new Error("TicketStoreProvider ausente");
  return ctx;
}

function TicketStoreProvider({ children }: { children?: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const raw = localStorage.getItem("tickets");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (t: Ticket) => setTickets((prev) => [t, ...prev]);
  const updateTicket = (id: string, patch: Partial<Ticket>) =>
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const removeTicket = (id: string) => setTickets((prev) => prev.filter((t) => t.id !== id));
  const reload = () => {
    try {
      const raw = localStorage.getItem("tickets");
      setTickets(raw ? JSON.parse(raw) : []);
    } catch {
      setTickets([]);
    }
  };

  const value = useMemo(() => ({ tickets, addTicket, updateTicket, removeTicket, reload }), [tickets]);
  return <TicketStoreContext.Provider value={value}>{children}</TicketStoreContext.Provider>;
}

/**
 * Auth Context
 */
type AuthState = { isAuthenticated: boolean; user?: { name: string } | null };
const AuthContext = React.createContext<{
  auth: AuthState;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
} | null>(null);

function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider ausente");
  return ctx;
}
function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const raw = localStorage.getItem("auth");
      return raw ? JSON.parse(raw) : { isAuthenticated: false, user: null };
    } catch {
      return { isAuthenticated: false, user: null };
    }
  });

  const login = async (u: string, p: string) => {
    await new Promise((r) => setTimeout(r, 300));
    if (u === "admin" && p === "admin123") {
      const state = { isAuthenticated: true, user: { name: "Administrador" } };
      setAuth(state);
      localStorage.setItem("auth", JSON.stringify(state));
      return true;
    }
    return false;
  };
  const logout = () => {
    const state = { isAuthenticated: false, user: null };
    setAuth(state);
    localStorage.setItem("auth", JSON.stringify(state));
  };

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
}

/**
 * Toasts simples
 */
type ToastItem = { id: string; title: string; description?: string; variant?: "default" | "destructive" | "success" };
const ToastContext = React.createContext<{
  toasts: ToastItem[];
  show: (t: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
} | null>(null);

function useToasts() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("ToastProvider ausente");
  return ctx;
}
function ToastProvider({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const show = (t: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    const item = { id, ...t };
    setToasts((prev) => [...prev, item]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4500);
  };
  const dismiss = (id: string) => setToasts((prev) => prev.filter((x) => x.id !== id));
  return (
    <ToastContext.Provider value={{ toasts, show, dismiss }}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-[100] space-y-2 w-full max-w-sm">
        {toasts.map((t) => (
          <Alert
            key={t.id}
            className={`shadow-lg border ${t.variant === "destructive" ? "border-red-500 bg-red-500 text-white" : t.variant === "success" ? "border-green-600 bg-green-600 text-white" : "bg-white text-gray-900"}`}
          >
            <div className="flex items-start gap-3">
              {t.variant === "destructive" ? <AlertTriangle size={20} /> : t.variant === "success" ? <CheckCircle2 size={20} /> : <Info size={20} />}
              <div className="flex-1">
                <AlertTitle className="font-semibold">{t.title}</AlertTitle>
                {t.description ? <AlertDescription>{t.description}</AlertDescription> : null}
              </div>
              <Button size="sm" variant="secondary" onClick={() => dismiss(t.id)} aria-label="Fechar aviso">
                Fechar
              </Button>
            </div>
          </Alert>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Router mínimo
 */
type RoutePath =
  | "/"
  | "/solicitar"
  | "/diretrizes"
  | "/templates"
  | "/portfolio"
  | "/dashboard"
  | "/faq"
  | "/contato"
  | "/confirmacao";

function useRoute() {
  const [path, setPath] = useState<RoutePath>(() => (window.location.pathname as RoutePath) || "/");
  const [search, setSearch] = useState<string>(() => window.location.search || "");
  
  useEffect(() => {
    const handler = () => {
      const newPath = (window.location.pathname || "/") as RoutePath;
      setPath(newPath);
      setSearch(window.location.search || "");
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const navigate = useCallback((to: RoutePath | string) => {
    window.history.pushState({}, "", to);
    setPath((window.location.pathname || "/") as RoutePath);
    setSearch(window.location.search || "");
    // Force update just in case
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);
  
  return { path, search, navigate };
}

/**
 * Navbar e Footer
 */
function Navbar() {
  const { auth, logout } = useAuth();
  const { navigate } = useRoute();
  const linkClass = "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 hover:text-blue-700 transition-colors focus-ring text-gray-700";
  return (
    <header className="fixed-header text-gray-900" role="banner" aria-label="Barra de navegação">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 focus-ring" aria-label="Ir para a Home">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
              <Images size={18} color="white" />
            </div>
            <strong className="tracking-tight text-blue-900" aria-label="Marketing">Marketing</strong>
          </button>
          <nav className="hidden md:flex items-center gap-1" aria-label="Menu principal">
            <button onClick={() => navigate("/")} className={linkClass}><Home size={16} className="inline-block mr-1" /> Início</button>
            <button onClick={() => navigate("/solicitar")} className={linkClass}><Send size={16} className="inline-block mr-1" /> Solicitar</button>
            <button onClick={() => navigate("/diretrizes")} className={linkClass}><FileText size={16} className="inline-block mr-1" /> Diretrizes</button>
            <button onClick={() => navigate("/templates")} className={linkClass}><Layers size={16} className="inline-block mr-1" /> Templates</button>
            <button onClick={() => navigate("/portfolio")} className={linkClass}><Images size={16} className="inline-block mr-1" /> Portfólio</button>
          </nav>
          <div className="flex items-center gap-2">
            {auth.isAuthenticated ? (
              <>
                <Button variant="secondary" onClick={() => navigate("/dashboard")} aria-label="Abrir dashboard">
                  <ClipboardList size={16} className="mr-2" /> Dashboard
                </Button>
                <Button variant="destructive" onClick={() => {logout(); navigate("/");}} aria-label="Sair">
                  <LogOut size={16} className="mr-2" /> Sair
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => navigate("/dashboard")} aria-label="Entrar no dashboard">
                <LogIn size={16} className="mr-2" /> Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const { navigate } = useRoute();
  return (
    <footer className="mt-12 border-t border-gray-200 bg-gray-50 text-gray-800" role="contentinfo" aria-label="Rodapé">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
        <div>
          <h4 className="font-semibold mb-2">Central de Demandas</h4>
          <p className="text-sm text-gray-600">Portal para captação, priorização e gestão de pedidos de Marketing.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Links úteis</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li><button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:underline text-left">Voltar ao topo</button></li>
            <li><button onClick={() => navigate("/faq")} className="hover:underline text-left">FAQ</button></li>
            <li><button onClick={() => navigate("/contato")} className="hover:underline text-left">Contato</button></li>
          </ul>
        </div>
        <div className="text-sm text-gray-600">
          <p>© {new Date().getFullYear()} SENAI/SESI — Equipe de Marketing</p>
          <p>Construído com React, Tailwind e shadcn/ui.</p>
        </div>
      </div>
    </footer>
  );
}

// --- Pages ---

function HomePage() {
  const { navigate } = useRoute();
  return (
    <main className="pt-6" role="main">
      <section className="brand-gradient text-white rounded-none md:rounded-b-3xl shadow-lg -mt-6 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">Central de Demandas de Marketing</h1>
            <p className="mt-4 text-lg text-white/90">
              Centralize solicitações, priorize automaticamente e acompanhe o status. Encontre templates, diretrizes e portfólio para acelerar suas entregas.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-semibold" onClick={() => navigate("/solicitar")}>
                <Send size={18} className="mr-2" /> Solicitar material
              </Button>
              <Button size="lg" variant="secondary" className="bg-blue-800 text-white hover:bg-blue-700 border border-blue-400" onClick={() => navigate("/diretrizes")}>
                <FileText size={18} className="mr-2" /> Diretrizes & Prioridades
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Resumo de SLA</CardTitle>
                <CardDescription className="text-white/80">Regras principais de prazos</CardDescription>
              </CardHeader>
              <CardContent className="text-white/90">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2"><Clock4 size={18} className="mt-1 shrink-0"/> <span>Até 10 dias úteis para peças.</span></li>
                  <li className="flex items-start gap-2"><Calendar size={18} className="mt-1 shrink-0"/> <span>Cobertura de eventos com aviso mínimo de 5 dias úteis.</span></li>
                  <li className="flex items-start gap-2"><ShieldAlert size={18} className="mt-1 shrink-0"/> <span>Dependências de COMAR/Sede podem requerer prazo extra.</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Acesso rápido</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Diretrizes", desc: "Regras e prazos", link: "/diretrizes", icon: FileText },
            { title: "Templates", desc: "Modelos Canva", link: "/templates", icon: Layers },
            { title: "Portfólio", desc: "Entregas recentes", link: "/portfolio", icon: Images },
            { title: "FAQ", desc: "Dúvidas comuns", link: "/faq", icon: HelpCircle },
          ].map((item) => (
            <Card key={item.link} className="hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer" onClick={() => navigate(item.link)}>
              <CardHeader>
                <item.icon size={32} className="text-blue-600 mb-2" />
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
              <CardFooter>
                <span className="text-blue-600 text-sm font-medium flex items-center">Acessar <ChevronRight size={14} className="ml-1" /></span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

function SolicitarPage() {
  const { addTicket } = useTicketStore();
  const { show } = useToasts();
  const { navigate } = useRoute();

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [unidade, setUnidade] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [tipoPedido, setTipoPedido] = useState<string>("");
  const [produtoEvento, setProdutoEvento] = useState("");
  const [publicoAlvo, setPublicoAlvo] = useState<PublicoAlvo[]>([]);
  const [publicoOutro, setPublicoOutro] = useState("");
  const [canais, setCanais] = useState<CanalDivulgacao[]>([]);
  const [canalOutro, setCanalOutro] = useState("");
  const [material, setMaterial] = useState<string>("");
  const [dataDesejada, setDataDesejada] = useState("");
  const [prioridade, setPrioridade] = useState<Prioridade>("Média");
  const [justificativa, setJustificativa] = useState("");
  const [impacto, setImpacto] = useState(false);
  const [anexos, setAnexos] = useState<{ name: string; size: number; type: string }[]>([]);
  const [briefing, setBriefing] = useState("");
  const [dependencia, setDependencia] = useState(false);
  const [modeloSugerido, setModeloSugerido] = useState<string>("");

  // Load draft
  useEffect(() => {
    const raw = localStorage.getItem("formDraft");
    if (raw) {
      try {
        const d = JSON.parse(raw);
        setEmail(d.email || ""); setNome(d.nome || ""); setTelefone(d.telefone || "");
        setUnidade(d.unidade || ""); setArea(d.area || ""); setTipoPedido(d.tipoPedido || "");
        setProdutoEvento(d.produtoEvento || ""); setPublicoAlvo(d.publicoAlvo || []);
        setPublicoOutro(d.publicoOutro || ""); setCanais(d.canais || []);
        setCanalOutro(d.canalOutro || ""); setMaterial(d.material || "");
        setDataDesejada(d.dataDesejada || ""); setPrioridade(d.prioridade || "Média");
        setJustificativa(d.justificativa || ""); setImpacto(d.impacto || false);
        setAnexos(d.anexos || []); setBriefing(d.briefing || "");
        setDependencia(d.dependencia || false); setModeloSugerido(d.modeloSugerido || "");
      } catch {}
    }
  }, []);

  // Save draft
  useEffect(() => {
    const draft = { email, nome, telefone, unidade, area, tipoPedido, produtoEvento, publicoAlvo, publicoOutro, canais, canalOutro, material, dataDesejada, prioridade, justificativa, impacto, anexos, briefing, dependencia, modeloSugerido };
    localStorage.setItem("formDraft", JSON.stringify(draft));
  }, [email, nome, telefone, unidade, area, tipoPedido, produtoEvento, publicoAlvo, publicoOutro, canais, canalOutro, material, dataDesejada, prioridade, justificativa, impacto, anexos, briefing, dependencia, modeloSugerido]);

  const emailValido = /\S+@\S+\.\S+/.test(email);
  const dataValida = useMemo(() => {
    if (!dataDesejada) return false;
    const d = new Date(dataDesejada);
    const today = new Date();
    d.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0);
    return d.getTime() > today.getTime();
  }, [dataDesejada]);

  const estimada = useMemo(() => {
    if (!tipoPedido || !prioridade) return null;
    return estimateDueDate(tipoPedido, prioridade);
  }, [tipoPedido, prioridade]);

  const toggleArray = (arr: any[], v: any, set: any) => {
    if (arr.includes(v)) set(arr.filter((x) => x !== v));
    else set([...arr, v]);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const meta = Array.from(e.target.files).map((f: any) => ({ name: f.name, size: f.size, type: f.type }));
    setAnexos(meta);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValido) return show({ title: "E-mail inválido", description: "Informe um e-mail válido.", variant: "destructive" });
    if (!nome || !unidade || !area || !tipoPedido || !produtoEvento || !material || !dataDesejada) {
      return show({ title: "Campos obrigatórios", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
    }
    if (!dataValida) return show({ title: "Data inválida", description: "A data deve ser maior que hoje.", variant: "destructive" });

    const id = gerarTicketId();
    const ticket: Ticket = {
      id, email, nome, telefone, unidade: unidade as any, area: area as any, tipoPedido: tipoPedido as any,
      produtoEvento, publicoAlvo, publicoOutro, canais, canalOutro, material: material as any, dataDesejada,
      prioridade, justificativa, impactoFaturamento: impacto, anexos, briefing, dependenciaExterna: dependencia,
      modeloSugerido: modeloSugerido as any, criadoEm: new Date().toISOString(), status: "Recebido",
      estimativa: estimada ? estimada.toISOString() : undefined
    };

    addTicket(ticket);
    localStorage.removeItem("formDraft");
    show({ title: "Solicitação enviada", description: `Ticket ${ticket.id} registrado.`, variant: "success" });
    window.history.pushState({}, "", `/confirmacao?ticket=${encodeURIComponent(ticket.id)}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <main className="pt-20 max-w-4xl mx-auto px-4 pb-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Solicitar Material</h1>
        <p className="text-gray-600 mt-2">Preencha o formulário para iniciar um novo pedido de marketing.</p>
      </div>
      <Card className="border-t-4 border-t-blue-600">
        <CardHeader>
          <CardTitle>Dados da Solicitação</CardTitle>
          <CardDescription>Campos com * são obrigatórios</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Responsável *</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Unidade *</Label>
                <Select value={unidade} onValueChange={setUnidade}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unidade Centro">Unidade Centro</SelectItem>
                    <SelectItem value="Unidade Norte">Unidade Norte</SelectItem>
                    <SelectItem value="Unidade Sul">Unidade Sul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Área *</Label>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                    <SelectItem value="Operações">Operações</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                    <SelectItem value="Diretoria">Diretoria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo Pedido *</Label>
                <Select value={tipoPedido} onValueChange={setTipoPedido}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Peça de divulgação">Peça de divulgação</SelectItem>
                    <SelectItem value="Cobertura de evento">Cobertura de evento</SelectItem>
                    <SelectItem value="Template">Template</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="produto">Produto / Evento *</Label>
              <Input id="produto" value={produtoEvento} onChange={(e) => setProdutoEvento(e.target.value)} required />
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                <div>
                    <Label className="mb-2 block">Público Alvo</Label>
                    {["Alunos", "Indústria", "Comunidade", "Interno"].map(p => (
                        <label key={p} className="flex items-center gap-2 mb-1">
                            <Checkbox checked={publicoAlvo.includes(p as any)} onCheckedChange={() => toggleArray(publicoAlvo, p, setPublicoAlvo)} />
                            <span className="text-sm">{p}</span>
                        </label>
                    ))}
                </div>
                <div>
                    <Label className="mb-2 block">Canais</Label>
                    {["Instagram", "Facebook", "LinkedIn", "Site", "E-mail marketing"].map(c => (
                        <label key={c} className="flex items-center gap-2 mb-1">
                            <Checkbox checked={canais.includes(c as any)} onCheckedChange={() => toggleArray(canais, c, setCanais)} />
                            <span className="text-sm">{c}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Material *</Label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2"><input type="radio" name="material" checked={material === "Digital"} onChange={() => setMaterial("Digital")} /> Digital</label>
                        <label className="flex items-center gap-2"><input type="radio" name="material" checked={material === "Impresso"} onChange={() => setMaterial("Impresso")} /> Impresso</label>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Prioridade *</Label>
                    <div className="flex gap-4">
                         {["Baixa", "Média", "Alta"].map(p => (
                             <label key={p} className="flex items-center gap-2">
                                 <input type="radio" name="prioridade" checked={prioridade === p} onChange={() => setPrioridade(p as any)} />
                                 {p}
                             </label>
                         ))}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="data">Data Desejada *</Label>
                <Input id="data" type="date" value={dataDesejada} onChange={(e) => setDataDesejada(e.target.value)} />
                {estimada && <p className="text-sm text-blue-600">Estimativa SLA: {formatDateBR(estimada)}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="anexos">Anexos (Imagens, PDF)</Label>
                <div className="flex flex-col gap-2">
                  <Input 
                    id="anexos" 
                    type="file" 
                    multiple 
                    accept="image/*,application/pdf" 
                    onChange={handleFiles} 
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {anexos.length > 0 && (
                    <ul className="text-sm bg-gray-50 p-3 rounded-md border space-y-1">
                      {anexos.map((a, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700">
                          <Paperclip size={14} className="text-blue-500"/>
                          <span className="font-medium">{a.name}</span> 
                          <span className="text-gray-500 text-xs">({(a.size / 1024).toFixed(1)} KB)</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="briefing">Briefing Detalhado</Label>
                <Textarea id="briefing" value={briefing} onChange={(e) => setBriefing(e.target.value)} className="h-24" placeholder="Descreva detalhes, textos, objetivos..." />
            </div>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => localStorage.removeItem("formDraft")}>Limpar</Button>
                <Button type="submit"><Send size={16} className="mr-2"/> Enviar Solicitação</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

function TemplatesPage() {
  const [filtro, setFiltro] = useState("Todos");
  const filtered = useMemo(() => {
      if(filtro === "Todos") return templatesData;
      return templatesData.filter(t => t.tipo === filtro);
  }, [filtro]);

  return (
    <main className="pt-20 max-w-6xl mx-auto px-4 pb-10">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Modelos Canva</h1>
            <div className="w-48">
                <Select value={filtro} onValueChange={setFiltro}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {["Todos", "Cartaz", "Post Instagram", "Folder", "Stories", "Banner", "Apresentação"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(t => (
                <Card key={t.id}>
                    <div className="h-40 bg-gray-100 w-full object-cover rounded-t-lg flex items-center justify-center text-blue-300">
                        <Layers size={48} />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-lg">{t.titulo}</CardTitle>
                        <CardDescription>{t.tipo}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline" className="w-full">Abrir Modelo <ExternalLink size={14} className="ml-2"/></Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </main>
  );
}

function PortfolioPage() {
    const [selected, setSelected] = useState<PortfolioItem | null>(null);
    const [q, setQ] = useState("");
    const [fUnidade, setFUnidade] = useState("Todas");
    const [fCanal, setFCanal] = useState("Todos");

    const filtered = useMemo(() => {
        return portfolioData.filter(p => {
            const matchesSearch = p.titulo.toLowerCase().includes(q.toLowerCase());
            const matchesUnidade = fUnidade === "Todas" || p.unidade === fUnidade;
            const matchesCanal = fCanal === "Todos" || p.canal === fCanal;
            return matchesSearch && matchesUnidade && matchesCanal;
        });
    }, [q, fUnidade, fCanal]);

    return (
        <main className="pt-20 max-w-6xl mx-auto px-4 pb-10">
            <h1 className="text-2xl font-bold mb-6">Portfólio</h1>
            <div className="flex flex-wrap gap-4 mb-8 items-end p-4 bg-gray-50 rounded-lg border">
                 <div className="flex-1 min-w-[200px]">
                     <Label className="mb-1 block text-xs uppercase text-gray-500">Buscar</Label>
                     <Input placeholder="Título..." value={q} onChange={e => setQ(e.target.value)} />
                 </div>
                 <div className="w-48">
                     <Label className="mb-1 block text-xs uppercase text-gray-500">Unidade</Label>
                     <Select value={fUnidade} onValueChange={setFUnidade}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {["Todas", "Unidade Centro", "Unidade Norte", "Unidade Sul"].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                     </Select>
                 </div>
                 <div className="w-48">
                     <Label className="mb-1 block text-xs uppercase text-gray-500">Canal</Label>
                     <Select value={fCanal} onValueChange={setFCanal}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {["Todos", "Instagram", "Facebook", "LinkedIn", "Site"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                     </Select>
                 </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(p => (
                    <Card key={p.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelected(p)}>
                        <div className="h-48 overflow-hidden rounded-t-lg">
                             <img src={p.imagem} alt={p.titulo} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                        </div>
                        <CardContent className="pt-4">
                            <h3 className="font-semibold mb-2">{p.titulo}</h3>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{p.unidade}</Badge>
                                <Badge variant="secondary">{p.canal}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <AlertDialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{selected?.titulo}</AlertDialogTitle>
                        <AlertDialogDescription>{selected?.descricao}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <img src={selected?.imagem} className="rounded-md w-full" />
                    <AlertDialogFooter>
                        <AlertDialogCancel>Fechar</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}

function DashboardPage() {
    const { auth, login } = useAuth();
    const { tickets, updateTicket } = useTicketStore();
    const [u, setU] = useState("");
    const [p, setP] = useState("");
    const { show } = useToasts();

    // Filters
    const [fUnidade, setFUnidade] = useState("Todas");
    const [fArea, setFArea] = useState("Todas");
    const [fStatus, setFStatus] = useState("Todos");
    const [fPrioridade, setFPrioridade] = useState("Todas");
    
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    if (!auth.isAuthenticated) {
        return (
            <main className="pt-20 max-w-md mx-auto px-4">
                <Card>
                    <CardHeader><CardTitle>Login Administrativo</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            if(await login(u,p)) show({title: "Login efetuado", variant: "success"});
                            else show({title: "Erro", description: "admin / admin123", variant: "destructive"});
                        }} className="space-y-4">
                            <div className="space-y-2"><Label>Usuário</Label><Input value={u} onChange={e => setU(e.target.value)}/></div>
                            <div className="space-y-2"><Label>Senha</Label><Input type="password" value={p} onChange={e => setP(e.target.value)}/></div>
                            <Button type="submit" className="w-full">Entrar</Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        );
    }

    const filteredTickets = tickets.filter(t => {
        return (fUnidade === "Todas" || t.unidade === fUnidade) &&
               (fArea === "Todas" || t.area === fArea) &&
               (fStatus === "Todos" || t.status === fStatus) &&
               (fPrioridade === "Todas" || t.prioridade === fPrioridade);
    });

    const handleNoteChange = (val: string) => {
        if(selectedTicket) {
            updateTicket(selectedTicket.id, { notas: val });
            setSelectedTicket({...selectedTicket, notas: val});
        }
    };

    return (
        <main className="pt-20 max-w-7xl mx-auto px-4 pb-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard de Tickets</h1>
                <Button variant="outline" onClick={() => toCSV(filteredTickets) && show({title: "CSV gerado"})}><ExternalLink size={16} className="mr-2"/> Exportar CSV</Button>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{tickets.length}</CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Em Aberto</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{tickets.filter(t => t.status === "Recebido").length}</CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Em Andamento</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{tickets.filter(t => t.status === "Em andamento").length}</CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Concluídos</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{tickets.filter(t => t.status === "Concluído").length}</CardContent></Card>
            </div>

            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="min-w-[150px]">
                             <Label className="text-xs uppercase text-gray-500 mb-1 block">Unidade</Label>
                             <Select value={fUnidade} onValueChange={setFUnidade}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {["Todas", "Unidade Centro", "Unidade Norte", "Unidade Sul"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                                </SelectContent>
                             </Select>
                        </div>
                        <div className="min-w-[150px]">
                             <Label className="text-xs uppercase text-gray-500 mb-1 block">Área</Label>
                             <Select value={fArea} onValueChange={setFArea}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {["Todas", "Comercial", "Operações", "RH", "Diretoria"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                                </SelectContent>
                             </Select>
                        </div>
                        <div className="min-w-[150px]">
                             <Label className="text-xs uppercase text-gray-500 mb-1 block">Prioridade</Label>
                             <Select value={fPrioridade} onValueChange={setFPrioridade}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {["Todas", "Alta", "Média", "Baixa"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                                </SelectContent>
                             </Select>
                        </div>
                         <div className="min-w-[150px]">
                             <Label className="text-xs uppercase text-gray-500 mb-1 block">Status</Label>
                             <Select value={fStatus} onValueChange={setFStatus}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {["Todos", "Recebido", "Em andamento", "Aguardando aprovação", "Concluído"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                                </SelectContent>
                             </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Prioridade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data Desejada</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTickets.map(t => (
                            <TableRow key={t.id}>
                                <TableCell className="font-mono text-xs">#{t.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{t.nome}</span>
                                        <span className="text-xs text-gray-500">{t.unidade}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{t.tipoPedido}</TableCell>
                                <TableCell><Badge variant={t.prioridade === "Alta" ? "destructive" : "secondary"}>{t.prioridade}</Badge></TableCell>
                                <TableCell>
                                    <Select value={t.status} onValueChange={(v) => updateTicket(t.id, { status: v as any })}>
                                        <SelectTrigger className="w-[160px] h-8"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Recebido">Recebido</SelectItem>
                                            <SelectItem value="Em andamento">Em andamento</SelectItem>
                                            <SelectItem value="Aguardando aprovação">Aguardando aprovação</SelectItem>
                                            <SelectItem value="Concluído">Concluído</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>{formatDateBR(t.dataDesejada)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(t)}><Eye size={16} className="text-gray-500"/></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredTickets.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum ticket encontrado</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </Card>

            <AlertDialog open={!!selectedTicket} onOpenChange={(o) => !o && setSelectedTicket(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Detalhes do Ticket #{selectedTicket?.id}</AlertDialogTitle>
                        <AlertDialogDescription>Informações completas da solicitação</AlertDialogDescription>
                    </AlertDialogHeader>
                    {selectedTicket && (
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold block text-gray-700">Solicitante</span>
                                    {selectedTicket.nome} ({selectedTicket.email})
                                </div>
                                <div>
                                    <span className="font-semibold block text-gray-700">Área / Unidade</span>
                                    {selectedTicket.area} - {selectedTicket.unidade}
                                </div>
                                <div>
                                    <span className="font-semibold block text-gray-700">Produto/Evento</span>
                                    {selectedTicket.produtoEvento}
                                </div>
                                <div>
                                    <span className="font-semibold block text-gray-700">Canais</span>
                                    {selectedTicket.canais.join(", ")}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md text-sm">
                                <span className="font-semibold block mb-1 text-gray-700">Briefing</span>
                                {selectedTicket.briefing || "Não informado."}
                            </div>
                            <div>
                                <span className="font-semibold block mb-1 text-sm text-gray-700">Anexos</span>
                                {selectedTicket.anexos?.length ? (
                                    <ul className="text-xs list-disc pl-4">
                                        {selectedTicket.anexos.map((a,i) => <li key={i}>{a.name} ({(a.size/1024).toFixed(1)} KB)</li>)}
                                    </ul>
                                ) : <span className="text-xs text-gray-400">Sem anexos</span>}
                            </div>
                            <div className="border-t pt-4">
                                <Label className="mb-2 block">Notas Internas</Label>
                                <Textarea 
                                    placeholder="Registre anotações sobre o andamento..." 
                                    value={selectedTicket.notas || ""} 
                                    onChange={e => handleNoteChange(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel>Fechar</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}

function ConfirmacaoPage({ search }: { search: string }) {
    const id = new URLSearchParams(search).get("ticket");
    return (
        <main className="pt-20 max-w-md mx-auto px-4">
            <Card className="text-center p-6">
                <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={24} />
                </div>
                <h1 className="text-2xl font-bold mb-2">Solicitação Recebida!</h1>
                <p className="text-gray-600 mb-4">Seu ticket <strong>#{id}</strong> foi criado com sucesso.</p>
                <Button variant="outline" onClick={() => {window.history.pushState({},"", "/"); window.dispatchEvent(new PopStateEvent("popstate"))}}>Voltar ao Início</Button>
            </Card>
        </main>
    );
}

function DiretrizesPage() {
    return (
        <main className="pt-20 max-w-4xl mx-auto px-4 pb-10">
            <h1 className="text-3xl font-bold mb-6">Diretrizes & SLA</h1>
            <Card>
                <CardContent className="pt-6 space-y-6">
                    <section>
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Clock4 className="text-blue-600"/> Prazos de Entrega</h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                            <li>Peças digitais simples: 3 a 5 dias úteis.</li>
                            <li>Materiais impressos complexos: 7 a 10 dias úteis.</li>
                            <li>Campanhas completas: 15+ dias úteis.</li>
                        </ul>
                    </section>
                    <Separator />
                    <section>
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Calendar className="text-blue-600"/> Eventos</h3>
                        <p className="text-gray-700 mb-2">Solicitações de cobertura devem ser feitas com antecedência mínima de <strong>5 dias úteis</strong>.</p>
                        <Alert className="bg-yellow-50 border-yellow-200"><AlertTitle>Atenção</AlertTitle><AlertDescription>Pedidos fora do prazo sujeitos a disponibilidade de equipe.</AlertDescription></Alert>
                    </section>
                </CardContent>
            </Card>
        </main>
    );
}

function FAQPage() {
    return (
        <main className="pt-20 max-w-3xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">Perguntas Frequentes</h1>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Qual o prazo para posts de redes sociais?</AccordionTrigger>
                    <AccordionContent>O prazo padrão é de 5 dias úteis para criação e aprovação.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Como solicitar alterações?</AccordionTrigger>
                    <AccordionContent>Responda ao e-mail de confirmação do ticket ou contate o responsável via Teams.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Onde encontro a logo oficial?</AccordionTrigger>
                    <AccordionContent>Disponível na seção de Templates/Brandbook.</AccordionContent>
                </AccordionItem>
            </Accordion>
        </main>
    );
}

function ContatoPage() {
  return (
    <main className="pt-20 max-w-3xl mx-auto px-4 pb-10">
      <h1 className="text-2xl font-bold mb-4">Contato / Suporte</h1>
      <Card>
        <CardHeader>
          <CardTitle>Equipe de Marketing</CardTitle>
          <CardDescription>Horário de atendimento: seg a sex, 9h às 18h</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>E-mails: marketing@senai.br, comunicacao@senai.br</p>
          <p>Ramais: 2001 (coordenação), 2002 (criação), 2003 (mídias)</p>
        </CardContent>
      </Card>
    </main>
  );
}

// --- Main App ---

function RouterSwitch() {
  const route = useRoute();
  switch (route.path) {
    case "/": return <HomePage />;
    case "/solicitar": return <SolicitarPage />;
    case "/diretrizes": return <DiretrizesPage />;
    case "/templates": return <TemplatesPage />;
    case "/portfolio": return <PortfolioPage />;
    case "/dashboard": return <DashboardPage />;
    case "/confirmacao": return <ConfirmacaoPage search={route.search} />;
    case "/faq": return <FAQPage />;
    case "/contato": return <ContatoPage />;
    default: return <HomePage />;
  }
}

function BrandingBackdrop() {
  return <div className="h-1 w-full bg-blue-600 sticky top-0 z-[60]" aria-hidden="true" />;
}

function App() {
  return (
    <AuthProvider>
      <TicketStoreProvider>
        <ToastProvider>
          <GlobalStyles />
          <BrandingBackdrop />
          <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <div className="flex-1">
              <RouterSwitch />
            </div>
            <Footer />
          </div>
        </ToastProvider>
      </TicketStoreProvider>
    </AuthProvider>
  );
}

export default App;