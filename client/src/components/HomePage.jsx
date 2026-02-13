import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { 
  ArrowUp, 
  Droplet, 
  Activity, 
  PlayCircle, 
  ArrowRight,
  Zap,
  ShieldCheck,
  Settings,
  FileUp,
  Cpu,
  ClipboardCheck,
  Beaker,
  Heart,
  ScanLine
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';

// --- Componentes de UI ---

const FadeIn = ({ 
  children, 
  delay = 0, 
  className = "", 
  direction = 'up',
  fullWidth = false
}) => {
  const getDirectionOffset = () => {
    switch (direction) {
      case 'up': return { y: 40, x: 0 };
      case 'down': return { y: -40, x: 0 };
      case 'left': return { x: 40, y: 0 };
      case 'right': return { x: -40, y: 0 };
      case 'none': return { x: 0, y: 0 };
      default: return { y: 40, x: 0 };
    }
  };

  const offset = getDirectionOffset();

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...offset
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{ 
        duration: 0.7, 
        delay: delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- Sub-componentes ---

const Hero = ({ onCtaClick }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 pt-20">
      {/* Gradientes de Fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-red-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
        
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
            Nova tecnologia IA 2.0 disponível
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Análise Laboratorial <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Inteligente
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Faça upload do seu exame em PDF e receba uma análise detalhada, 
            explicativa e profissional em segundos. Tecnologia avançada para sua saúde.
          </p>
        </FadeIn>

        <FadeIn delay={0.4} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button 
            onClick={onCtaClick}
            className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-red-600/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
          >
            Experimentar Grátis
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          
          <button className="w-full sm:w-auto px-8 py-4 border border-gray-600 hover:border-white text-gray-300 hover:text-white font-semibold rounded-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group">
            <PlayCircle className="mr-2 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            Ver demonstração
          </button>
        </FadeIn>

        {/* Imagem Hero / Mockup */}
        <FadeIn delay={0.6} className="mt-16 w-full max-w-5xl">
          <div className="relative rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-4 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-900 via-transparent to-transparent z-20 opacity-80 rounded-2xl pointer-events-none"></div>
            
            {/* Janela do Navegador Mockup */}
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-inner">
              {/* Fake Window Header */}
              <div className="flex items-center px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto text-xs text-gray-500 font-mono">dashboard.hemotrack.ai</div>
              </div>
              
              {/* Conteúdo Placeholder */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Painel Esquerdo */}
                 <div className="md:col-span-1 space-y-4">
                    <div className="h-32 bg-gray-800 rounded-lg animate-pulse"></div>
                    <div className="h-12 bg-gray-800 rounded-lg opacity-60"></div>
                    <div className="h-12 bg-gray-800 rounded-lg opacity-60"></div>
                 </div>
                 {/* Painel Direito (Análise) */}
                 <div className="md:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-8 w-1/3 bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-8 w-24 bg-red-600/20 rounded text-red-500 flex items-center justify-center text-xs font-bold">ALERTA</div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-800 rounded w-full"></div>
                        <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-800 rounded w-4/6"></div>
                    </div>
                    <div className="mt-6 p-4 border border-red-900/30 bg-red-900/10 rounded-lg">
                        <div className="h-4 w-1/2 bg-red-800/40 rounded mb-2"></div>
                        <div className="h-16 bg-red-800/20 rounded"></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: <FileUp className="h-10 w-10 text-red-600" />,
      title: "Upload do PDF",
      description: "Envie o arquivo PDF do seu exame laboratorial através da nossa plataforma segura.",
      number: "01"
    },
    {
      icon: <Cpu className="h-10 w-10 text-red-600" />,
      title: "IA Processa",
      description: "Nossa inteligência artificial analisa cada parâmetro, comparando com referências atualizadas.",
      number: "02"
    },
    {
      icon: <ClipboardCheck className="h-10 w-10 text-red-600" />,
      title: "Receba a Análise",
      description: "Em segundos, você tem um relatório detalhado e fácil de entender sobre sua saúde.",
      number: "03"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Elemento decorativo de fundo */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-red-600 font-bold tracking-wide uppercase text-sm mb-3">Passo a Passo</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">Como funciona o Hemotrack?</h3>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Linha conectora para Desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>

          {steps.map((step, index) => (
            <FadeIn key={index} delay={index * 0.2}>
              <div className="relative group p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center text-center">
                <div className="absolute -top-6 bg-gray-50 p-2 rounded-full border-4 border-white shadow-sm">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 font-bold text-lg">
                        {step.number}
                    </span>
                </div>
                
                <div className="mt-6 mb-6 p-4 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">
                  {step.icon}
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      title: "Análise em Segundos",
      description: "Não espere dias para entender seus exames. Nosso motor de IA processa PDFs complexos instantaneamente, destacando alterações e explicando termos médicos em linguagem simples.",
      icon: <Zap className="h-6 w-6 text-white" />,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      align: 'left'
    },
    {
      title: "Totalmente Seguro",
      description: "Sua saúde é privada. Utilizamos criptografia de ponta a ponta e armazenamento seguro (Firebase/GCP). Seus dados nunca são compartilhados com terceiros sem seu consentimento explícito.",
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      align: 'right'
    },
    {
      title: "Painel Administrativo",
      description: "Para clínicas e médicos: gerencie múltiplos pacientes, controle limites de análises e tenha um histórico completo acessível a qualquer momento através de um dashboard intuitivo.",
      icon: <Settings className="h-6 w-6 text-white" />,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      align: 'left'
    }
  ];

  return (
    <section className="py-24 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {features.map((feature, index) => (
          <div key={index} className={`flex flex-col ${feature.align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
            
            {/* Conteúdo de Texto */}
            <div className="flex-1 space-y-6">
              <FadeIn direction={feature.align === 'right' ? 'left' : 'right'}>
                <div className="inline-flex items-center justify-center p-3 bg-red-600 rounded-xl shadow-lg shadow-red-900/50 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
                <button className="text-red-500 font-semibold hover:text-red-400 transition-colors flex items-center mt-4">
                  Saiba mais <span className="ml-2 text-xl">→</span>
                </button>
              </FadeIn>
            </div>

            {/* Conteúdo de Imagem */}
            <div className="flex-1 w-full">
              <FadeIn direction={feature.align === 'right' ? 'right' : 'left'} delay={0.2}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700 group">
                  <div className="absolute inset-0 bg-red-600/10 group-hover:bg-transparent transition-all duration-500 z-10"></div>
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Elementos Decorativos */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600/20 blur-3xl rounded-full"></div>
                </div>
              </FadeIn>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
};

const Counter = ({ from, to, duration }) => {
  const [count, setCount] = useState(from);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: false, margin: "-100px" });

  useEffect(() => {
    if (!inView) {
      setCount(from);
      return;
    }

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      setCount(Math.floor(from + (to - from) * percentage));

      if (progress < duration * 1000) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count}</span>;
};

const Stats = () => {
  const stats = [
    { label: "Análises Realizadas", value: 500, suffix: "+" },
    { label: "Precisão na Leitura", value: 98, suffix: "%" },
    { label: "Disponibilidade", value: 24, suffix: "/7" }
  ];

  return (
    <section className="py-20 relative bg-gradient-to-br from-red-900 via-red-800 to-gray-900 text-white overflow-hidden">
      {/* Overlay de Padrão */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-red-700/50">
          
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-8"
            >
              <div className="text-5xl md:text-6xl font-extrabold mb-2 text-white tracking-tight">
                <Counter from={0} to={stat.value} duration={2} />{stat.suffix}
              </div>
              <p className="text-red-200 font-medium text-lg uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

const AvailableExams = ({ onAnalyzeClick }) => {
  return (
    <section id="exames" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">Comece Agora</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Selecione o tipo de exame que deseja analisar. Estamos constantemente adicionando novos tipos de análises.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Cartão Ativo - Hemograma */}
          <FadeIn className="h-full">
            <div className="h-full bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-red-100 hover:border-red-500 transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="bg-red-600 p-6 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Hemograma Completo</h3>
                </div>
                <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Disponível
                </span>
              </div>
              
              <div className="p-8">
                <p className="text-gray-600 mb-6 text-lg">
                  Análise detalhada de série vermelha (eritrócitos), série branca (leucócitos) e plaquetas.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-gray-500">
                    <ScanLine className="h-4 w-4 mr-2 text-green-500" />
                    Detecta anemias e infecções
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ScanLine className="h-4 w-4 mr-2 text-green-500" />
                    Interpretação automática de VCM, HCM, CHCM
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ScanLine className="h-4 w-4 mr-2 text-green-500" />
                    Alertas visuais para valores críticos
                  </div>
                </div>

                <button 
                  onClick={onAnalyzeClick}
                  className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                >
                  Analisar Hemograma
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Grid de "Em Breve" */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Cartão 2 */}
            <FadeIn delay={0.2} className="h-full">
              <div className="h-full bg-gray-100 rounded-2xl p-6 border border-gray-200 opacity-70 hover:opacity-100 transition-opacity relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-gray-300 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase">
                  Em Breve
                </div>
                <Beaker className="h-10 w-10 text-gray-400 mb-4" />
                <h4 className="text-xl font-bold text-gray-800 mb-2">Glicemia & Insulina</h4>
                <p className="text-sm text-gray-500">Análise de curvas glicêmicas e risco de diabetes.</p>
              </div>
            </FadeIn>

            {/* Cartão 3 */}
            <FadeIn delay={0.3} className="h-full">
              <div className="h-full bg-gray-100 rounded-2xl p-6 border border-gray-200 opacity-70 hover:opacity-100 transition-opacity relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-gray-300 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase">
                  Em Breve
                </div>
                <Heart className="h-10 w-10 text-gray-400 mb-4" />
                <h4 className="text-xl font-bold text-gray-800 mb-2">Perfil Lipídico</h4>
                <p className="text-sm text-gray-500">Colesterol total, frações HDL/LDL e triglicerídeos.</p>
              </div>
            </FadeIn>

             {/* Cartão 4 */}
             <FadeIn delay={0.4} className="col-span-1 sm:col-span-2">
              <div className="h-full bg-gray-100 rounded-2xl p-6 border border-gray-200 opacity-70 hover:opacity-100 transition-opacity relative overflow-hidden flex items-center">
                 <div className="mr-6">
                    <Activity className="h-10 w-10 text-gray-400" />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-1">Função Hepática e Renal</h4>
                    <p className="text-sm text-gray-500">TGO, TGP, Gama GT, Ureia e Creatinina.</p>
                    <div className="mt-2 inline-block bg-gray-300 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase">
                        Em desenvolvimento
                    </div>
                 </div>
              </div>
            </FadeIn>

          </div>

        </div>
      </div>
    </section>
  );
};

// --- Componente Principal ---

const HomePage = ({ onNavigateLogin, onNavigate, user }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-manrope selection:bg-red-200 selection:text-red-900">
      <Navbar 
        user={user}
        onNavigate={(screen) => {
          if (screen === 'login') onNavigateLogin();
          else if (screen === 'landing' || screen === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
          else if (onNavigate) onNavigate(screen); // Encaminha outras navegações (hemogram, admin, contact) para o App.js
        }} 
        isLanding={true} 
      />
      
      <main>
        <Hero onCtaClick={() => onNavigate ? onNavigate('hemogram') : onNavigateLogin()} />
        <HowItWorks />
        <Features />
        <Stats />
        <AvailableExams onAnalyzeClick={() => onNavigate ? onNavigate('hemogram') : onNavigateLogin()} />
      </main>

      <Footer />

      {/* Botão Voltar ao Topo */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-xl transition-all duration-300 z-40 transform ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </div>
  );
};

export default HomePage;
