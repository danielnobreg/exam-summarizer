import React, { useState } from 'react';
import { Droplet, Mail, Instagram, Linkedin, Twitter } from 'lucide-react';
import TermsModal from './TermsModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('terms');
  const [showToast, setShowToast] = useState(false);

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handlePlaceholderClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <footer id="contact" className="bg-gray-950 text-white border-t border-gray-800 font-manrope relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

            <div>
              <div className="flex items-center mb-4">
                <Droplet className="h-6 w-6 text-red-600 fill-red-600" />
                <span className="ml-2 text-xl font-extrabold tracking-tight">
                  Hemotrack
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Revolucionando a análise de exames laboratoriais com inteligência artificial. Rápido, preciso e seguro.
              </p>
            </div>

            {/* Plataforma */}
            <div>
              <h4 className="font-bold text-lg mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button type="button" onClick={handlePlaceholderClick} className="hover:text-red-500 transition-colors text-left">
                    Como Funciona
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handlePlaceholderClick} className="hover:text-red-500 transition-colors text-left">
                    Segurança
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handlePlaceholderClick} className="hover:text-red-500 transition-colors text-left">
                    Preços
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handlePlaceholderClick} className="hover:text-red-500 transition-colors text-left">
                    Para Médicos
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button 
                    type="button"
                    onClick={() => openModal('terms')}
                    className="hover:text-red-500 transition-colors text-left"
                  >
                    Termos de Uso
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => openModal('privacy')}
                    className="hover:text-red-500 transition-colors text-left"
                  >
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handlePlaceholderClick} className="hover:text-red-500 transition-colors text-left">
                    Cookies
                  </button>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h4 className="font-bold text-lg mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  suporte@hemotrack.com.br
                </li>
              </ul>

              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handlePlaceholderClick}
                  aria-label="Instagram"
                  className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-red-600"
                >
                  <Instagram className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handlePlaceholderClick}
                  aria-label="LinkedIn"
                  className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-red-600"
                >
                  <Linkedin className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handlePlaceholderClick}
                  aria-label="Twitter"
                  className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-red-600"
                >
                  <Twitter className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2026 Hemotrack. Todos os direitos reservados.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-gray-500">
              <span>Feito com ❤️ para sua saúde</span>
            </div>
          </div>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl border border-gray-800 flex items-center gap-3"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500">
                !
              </span>
              <span className="font-medium text-sm">
                Funcionalidade em desenvolvimento
              </span>
            </motion.div>
          )}
        </AnimatePresence>

      </footer>

      <TermsModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </>
  );
}
