import React, { useState, useEffect } from 'react';
import * as analysisService from '../services/analysisService';
import { getUserData } from '../services/userService';

export default function Dashboard({ user, onLogout }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [userData, setUserData] = useState(null);
  
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
    setLoading(true);
    setError('');
    setApiResponse('');

    try {
      const pdfText = await analysisService.extractTextFromPdf(file);
      const result = await analysisService.analyzeExam(pdfText);
      setApiResponse(result);
    } catch (err) {
      setError(err.message || 'Erro ao processar PDF');
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      {/* Header com Logout */}
      <div className="max-w-2xl mx-auto mb-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Logado como:</p>
          <p className="font-semibold text-gray-800">
            {userData?.name} {userData?.isAdmin && '(Administrador)'}
          </p>
          <p className="text-xs text-gray-500">{userData?.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Sair
        </button>
      </div>
      
      {/* Mostrar painel admin se for admin */}
      {userData?.isAdmin && (
        <div className="max-w-2xl mx-auto mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-semibold text-yellow-800">
            🔧 Você tem permissões de administrador
          </p>
        </div>
      )}

      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-red-600 rounded-full shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 22s8-4 8-10a8 8 0 0 0-16 0c0 6 8 10 8 10Z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Análise Laboratorial</h1>
          <p className="text-lg text-gray-600">Faça o upload do PDF dos exames para obter um resumo de seus resultados. </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Arquivo PDF do Exame</label>
            <label 
              htmlFor="file-upload" 
              className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition ${
                isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 mb-3">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                <path d="M12 12v9"/>
                <path d="m16 16-4-4-4 4"/>
              </svg>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Clique para enviar</span> ou arraste e solte
              </p>
              <p className="text-xs text-gray-500">Apenas PDF (máx. 10MB)</p>
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {file && (
            <div className="mb-6 flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span className="text-sm text-green-800">
                <strong>Arquivo selecionado:</strong> {file.name}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-sm text-red-800 font-medium">⚠️ {error}</p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analisando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/>
                </svg>
                Analisar Exame
              </>
            )}
          </button>

          {(apiResponse || loading) && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Resultados da Análise</h2>
                {apiResponse && (
                  <button
                    onClick={handleCopy}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                      {copySuccess && <path d="m9 14 2 2 4-4"/>}
                    </svg>
                    {copySuccess ? 'Copiado!' : 'Copiar'}
                  </button>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[100px]">
                {loading ? (
                  <p className="text-gray-600 text-center">Gerando análise...</p>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed">
                    {apiResponse}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            © 2025 Hemotrack por Daniel Nóbrega. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}