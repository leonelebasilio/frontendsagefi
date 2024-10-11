'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

// Inicializa o cliente Supabase
const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko'
const supabase = createClient(supabaseUrl, supabaseKey)

// Ícones sugeridos para cartões
const iconesSugeridos = [
  'credit-card', 'cc-visa', 'cc-mastercard', 'cc-amex', 'cc-discover',
  'money-check-alt', 'wallet', 'piggy-bank', 'university', 'landmark'
]

export default function BodyCartao() {
  const [cartoes, setCartoes] = useState([])
  const [novoCartao, setNovoCartao] = useState({
    nome: '',
    numero: '',
    tipo: '',
    data_vencimento: '',
    data_fechamento: '',
    data_validade: '',
    limite_total: '',
    limite_disponivel: '',
    icone: ''
  })
  const [editandoCartao, setEditandoCartao] = useState(null)

  useEffect(() => {
    carregarCartoes()
  }, [])

  const carregarCartoes = async () => {
    const { data, error } = await supabase.from('tbCartao').select('*')
    if (error) {
      console.error('Erro ao carregar cartões:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cartões. Por favor, tente novamente.",
        variant: "destructive",
      })
    } else {
      setCartoes(data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const cartaoParaSalvar = {
        ...novoCartao,
        id_usuario: user.id,
        limite_total: parseFloat(novoCartao.limite_total),
        limite_disponivel: parseFloat(novoCartao.limite_disponivel)
      }

      let error
      if (editandoCartao) {
        const { error: updateError } = await supabase
          .from('tbCartao')
          .update(cartaoParaSalvar)
          .eq('id', editandoCartao.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('tbCartao')
          .insert(cartaoParaSalvar)
        error = insertError
      }

      if (error) throw error

      toast({
        title: "Sucesso",
        description: editandoCartao ? "Cartão atualizado com sucesso!" : "Novo cartão adicionado com sucesso!",
      })

      setNovoCartao({
        nome: '',
        numero: '',
        tipo: '',
        data_vencimento: '',
        data_fechamento: '',
        data_validade: '',
        limite_total: '',
        limite_disponivel: '',
        icone: ''
      })
      setEditandoCartao(null)
      carregarCartoes()
    } catch (error) {
      console.error('Erro ao salvar cartão:', error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o cartão. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (cartao) => {
    setEditandoCartao(cartao)
    setNovoCartao({
      nome: cartao.nome,
      numero: cartao.numero,
      tipo: cartao.tipo,
      data_vencimento: cartao.data_vencimento,
      data_fechamento: cartao.data_fechamento,
      data_validade: cartao.data_validade,
      limite_total: cartao.limite_total.toString(),
      limite_disponivel: cartao.limite_disponivel.toString(),
      icone: cartao.icone
    })
  }

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('tbCartao')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Cartão excluído com sucesso!",
      })

      carregarCartoes()
    } catch (error) {
      console.error('Erro ao excluir cartão:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cartão. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Cartões</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="nome">Nome do Cartão</Label>
          <Input
            id="nome"
            value={novoCartao.nome}
            onChange={(e) => setNovoCartao({ ...novoCartao, nome: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="numero">Número do Cartão</Label>
          <Input
            id="numero"
            value={novoCartao.numero}
            onChange={(e) => setNovoCartao({ ...novoCartao, numero: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="tipo">Tipo do Cartão</Label>
          <Input
            id="tipo"
            value={novoCartao.tipo}
            onChange={(e) => setNovoCartao({ ...novoCartao, tipo: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="data_vencimento">Data de Vencimento</Label>
          <Input
            id="data_vencimento"
            type="date"
            value={novoCartao.data_vencimento}
            onChange={(e) => setNovoCartao({ ...novoCartao, data_vencimento: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="data_fechamento">Data de Fechamento</Label>
          <Input
            id="data_fechamento"
            type="date"
            value={novoCartao.data_fechamento}
            onChange={(e) => setNovoCartao({ ...novoCartao, data_fechamento: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="data_validade">Data de Validade</Label>
          <Input
            id="data_validade"
            type="date"
            value={novoCartao.data_validade}
            onChange={(e) => setNovoCartao({ ...novoCartao, data_validade: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="limite_total">Limite Total</Label>
          <Input
            id="limite_total"
            type="number"
            value={novoCartao.limite_total}
            onChange={(e) => setNovoCartao({ ...novoCartao, limite_total: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="limite_disponivel">Limite Disponível</Label>
          <Input
            id="limite_disponivel"
            type="number"
            value={novoCartao.limite_disponivel}
            onChange={(e) => setNovoCartao({ ...novoCartao, limite_disponivel: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="icone">Ícone</Label>
          <Select value={novoCartao.icone} onValueChange={(value) => setNovoCartao({ ...novoCartao, icone: value })}>
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

        <Button type="submit">{editandoCartao ? 'Atualizar Cartão' : 'Adicionar Cartão'}</Button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Cartões Existentes</h2>
        {cartoes.map((cartao) => (
          <div key={cartao.id} className="flex items-center justify-between p-2 border rounded">
            <span>{cartao.nome}</span>
            <div>
              <Button onClick={() => handleEdit(cartao)} className="mr-2">Editar</Button>
              <Button onClick={() => handleDelete(cartao.id)} variant="destructive">Excluir</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}