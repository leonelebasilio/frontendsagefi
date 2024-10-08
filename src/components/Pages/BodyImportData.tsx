// Teste github

mport React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClient } from '@supabase/supabase-js'
import { useToast } from "@/hooks/use-toast"

const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function BodyImportData() {
  const [files, setFiles] = useState([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importTime, setImportTime] = useState(0)
  const [importStatus, setImportStatus] = useState(null)
  const [user, setUser] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'audio/mpeg': ['.mp3']
    },
    maxSize: 20 * 1024 * 1024 // 20MB
  })

  const removeFile = (file) => {
    setFiles(prevFiles => prevFiles.filter(f => f !== file))
  }

  const importFiles = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Nenhum usuário autenticado encontrado",
        variant: "destructive",
      })
      return
    }

    setImporting(true)
    setImportProgress(0)
    setImportTime(files.length * 10) // Estimating 10 seconds per file
    setImportStatus(null)

    try {
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession()
      if (refreshError) throw refreshError

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const { data, error } = await supabase.storage
          .from('imported-files')
          .upload(`${user.id}/${file.name}`, file)

        if (error) throw error

        const { error: insertError } = await supabase
          .from('imported_files')
          .insert([
            { 
              user_id: user.id, 
              file_name: file.name, 
              file_type: file.type, 
              file_size: file.size, 
              file_path: data.path 
            }
          ])

        if (insertError) {
          if (insertError.code === '42501') {
            throw new Error("Você não tem permissão para realizar esta ação. Entre em contato com o administrador.")
          }
          throw insertError
        }

        setImportProgress((prev) => prev + (100 / files.length))
      }

      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      setImportStatus('success')
      toast({
        title: "Sucesso!",
        description: "Arquivos importados com sucesso.",
        variant: "default",
      })
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error)
      setImportStatus('error')
      if (error.message.includes('permissão')) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        })
      } else if (error.message.includes('JWT expired')) {
        toast({
          title: "Erro",
          description: "Erro de autenticação. Por favor, faça login novamente.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro",
          description: "Ocorreu um erro durante a importação. Por favor, tente novamente.",
          variant: "destructive",
        })
      }
    } finally {
      setImporting(false)
      setImportProgress(100)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Arraste e solte arquivos aqui</p>
          ) : (
            <p>Arraste e solte arquivos aqui, ou clique para selecionar arquivos</p>
          )}
          <p className="text-sm text-gray-500 mt-2">PDF, JPG, PNG, MP3 (max. 20MB)</p>
        </div>
        {files.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Arquivos Selecionados</h2>
            <ul className="space-y-2">
              {files.map((file) => (
                <li key={file.name} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span>{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(file)}>
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button 
          onClick={importFiles} 
          disabled={importing || files.length === 0} 
          className="mt-4"
        >
          {importing ? 'Enviando arquivos...' : 'Importar'}
        </Button>
        {importing && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Progresso da Importação</h3>
            <Progress value={importProgress} className="w-full" />
            <p className="text-sm text-gray-500 mt-2">
              Tempo estimado: {Math.ceil(importTime / 60)} minutos
            </p>
          </div>
        )}
        {importStatus === 'success' && (
          <Alert variant="default" className="mt-4">
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>Arquivos importados com sucesso.</AlertDescription>
          </Alert>
        )}
        {importStatus === 'error' && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>Ocorreu um erro durante a importação. Por favor, tente novamente.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}