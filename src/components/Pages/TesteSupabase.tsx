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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Inicializa o cliente Supabase
const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko'
const supabase = createClient(supabaseUrl, supabaseKey)

interface Teste {
  id: number
  descricao: string
  user_id: string
  created_at: string
  updated_at: string
  tipo: 'Uva' | 'Melão' | 'Banana'
  detalhes: string
  quantidade: number
}

export default function TesteSupabase() {
  const [novoTeste, setNovoTeste] = useState<Omit<Teste, 'id' | 'user_id' | 'created_at' | 'updated_at'>>({
    descricao: '',
    tipo: 'Uva',
    detalhes: '',
    quantidade: 0
  })
  const [testes, setTestes] = useState<Teste[]>([])
  const [editando, setEditando] = useState<number | null>(null)
  const [mostrarBusca, setMostrarBusca] = useState(false)
  const [termoBusca, setTermoBusca] = useState('')
  const { user } = useAuth()
  const { toast } = useToast()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      carregarTestes()
    }
  }, [user])

  useEffect(() => {
    if (mostrarBusca && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [mostrarBusca])

  // Função para carregar os testes do usuário
  const carregarTestes = async () => {
    try {
      const { data, error } = await supabase
        .from('testes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTestes(data || [])
    } catch (error) {
      console.error('Erro ao carregar testes:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os testes. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para adicionar um novo teste
  const adicionarTeste = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('testes')
        .insert({ ...novoTeste, user_id: user?.id })

      if (error) throw error
      toast({
        title: "Sucesso",
        description: "Novo teste adicionado com sucesso!",
      })
      setNovoTeste({
        descricao: '',
        tipo: 'Uva',
        detalhes: '',
        quantidade: 0
      })
      carregarTestes()
    } catch (error) {
      console.error('Erro ao adicionar teste:', error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o teste. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para atualizar um teste
  const atualizarTeste = async (id: number, testeAtualizado: Partial<Teste>) => {
    try {
      const { error } = await supabase
        .from('testes')
        .update(testeAtualizado)
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error
      toast({
        title: "Sucesso",
        description: "Teste atualizado com sucesso!",
      })
      setEditando(null)
      carregarTestes()
    } catch (error) {
      console.error('Erro ao atualizar teste:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o teste. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para excluir um teste
  const excluirTeste = async (id: number) => {
    try {
      const { error } = await supabase
        .from('testes')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error
      toast({
        title: "Sucesso",
        description: "Teste excluído com sucesso!",
      })
      carregarTestes()
    } catch (error) {
      console.error('Erro ao excluir teste:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o teste. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para filtrar os testes
  const testesFiltrados = testes.filter(teste =>
    teste.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
    teste.tipo.toLowerCase().includes(termoBusca.toLowerCase()) ||
    teste.detalhes.toLowerCase().includes(termoBusca.toLowerCase())
  )

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciar Testes</CardTitle>
          <div className="flex items-center">
            {mostrarBusca && (
              <Input
                ref={searchInputRef}
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Buscar testes..."
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
          <form onSubmit={adicionarTeste} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-sm font-medium">Descrição</Label>
                <Input
                  id="descricao"
                  type="text"
                  value={novoTeste.descricao}
                  onChange={(e) => setNovoTeste({ ...novoTeste, descricao: e.target.value })}
                  placeholder="Descrição do novo teste"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-sm font-medium">Tipo</Label>
                <Select
                  value={novoTeste.tipo}
                  onValueChange={(value) => setNovoTeste({ ...novoTeste, tipo: value as 'Uva' | 'Melão' | 'Banana' })}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Uva">Uva</SelectItem>
                    <SelectItem value="Melão">Melão</SelectItem>
                    <SelectItem value="Banana">Banana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="detalhes" className="text-sm font-medium">Detalhes</Label>
                <Textarea
                  id="detalhes"
                  value={novoTeste.detalhes}
                  onChange={(e) => setNovoTeste({ ...novoTeste, detalhes: e.target.value })}
                  placeholder="Detalhes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantidade" className="text-sm font-medium">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={novoTeste.quantidade}
                  onChange={(e) => setNovoTeste({ ...novoTeste, quantidade: parseInt(e.target.value) })}
                  placeholder="Quantidade"
                  required
                />
              </div>
            </div>
            <Button type="submit">Salvar</Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testesFiltrados.map((teste) => (
                <>
                  <TableRow key={teste.id}>
                    <TableCell>{teste.descricao}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditando(editando === teste.id ? null : teste.id)}
                        >
                          {editando === teste.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => excluirTeste(teste.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {editando === teste.id && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <form onSubmit={(e) => {
                          e.preventDefault()
                          atualizarTeste(teste.id, teste)
                        }} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`descricao-${teste.id}`} className="text-sm font-medium">Descrição</Label>
                              <Input
                                id={`descricao-${teste.id}`}
                                type="text"
                                value={teste.descricao}
                                onChange={(e) => setTestes(testes.map(t => t.id === teste.id ? { ...t, descricao: e.target.value } : t))}
                                placeholder="Descrição"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`tipo-${teste.id}`} className="text-sm font-medium">Tipo</Label>
                              <Select
                                value={teste.tipo}
                                onValueChange={(value) => setTestes(testes.map(t => t.id === teste.id ? { ...t, tipo: value as 'Uva' | 'Melão' | 'Banana' } : t))}
                              >
                                <SelectTrigger id={`tipo-${teste.id}`}>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Uva">Uva</SelectItem>
                                  <SelectItem value="Melão">Melão</SelectItem>
                                  <SelectItem value="Banana">Banana</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`detalhes-${teste.id}`} className="text-sm font-medium">Detalhes</Label>
                              <Textarea
                                id={`detalhes-${teste.id}`}
                                value={teste.detalhes}
                                onChange={(e) => setTestes(testes.map(t => t.id === teste.id ? { ...t, detalhes: e.target.value } : t))}
                                placeholder="Detalhes"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`quantidade-${teste.id}`} className="text-sm font-medium">Quantidade</Label>
                              <Input
                                id={`quantidade-${teste.id}`}
                                type="number"
                                value={teste.quantidade}
                                onChange={(e) => setTestes(testes.map(t => t.id === teste.id ? { ...t, quantidade: parseInt(e.target.value) } : t))}
                                placeholder="Quantidade"
                                required
                              />
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