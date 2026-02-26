import { authFetch } from './authService';

export async function extractTextFromPdf(file) {
  const reader = new FileReader();
  const arrayBuffer = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

  const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

// aqui mandamos o texto do PDF pra API fazer a análise
// usa authFetch que já adiciona o Bearer token automaticamente
export async function analyzeExam(pdfText) {
  const data = await authFetch('/api/analysis/hemogram', {
    method: 'POST',
    body: JSON.stringify({ message: pdfText }),
  });

  // retornamos tanto a análise quanto os dados de uso
  return {
    reply: data.reply,
    usage: data.usage // { dailyUsage, dailyLimit, remaining }
  };
}

export async function analyzeXray(promptText, images) {
  const data = await authFetch('/api/analysis/xray', {
    method: 'POST',
    body: JSON.stringify({ promptText, images }),
  });
  return { reply: data.reply, usage: data.usage };
}

export async function analyzeECG(promptText, images) {
  const data = await authFetch('/api/analysis/ecg', {
    method: 'POST',
    body: JSON.stringify({ promptText, images }),
  });
  return { reply: data.reply, usage: data.usage };
}


export const LOADING_MESSAGES = [
  "Lembre-se: O Hemotrack é uma ferramenta de apoio e não substitui a avaliação médica.",
  "A inteligência artificial analisa os dados fornecidos, mas o diagnóstico final é sempre do médico responsável.",
  "Nossas análises são baseadas em padrões, porém cada quadro clínico é único. Consulte um profissional.",
  "O Hemotrack auxilia na triagem, mas a conduta terapêutica deve ser validada por um especialista.",
  "As informações geradas servem como segunda opinião e não devem ser usadas isoladamente para decisões clínicas."
];

// Carrega a biblioteca PDF.js
// Isso é necessário para ler arquivos PDF
export function loadPdfJs() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js'; // CDN do PDF.js
    script.integrity = 'sha384-lrb5efVIYR2lZw+OsuztHZzP9wpGNrhui+0VlpiHb/iPcZSCDT3CeETsL9EMQ8ih'; // 
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        resolve();
      } else {
        reject(new Error('PDF.js não carregou corretamente'));
      }
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
}