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

// Ícones sugeridos para categorias
const iconesSugeridos = [
  'utensils', 'shopping-cart', 'home', 'heartbeat', 'graduation-cap', 'car', 'plane', 'piggy-bank',
  'chart-line', 'money-bill-wave', 'gift', 'tools', 'gamepad', 'film', 'book', 'dumbbell',
  'coffee', 'bus', 'tshirt', 'paw'
]

// Cores sugeridas para categorias
const coresSugeridas = [
  'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'teal',
  'cyan', 'indigo', 'lime', 'brown', 'gray', 'black', 'white', 'maroon',
  
  'navy', 'olive', 'silver', 'gold'
]

export default function BodyCategoria() {
  const [categorias, setCategorias] = useState([])
  const [novaCategoria, setNovaCategoria] = useState({ nome: '', icone: '', cor: '' })
  const [editandoCategoria, setEditandoCategoria] = useState(null)

  useEffect(() => {
    carregarCategorias()
  }, [])

  const carregarCategorias = async () => {
    const { data, error } = await supabase.from('tbCategoria').select('*')
    if (error) {
      console.error('Erro ao carregar categorias:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias. Por favor, tente novamente.",
        variant: "destructive",
      })
    } else {
      setCategorias(data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const categoriaParaSalvar = {
        ...novaCategoria,
        id_usuario: user.id
      }

      let error
      if (editandoCategoria) {
        const { error: updateError } = await supabase
          .from('tbCategoria')
          .update(categoriaParaSalvar)
          .eq('id', editandoCategoria.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('tbCategoria')
          .insert(categoriaParaSalvar)
        error = insertError
      }

      if (error) throw error

      toast({
        title: "Sucesso",
        description: editandoCategoria ? "Categoria atualizada com sucesso!" : "Nova categoria adicionada com sucesso!",
      })

      setNovaCategoria({ nome: '', icone: '', cor: '' })
      setEditandoCategoria(null)
      carregarCategorias()
    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a categoria. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (categoria) => {
    setEditandoCategoria(categoria)
    setNovaCategoria({
      nome: categoria.nome,
      icone: categoria.icone,
      cor: categoria.cor
    })
  }

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('tbCategoria')
        .delete()
        .eq('id', id)

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Categorias</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="nome">Nome da Categoria</Label>
          <Input
            id="nome"
            value={novaCategoria.nome}
            onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="icone">Ícone</Label>
          <Select value={novaCategoria.icone} onValueChange={(value) => setNovaCategoria({ ...novaCategoria, icone: value })}>
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
          <Label htmlFor="cor">Cor</Label>
          <Select value={novaCategoria.cor} onValueChange={(value) => setNovaCategoria({ ...novaCategoria, cor: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma cor" />
            </SelectTrigger>
            <SelectContent>
              {coresSugeridas.map((cor) => (
                <SelectItem key={cor} value={cor}>{cor}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit">{editandoCategoria ? 'Atualizar Categoria' : 'Adicionar Categoria'}</Button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Categorias Existentes</h2>
        {categorias.map((categoria) => (
          <div key={categoria.id} className="flex items-center justify-between p-2 border rounded">
            <span>{categoria.nome}</span>
            <div>
              <Button onClick={() => handleEdit(categoria)} className="mr-2">Editar</Button>
              <Button onClick={() => handleDelete(categoria.id)} variant="destructive">Excluir</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}