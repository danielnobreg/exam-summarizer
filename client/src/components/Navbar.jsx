import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Droplet,
  ChevronDown,
  Activity,
  Settings,
  LogOut,
  HeartPulse,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserData } from "../services/userService";

const LungsIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v4" />
    <path d="M12 5v11c0 2-1.5 4-3.5 4C6 20 4 17.5 3.5 14c-.5-3.5 1-7 4-8l4.5-1z" />
    <path d="M12 5v11c0 2 1.5 4 3.5 4C18 20 20 17.5 20.5 14c.5-3.5-1-7-4-8L12 5z" />
  </svg>
);

function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const Navbar = ({ user, onNavigate, onLogout, isLanding = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  // Efeito para detectar rolagem e alterar fundo da navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efeito para carregar dados do usuário
  useEffect(() => {
    async function loadUserData() {
      if (user?.uid) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (err) {
          console.error("Erro ao buscar dados do usuário:", err);
        }
      }
    }
    loadUserData();
  }, [user?.uid]);

  const handleNavigate = (screen) => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    setIsUserMenuOpen(false);
    if (onNavigate) onNavigate(screen);
  };

  // Cores unificadas para fundos claros em toda a aplicação
  const navBackground = isScrolled
    ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
    : isLanding
      ? "bg-transparent"
      : "bg-white/90 border-b border-gray-50";

  const textColor = "text-slate-700";
  const logoColor = "text-slate-900";
  const logoIconColor = "text-blue-600";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBackground}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo (Esquerda) */}
          <div
            className="flex-shrink-0 flex items-center cursor-pointer group"
            onClick={() => handleNavigate("home")}
          >
            <Droplet
              className={`h-8 w-8 ${logoIconColor} group-hover:scale-110 transition-transform duration-300`}
            />
            <span
              className={`ml-2 text-2xl font-extrabold tracking-tight ${logoColor}`}
            >
              Sintesys
            </span>
          </div>

          {/* Links Centralizados (Desktop) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center space-x-8">
            <button
              onClick={() => handleNavigate("home")}
              className={`${textColor} hover:text-blue-600 transition-colors font-medium text-sm tracking-wide`}
            >
              Home
            </button>

            {user && (
              <div
                className="relative group"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  className={`flex items-center ${textColor} hover:text-blue-600 transition-colors font-medium text-sm tracking-wide focus:outline-none`}
                >
                  Exames
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="p-2">
                        <button
                          onClick={() => handleNavigate("hemogram")}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 transition flex items-center group"
                        >
                          <Activity className="h-5 w-5 text-blue-500 mr-3 group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              Laboratorial
                            </p>
                            <p className="text-xs text-gray-500">
                              Análise laboratorial completa
                            </p>
                          </div>
                        </button>
                        <button
                          onClick={() => handleNavigate("xray")}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-emerald-50 transition flex items-center group"
                        >
                          <LungsIcon className="h-5 w-5 text-emerald-500 mr-3 group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              Radiografia de Tórax
                            </p>
                            <p className="text-xs text-gray-500">
                              Análise de Radiografia de Tórax
                            </p>
                          </div>
                        </button>
                        <button
                          onClick={() => handleNavigate("ecg")}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-50 transition flex items-center group"
                        >
                          <HeartPulse className="h-5 w-5 text-indigo-500 mr-3 group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              Eletrocardiograma
                            </p>
                            <p className="text-xs text-gray-500">
                              Análise de Eletrocardiograma
                            </p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {user && (
              <button
                onClick={() => handleNavigate("dashboard")}
                className={`${textColor} hover:text-blue-600 transition-colors font-medium text-sm tracking-wide`}
              >
                Dashboard
              </button>
            )}

            <button
              onClick={() => handleNavigate("contact")}
              className={`${textColor} hover:text-blue-600 transition-colors font-medium text-sm tracking-wide`}
            >
              Contato
            </button>
          </div>

          {/* Ações à Direita (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              // Usuário logado: Menu de usuário
              <div
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button
                  className={`flex items-center gap-2 font-medium focus:outline-none ${textColor}`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white/20">
                    {getInitials(
                      userData?.name || user.name || user.email?.split("@")[0],
                    )}
                  </div>
                  <span className="max-w-[100px] truncate hidden lg:block text-sm">
                    {userData?.name
                      ? userData.name.split(" ")[0]
                      : user.name
                        ? user.name.split(" ")[0]
                        : user.email.split("@")[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-1"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {userData?.name || user.name || "Usuário"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        {userData?.isAdmin && (
                          <button
                            onClick={() => handleNavigate("admin")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg flex items-center transition-colors"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Painel Admin
                          </button>
                        )}

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                          onClick={onLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sair
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Usuário não logado: Botão Login
              <button
                onClick={() => handleNavigate("login")}
                className={`font-bold px-6 py-2.5 rounded-xl transition-all duration-300 text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5`}
              >
                Entrar
              </button>
            )}
          </div>

          {/* Botão Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${textColor} p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none`}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-b overflow-hidden bg-white border-gray-100 shadow-xl`}
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <button
                onClick={() => handleNavigate("home")}
                className={`block w-full text-left px-4 py-3 text-base font-bold rounded-xl transition-colors text-slate-900 hover:bg-slate-50`}
              >
                Home
              </button>

              {user && (
                <div className="px-4 py-2">
                  <p
                    className={`text-xs font-bold uppercase tracking-wider mb-2 text-slate-400`}
                  >
                    Exames
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavigate("hemogram")}
                      className={`flex items-center w-full px-4 py-3 rounded-xl border-l-2 text-slate-900 border-blue-500 bg-slate-50 hover:bg-blue-50/50`}
                    >
                      <Activity className="h-4 w-4 mr-2 text-blue-500" />
                      Hemograma
                    </button>
                    <button
                      onClick={() => handleNavigate("xray")}
                      className={`flex items-center w-full px-4 py-3 rounded-xl border-l-2 text-slate-900 border-emerald-500 bg-slate-50 hover:bg-emerald-50/50`}
                    >
                      <LungsIcon className="h-4 w-4 mr-2 text-emerald-500" />
                      Raio-X
                    </button>
                    <button
                      onClick={() => handleNavigate("ecg")}
                      className={`flex items-center w-full px-4 py-3 rounded-xl border-l-2 text-slate-900 border-indigo-500 bg-slate-50 hover:bg-indigo-50/50`}
                    >
                      <HeartPulse className="h-4 w-4 mr-2 text-indigo-500" />
                      Eletrocardiograma
                    </button>
                  </div>
                </div>
              )}

              {user ? (
                <div className={`mt-4 pt-4 border-t border-slate-100`}>
                  <div className="px-4 flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
                      {getInitials(
                        userData?.name ||
                          user.name ||
                          user.email?.split("@")[0],
                      )}
                    </div>
                    <div>
                      <p className={`font-bold text-slate-900`}>
                        {userData?.name || user.name || "Usuário"}
                      </p>
                      <p className={`text-xs text-slate-500`}>{user.email}</p>
                    </div>
                  </div>

                  {userData?.isAdmin && (
                    <button
                      onClick={() => handleNavigate("admin")}
                      className={`block w-full text-left px-4 py-3 text-base font-medium rounded-xl text-slate-700 hover:bg-slate-50`}
                    >
                      Painel Admin
                    </button>
                  )}

                  <button
                    onClick={onLogout}
                    className={`block w-full text-left px-4 py-3 text-base font-bold rounded-xl text-red-500 hover:bg-red-50/10 mt-2`}
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="p-4 mt-2">
                  <button
                    onClick={() => handleNavigate("login")}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20"
                  >
                    Entrar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
