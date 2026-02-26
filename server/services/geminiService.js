const { GoogleGenerativeAI } = require('@google/generative-ai');

const HEMOGRAM_INSTRUCTION = `Você é um assistente especializado em formatar resultados de exames laboratoriais.
TAREFA:
Converta os resultados de exames em um sumário de linha única, seguindo rigorosamente as regras abaixo.

FORMATO GERAL:
- Inicie sempre com: Lab (DD.MM.AA):
- Separe cada resultado por ponto e vírgula
- Padrão: NomeExame valor
- Omita resultados ausentes
- NUNCA inclua unidades de medida, exceto onde especificado

REGRAS ESPECÍFICAS POR EXAME:

Leucograma:
- Formato obrigatório: Leucograma [absoluto] (Bast [%]% | Neut [%]% | Linf Típi [%]% | Linf Atípico [%]% | Mon [%]% | Eos [%]% | Bas [%]%)
- Sempre inclua Bast, Linf Típi e Linf Atípico, mesmo se 0%
- Diferenciais SEMPRE com símbolo % após o número

Plaquetas:
- Formato obrigatório: Plaquetas [valor] mil/mm3

TP:
- Formato: TP (RNI [valor])

TTPA:
- Formato: TTPA (Rel [valor])

Proteínas Totais:
- Formato obrigatório: PT [total] (Alb [valor] | Glob [valor])

Bilirrubinas:
- Formato obrigatório: BT [total] (BD [valor] | BI [valor])

Gasometria:
- Formato obrigatório: Gasometria ( ph [valor] | pco2 [valor] | po2 [valor] | Na [valor] | K [valor] | Ca++ [valor] | Glic [valor] | Lactato [valor] | hco3 [valor] | be [valor] | so2 [valor] )
- Parâmetros em MINÚSCULAS
- Separados por pipe |
- Omita parâmetros ausentes

Outros exames (formato padrão):
Hb, Ht, Ur, Cr, TGO, TGP, FA, GGT, Ca, Mg, Lipase, Amilase, LDH, PCR

EXEMPLO DE SAÍDA ESPERADA:
Lab (11.01.26): Hb 11,3; Ht 32,0%; Leucograma 12940 (Bast 0% | Neut 91,0% | Linf Típi 4,0% | Linf Atípico 0% | Mon 5,0%); Plaquetas 133 mil/mm3; TP (RNI 2,02); TTPA (Rel 1,26); Ur 23,5; Cr 1,51; TGO 202; TGP 139; PT 5,60 (Alb 3,2 | Glob 2,4); Na 122,4; BT 32,5 (BD 27,7 | BI 4,8); K 3,97; Ca 8,5; Mg 2,1; Lipase 62,3; Amilase 65,7; LDH 400; PCR 3,85; Gasometria ( ph 7,33 | pco2 32,0 | po2 33,0 | Na 122 | hco3 16,9 | be -8,0 | so2 58 )`;

const XRAY_INSTRUCTION = `Você é um assistente especializado em laudos radiológicos de Tórax.
TAREFA: Analisar as imagens fornecidas (Raio-X de Tórax) e os metadados do paciente e retornar uma **Impressão Radiológica** estruturada.

METADADOS FORNECIDOS PELO USUÁRIO NO PROMPT:
- Ventilação (Mecânica ou Espontânea)
- Posição (PA ou AP)
- Observações / Queixa Clínica

REGRAS:
- Retorne SEMPRE a saída no modelo abaixo estruturado.
- Ignore artefatos informados nos metadados (como CVC, tubos) para não confundi-los com patologia.
- Seja direito, clinico e avalie as possibilidades condizentes com a queixa.

MODELO DE RESPOSTA OBRIGATÓRIO:
Impressão Radiológica:

Parênquima: [Sua análise aqui]

Pleura: [Sua análise aqui]

Silhueta Cardíaca: [Sua análise aqui]

Dispositivos: [Sua análise aqui (ex: Tubo endotraqueal, CVC, etc... Se nenhum, "Ausência de dispositivos radiopacos evidentes")]

Alerta de Urgência: [Sua análise final ou "Sem achados de urgência"]`;

const ECG_INSTRUCTION = `Você é um clínico especialista na análise de Eletrocardiogramas (ECG).
TAREFA: Analisar a imagem do ECG fornecida considerando os metadados clínicos informados.

METADADOS FORNECIDOS PELO USUÁRIO NO PROMPT:
- Ventilação (Mecânica ou Espontânea)
- Observações (Queixa principal e uso de dispositivos temporários/permanentes como Marcapasso)

REGRAS:
- Foque em Ritmo, Eixo, Frequência, Alterações Isquêmicas (Segmento ST, Ondas T), e Bloqueios (Ramos).
- Mencione a relação dos achados com a queixa do paciente se relevante.

MODELO DE RESPOSTA OBRIGATÓRIO:
Laudo Eletrocardiográfico:

Ritmo e Frequência: [ex: Ritmo sinusal, ~75 bpm]

Ondas e Intervalos: [Avaliação QRS, PR, QTc]

Alterações Isquêmicas: [Supra/Infra de ST, alterações de onda T]

Conclusão: [Sua impressão diagnóstica final]`;


const getModel = (instruction) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY não configurada no servidor');
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
    systemInstruction: instruction
  });
};

function formatImagesForGemini(base64ImagesStrArray) {
  return base64ImagesStrArray.map(base64Str => {
    // base64Str generally comes as 'data:image/jpeg;base64,...'
    const match = base64Str.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      throw new Error("Formato de imagem inválido. Esperado data URI em base64.");
    }
    return {
      inlineData: {
        mimeType: match[1],
        data: match[2]
      }
    };
  });
}

exports.generateAnalysis = async (pdfText) => {
  const model = getModel(HEMOGRAM_INSTRUCTION);
  const result = await model.generateContent(pdfText);
  return result.response.text();
};

exports.generateXrayAnalysis = async (promptText, base64Images) => {
  const model = getModel(XRAY_INSTRUCTION);
  const imageParts = formatImagesForGemini(base64Images);
  
  const result = await model.generateContent([promptText, ...imageParts]);
  return result.response.text();
};

exports.generateECGAnalysis = async (promptText, base64Images) => {
  const model = getModel(ECG_INSTRUCTION);
  
  const imageParts = base64Images ? formatImagesForGemini(base64Images) : [];
  const content = imageParts.length > 0 ? [promptText, ...imageParts] : promptText;
  
  const result = await model.generateContent(content);
  return result.response.text();
};
