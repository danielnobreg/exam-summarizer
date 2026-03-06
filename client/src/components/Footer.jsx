import React, { useState } from "react";
import { Droplet, Mail } from "lucide-react";
import TermsModal from "./TermsModal";

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("terms");

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <>
      <footer
        id="contact"
        className="bg-slate-950 text-white border-t border-slate-800 font-manrope relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-4">
                <Droplet className="h-6 w-6 text-blue-500 fill-blue-500" />
                <span className="ml-2 text-xl font-extrabold tracking-tight">
                  iXamina
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Revolucionando a análise de exames laboratoriais com
                inteligência artificial. Rápido, preciso e seguro.
              </p>
            </div>

            {/* Simplificado */}

            {/* Legal */}
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button
                    type="button"
                    onClick={() => openModal("terms")}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    Termos de Uso
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openModal("privacy")}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    Política de Privacidade
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
                  suporte@ixamina.com.br
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2026 iXamina. Todos os direitos reservados.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-gray-500">
              <span>Feito com ❤️ para sua saúde</span>
            </div>
          </div>
        </div>
      </footer>

      <TermsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </>
  );
}
