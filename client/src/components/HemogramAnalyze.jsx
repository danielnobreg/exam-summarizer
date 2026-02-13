import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import * as analysisService from '../services/analysisService';
import { getUserData } from '../services/userService';
import { useUsageLimit } from '../hooks/useUsageLimit';
import TermsModal from './TermsModal';

export default function HemogramAnalyze({ user, onLogout, onNavigate }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  
  // Estado para os modais do footer
  const [footerModalOpen, setFooterModalOpen] = useState(false);
  const [footerModalType, setFooterModalType] = useState('terms');

  // Hook customizado para limite de uso
  const { 
    canUse, 
    dailyUsage, 
    dailyLimit, 
    remaining, 
    loading: usageLoading,
    updateUsageAfterAnalysis,
    refresh: refreshUsage
  } = useUsageLimit(user?.uid);

  const isAdminUser = !!userData?.isAdmin;
  const canUseEffective = isAdminUser ? true : canUse;
  
  useEffect(() => {
    analysisService.loadPdfJs();
    
    async function loadUserData() {
      try {
        const data = await getUserData(user.uid);
        setUserData(data);
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
      }
    }  
    loadUserData();
  }, [user.uid]);

  async function handleAnalyze() {
    if (!file) return;
    
    if (!canUseEffective) {
      setError('Limite diário atingido. Tente novamente amanhã!');
      return;
    }
    
    setLoading(true);
    setError('');
    setApiResponse('');

    try {
      const pdfText = await analysisService.extractTextFromPdf(file);
      const result = await analysisService.analyzeExam(pdfText, user.uid);
      setApiResponse(result.reply);
      
      if (result.usage) {
        updateUsageAfterAnalysis(result.usage);
      }
      
    } catch (err) {
      if (err.message.includes('Limite')) {
        setError('Limite diário atingido. Tente novamente amanhã!');
        refreshUsage();
      } else {
        setError(err.message || 'Erro ao processar PDF');
      }
    } finally {
      setLoading(false);
      setFile(null); // Limpa seleção de arquivo
    }
  }

  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      setApiResponse('');
    } else {
      setError('Por favor, selecione um arquivo PDF válido.');
      setFile(null);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e) => { processFile(e.target.files?.[0]); };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiResponse).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const openFooterModal = (type) => {
    setFooterModalType(type);
    setFooterModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-manrope pt-20 flex flex-col">
      <Navbar 
        user={{ ...user, userData }} 
        onLogout={onLogout} 
        onNavigate={onNavigate} 
      />

      {/* Botão Guia */}
      <button
        onClick={() => setShowGuide(true)}
        className="fixed bottom-6 right-6 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full shadow-lg border border-gray-200 font-medium text-sm transition-all hover:shadow-xl flex items-center gap-2 z-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        Como usar
      </button>

      {/* Modal Guia */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Guia de Como usar
              </h2>
              <button
                onClick={() => setShowGuide(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div className="space-y-6 text-sm text-gray-600">
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-red-200">1</span>
                <div>
                    <h3 className="font-bold text-gray-900 mb-1">Faça upload do PDF</h3>
                    <p>Envie o arquivo PDF do seu exame laboratorial (clique ou arraste para a área indicada).</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-red-200">2</span>
                <div>
                    <h3 className="font-bold text-gray-900 mb-1">Clique em "Resumir Exame"</h3>
                    <p>Nossa IA processará os dados e identificará os principais resultados.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-red-200">3</span>
                <div>
                   <h3 className="font-bold text-gray-900 mb-1">Copie o Resultado</h3>
                   <p>O resultado formatado estará pronto para ser copiado e usado onde precisar.</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs text-blue-800 leading-relaxed">
                  💡 <strong>Dica:</strong> O sistema destaca valores fora do padrão para facilitar sua atenção.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="w-full mt-8 bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg hover:-translate-y-0.5"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        
        {/* Aviso de Limite */}
        {!isAdminUser && !canUseEffective && !usageLoading && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-pulse">
             <span className="text-2xl">🚫</span>
             <div>
                <p className="text-sm font-bold text-red-800">Limite Diário Atingido</p>
                <p className="text-xs text-red-700">Você já realizou {dailyLimit} análises hoje. Volte amanhã!</p>
             </div>
          </div>
        )}

        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm mb-6 border border-gray-100">
             <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30 transform rotate-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 22s8-4 8-10a8 8 0 0 0-16 0c0 6 8 10 8 10Z"/>
                </svg>
             </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Análise Laboratorial</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Faça o upload do PDF dos seus exames e obtenha um resumo detalhado com inteligência artificial.
          </p>
        </div>

        {/* Card de Upload */}
        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100 relative overflow-hidden">
          {/* Blob decorativo de fundo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl -z-10 opacity-50 -translate-x-1/2 translate-y-1/2"></div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Arquivo PDF do Exame</label>
            <label 
              htmlFor="file-upload" 
              className={`group flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                isDragging ? 'border-red-400 bg-red-50 scale-[1.02]' : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-red-300 hover:shadow-md'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className={`transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-red-100' : 'bg-white shadow-sm group-hover:bg-red-50'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-colors ${isDragging ? 'text-red-600' : 'text-gray-400 group-hover:text-red-500'}`}>
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                    <path d="M12 12v9"/>
                    <path d="m16 16-4-4-4 4"/>
                    </svg>
                </div>
              </div>
              <p className="text-base text-gray-700 mb-1 font-medium">
                <span className="text-red-600 font-bold border-b border-red-200 hover:border-red-600 transition-colors">Clique para enviar</span> ou arraste
              </p>
              <p className="text-xs text-gray-400 mt-1">Suporta apenas PDF (máx. 10MB)</p>
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Estado de Arquivo Selecionado */}
          {file && (
            <div className="mb-6 flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14 2 14 8 20 8"/>
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-bold text-green-900">{file.name}</p>
                    <p className="text-xs text-green-700">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)} 
                className="text-green-700 hover:text-green-900 p-2 hover:bg-green-100 rounded-full transition"
                title="Remover arquivo"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-center animate-shake">
              <p className="text-sm text-red-800 font-bold flex items-center justify-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                 {error}
              </p>
            </div>
          )}

          {/* Botão Analisar */}
          <button
            onClick={handleAnalyze}
            disabled={!file || loading || !canUseEffective}
            className="w-full bg-red-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-red-600/30 hover:-translate-y-1 flex items-center justify-center gap-3 text-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analisando...
              </>
            ) : !canUseEffective ? (
              <>Limites Esgotados</>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/>
                </svg>
                Resumir Exame
              </>
            )}
          </button>

          {/* Resultados da Análise */}
          {(apiResponse || loading) && (
            <div className="mt-10 pt-8 border-t border-gray-100 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 text-sm font-black">AI</span>
                    Resultado da Análise
                </h2>
                {apiResponse && (
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition flex items-center gap-2"
                  >
                    {copySuccess ? (
                        <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span className="text-green-600">Copiado!</span>
                        </>
                    ) : (
                        <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copiar Texto
                        </>
                    )}
                  </button>
                )}
              </div>
              <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200 min-h-[150px] shadow-inner relative">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <p className="animate-pulse font-medium">Lendo e interpretando dados...</p>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed custom-scrollbar relative z-10">
                    {apiResponse}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Estatísticas de Uso */}
        {!isAdminUser && (
          <div className="text-center mt-8 mb-6">
            {usageLoading ? (
              <p className="text-sm text-gray-400">Calculando uso...</p>
            ) : (
              <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
                <div className={`w-2 h-2 rounded-full ${remaining === 0 ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
                <p className="text-sm font-medium text-gray-600">
                  Análises hoje: <span className="font-bold text-gray-900">{remaining}</span> de <span className="text-gray-500">{dailyLimit}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Minimalista com Links Legais */}
      <footer className="mt-auto py-6 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2026 Hemotrack. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
             <button onClick={() => openFooterModal('terms')} className="text-xs text-gray-500 hover:text-red-600 transition">Termos de Uso</button>
             <button onClick={() => openFooterModal('privacy')} className="text-xs text-gray-500 hover:text-red-600 transition">Privacidade</button>
          </div>
        </div>
      </footer>

      <TermsModal 
        isOpen={footerModalOpen} 
        onClose={() => setFooterModalOpen(false)}
        type={footerModalType}
      />

    </div>
  );
}