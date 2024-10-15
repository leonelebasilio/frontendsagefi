'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

// Inicializa o cliente Supabase
const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko'
const supabase = createClient(supabaseUrl, supabaseKey)

// Configuração da API do Google Gemini
const genAI = new GoogleGenerativeAI("AIzaSyA_NtM9Fk2U-r7iafk8NfyibumRGpDwZW4")

export default function AiGeminiImportacao() {
  const [files, setFiles] = useState<{ name: string; id: string }[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [importResult, setImportResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('tbimportacao')
        .select('id, file_name')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setFiles(data.map(file => ({ id: file.id, name: file.file_name })))
      } else {
        setFiles([])
      }
    } catch (err) {
      setError('Erro ao carregar a lista de arquivos.')
      console.error('Erro ao carregar arquivos:', err)
    }
  }

  const handleFileSelect = (value: string) => {
    setSelectedFile(value)
    const selectedFileObj = files.find(file => file.id === value)
    setSelectedFileName(selectedFileObj ? selectedFileObj.name : null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!selectedFile) {
        throw new Error('Por favor, selecione um arquivo.')
      }

      // Obter informações do arquivo da tabela tbimportacao
      const { data: fileInfo, error: fileInfoError } = await supabase
        .from('tbimportacao')
        .select('file_name')
        .eq('id', selectedFile)
        .single()

      if (fileInfoError) throw fileInfoError

      if (!fileInfo || !fileInfo.file_name) {
        throw new Error('Informações do arquivo não encontradas.')
      }

      // Baixar o arquivo do Supabase
      const { data, error: downloadError } = await supabase.storage
        .from('Importacoes')
        .download(fileInfo.file_name)

      if (downloadError) throw downloadError

      // Criar um Blob com o conteúdo do arquivo
      const blob = new Blob([data], { type: data.type })

      // Atualizar o status na tabela tbimportacao
      const { error: updateError } = await supabase
        .from('tbimportacao')
        .update({ status: 'processando' })
        .eq('id', selectedFile)

      if (updateError) throw updateError

      // Processar o arquivo com a API do Google Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

      const prompt = "Liste as transações com a descrição, valor e data."

      // Converter o Blob para base64
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      const base64Data = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string
          resolve(base64.split(',')[1]) // Remove o prefixo "data:*/*;base64,"
        }
      })

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: data.type,
            data: base64Data
          }
        }
      ])
      const response = await result.response
      const jsonResponse = JSON.parse(response.text())

      // Atualizar o status na tabela tbimportacao para concluído
      await supabase
        .from('tbimportacao')
        .update({ status: 'concluído' })
        .eq('id', selectedFile)

      setImportResult(jsonResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Importação de Arquivo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select value={selectedFile} onValueChange={handleFileSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um arquivo">
                {selectedFileName || "Selecione um arquivo"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {files.map((file) => (
                <SelectItem key={file.id} value={file.id}>
                  {file.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={!selectedFile || isLoading}>
            {isLoading ? 'Processando...' : 'Importar'}
          </Button>
        </form>

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}

        {importResult && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Transações Importadas:</h3>
            <ul className="space-y-2">
              {importResult.map((transaction: any, index: number) => (
                <li key={index} className="border p-2 rounded">
                  <p><strong>Descrição:</strong> {transaction.descricao}</p>
                  <p><strong>Valor:</strong> R$ {transaction.valor.toFixed(2)}</p>
                  <p><strong>Data:</strong> {new Date(transaction.data_transacao).toLocaleDateString('pt-BR')}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}