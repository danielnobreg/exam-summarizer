import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Construction, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact({ user, onNavigate, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50 font-manrope flex flex-col">
      <Navbar user={user} onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-grow flex items-center justify-center relative overflow-hidden pt-20">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-200/40 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="text-center px-4 relative z-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center p-6 bg-white rounded-3xl shadow-xl mb-8 border border-gray-100 relative">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
              <Construction className="h-16 w-16 text-blue-600" />
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Página em <span className="text-blue-600">Construção</span>
            </h1>

            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Estamos preparando algo especial para você! <br />
              Em breve, você poderá entrar em contato diretamente com nossa
              equipe por aqui.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("home")}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 shadow-blue-600/20 hover:-translate-y-1 group mb-8"
            >
              <ArrowLeft className="mr-2 h-5 w-5  group-hover:-translate-x-1 transition-transform" />
              Voltar para Home
            </motion.button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
