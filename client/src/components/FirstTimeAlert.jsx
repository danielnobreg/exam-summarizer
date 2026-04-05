import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react';

export default function FirstTimeAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Check global state in localStorage (v2 for reset)
    const hasSeenAlert = localStorage.getItem('ixamina_first_time_upload_alert_v2');
    if (!hasSeenAlert) {
      setIsRendered(true);
      document.body.style.overflow = "hidden"; // Block scroll
      // Small timeout to allow css animations to trigger smoothly
      setTimeout(() => setIsOpen(true), 100);
    }

    return () => {
      document.body.style.overflow = ""; // Cleanup scroll block
    };
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('ixamina_first_time_upload_alert_v2', 'true');
    document.body.style.overflow = ""; // Restore scroll
    // Wait for the exit animation before fully unmounting
    setTimeout(() => setIsRendered(false), 300);
  };

  if (!isRendered) return null;

  return createPortal(
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'bg-black/80 backdrop-blur-md opacity-100' : 'bg-transparent backdrop-blur-none opacity-0'}`}>
      <div className={`bg-[#111624] border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg p-8 relative overflow-hidden transition-all duration-500 transform ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'}`}>
        
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

        <div className="flex items-center mb-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-white/10 mr-4">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Otimização de Análise</h2>
            <p className="text-sm text-slate-400">Aviso importante para o uso da Inteligência Artificial</p>
          </div>
        </div>

        <div className="space-y-4 mb-8 relative z-10 text-slate-300 text-sm leading-relaxed">
          <p className="mb-2">
            Para garantir que a Inteligência Artificial do iXamina extraia o melhor e mais preciso resultado do seu exame, atente-se a essas recomendações antes do upload:
          </p>

          <div className="flex gap-3 items-start bg-white/5 p-4 rounded-xl border border-white/5">
            <ImageIcon className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-1">Qualidade da Imagem ou Scan</span>
              Envie fotos/arquivos com alta resolução, bem iluminados e com textos perfeitamente legíveis.
            </div>
          </div>

          <div className="flex gap-3 items-start bg-white/5 p-4 rounded-xl border border-white/5">
            <FileText className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-1">Evite Sujeira Visual</span>
              Recorte a foto focando apenas no texto ou na área do exame. Evite que apareçam mesas, fundos complexos, sombras pesadas ou dobras extremas do papel.
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <button
            onClick={handleDismiss}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:-translate-y-1"
          >
            <CheckCircle2 size={20} />
            Entendi perfeitamente
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
