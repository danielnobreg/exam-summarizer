import React from 'react';

export default function TermsModal({ isOpen, onClose, type }) {
  if (!isOpen) return null;

  const content = {
    terms: {
      title: 'Termos de Uso',
      text: `
**Última atualização: 02/02/2026**

## 1. Aceitação dos Termos
Ao acessar e usar o Hemotrack, você concorda com estes Termos de Uso.

## 2. Descrição do Serviço
O Hemotrack é uma plataforma de resumo e formatação de resultados de exames laboratoriais.

## 3. Uso Permitido
- Serviço exclusivo para profissionais de saúde autorizados
- Mantenha a confidencialidade de suas credenciais
- Proibido compartilhar conta com terceiros

## 4. Responsabilidades
- Resultados são apenas para referência
- Não substituem interpretação médica profissional
- Usuário é responsável por validar informações

## 5. Limitação de Responsabilidade
O Hemotrack não se responsabiliza por decisões clínicas baseadas nas análises.

## 6. Contato
Para dúvidas: hemotracksuporte@gmail.com
      `
    },
    privacy: {
      title: 'Política de Privacidade',
      text: `
**Última atualização: 02/02/2026**

## 1. Informações que Coletamos
- Nome completo e email
- Credenciais de acesso (criptografadas)
- Arquivos PDF para análise

## 2. Como Usamos seus Dados
- Autenticar acesso ao sistema
- Processar análises de exames
- Melhorar nossos serviços

## 3. Compartilhamento
Não compartilhamos seus dados com terceiros, exceto por obrigação legal.

## 4. Tecnologias
- Firebase Authentication
- Google Gemini AI (dados anonimizados)
- Firestore Database

## 5. Segurança
- Criptografia de senhas
- Acesso restrito

## 6. Seus Direitos (LGPD)
- Acessar seus dados
- Corrigir informações
- Solicitar exclusão
- Revogar consentimento

## 7. Contato
Email: hemotracksuporte@gmail.com
      `
    }
  };

  const { title, text } = content[type] || content.terms;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="prose prose-sm max-w-none">
            {text.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>;
              } else if (line.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-semibold mt-3 mb-2">{line.replace('## ', '')}</h2>;
              } else if (line.startsWith('- ')) {
                return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
              } else if (line.startsWith('**')) {
                return <p key={i} className="font-semibold my-2">{line.replace(/\*\*/g, '')}</p>;
              } else if (line.trim()) {
                return <p key={i} className="my-2 text-gray-700">{line}</p>;
              }
              return null;
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}