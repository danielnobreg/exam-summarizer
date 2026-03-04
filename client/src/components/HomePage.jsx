import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  BrainCircuit,
  Syringe,
  HeartPulse,
  Lock,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

import Navbar from "./Navbar";
import Footer from "./Footer";

// --- Utilitários de Animação ---
const FadeIn = ({ children, delay = 0, direction = "up", className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
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

// --- Seções ---

const Hero = ({ onCtaClick, onScrollToModules }) => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center bg-white pt-20 border-b border-gray-100">
      {/* Background Decorativo Médico Minimalista */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-50/50 blur-3xl"></div>
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-slate-50 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <FadeIn>
              <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-full mb-8 text-sm font-semibold tracking-wide border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Segurança de Dados Médicos (LGPD)</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                Apoio à Decisão{" "}
                <span className="text-blue-600">Clínica Avançada</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed font-light">
                O Sintesys auxilia profissionais no mapeamento de biomarcadores
                e interpretação radiológica com processamento inteligente de
                ponta. Obtenha laudos estruturados, identificação de anomalias e
                cruzamento de dados com a literatura médica atual.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onCtaClick}
                  className="px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  Confira nossos planos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button
                  onClick={onScrollToModules}
                  className="px-8 py-4 text-lg font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center"
                >
                  Nossos Módulos
                </button>
              </div>
            </FadeIn>
          </div>

          <div className="hidden lg:block relative">
            <FadeIn delay={0.4} direction="left">
              {/* Minimalist UI Mockup instead of real images */}
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 relative z-10">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="text-xs font-medium text-slate-400 ml-4 flex-1">
                    Relatório_Paciente_Silva.pdf
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-slate-100 rounded-md w-1/3"></div>
                  <div className="h-8 bg-slate-50 rounded-md w-3/4"></div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30">
                      <div className="text-xs font-bold text-blue-600 uppercase mb-1">
                        Achados Críticos
                      </div>
                      <div className="text-sm text-slate-700">
                        Leucocitose severa
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
                      <div className="text-xs font-bold text-emerald-600 uppercase mb-1">
                        Sinais Vitais
                      </div>
                      <div className="text-sm text-slate-700">
                        Estabilidade confirmada
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <div className="h-2 bg-slate-100 rounded-full w-full"></div>
                    <div className="h-2 bg-slate-100 rounded-full w-5/6"></div>
                    <div className="h-2 bg-slate-100 rounded-full w-4/6"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-slate-900 rounded-2xl -z-10"></div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

const Methodology = () => {
  const pillars = [
    {
      icon: <BrainCircuit className="h-8 w-8 text-blue-600" />,
      title: "Processamento Cognitivo",
      desc: "Identifica correlações clínicas complexas que podem passar despercebidas na revisão manual rápida.",
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Eficiência Operacional",
      desc: "Reduz drasticamente o tempo de triagem de exames laboratoriais e radiológicos, liberando tempo médico.",
    },
    {
      icon: <Lock className="h-8 w-8 text-blue-600" />,
      title: "Privacidade by Design",
      desc: "A infraestrutura não utiliza os dados sensíveis inseridos para treinamento de IA de terceiros (Zero Retention API).",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-3">
              Tecnologia
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900">
              Pilares da Plataforma
            </h3>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 h-full flex flex-col items-start">
                <div className="p-3 rounded-xl bg-blue-50 mb-6 border border-blue-100">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const AvailableModules = ({ onNavigate }) => {
  const modules = [
    {
      id: "hemogram",
      icon: <Syringe className="h-8 w-8 text-blue-600" />,
      title: "Exame Laboratorial Completo",
      desc: "Avaliação laboratorial integral: série vermelha, série branca e plaquetas. Cruzamento de biomarcadores para detecção precoce de desvios.",
      styles: {
        bg: "bg-blue-50",
        hoverBg: "hover:bg-blue-600",
        text: "text-blue-500",
        hoverBorder: "hover:border-blue-600",
      },
      features: [
        "Índices Hematimétricos",
        "Sinalização Infecciosa",
        "Valores de Pânico",
      ],
    },
    {
      id: "xray",
      icon: <Activity className="h-8 w-8 text-emerald-600" />,
      title: "Radiografia de Tórax",
      desc: "Suporte à detecção de anomalias pulmonares, alterações na silhueta cardíaca e identificação de derrames pleurais ou opacidades.",
      styles: {
        bg: "bg-emerald-50",
        hoverBg: "hover:bg-emerald-600",
        text: "text-emerald-500",
        hoverBorder: "hover:border-emerald-600",
      },
      features: [
        "Análise de Opacidades",
        "Silhueta Cardíaca",
        "Dados Clínicos Integrados",
      ],
    },
    {
      id: "ecg",
      icon: <HeartPulse className="h-8 w-8 text-indigo-600" />,
      title: "Eletrocardiograma",
      desc: "Identificação estruturada de padrões de arritmia, bloqueios de ramo, intervalos (PR, QTi) e sinais de isquemia miocárdica.",
      styles: {
        bg: "bg-indigo-50",
        hoverBg: "hover:bg-indigo-600",
        text: "text-indigo-500",
        hoverBorder: "hover:border-indigo-600",
      },
      features: [
        "Leitura de Eixos",
        "Rastreio de Arritmias",
        "Análise de Isquemia",
      ],
    },
  ];

  return (
    <section id="modulos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <FadeIn>
            <h2 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-3">
              Módulos Ativos
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900">
              Especialidades Suportadas
            </h3>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {modules.map((mod, idx) => (
            <FadeIn key={idx} delay={idx * 0.1} className="h-full">
              <div className="group h-full bg-white rounded-3xl border border-slate-200 hover:border-slate-300 p-8 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300">
                <div
                  className={`w-14 h-14 rounded-2xl ${mod.styles.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  {mod.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">
                  {mod.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1">
                  {mod.desc}
                </p>

                <div className="space-y-3 mb-8">
                  {mod.features.map((feat, fidx) => (
                    <div
                      key={fidx}
                      className="flex items-center text-sm font-medium text-slate-700"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 mr-3 ${mod.styles.text}`}
                      />
                      {feat}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate(mod.id)}
                  className={`w-full py-3 bg-slate-50 text-slate-800 border border-slate-200 font-bold rounded-xl ${mod.styles.hoverBg} hover:text-white ${mod.styles.hoverBorder} transition-colors`}
                >
                  Acessar Módulo
                </button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Planos de Assinatura ---
const Pricing = () => {
  return (
    <section
      id="planos"
      className="py-24 bg-slate-50 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-3">
              Modelos de Assinatura
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900">
              Planos e Vantagens
            </h3>
          </FadeIn>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Plano Gratuito */}
          <FadeIn>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 relative opacity-80 h-full flex flex-col">
              <h4 className="text-2xl font-bold text-slate-800 mb-2">
                Plano Inicial
              </h4>
              <p className="text-slate-500 text-sm mb-6">
                Para experimentação da interface.
              </p>
              <div className="text-4xl font-extrabold text-slate-900 mb-8">
                Grátis
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />{" "}
                  Acesso ao dashboard
                </div>
                <div className="flex items-center text-sm text-slate-400 line-through">
                  <X className="w-5 h-5 text-slate-300 mr-3 flex-shrink-0" />{" "}
                  Análise de Hemogramas
                </div>
                <div className="flex items-center text-sm text-slate-400 line-through">
                  <X className="w-5 h-5 text-slate-300 mr-3 flex-shrink-0" />{" "}
                  Raio-X Torácico
                </div>
                <div className="flex items-center text-sm text-slate-400 line-through">
                  <X className="w-5 h-5 text-slate-300 mr-3 flex-shrink-0" />{" "}
                  Eletrocardiograma
                </div>
                <div className="flex items-center text-sm text-slate-400 line-through">
                  <X className="w-5 h-5 text-slate-300 mr-3 flex-shrink-0" />{" "}
                  Suporte Prioritário
                </div>
              </div>

              <button
                disabled
                className="w-full py-4 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed border border-slate-200"
              >
                Em breve
              </button>
            </div>
          </FadeIn>

          {/* Plano PRO */}
          <FadeIn delay={0.2}>
            <div className="bg-white rounded-3xl p-8 border-2 border-blue-500 shadow-xl relative h-full flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                Mais Escolhido
              </div>

              <h4 className="text-2xl font-bold text-blue-900 mb-2">
                Sintesys PRO
              </h4>
              <p className="text-slate-500 text-sm mb-6">
                Acesso completo à plataforma.
              </p>
              <div className="text-4xl font-extrabold text-slate-900 mb-2">
                R$ 9,90
                <span className="text-lg text-slate-500 font-medium">/mês</span>
              </div>

              <div className="space-y-4 mb-8 flex-1 mt-6">
                <div className="flex items-center text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />{" "}
                  Análises Ilimitadas de Hemogramas
                </div>
                <div className="flex items-center text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />{" "}
                  Acesso total ao Raio-X Torácico
                </div>
                <div className="flex items-center text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />{" "}
                  Identificação de anomalias no ECG
                </div>
                <div className="flex items-center text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />{" "}
                  Exportação de Laudos Estruturados
                </div>
                <div className="flex items-center text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />{" "}
                  Suporte Especializado 24/7
                </div>
              </div>

              <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:-translate-y-1">
                Assinar Sintesys PRO
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// --- Componente Principal ---

const HomePage = ({ onNavigateLogin, onNavigate, user, onLogout }) => {
  const scrollToModules = () => {
    document.getElementById("modulos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-manrope selection:bg-blue-100 selection:text-blue-900">
      <Navbar
        user={user}
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
        <Pricing />
        <AvailableModules
          onNavigate={(screen) =>
            onNavigate ? onNavigate(screen) : onNavigateLogin()
          }
        />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
