'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Inicializa o cliente Supabase
const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko'
const supabase = createClient(supabaseUrl, supabaseKey)

// Ícones sugeridos para contas
const iconesSugeridos = [
  'university', 'piggy-bank', 'wallet', 'money-bill-wave', 'coins',
  'cash-register', 'landmark', 'credit-card', 'money-check-alt', 'donate'
]

export default function BodyConta() {
  const [contas, setContas] = useState([])
  const [novaConta, setNovaConta] = useState({
    nome: '',
    tipo: 'Corrente',
    icone: '',
    numero: ''
  })
  const [editandoConta, setEditandoConta] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    carregarContas()
  }, [])

  const carregarContas = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('tbConta')
        .select('*')
        .eq('id_usuario', user.id)

      if (error) throw error
      setContas(data)
    } catch (error) {
      console.error('Erro ao carregar contas:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as contas. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const contaParaSalvar = {
        ...novaConta,
        id_usuario: user.id
      }

      let error
      if (editandoConta) {
        const { error: updateError } = await supabase
          .from('tbConta')
          .update(contaParaSalvar)
          .eq('id', editandoConta.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('tbConta')
          .insert(contaParaSalvar)
        error = insertError
      }

      if (error) throw error

      toast({
        title: "Sucesso",
        description: editandoConta ? "Conta atualizada com sucesso!" : "Nova conta adicionada com sucesso!",
      })

      setNovaConta({
        nome: '',
        tipo: 'Corrente',
        icone: '',
        numero: ''
      })
      setEditandoConta(null)
      await carregarContas()
    } catch (error) {
      console.error('Erro ao salvar conta:', error.message || 'Erro desconhecido')
      toast({
        title: "Erro",
        description: `Não foi possível salvar a conta. ${error.message || 'Por favor, tente novamente.'}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (conta) => {
    setEditandoConta(conta)
    setNovaConta({
      nome: conta.nome,
      tipo: conta.tipo,
      icone: conta.icone,
      numero: conta.numero
    })
  }

  const handleDelete = async (id) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('tbConta')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Conta excluída com sucesso!",
      })

      await carregarContas()
    } catch (error) {
      console.error('Erro ao excluir conta:', error.message || 'Erro desconhecido')
      toast({
        title: "Erro",
        description: `Não foi possível excluir a conta. ${error.message || 'Por favor, tente novamente.'}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Contas</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="nome">Nome da Conta</Label>
          <Input
            id="nome"
            value={novaConta.nome}
            onChange={(e) => setNovaConta({ ...novaConta, nome: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="tipo">Tipo da Conta</Label>
          <Select value={novaConta.tipo} onValueChange={(value) => setNovaConta({ ...novaConta, tipo: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo da conta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Corrente">Corrente</SelectItem>
              <SelectItem value="Poupança">Poupança</SelectItem>
              <SelectItem value="Investimento">Investimento</SelectItem>
              <SelectItem value="Outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="icone">Ícone</Label>
          <Select value={novaConta.icone} onValueChange={(value) => setNovaConta({ ...novaConta, icone: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um ícone" />
            </SelectTrigger>
            <SelectContent>
              {iconesSugeridos.map((icone) => (
                <SelectItem key={icone} value={icone}>{icone}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="numero">Número da Conta</Label>
          <Input
            id="numero"
            value={novaConta.numero}
            onChange={(e) => setNovaConta({ ...novaConta, numero: e.target.value })}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            editandoConta ? 'Atualizar Conta' : 'Adicionar Conta'
          )}
        </Button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Contas Existentes</h2>
        {contas.map((conta) => (
          <div key={conta.id} className="flex items-center justify-between p-2 border rounded">
            <span>{conta.nome}</span>
            <div>
              <Button onClick={() => handleEdit(conta)} className="mr-2">Editar</Button>
              <Button onClick={() => handleDelete(conta.id)} variant="destructive">Excluir</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}