'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

// Inicializa o cliente Supabase
const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function BodyTransacao() {
  const navigate = useNavigate()
  const [tipoTransacao, setTipoTransacao] = useState('despesa')
  const [valor, setValor] = useState('')
  const [titulo, setTitulo] = useState('')
  const [dataTransacao, setDataTransacao] = useState(new Date().toISOString().split('T')[0])
  const [categoria, setCategoria] = useState('')
  const [conta, setConta] = useState('')
  const [cartao, setCartao] = useState('')
  const [tag, setTag] = useState('')
  const [tipoLancamento, setTipoLancamento] = useState('unico')
  const [qtdParcelas, setQtdParcelas] = useState('')
  const [contaOrigem, setContaOrigem] = useState('')
  const [contaDestino, setContaDestino] = useState('')
  const [categorias, setCategorias] = useState([])
  const [contas, setContas] = useState([])
  const [cartoes, setCartoes] = useState([])
  const [tags, setTags] = useState([])

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    // Carregar categorias, contas, cartões e tags do Supabase
    const { data: categoriasData } = await supabase.from('tbCategoria').select('*')
    const { data: contasData } = await supabase.from('tbConta').select('*')
    const { data: cartoesData } = await supabase.from('tbCartao').select('*')
    const { data: tagsData } = await supabase.from('tbTag').select('*')

    setCategorias(categoriasData || [])
    setContas(contasData || [])
    setCartoes(cartoesData || [])
    setTags(tagsData || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const novaTransacao = {
        id_usuario: user.id,
        tipo_transacao: tipoTransacao,
        valor: parseFloat(valor),
        titulo,
        data_transacao: dataTransacao,
        categoria,
        conta,
        cartao,
        tag,
        tipo_lancamento: tipoLancamento,
        qtd_parcelas: tipoLancamento === 'parcelado' ? parseInt(qtdParcelas) : null,
        conta_origem: tipoTransacao === 'transferencia' ? contaOrigem : null,
        conta_destino: tipoTransacao === 'transferencia' ? contaDestino : null,
      }

      const { error } = await supabase.from('tbTransacao').insert(novaTransacao)
      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso!",
      })

      // Limpar formulário
      setValor('')
      setTitulo('')
      setDataTransacao(new Date().toISOString().split('T')[0])
      setCategoria('')
      setConta('')
      setCartao('')
      setTag('')
      setTipoLancamento('unico')
      setQtdParcelas('')
      setContaOrigem('')
      setContaDestino('')

      // Navegar para a página de listagem de transações
      navigate('/transacoes')

    } catch (error) {
      console.error('Erro ao salvar transação:', error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a transação. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nova Transação</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <RadioGroup value={tipoTransacao} onValueChange={setTipoTransacao} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="receita" id="receita" />
            <Label htmlFor="receita">Receita</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="despesa" id="despesa" />
            <Label htmlFor="despesa">Despesa</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="transferencia" id="transferencia" />
            <Label htmlFor="transferencia">Transferência</Label>
          </div>
        </RadioGroup>

        <div>
          <Label htmlFor="valor">Valor</Label>
          <Input
            id="valor"
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="dataTransacao">Data da Transação</Label>
          <Input
            id="dataTransacao"
            type="date"
            value={dataTransacao}
            onChange={(e) => setDataTransacao(e.target.value)}
            required
          />
        </div>

        {tipoTransacao !== 'transferencia' && (
          <>
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="conta">Conta</Label>
              <Select value={conta} onValueChange={setConta}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta" />
                </SelectTrigger>
                <SelectContent>
                  {contas.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cartao">Cartão</Label>
              <Select value={cartao} onValueChange={setCartao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cartão" />
                </SelectTrigger>
                <SelectContent>
                  {cartoes.map((card) => (
                    <SelectItem key={card.id} value={card.id.toString()}>{card.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tag">Tag</Label>
              <Select value={tag} onValueChange={setTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma tag" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>{t.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {tipoTransacao === 'transferencia' && (
          <>
            <div>
              <Label htmlFor="contaOrigem">Conta de Origem</Label>
              <Select value={contaOrigem} onValueChange={setContaOrigem}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta de origem" />
                </SelectTrigger>
                <SelectContent>
                  {contas.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contaDestino">Conta de Destino</Label>
              <Select value={contaDestino} onValueChange={setContaDestino}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta de destino" />
                </SelectTrigger>
                <SelectContent>
                  {contas.filter(c => c.id.toString() !== contaOrigem).map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div>
          <Label>Tipo de Lançamento</Label>
          <RadioGroup value={tipoLancamento} onValueChange={setTipoLancamento} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unico" id="unico" />
              <Label htmlFor="unico">Único</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="recorrente" id="recorrente" />
              <Label htmlFor="recorrente">Recorrente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="parcelado" id="parcelado" />
              <Label htmlFor="parcelado">Parcelado</Label>
            </div>
          </RadioGroup>
        </div>

        {tipoLancamento === 'parcelado' && (
          <div>
            <Label htmlFor="qtdParcelas">Quantidade de Parcelas</Label>
            <Input
              id="qtdParcelas"
              type="number"
              value={qtdParcelas}
              onChange={(e) => setQtdParcelas(e.target.value)}
              required
            />
          </div>
        )}

        <Button type="submit">Adicionar Transação</Button>
      </form>
    </div>
  )
}