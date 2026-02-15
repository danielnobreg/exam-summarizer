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

export function loadPdfJs() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
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