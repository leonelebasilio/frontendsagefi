import { useState } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Configuração da API do Google Gemini
const genAI = new GoogleGenerativeAI("AIzaSyA_NtM9Fk2U-r7iafk8NfyibumRGpDwZW4");

// Configurações do modelo
const modelConfig = {
  model: 'gemini-1.5-pro',
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 200000,
  },
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ],
};

export async function queryGemini(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel(modelConfig);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erro ao consultar o Google Gemini:', error);
    throw new Error('Falha ao processar a consulta. Por favor, tente novamente.');
  }
}

interface AIGeminiProps {
  onResult: (result: string) => void;
  onError: (error: string) => void;
}

export default function AIGemini({ onResult, onError }: AIGeminiProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const result = await queryGemini(prompt);
      onResult(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Digite sua pergunta aqui..."
        className="w-full p-2 border border-gray-300 rounded-md"
        rows={4}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Processando...' : 'Enviar'}
      </button>
    </form>
  );
}