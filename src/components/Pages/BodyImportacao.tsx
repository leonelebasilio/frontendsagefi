'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@supabase/supabase-js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Trash2 } from 'lucide-react'

// Inicializa o cliente Supabase
const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function BodyImportacao() {
  const [tipoExtrato, setTipoExtrato] = useState('')
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState([])

  // Configuração do Dropzone
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    multiple: false
  })

  // Função para carregar todos os arquivos do usuário
  const loadUserFiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      const { data, error } = await supabase
        .from('tbimportacao')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setUploadStatus(data.map(item => ({
        id: item.id,
        file: item.file_name,
        status: item.status,
        tipo: item.tipo_extrato
      })))
    } catch (error) {
      console.error('Erro ao carregar arquivos do usuário:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus arquivos. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Carregar arquivos do usuário ao montar o componente
  useEffect(() => {
    loadUserFiles()
  }, [])

  // Função para fazer upload e processar o arquivo
  const handleUpload = async () => {
    if (files.length === 0 || !tipoExtrato) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo e o tipo de extrato.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const file = files[0]
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error("Usuário não autenticado")

      // Upload do arquivo para o bucket 'importacoes'
      const { data, error } = await supabase.storage
        .from('importacoes')
        .upload(`${user.id}/${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Inserir informações na tabela tbimportacao
      const { data: insertData, error: insertError } = await supabase
        .from('tbimportacao')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_path: data.path,
          tipo_extrato: tipoExtrato,
          status: 'Processando'
        })
        .select()

      if (insertError) throw insertError

      setProgress(100)
      setUploadStatus(prev => [{ id: insertData[0].id, file: file.name, status: 'Processando', tipo: tipoExtrato }, ...prev])
      toast({
        title: "Sucesso",
        description: "Arquivo enviado e processado com sucesso.",
      })
    } catch (error) {
      console.error('Erro durante o upload:', error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante o upload. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setFiles([])
    }
  }

  // Função para excluir um arquivo
  const handleDelete = async (id, fileName) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error("Usuário não autenticado")

      // Remover o arquivo do Storage
      const { error: removeError } = await supabase.storage
        .from('importacoes')
        .remove([`${user.id}/${fileName}`])

      if (removeError) throw removeError

      // Atualizar o registro na tabela tbimportacao
      const { error: updateError } = await supabase
        .from('tbimportacao')
        .delete()
        .eq('id', id)

      if (updateError) throw updateError

      // Atualizar o estado local
      setUploadStatus(prev => prev.filter(status => status.id !== id))

      toast({
        title: "Sucesso",
        description: "Arquivo excluído com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao excluir o arquivo:', error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o arquivo. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Efeito para simular o progresso do upload
  useEffect(() => {
    if (uploading && progress < 90) {
      const timer = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 500)
      return () => clearInterval(timer)
    }
  }, [uploading, progress])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Importação de Extratos</h1>

      <div className="mb-4">
        <Select onValueChange={setTipoExtrato} value={tipoExtrato}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o tipo de extrato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="conta">Conta (corrente ou poupança)</SelectItem>
            <SelectItem value="cartao">Cartão de crédito</SelectItem>
            <SelectItem value="nota_fiscal">Nota fiscal</SelectItem>
            <SelectItem value="cupom_fiscal">Cupom fiscal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Solte o arquivo aqui...</p>
        ) : (
          <p>Arraste e solte um arquivo aqui, ou clique para selecionar</p>
        )}
      </div>

      {files.length > 0 && (
        <div className="mb-4">
          <p>Arquivo selecionado: {files[0].name}</p>
        </div>
      )}

      <Button onClick={handleUpload} disabled={uploading || files.length === 0}>
        {uploading ? 'Importando...' : 'Importar'}
      </Button>

      {uploading && (
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 mt-2">
            Tempo estimado: {Math.round((100 - progress) / 10)} segundos
          </p>
        </div>
      )}

      {uploadStatus.length > 0 && (
        <Table className="mt-8">
          <TableHeader>
            <TableRow>
              <TableHead>Arquivo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploadStatus.map((status) => (
              <TableRow key={status.id}>
                <TableCell>{status.file}</TableCell>
                <TableCell>{status.tipo}</TableCell>
                <TableCell>{status.status}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(status.id, status.file)}
                    disabled={status.status === 'Processando'}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}