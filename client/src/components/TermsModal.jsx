import React from 'react';
import { X, FileText, CheckCircle } from 'lucide-react';

export default function TermsModal({ isOpen, onClose, type }) {
  if (!isOpen) return null;

  const content = {
    terms: {
      title: 'Termos de Uso - Hemotrack',
      text: `
## 1. Aceitação dos Termos

Ao acessar e utilizar a plataforma Hemotrack, o usuário declara que leu, compreendeu e concorda integralmente com estes Termos de Uso. Caso não concorde, deverá cessar imediatamente o uso da plataforma.

## 2. Descrição do Serviço

O Hemotrack é uma plataforma tecnológica destinada exclusivamente a profissionais de saúde legalmente habilitados, cujo objetivo é organizar, estruturar e resumir informações contidas em exames médicos, tais como exames laboratoriais, de imagem e registros gráficos clínicos.

A plataforma não realiza diagnóstico, prognóstico, prescrição, orientação terapêutica ou qualquer ato privativo de profissão regulamentada, atuando apenas como ferramenta de apoio informacional e organizacional.

## 3. Declaração de Profissional Habilitado

Ao utilizar o Hemotrack, o usuário declara expressamente que:

- É profissional de Saúde legalmente habilitado, nos termos da legislação brasileira;
- Possui registro ativo em seu respectivo conselho profissional, quando aplicável;
- Utiliza a plataforma como ferramenta auxiliar, sob sua inteira responsabilidade técnica e ética.

O Hemotrack não realiza validação de credenciais profissionais, cabendo exclusivamente ao usuário a veracidade das informações prestadas.

## 4. Natureza do Uso e Limitações

4.1. As informações geradas pela plataforma:

- São meramente auxiliares e informativas;
- Não substituem laudos oficiais;
- Não substituem a análise crítica, interpretação clínica ou decisão profissional do usuário.

4.2. O Hemotrack não garante a exatidão, completude ou atualidade dos dados processados, especialmente quando os documentos fornecidos forem incompletos, ilegíveis ou imprecisos.

## 5. Responsabilidades do Usuário

O usuário é integralmente responsável por:

- Garantir que possui base legal e autorização para inserir dados de pacientes;
- Utilizar a plataforma em conformidade com normas éticas e legais de sua profissão;
- Validar todas as informações antes de qualquer aplicação clínica;
- Responder por decisões tomadas com base no uso da ferramenta.

## 6. Limitação de Responsabilidade

O Hemotrack não se responsabiliza, em nenhuma hipótese, por:

- Condutas profissionais adotadas pelo usuário;
- Decisões clínicas, médicas ou terapêuticas;
- Danos diretos ou indiretos decorrentes do uso das informações processadas;
- Eventuais interpretações equivocadas ou uso indevido da plataforma.

Nada nestes Termos exclui ou limita responsabilidade nos casos de dolo ou culpa grave, conforme a legislação vigente.

## 7. Suspensão e Encerramento

O Hemotrack poderá suspender ou encerrar o acesso do usuário, a qualquer tempo, caso identifique uso indevido, violação destes Termos ou risco jurídico plataforma.

## 8. Propriedade Intelectual

Todos os direitos sobre a plataforma, incluindo software, layout, textos e funcionalidades, pertencem ao Hemotrack, sendo vedada a reprodução ou uso não autorizado.

## 9. Modificações

Os Termos poderão ser alterados a qualquer momento. O usor continuado da plataforma após alterações implica aceitação automática das novas condições.

## 10. Contato

Email: hemotracksuporte@gmail.com

**Última atualização: 03/02/2026**
      `
    },
    privacy: {
      title: 'Política de Privacidade - Hemotrack',
      text: `
## 1. Dados Coletados

Coletamos e tratamos:

- Nome e email do profissional
- Credenciais de acesso (armazenadas de forma criptografada)
- Documentos enviados para processamento
- Dados técnicos de uso da plataforma

Os documentos podem conter dados pessoais sensíveis, incluindo dados de saúde de terceiros (pacientes).

## 2. Papel do Hemotrack na LGPD

O Hemotrack atua como operador de dados, realizando o tratamento em nome do profissional de saúde, que figura como controlador, nos termos do art. 5º, VI e VII da LGPD.

## 3. Base Legal para o Tratamento

O tratamento de dados ocorre com fundamento em:

- Art. 11, II, f, da LGPD – Tratamento de dados de saúde para tutela da saúde, realizado por profissionais de saúde;
- Art. 7º, V – Execução de contrato;
- Art. 6º – Princípios da finalidade, necessidade e segurança.

4. Finalidade do Tratamento

Os dados são tratados exclusivamente para:

- Processar e organizar exames médicos;
- Viabilizar o funcionamento técnico da plataforma;
- Garantir segurança e integridade do sistema.

## 5. Compartilhamento de Dados

Os dados não são comercializados.

Poderão ser processados por fornecedores tecnológicos essenciais, incluindo soluções de inteligência artificial, sempre com técnicas de anonimização, pseudonimização ou minimização, conforme aplicável e permitido por lei.

## 6. Segurança da Informação

Adotamos medidas técnicas e administrativas adequadas, incluindo:

- Criptografia de credenciais;
- Controle de acesso restrito;
- Infraestrutura segura de armazenamento.

Apesar disso, nenhum sistema é completamente imune a riscos.

## 7. Retenção e Exclusão

Os dados são mantidos apenas pelo tempo necessário à execução do serviço ou conforme exigido por obrigações legais.

O profissional poderá solicitar exclusão dos dados, respeitadas as limitações legais e regulatórias.

## 8. Direitos dos Titulares

O titular dos dados poderá exercer os direitos previstos na LGPD por meio do profissional controlador ou diretamente pelos canais do Hemotrack, conforme aplicável.

## 9. Contato

Email: hemotracksuporte@gmail.com

**Última atualização: 03/02/2026**
      `
    }
  };

  const { title, text } = content[type] || content.terms;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-manrope animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-gray-100 overflow-hidden transform transition-all animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${type === 'terms' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                {type === 'terms' ? <FileText className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <div className="prose prose-sm max-w-none text-gray-600">
            {text.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return (
                    <div key={i} className="flex items-center gap-2 mt-6 mb-3">
                        <h1 className="text-2xl font-extrabold text-gray-900">{line.replace('# ', '')}</h1>
                    </div>
                );
              } else if (line.startsWith('## ')) {
                return <h2 key={i} className="text-lg font-bold text-gray-800 mt-5 mb-2 pb-1 border-b border-gray-100">{line.replace('## ', '')}</h2>;
              } else if (line.startsWith('- ')) {
                return (
                    <div key={i} className="flex items-start gap-2 ml-2 my-1.5">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                        <p className="text-gray-600 leading-relaxed">{line.replace('- ', '')}</p>
                    </div>
                );
              } else if (line.startsWith('**')) {
                return <p key={i} className="font-bold text-gray-800 my-3 bg-gray-50 p-3 rounded-lg border border-gray-100">{line.replace(/\*\*/g, '')}</p>;
              } else if (line.trim()) {
                return <p key={i} className="my-2 text-gray-600 leading-relaxed">{line}</p>;
              }
              return null;
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-600/20 hover:-translate-y-0.5"
          >
            Entendi e Concordo
          </button>
        </div>

      </div>
    </div>
  );
}