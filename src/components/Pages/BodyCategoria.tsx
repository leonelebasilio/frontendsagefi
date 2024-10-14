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
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as Icons from 'lucide-react'

// Inicializa o cliente Supabase
const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko'
const supabase = createClient(supabaseUrl, supabaseKey)

interface Categoria {
  id: number
  user_id: string
  nome: string
  icone: string
  cor: string
  tipo: 'Padrao' | 'Personalizada'
  updated_at: string
}

const icones = [
  'utensils', 'shopping-cart', 'smile', 'home', 'heart', 'spa', 'trending-up', 'credit-card',
  'dollar-sign', 'file-text', 'book', 'car', 'more-horizontal', 'alert-triangle', 'tv',
  'repeat', 'plane', 'piggy-bank', 'briefcase', 'shield', 'tool', 'palette'
]

const cores = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#33FFF5', '#F5FF33', '#FF8C33', '#338CFF',
  '#33FF8C', '#8C33FF', '#FF338C', '#8CFF33', '#CCCCCC', '#FF3333', '#33FFFF', '#FFFF33',
  '#FF33FF', '#33FF33', '#3333FF', '#FF9933'
]

export default function BodyCategoria() {
  const [novaCategoria, setNovaCategoria] = useState<Omit<Categoria, 'id' | 'user_id' | 'tipo' | 'updated_at'>>({
    nome: '',
    icone: 'circle',
    cor: '#CCCCCC'
  })
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [editando, setEditando] = useState<number | null>(null)
  const [mostrarBusca, setMostrarBusca] = useState(false)
  const [termoBusca, setTermoBusca] = useState('')
  const { user } = useAuth()
  const { toast } = useToast()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      carregarCategorias()
    }
  }, [user])

  useEffect(() => {
    if (mostrarBusca && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [mostrarBusca])

  const carregarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('tbcategoria')
        .select('*')
        .order('tipo', { ascending: false })
        .order('nome', { ascending: true })

      if (error) throw error
      setCategorias(data || [])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const adicionarOuAtualizarCategoria = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editando) {
        const { error } = await supabase
          .from('tbcategoria')
          .update(novaCategoria)
          .eq('id', editando)
          .eq('user_id', user?.id)
          .eq('tipo', 'Personalizada')

        if (error) throw error
        toast({
          title: "Sucesso",
          description: "Categoria atualizada com sucesso!",
        })
        setEditando(null)
      } else {
        const { error } = await supabase
          .from('tbcategoria')
          .insert({ ...novaCategoria, user_id: user?.id, tipo: 'Personalizada' })

        if (error) throw error
        toast({
          title: "Sucesso",
          description: "Nova categoria adicionada com sucesso!",
        })
      }
      setNovaCategoria({ nome: '', icone: 'circle', cor: '#CCCCCC' })
      carregarCategorias()
    } catch (error) {
      console.error('Erro ao adicionar/atualizar categoria:', error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a categoria. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const iniciarEdicao = (categoria: Categoria) => {
    setEditando(categoria.id)
    setNovaCategoria({
      nome: categoria.nome,
      icone: categoria.icone,
      cor: categoria.cor
    })
  }

  const cancelarEdicao = () => {
    setEditando(null)
    setNovaCategoria({ nome: '', icone: 'circle', cor: '#CCCCCC' })
  }

  const excluirCategoria = async (id: number) => {
    try {
      const { error } = await supabase
        .from('tbcategoria')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)
        .eq('tipo', 'Personalizada')

      if (error) throw error
      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      })
      carregarCategorias()
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a categoria. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.nome.toLowerCase().includes(termoBusca.toLowerCase())
  )

  const renderIcone = (nomeIcone: string) => {
    const IconComponent = Icons[nomeIcone as keyof typeof Icons]
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null
  }

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciar Categorias</CardTitle>
          <div className="flex items-center">
            {mostrarBusca && (
              <Input
                ref={searchInputRef}
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Buscar categorias..."
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
          <form onSubmit={adicionarOuAtualizarCategoria} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">Nome da Categoria</Label>
                <Input
                  id="nome"
                  type="text"
                  value={novaCategoria.nome}
                  onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })}
                  placeholder="Nome da categoria"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icone" className="text-sm font-medium">Ícone</Label>
                <Select
                  value={novaCategoria.icone}
                  onValueChange={(value) => setNovaCategoria({ ...novaCategoria, icone: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    {icones.map((icone) => (
                      <SelectItem key={icone} value={icone}>
                        <div className="flex items-center">
                          {renderIcone(icone)}
                          <span className="ml-2">{icone}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cor" className="text-sm font-medium">Cor</Label>
                <Select
                  value={novaCategoria.cor}
                  onValueChange={(value) => setNovaCategoria({ ...novaCategoria, cor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma cor" />
                  </SelectTrigger>
                  <SelectContent>
                    {cores.map((cor) => (
                      <SelectItem key={cor} value={cor}>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: cor }}></div>
                          <span>{cor}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between">
              <Button type="submit">{editando ? 'Atualizar' : 'Salvar'}</Button>
              {editando && (
                <Button type="button" variant="outline" onClick={cancelarEdicao}>Cancelar</Button>
              )}
            </div>
          </form>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Minhas Categorias</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Ícone</TableHead>
                    <TableHead>Cor</TableHead>
                    <TableHead>Última Atualização</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriasFiltradas.filter(c => c.tipo === 'Personalizada').map((categoria) => (
                    <TableRow key={categoria.id}>
                      <TableCell>{categoria.nome}</TableCell>
                      <TableCell>{renderIcone(categoria.icone)}</TableCell>
                      <TableCell>
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: categoria.cor }}></div>
                      </TableCell>
                      <TableCell>{new Date(categoria.updated_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => iniciarEdicao(categoria)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => excluirCategoria(categoria.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Categorias Padrão</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Ícone</TableHead>
                    <TableHead>Cor</TableHead>
                    <TableHead>Última Atualização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriasFiltradas.filter(c => c.tipo === 'Padrao').map((categoria) => (
                    <TableRow key={categoria.id}>
                      <TableCell>{categoria.nome}</TableCell>
                      <TableCell>{renderIcone(categoria.icone)}</TableCell>
                      <TableCell>
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: categoria.cor }}></div>
                      </TableCell>
                      <TableCell>{new Date(categoria.updated_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </>
  )
}