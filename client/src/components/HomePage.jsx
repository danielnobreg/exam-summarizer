import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  BrainCircuit,
  Syringe,
  HeartPulse,
  Lock,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { getUserData } from "../services/userService";

// --- Utilitários de Animação ---
const FadeIn = ({
  children,
  delay = 0,
  direction = "up",
  className = "",
  duration = 0.5,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...directions[direction] }
      }
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- Seções B2C SaaS Premium ---

const Hero = ({ onCtaClick, onScrollToModules }) => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center bg-[#0B0F19] pt-20 border-b border-white/5 overflow-hidden">
      {/* Background Decorativo Médico Minimalista PREMIUM DARK */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 pointer-events-none mix-blend-screen">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[130px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[130px] -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center text-center mt-12 mb-20">
        <FadeIn direction="down" delay={0.1}>
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 backdrop-blur-md text-blue-300 px-5 py-2.5 rounded-full mb-8 text-sm font-medium tracking-wide shadow-2xl">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>A Revolução em Análise Clínica Chegou</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} duration={0.8}>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.05] max-w-5xl">
            Decisões precisas na <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              velocidade do pensamento.
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed font-light max-w-3xl">
            O iXamina processa exames laboratoriais e de imagem em segundos,
            extraindo achados clínicos estruturados com precisão absurda e zero
            retenção de dados sensíveis.
          </p>
        </FadeIn>

        <FadeIn delay={0.5} className="w-full flex justify-center">
          <div className="flex flex-col sm:flex-row gap-5">
            <button
              onClick={onCtaClick}
              className="px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-500 transition-all duration-300 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:-translate-y-1"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={onScrollToModules}
              className="px-8 py-4 text-lg font-bold text-white bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
            >
              Explorar Plataforma
            </button>
          </div>
        </FadeIn>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#0B0F19] to-transparent pointer-events-none"></div>
    </section>
  );
};

const Methodology = () => {
  return (
    <section className="py-32 bg-[#060913] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-sm font-bold text-indigo-400 tracking-[0.2em] uppercase mb-4">
              Por que o iXamina?
            </h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Padrão Ouro em Produtividade
            </h3>
            <p className="text-lg text-slate-400">
              Desenhado meticulosamente para acelerar fluxos clínicos sem abrir
              mão da precisão médica.
            </p>
          </FadeIn>
        </div>

        {/* Minimalist SaaS Premium Rows Instead of Grid */}
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <FadeIn delay={0.1}>
            <div className="interactive group relative overflow-hidden bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(59,130,246,0.05)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none"></div>
              <div className="relative z-10 md:w-20 md:h-20 w-16 h-16 shrink-0 rounded-[1.5rem] bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-500/20 flex items-center justify-center shadow-inner">
                <BrainCircuit className="w-8 h-8 md:w-10 md:h-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-2xl font-bold text-white mb-3 relative z-10">
                  Inteligência Estrutural
                </h4>
                <p className="text-slate-400 text-lg leading-relaxed relative z-10">
                  O motor cruza dados identificando gatilhos que exigiriam
                  checagem manual, reduzindo o tempo de triagem
                  significativamente com alta precisão.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Feature 2 */}
          <FadeIn delay={0.2}>
            <div className="interactive group relative overflow-hidden bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row-reverse items-center gap-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(16,185,129,0.05)]">
              <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none"></div>
              <div className="relative z-10 md:w-20 md:h-20 w-16 h-16 shrink-0 rounded-[1.5rem] bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                <Zap className="w-8 h-8 md:w-10 md:h-10 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              </div>
              <div className="flex-1 text-center md:text-right">
                <h4 className="text-2xl font-bold text-white mb-3 relative z-10">
                  Arquitetura Ultra-rápida
                </h4>
                <p className="text-slate-400 text-lg leading-relaxed relative z-10">
                  Respostas de alta complexidade em menos de 3 segundos,
                  processando laudos extensos em tempo recorde para garantir
                  agilidade.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Feature 3 */}
          <FadeIn delay={0.3}>
            <div className="interactive group relative overflow-hidden bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(168,85,247,0.05)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none"></div>
              <div className="relative z-10 md:w-20 md:h-20 w-16 h-16 shrink-0 rounded-[1.5rem] bg-gradient-to-br from-purple-500/10 to-fuchsia-600/10 border border-purple-500/20 flex items-center justify-center shadow-inner">
                <Lock className="w-8 h-8 md:w-10 md:h-10 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-2xl font-bold text-white mb-3 relative z-10">
                  Zero Retenção
                </h4>
                <p className="text-slate-400 text-lg leading-relaxed relative z-10">
                  Informações PII (Nomes, CPFs) são anonimizadas localmente.
                  Seus dados médicos nunca compõem bases de treino. Privacidade
                  inegociável.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const AvailableModules = ({ onNavigate, user }) => {
  const modules = [
    {
      id: "hemogram",
      icon: <Syringe className="h-10 w-10 text-rose-500" />,
      title: "Exames Laboratoriais",
      desc: "Avaliação hematológica cruzada com detecção de padrões e valores clínicos de alerta.",
      gradient: "from-rose-500/20 to-orange-500/5",
      borderHover: "hover:border-rose-500/50",
      btnHighlight:
        "bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white",
    },
    {
      id: "xray",
      icon: <Activity className="h-10 w-10 text-cyan-400" />,
      title: "Raio-X de Tórax",
      desc: "Análise assistida para opacidades pleurais, silhueta cardíaca e desvios radiológicos.",
      gradient: "from-cyan-500/20 to-blue-500/5",
      borderHover: "hover:border-cyan-500/50",
      btnHighlight:
        "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white",
    },
    {
      id: "ecg",
      icon: <HeartPulse className="h-10 w-10 text-amber-500" />,
      title: "Eletrocardiograma",
      desc: "Rastreio paramétrico de intervalos, eixos ventriculares e isquemias a partir de imagens ou PDFs.",
      gradient: "from-amber-500/20 to-yellow-500/5",
      borderHover: "hover:border-amber-500/50",
      btnHighlight:
        "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white",
    },
  ];

  return (
    <section
      id="modulos"
      className="py-32 bg-[#0B0F19] relative border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <FadeIn>
            <h2 className="text-base font-bold text-blue-500 tracking-widest uppercase mb-4">
              Módulos Ativos
            </h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Especialidades em Produção
            </h3>
          </FadeIn>
          <FadeIn delay={0.2} className="max-w-lg">
            <p className="text-slate-400 text-lg">
              Os módulos do iXamina são construídos sobre guardrails clínicos
              restritos, garantindo precisão documental.
            </p>
          </FadeIn>
        </div>

        {/* Asymmetrical Grid For Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((mod, idx) => (
            <FadeIn
              key={idx}
              delay={idx * 0.15}
              className={idx === 0 ? "md:col-span-2" : "md:col-span-1"}
            >
              <div
                className={`interactive group h-full bg-[#111624] rounded-[2rem] border border-white/5 ${mod.borderHover} p-10 flex flex-col shadow-2xl transition-all duration-500 relative overflow-hidden ${idx === 0 ? "md:flex-row md:items-center gap-10" : "gap-6"}`}
              >
                {/* Minimalist Gradient Background */}
                <div
                  className={`absolute top-0 ${idx === 0 ? "right-0" : "left-0"} w-[150%] h-[150%] bg-gradient-to-bl ${mod.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
                ></div>

                <div
                  className={`relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500 inline-flex p-6 rounded-3xl bg-white/5 shrink-0 ${idx === 0 ? "mb-0" : "mb-2"}`}
                >
                  {React.cloneElement(mod.icon, {
                    className: "h-12 w-12 text-current",
                  })}
                </div>

                <div className="flex-1 flex flex-col relative z-10">
                  <h4 className="text-2xl font-bold text-white mb-3">
                    {mod.title}
                  </h4>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8 flex-1">
                    {mod.desc}
                  </p>

                  <button
                    onClick={() => {
                      if (!user) {
                        alert("Faça login para acessar os módulos.");
                        onNavigate("login");
                      } else {
                        onNavigate(mod.id);
                      }
                    }}
                    className={`w-full md:w-auto self-start px-8 py-4 flex justify-center items-center gap-3 font-bold rounded-xl transition-all duration-300 ${user ? mod.btnHighlight : "bg-white/5 text-slate-500 cursor-not-allowed"}`}
                  >
                    {!user && <Lock className="w-5 h-5" />}
                    {user ? "Acessar Módulo" : "Faça Login"}
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Planos de Assinatura ---
const Pricing = ({ user, userData, onNavigateLogin }) => {
  const isAdmin = userData?.isAdmin;
  const currentPlan = isAdmin ? "admin" : userData?.plan || "free";

  const getButtonState = (planId) => {
    if (!user) {
      return {
        text: "Começar Agora",
        disabled: false,
        onClick: onNavigateLogin,
      };
    }
    if (isAdmin) {
      return { text: "Acesso Liberado (Admin)", disabled: true, onClick: null };
    }
    if (currentPlan === planId) {
      return { text: "Plano Atual", disabled: true, onClick: null };
    }
    return {
      text: `Assinar ${planId === "free" ? "Free" : planId === "basico" ? "Básico" : "Pro"}`,
      disabled: false,
      onClick: () => alert("Implementação de gateway de pagamento em breve."),
    };
  };

  const freeBtn = getButtonState("free");
  const basicBtn = getButtonState("basico");
  const proBtn = getButtonState("pro");

  return (
    <section
      id="planos"
      className="py-32 bg-[#060913] border-t border-white/5 relative overflow-hidden"
    >
      {/* Background Lighting */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <FadeIn>
            <h2 className="text-base font-bold text-indigo-400 tracking-widest uppercase mb-4">
              Transparência B2C
            </h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Acesso Inteligente
            </h3>
          </FadeIn>
        </div>

        {/* 2-Column Split: Free & Basic on Left, PRO on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Coluna Esquerda: Free & Básico */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Plano Free */}
            <FadeIn direction="right">
              <div className="interactive bg-[#111624] rounded-[2rem] p-8 border border-white/5 flex flex-col hover:border-white/10 transition-colors duration-500 h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">
                      Plano Free
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Para conhecer a Interface de usuário.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />{" "}
                    Menu Dashboard Ativo
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />{" "}
                    Chatbot Geral Básico
                  </div>
                </div>

                <button
                  disabled={freeBtn.disabled}
                  onClick={freeBtn.onClick}
                  className={`w-full py-3 font-bold rounded-xl transition-all duration-300 ${
                    freeBtn.disabled
                      ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {freeBtn.text}
                </button>
              </div>
            </FadeIn>

            {/* Plano Básico */}
            <FadeIn direction="right" delay={0.2}>
              <div className="interactive bg-[#111624] rounded-[2rem] p-8 border border-white/5 flex flex-col hover:border-white/10 transition-colors duration-500 h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">
                      Plano Básico
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Para análises de média frequência.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />{" "}
                    Todos os Módulos liberados
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />{" "}
                    Total Controle dos Prompts da Nossa IA
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />{" "}
                    Dashboard & Log History
                  </div>
                </div>

                <button
                  disabled={basicBtn.disabled}
                  onClick={basicBtn.onClick}
                  className={`w-full py-3 font-bold rounded-xl transition-all duration-300 border ${
                    basicBtn.disabled
                      ? "bg-white/5 text-slate-500 cursor-not-allowed border-white/5"
                      : "bg-transparent text-blue-400 border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50"
                  }`}
                >
                  {basicBtn.text}
                </button>
              </div>
            </FadeIn>
          </div>

          {/* Coluna Direita: PRO (Destaque Massivo) */}
          <div className="lg:col-span-7 h-full">
            <FadeIn delay={0.4} className="h-full">
              <div className="interactive group bg-[#0B0F19] rounded-[2.5rem] p-12 border border-indigo-500/50 shadow-[0_0_80px_rgba(79,70,229,0.15)] relative h-full flex flex-col overflow-hidden justify-between hover:shadow-[0_0_120px_rgba(79,70,229,0.3)] transition-all duration-700">
                {/* Internal Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/30 transition-all duration-1000"></div>

                <div>
                  <div className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg mb-8 relative z-10">
                    Recomendado: Experiência Premium
                  </div>

                  <h4 className="text-4xl md:text-5xl font-extrabold text-white mb-4 relative z-10">
                    iXamina PRO
                  </h4>
                  <p className="text-slate-300 text-lg mb-12 max-w-sm relative z-10">
                    O poder absoluto para a sua clínica. Obtenha segurança
                    total, restauração avançada e limites estendidos.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-14 relative z-10">
                    <div className="flex items-center text-sm md:text-base text-slate-200">
                      <CheckCircle2 className="w-6 h-6 text-indigo-400 mr-4 flex-shrink-0" />
                      Tudo dos Planos Anteriores
                    </div>
                    <div className="flex items-center text-sm md:text-base text-slate-200">
                      <CheckCircle2 className="w-6 h-6 text-indigo-400 mr-4 flex-shrink-0" />
                      Exportação de Exames
                    </div>
                    <div className="flex items-center text-sm md:text-base text-slate-200">
                      <CheckCircle2 className="w-6 h-6 text-indigo-400 mr-4 flex-shrink-0" />
                      Chatbot exclusivo no Whatsapp
                    </div>
                    <div className="flex items-center text-sm md:text-base text-slate-200">
                      <CheckCircle2 className="w-6 h-6 text-indigo-400 mr-4 flex-shrink-0" />
                      Limites Estendidos
                    </div>
                  </div>
                </div>

                <button
                  disabled={proBtn.disabled}
                  onClick={proBtn.onClick}
                  className={`relative z-10 flex-shrink-0 w-full py-5 text-xl font-bold rounded-2xl transition-all duration-300 ${
                    proBtn.disabled
                      ? "bg-indigo-900/40 text-indigo-300/50 cursor-not-allowed border border-indigo-500/20"
                      : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(79,70,229,0.5)]"
                  }`}
                >
                  {proBtn.text}
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- FAQ e Segurança ---
const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "A inteligência artificial substitui o diagnóstico médico?",
      a: "Não. A plataforma atua exclusivamente como ferramenta de apoio à decisão clínica. Nossas análises focam na estruturação e facilitação da leitura de exames, mas o parecer final, a conduta e o diagnóstico contínuo devem sempre partir do profissional de saúde devidamente habilitado.",
    },
    {
      q: "Meus dados e os exames enviados estão seguros?",
      a: "Sim. A segurança e privacidade (LGPD) são pilares arquiteturais do nosso sistema. Empregamos mascaramento de dados e técnicas avançadas para remover identificadores pessoais (Nomes, CPFs, RGs) dos laudos antes que a inteligência artificial sequer tenha acesso às imagens ou textos originais.",
    },
    {
      q: "Como o meu limite diário de uso é contabilizado?",
      a: "O limite diário de análises é consumido a cada exame processado pela IA. Ele é reiniciado automaticamente a cada 24 horas (à meia-noite, horário de Brasília) para todos os perfis cadastrados, não sendo acumulativo.",
    },
    {
      q: "Como funciona a integração com o WhatsApp?",
      a: "No Plano Superior, você obtém acesso ao nosso Chatbot Exclusivo no WhatsApp. Através dele, você pode solicitar sumarizações rápidas e buscar diagnósticos na literatura médica via mensagens diretas, ideal para uso assistente imediato.",
    },
  ];

  return (
    <section className="py-32 bg-[#0B0F19] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <FadeIn>
            <h2 className="text-base font-bold text-slate-500 tracking-widest uppercase mb-4">
              Dúvidas Técnicas
            </h2>
            <h3 className="text-4xl font-extrabold text-white tracking-tight">
              Entenda a Arquitetura
            </h3>
          </FadeIn>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div
                  className={`border ${isOpen ? "border-indigo-500/50 bg-[#111624]" : "border-white/5 bg-[#111624]/50 hover:bg-[#111624]"} rounded-[1.5rem] overflow-hidden transition-all duration-300`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full text-left px-8 py-6 flex items-center justify-between focus:outline-none"
                  >
                    <span
                      className={`font-bold text-lg ${isOpen ? "text-indigo-400" : "text-slate-200"}`}
                    >
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180 text-indigo-400" : "text-slate-500"}`}
                    />
                  </button>
                  <div
                    className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-56 pb-8 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <p className="text-slate-400 text-base leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const SecurityBadges = () => {
  return (
    <section className="py-16 bg-[#000000] border-t border-white/10 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-900/5 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <p className="text-slate-500 text-xs mb-8 uppercase tracking-[0.2em] font-bold">
            Infraestrutura Certificada
          </p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-24 opacity-70">
            <div className="flex items-center group">
              <ShieldCheck className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors mr-3" />
              <span className="text-slate-300 font-medium text-sm text-left leading-tight">
                LGPD
                <br />
                Compliant
              </span>
            </div>
            <div className="flex items-center group">
              <Lock className="w-8 h-8 text-slate-400 group-hover:text-amber-400 transition-colors mr-3" />
              <span className="text-slate-300 font-medium text-sm text-left leading-tight">
                Zero Retention
                <br />
                API
              </span>
            </div>
            <div className="flex items-center group">
              <Activity className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 transition-colors mr-3" />
              <span className="text-slate-300 font-medium text-sm text-left leading-tight">
                TLS 1.3
                <br />
                E2E Encriptado
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

// --- Componente Principal ---

const HomePage = ({ onNavigateLogin, onNavigate, user, onLogout }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (user?.uid) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (e) {
          console.error(e);
        }
      }
    }
    fetchUser();
  }, [user]);

  const scrollToModules = () => {
    document.getElementById("modulos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#060913] font-manrope selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar
        user={user ? { ...user, userData } : null}
        onNavigate={(screen) => {
          if (screen === "login") onNavigateLogin();
          else if (screen === "landing" || screen === "home")
            window.scrollTo({ top: 0, behavior: "smooth" });
          else if (onNavigate) onNavigate(screen);
        }}
        onLogout={onLogout}
        isLanding={true}
      />

      <main>
        <Hero
          onCtaClick={() =>
            document
              .getElementById("planos")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          onScrollToModules={scrollToModules}
        />
        <Methodology />
        <Pricing
          user={user}
          userData={userData}
          onNavigateLogin={onNavigateLogin}
        />
        <AvailableModules
          user={user}
          onNavigate={(screen) =>
            onNavigate ? onNavigate(screen) : onNavigateLogin()
          }
        />
        <FAQ />
        <SecurityBadges />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
