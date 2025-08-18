import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useRef } from 'react'
import { 
  CloudArrowUpIcon,
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

interface UploadedFile {
  id: string
  name: string
  size: string
  type: string
  category: string
  url: string
  status: 'uploading' | 'completed' | 'error'
  progress: number
  timestamp: string
}

const Upload: NextPage = () => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: 'general', label: 'Geral' },
    { value: 'documents', label: 'Documentos' },
    { value: 'images', label: 'Imagens' },
    { value: 'videos', label: 'Vídeos' },
    { value: 'contracts', label: 'Contratos' },
    { value: 'certificates', label: 'Certificados' },
    { value: 'maps', label: 'Mapas' },
    { value: 'reports', label: 'Relatórios' }
  ]

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <PhotoIcon className="h-8 w-8 text-blue-600" />
    if (type.startsWith('video/')) return <VideoCameraIcon className="h-8 w-8 text-purple-600" />
    return <DocumentIcon className="h-8 w-8 text-gray-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      category: selectedCategory,
      url: '',
      status: 'uploading' as const,
      progress: 0,
      timestamp: new Date().toISOString()
    }))

    setFiles(prev => [...prev, ...newFiles])
    simulateUpload(newFiles)
  }

  const simulateUpload = (filesToUpload: UploadedFile[]) => {
    setUploading(true)
    
    filesToUpload.forEach((file, index) => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + Math.random() * 20, 100)
            
            if (newProgress >= 100) {
              clearInterval(interval)
              return {
                ...f,
                progress: 100,
                status: 'completed' as const,
                url: `https://storage.agroisync.com/uploads/${f.name}`
              }
            }
            
            return { ...f, progress: newProgress }
          }
          return f
        }))
      }, 200)
    })

    setTimeout(() => setUploading(false), 3000)
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const retryUpload = (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'uploading' as const, progress: 0 }
        : f
    ))
    
    const file = files.find(f => f.id === fileId)
    if (file) {
      simulateUpload([file])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'text-blue-600'
      case 'completed': return 'text-green-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading': return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
      case 'completed': return <CheckCircleIcon className="h-4 w-4 text-green-600" />
      case 'error': return <XMarkIcon className="h-4 w-4 text-red-600" />
      default: return null
    }
  }

  return (
    <>
      <Head>
        <title>Upload de Arquivos - AgroSync</title>
        <meta name="description" content="Faça upload de documentos, imagens e arquivos para a plataforma AgroSync" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-white shadow-sm border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Upload de Arquivos
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Faça upload de documentos, imagens e arquivos importantes para sua fazenda
              </p>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Area */}
              <div className="lg:col-span-2">
                <Card>
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Enviar Arquivos</h2>
                    
                    {/* Category Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria do Arquivo
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Drag & Drop Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <CloudArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Arraste e solte arquivos aqui
                      </p>
                      <p className="text-gray-600 mb-4">
                        ou clique para selecionar arquivos
                      </p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                      >
                        Selecionar Arquivos
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="*/*"
                      />
                    </div>

                    {/* File Types Info */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Tipos de Arquivo Suportados:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <DocumentIcon className="h-4 w-4 mr-2" />
                          Documentos (PDF, DOC)
                        </div>
                        <div className="flex items-center">
                          <PhotoIcon className="h-4 w-4 mr-2" />
                          Imagens (JPG, PNG)
                        </div>
                        <div className="flex items-center">
                          <VideoCameraIcon className="h-4 w-4 mr-2" />
                          Vídeos (MP4, AVI)
                        </div>
                        <div className="flex items-center">
                          <DocumentIcon className="h-4 w-4 mr-2" />
                          Planilhas (XLS, CSV)
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Upload Stats */}
              <div>
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total de Arquivos:</span>
                        <span className="font-semibold">{files.length}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Em Upload:</span>
                        <span className="font-semibold text-blue-600">
                          {files.filter(f => f.status === 'uploading').length}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Concluídos:</span>
                        <span className="font-semibold text-green-600">
                          {files.filter(f => f.status === 'completed').length}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Com Erro:</span>
                        <span className="font-semibold text-red-600">
                          {files.filter(f => f.status === 'error').length}
                        </span>
                      </div>
                    </div>

                    {files.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setFiles([])}
                        >
                          Limpar Lista
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Files List */}
        {files.length > 0 && (
          <section className="py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Arquivos Enviados</h2>
              
              <div className="space-y-4">
                {files.map((file) => (
                  <Card key={file.id}>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getFileIcon(file.type)}
                          <div>
                            <h3 className="font-medium text-gray-900">{file.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{file.size}</span>
                              <span>•</span>
                              <span>{file.category}</span>
                              <span>•</span>
                              <span>{new Date(file.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {/* Progress Bar */}
                          {file.status === 'uploading' && (
                            <div className="w-32">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{Math.round(file.progress)}%</span>
                            </div>
                          )}
                          
                          {/* Status */}
                          <div className={`flex items-center space-x-2 ${getStatusColor(file.status)}`}>
                            {getStatusIcon(file.status)}
                            <span className="text-sm font-medium">
                              {file.status === 'uploading' ? 'Enviando...' :
                               file.status === 'completed' ? 'Concluído' : 'Erro'}
                            </span>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            {file.status === 'completed' && (
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                            )}
                            
                            {file.status === 'error' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => retryUpload(file.id)}
                              >
                                Tentar Novamente
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tips Section */}
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Dicas para Upload</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DocumentIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Organize por Categoria</h3>
                <p className="text-gray-600 text-sm">
                  Use as categorias para organizar seus arquivos e facilitar a busca posterior
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CloudArrowUpIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Backup Automático</h3>
                <p className="text-gray-600 text-sm">
                  Todos os arquivos são automaticamente salvos na nuvem com backup redundante
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Segurança Garantida</h3>
                <p className="text-gray-600 text-sm">
                  Seus arquivos são criptografados e protegidos com as mais altas medidas de segurança
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Upload
