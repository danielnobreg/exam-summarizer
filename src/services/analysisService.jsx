const API_URL = 'http://localhost:3001/api/analysis';

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

// Enviar para análise
export async function analyzeExam(pdfText) {
  const response = await fetch(`${API_URL}/hemogram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: pdfText })
  });

  if (!response.ok) {
    throw new Error('Erro ao comunicar com a API');
  }

  const data = await response.json();
  return data.reply;
}

// Carregar PDF.js
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