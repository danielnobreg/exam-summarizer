import React from 'react';

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

É profissional de Saúde legalmente habilitado, nos termos da legislação brasileira;

Possui registro ativo em seu respectivo conselho profissional, quando aplicável;

Utiliza a plataforma como ferramenta auxiliar, sob sua inteira responsabilidade técnica e ética.

O Hemotrack não realiza validação de credenciais profissionais, cabendo exclusivamente ao usuário a veracidade das informações prestadas.

## 4. Natureza do Uso e Limitações

4.1. As informações geradas pela plataforma:

São meramente auxiliares e informativas;

Não substituem laudos oficiais;

Não substituem a análise crítica, interpretação clínica ou decisão profissional do usuário.

4.2. O Hemotrack não garante a exatidão, completude ou atualidade dos dados processados, especialmente quando os documentos fornecidos forem incompletos, ilegíveis ou imprecisos.

## 5. Responsabilidades do Usuário

O usuário é integralmente responsável por:

Garantir que possui base legal e autorização para inserir dados de pacientes;

Utilizar a plataforma em conformidade com normas éticas e legais de sua profissão;

Validar todas as informações antes de qualquer aplicação clínica;

Responder por decisões tomadas com base no uso da ferramenta.

## 6. Limitação de Responsabilidade

O Hemotrack não se responsabiliza, em nenhuma hipótese, por:

Condutas profissionais adotadas pelo usuário;

Decisões clínicas, médicas ou terapêuticas;

Danos diretos ou indiretos decorrentes do uso das informações processadas;

Eventuais interpretações equivocadas ou uso indevido da plataforma.

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

Nome e email do profissional

Credenciais de acesso (armazenadas de forma criptografada)

Documentos enviados para processamento

Dados técnicos de uso da plataforma

Os documentos podem conter dados pessoais sensíveis, incluindo dados de saúde de terceiros (pacientes).

## 2. Papel do Hemotrack na LGPD

O Hemotrack atua como operador de dados, realizando o tratamento em nome do profissional de saúde, que figura como controlador, nos termos do art. 5º, VI e VII da LGPD.

## 3. Base Legal para o Tratamento

O tratamento de dados ocorre com fundamento em:

Art. 11, II, f, da LGPD – Tratamento de dados de saúde para tutela da saúde, realizado por profissionais de saúde;

Art. 7º, V – Execução de contrato;

Art. 6º – Princípios da finalidade, necessidade e segurança.

4. Finalidade do Tratamento

Os dados são tratados exclusivamente para:

Processar e organizar exames médicos;

Viabilizar o funcionamento técnico da plataforma;

Garantir segurança e integridade do sistema.

## 5. Compartilhamento de Dados

Os dados não são comercializados.

Poderão ser processados por fornecedores tecnológicos essenciais, incluindo soluções de inteligência artificial, sempre comt técnicas de anonimização, pseudonimização ou minimização, conforme aplicável e permitido por lei.

## 6. Segurança da Informação

Adotamos medidas técnicas e administrativas adequadas, incluindo:

Criptografia de credenciais;

Controle de acesso restrito;

Infraestrutura segura de armazenamento.

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