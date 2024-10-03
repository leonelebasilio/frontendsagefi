import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Menu, Search, Bell, User, Home, CreditCard, Target, Briefcase, Settings, HelpCircle, Upload, X, FileText, Image, Music, AlertTriangle, Check, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import fs from 'fs'
import path from 'path'

const translations = {
  pt: {
    dashboard: "Painel",
    search: "Buscar",
    home: "Início",
    transactions: "Transações",
    goals: "Metas",
    investments: "Investimentos",
    settings: "Configurações",
    help: "Ajuda",
    importData: "Importar Dados",
    dragAndDrop: "Arraste e solte arquivos aqui, ou clique para selecionar arquivos",
    fileTypes: "PDF, JPG, PNG, MP3 (max. 20MB)",
    selectedFiles: "Arquivos Selecionados",
    fileName: "Nome do Arquivo",
    fileType: "Tipo",
    fileSize: "Tamanho",
    actions: "Ações",
    import: "Importar",
    importProgress: "Progresso da Importação",
    estimatedTime: "Tempo estimado:",
    minutes: "minutos",
    uploadingFiles: "Enviando arquivos...",
    processingData: "Processando dados com IA (pode levar 2-3 minutos)...",
    importComplete: "Importação concluída"
  },
  // ... add translations for 'en' and 'es' here
}

const ImportData = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [lang, setLang] = useState('pt')
  const [files, setFiles] = useState([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importTime, setImportTime] = useState(0)

  const t = translations[lang]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

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
    setImporting(true)
    setImportProgress(0)
    setImportTime(files.length * 10) // Estimating 10 seconds per file

    const targetDir = 'C:\\SaudeFinanceira\\Files'

    // Ensure the target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    // Simulate file upload and processing
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const targetPath = path.join(targetDir, file.name)

      // Read the file and write it to the target directory
      const fileBuffer = await file.arrayBuffer()
      fs.writeFileSync(targetPath, Buffer.from(fileBuffer))

      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate 1 second per file upload
      setImportProgress((prev) => prev + (100 / files.length))
    }

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    setImporting(false)
    setFiles([])
  }

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div 
        className="bg-white shadow-lg"
        initial={false}
        animate={{ width: isMenuOpen ? 240 : 80 }}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className={`text-2xl font-bold text-[#2ECC71] ${!isMenuOpen && 'hidden'}`}>SageFI</h1>
          <button onClick={toggleMenu}>
            <Menu className="text-gray-500" />
          </button>
        </div>
        <nav className="mt-8">
          {[
            { icon: Home, label: t.home, path: '/' },
            { icon: CreditCard, label: t.transactions, path: '/transactions' },
            { icon: Target, label: t.goals, path: '/goals' },
            { icon: Briefcase, label: t.investments, path: '/investments' },
            { icon: Settings, label: t.settings, path: '/settings' },
            { icon: Upload, label: t.importData, path: '/import' },
            { icon: HelpCircle, label: t.help, path: '/help' },
          ].map((item, index) => (
            <Link key={index} to={item.path} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
              <item.icon className="h-5 w-5 mr-2" />
              {isMenuOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="relative w-64">
              <input
                type="text"
                placeholder={t.search}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-[#3498DB]"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-white border border-gray-300 rounded-md text-gray-700 py-1 px-2"
              >
                <option value="pt">PT</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
              <Bell className="text-gray-500" />
              <User className="text-gray-500" />
            </div>
          </div>
        </header>

        {/* Import Data Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">{t.importData}</h1>

            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">{t.dragAndDrop}</p>
              <p className="text-xs text-gray-500 mt-1">{t.fileTypes}</p>
            </div>

            {files.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">{t.selectedFiles}</h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">{t.fileName}</th>
                      <th className="text-left py-2">{t.fileType}</th>
                      <th className="text-left py-2">{t.fileSize}</th>
                      <th className="text-left py-2">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file.name} className="border-b">
                        <td className="py-2 flex items-center">
                          {file.type.includes('pdf') && <FileText className="mr-2 text-red-500" />}
                          {file.type.includes('image') && <Image className="mr-2 text-green-500" />}
                          {file.type.includes('audio') && <Music className="mr-2 text-purple-500" />}
                          {file.name}
                        </td>
                        <td className="py-2">{file.type}</td>
                        <td className="py-2">{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                        <td className="py-2">
                          <button onClick={() => removeFile(file)} className="text-red-500 hover:text-red-700">
                            <X className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {files.length > 0 && !importing && (
              <button
                onClick={importFiles}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {t.import}
              </button>
            )}

            {importing && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{t.importProgress}</h2>
                <div className="mb-4">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${importProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {t.estimatedTime} {Math.ceil(importTime / 60)} {t.minutes}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Loader className="text-blue-500 animate-spin mr-2" />
                    <span>{t.uploadingFiles}</span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="text-yellow-500 mr-2" />
                    <span>{t.processingData}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Check className="mr-2" />
                    <span>{t.importComplete}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500">
            &copy; 2023 SageFI. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}

export default ImportData