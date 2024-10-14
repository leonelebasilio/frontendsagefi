'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Pencil, Trash2, Save, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Inicializa o cliente Supabase
const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko'
const supabase = createClient(supabaseUrl, supabaseKey)

interface Tag {
  id: number
  user_id: string
  nome: string
  icone: string
  cor: string
  created_at: string
  updated_at: string
}

const cores = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800000', '#008000', '#000080', '#808000', '#800080', '#008080',
  '#FFA500', '#FFC0CB', '#800000', '#008000', '#000080', '#808000',
  '#800080', '#008080'
]

export default function BodyTags() {
  const [novaTag, setNovaTag] = useState<Omit<Tag, 'id' | 'user_id' | 'created_at' | 'updated_at'>>({
    nome: '',
    icone: '',
    cor: cores[0]
  })
  const [tags, setTags] = useState<Tag[]>([])
  const [editando, setEditando] = useState<number | null>(null)
  const [mostrarBusca, setMostrarBusca] = useState(false)
  const [termoBusca, setTermoBusca] = useState('')
  const { user } = useAuth()
  const { toast } = useToast()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      carregarTags()
    }
  }, [user])

  useEffect(() => {
    if (mostrarBusca && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [mostrarBusca])

  // Função para carregar as tags do usuário
  const carregarTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tbtag')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTags(data || [])
    } catch (error) {
      console.error('Erro ao carregar tags:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tags. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para adicionar uma nova tag
  const adicionarTag = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('tbtag')
        .insert({ ...novaTag, user_id: user?.id })

      if (error) throw error
      toast({
        title: "Sucesso",
        description: "Nova tag adicionada com sucesso!",
      })
      setNovaTag({
        nome: '',
        icone: '',
        cor: cores[0]
      })
      carregarTags()
    } catch (error) {
      console.error('Erro ao adicionar tag:', error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a tag. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para atualizar uma tag
  const atualizarTag = async (id: number, tagAtualizada: Partial<Tag>) => {
    try {
      const { error } = await supabase
        .from('tbtag')
        .update(tagAtualizada)
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error
      toast({
        title: "Sucesso",
        description: "Tag atualizada com sucesso!",
      })
      setEditando(null)
      carregarTags()
    } catch (error) {
      console.error('Erro ao atualizar tag:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tag. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para excluir uma tag
  const excluirTag = async (id: number) => {
    try {
      const { error } = await supabase
        .from('tbtag')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error
      toast({
        title: "Sucesso",
        description: "Tag excluída com sucesso!",
      })
      carregarTags()
    } catch (error) {
      console.error('Erro ao excluir tag:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tag. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para filtrar as tags
  const tagsFiltradas = tags.filter(tag =>
    tag.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    tag.icone.toLowerCase().includes(termoBusca.toLowerCase())
  )

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciar Tags</CardTitle>
          <div className="flex items-center">
            {mostrarBusca && (
              <Input
                ref={searchInputRef}
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Buscar tags..."
                className="mr-2 w-64"
              />
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setMostrarBusca(!mostrarBusca)}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={adicionarTag} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">Nome da Tag</Label>
                <Input
                  id="nome"
                  type="text"
                  value={novaTag.nome}
                  onChange={(e) => setNovaTag({ ...novaTag, nome: e.target.value })}
                  placeholder="Nome da nova tag"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icone" className="text-sm font-medium">Ícone da Tag</Label>
                <Input
                  id="icone"
                  type="text"
                  value={novaTag.icone}
                  onChange={(e) => setNovaTag({ ...novaTag, icone: e.target.value })}
                  placeholder="Sugestão de ícone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cor" className="text-sm font-medium">Cor da Tag</Label>
                <Select
                  value={novaTag.cor}
                  onValueChange={(value) => setNovaTag({ ...novaTag, cor: value })}
                >
                  <SelectTrigger id="cor">
                    <SelectValue placeholder="Selecione a cor" />
                  </SelectTrigger>
                  <SelectContent>
                    {cores.map((cor, index) => (
                      <SelectItem key={index} value={cor}>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: cor }}></div>
                          {cor}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit">Salvar</Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Tag</TableHead>
                <TableHead>Ícone</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tagsFiltradas.map((tag) => (
                <>
                  <TableRow key={tag.id}>
                    <TableCell>{tag.nome}</TableCell>
                    <TableCell>{tag.icone}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: tag.cor }}></div>
                        {tag.cor}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditando(editando === tag.id ? null : tag.id)}
                        >
                          {editando === tag.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => excluirTag(tag.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {editando === tag.id && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <form onSubmit={(e) => {
                          e.preventDefault()
                          atualizarTag(tag.id, tag)
                        }} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`nome-${tag.id}`} className="text-sm font-medium">Nome da Tag</Label>
                              <Input
                                id={`nome-${tag.id}`}
                                type="text"
                                value={tag.nome}
                                onChange={(e) => setTags(tags.map(t => t.id === tag.id ? { ...t, nome: e.target.value } : t))}
                                placeholder="Nome da tag"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`icone-${tag.id}`} className="text-sm font-medium">Ícone da Tag</Label>
                              <Input
                                id={`icone-${tag.id}`}
                                type="text"
                                value={tag.icone}
                                onChange={(e) => setTags(tags.map(t => t.id === tag.id ? { ...t, icone: e.target.value } : t))}
                                placeholder="Sugestão de ícone"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`cor-${tag.id}`} className="text-sm font-medium">Cor da Tag</Label>
                              <Select
                                value={tag.cor}
                                onValueChange={(value) => setTags(tags.map(t => t.id === tag.id ? { ...t, cor: value } : t))}
                              >
                                <SelectTrigger id={`cor-${tag.id}`}>
                                  <SelectValue placeholder="Selecione a cor" />
                                </SelectTrigger>
                                <SelectContent>
                                  {cores.map((cor, index) => (
                                    <SelectItem key={index} value={cor}>
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: cor }}></div>
                                        {cor}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button type="submit" size="sm">
                              <Save className="h-4 w-4 mr-2" />
                              Salvar
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => setEditando(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </form>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Toaster />
    
    </>
  )
}