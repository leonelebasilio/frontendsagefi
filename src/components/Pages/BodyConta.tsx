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

interface Conta {
  id: number
  user_id: string
  nome: string
  tipo: 'Corrente' | 'Poupança' | 'Investimento' | 'Dinheiro'
  numero: number
  created_at: string
  updated_at: string
}

export default function BodyConta() {
  const [novaConta, setNovaConta] = useState<Omit<Conta, 'id' | 'user_id' | 'created_at' | 'updated_at'>>({
    nome: '',
    tipo: 'Corrente',
    numero: 0
  })
  const [contas, setContas] = useState<Conta[]>([])
  const [editando, setEditando] = useState<number | null>(null)
  const [mostrarBusca, setMostrarBusca] = useState(false)
  const [termoBusca, setTermoBusca] = useState('')
  const { user } = useAuth()
  const { toast } = useToast()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      carregarContas()
    }
  }, [user])

  useEffect(() => {
    if (mostrarBusca && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [mostrarBusca])

  // Função para carregar as contas do usuário
  const carregarContas = async () => {
    try {
      const { data, error } = await supabase
        .from('tbconta')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setContas(data || [])
    } catch (error) {
      console.error('Erro ao carregar contas:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as contas. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para adicionar uma nova conta
  const adicionarConta = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('tbconta')
        .insert({ ...novaConta, user_id: user?.id })

      if (error) throw error
      toast({
        title: "Sucesso",
        description: "Nova conta adicionada com sucesso!",
      })
      setNovaConta({
        nome: '',
        tipo: 'Corrente',
        numero: 0
      })
      carregarContas()
    } catch (error) {
      console.error('Erro ao adicionar conta:', error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a conta. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para atualizar uma conta
  const atualizarConta = async (id: number, contaAtualizada: Partial<Conta>) => {
    try {
      const { error } = await supabase
        .from('tbconta')
        .update(contaAtualizada)
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error
      toast({
        title: "Sucesso",
        description: "Conta atualizada com sucesso!",
      })
      setEditando(null)
      carregarContas()
    } catch (error) {
      console.error('Erro ao atualizar conta:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a conta. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para excluir uma conta
  const excluirConta = async (id: number) => {
    try {
      const { error } = await supabase
        .from('tbconta')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error
      toast({
        title: "Sucesso",
        description: "Conta excluída com sucesso!",
      })
      carregarContas()
    } catch (error) {
      console.error('Erro ao excluir conta:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conta. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para filtrar as contas
  const contasFiltradas = contas.filter(conta =>
    conta.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    conta.tipo.toLowerCase().includes(termoBusca.toLowerCase()) ||
    conta.numero.toString().includes(termoBusca)
  )

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciar Contas</CardTitle>
          <div className="flex items-center">
            {mostrarBusca && (
              <Input
                ref={searchInputRef}
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Buscar contas..."
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
          <form onSubmit={adicionarConta} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">Nome da Conta</Label>
                <Input
                  id="nome"
                  type="text"
                  value={novaConta.nome}
                  onChange={(e) => setNovaConta({ ...novaConta, nome: e.target.value })}
                  placeholder="Nome da nova conta"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-sm font-medium">Tipo da Conta</Label>
                <Select
                  value={novaConta.tipo}
                  onValueChange={(value) => setNovaConta({ ...novaConta, tipo: value as 'Corrente' | 'Poupança' | 'Investimento' | 'Dinheiro' })}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corrente">Corrente</SelectItem>
                    <SelectItem value="Poupança">Poupança</SelectItem>
                    <SelectItem value="Investimento">Investimento</SelectItem>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero" className="text-sm font-medium">Número da Conta</Label>
                <Input
                  id="numero"
                  type="number"
                  value={novaConta.numero}
                  onChange={(e) => setNovaConta({ ...novaConta, numero: parseInt(e.target.value) })}
                  placeholder="Número da conta"
                />
              </div>
            </div>
            <Button type="submit">Salvar</Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Conta</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contasFiltradas.map((conta) => (
                <>
                  <TableRow key={conta.id}>
                    <TableCell>{conta.nome}</TableCell>
                    <TableCell>{conta.tipo}</TableCell>
                    <TableCell>{conta.numero}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditando(editando === conta.id ? null : conta.id)}
                        >
                          {editando === conta.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => excluirConta(conta.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {editando === conta.id && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <form onSubmit={(e) => {
                          e.preventDefault()
                          atualizarConta(conta.id, conta)
                        }} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`nome-${conta.id}`} className="text-sm font-medium">Nome da Conta</Label>
                              <Input
                                id={`nome-${conta.id}`}
                                type="text"
                                value={conta.nome}
                                onChange={(e) => setContas(contas.map(c => c.id === conta.id ? { ...c, nome: e.target.value } : c))}
                                placeholder="Nome da conta"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`tipo-${conta.id}`} className="text-sm font-medium">Tipo da Conta</Label>
                              <Select
                                value={conta.tipo}
                                onValueChange={(value) => setContas(contas.map(c => c.id === conta.id ? { ...c, tipo: value as 'Corrente' | 'Poupança' | 'Investimento' | 'Dinheiro' } : c))}
                              >
                                <SelectTrigger id={`tipo-${conta.id}`}>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Corrente">Corrente</SelectItem>
                                  <SelectItem value="Poupança">Poupança</SelectItem>
                                  <SelectItem value="Investimento">Investimento</SelectItem>
                                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`numero-${conta.id}`} className="text-sm font-medium">Número da Conta</Label>
                              <Input
                                id={`numero-${conta.id}`}
                                type="number"
                                value={conta.numero}
                                onChange={(e) => setContas(contas.map(c => c.id === conta.id ? { ...c, numero: parseInt(e.target.value) } : c))}
                                placeholder="Número da conta"
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