'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Tag, Star, Heart, Circle, Square, Triangle, Home, User, Settings, Mail, Phone, Calendar, Book, Music, Video, Camera, Image, FileText, Folder, Globe } from 'lucide-react'

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
}

const cores = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800000', '#008000', '#000080', '#808000', '#800080', '#008080',
  '#FFA500', '#FFC0CB', '#800000', '#FF1493', '#FF4500', '#DA70D6',
  '#7B68EE', '#00FA9A'
]

const icones = [
  { nome: 'tag', componente: Tag },
  { nome: 'star', componente: Star },
  { nome: 'heart', componente: Heart },
  { nome: 'circle', componente: Circle },
  { nome: 'square', componente: Square },
  { nome: 'triangle', componente: Triangle },
  { nome: 'home', componente: Home },
  { nome: 'user', componente: User },
  { nome: 'settings', componente: Settings },
  { nome: 'mail', componente: Mail },
  { nome: 'phone', componente: Phone },
  { nome: 'calendar', componente: Calendar },
  { nome: 'book', componente: Book },
  { nome: 'music', componente: Music },
  { nome: 'video', componente: Video },
  { nome: 'camera', componente: Camera },
  { nome: 'image', componente: Image },
  { nome: 'file', componente: FileText },
  { nome: 'folder', componente: Folder },
  { nome: 'globe', componente: Globe }
]

export default function BodyTags() {
  const [nome, setNome] = useState('')
  const [icone, setIcone] = useState('')
  const [cor, setCor] = useState('')
  const [tags, setTags] = useState<Tag[]>([])
  const [editando, setEditando] = useState<number | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      carregarTags()
    }
  }, [user])

  // Função para carregar as tags do usuário
  const carregarTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tbTags')
        .select('*')
        .eq('user_id', user?.id)
        .order('id', { ascending: true })

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

  // Função para adicionar ou atualizar uma tag
  const salvarTag = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editando) {
        const { error } = await supabase
          .from('tbTags')
          .update({ nome, icone, cor })
          .eq('id', editando)
          .eq('user_id', user?.id)

        if (error) throw error
        toast({
          title: "Sucesso",
          description: "Tag atualizada com sucesso!",
        })
      } else {
        const { error } = await supabase
          .from('tbTags')
          .insert({ nome, icone, cor, user_id: user?.id })

        if (error) throw error
        toast({
          title: "Sucesso",
          description: "Nova tag adicionada com sucesso!",
        })
      }
      setNome('')
      setIcone('')
      setCor('')
      setEditando(null)
      carregarTags()
    } catch (error) {
      console.error('Erro ao salvar tag:', error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a tag. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para excluir uma tag
  const excluirTag = async (id: number) => {
    try {
      const { error } = await supabase
        .from('tbTags')
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

  const IconeComponent = ({ nome, cor }: { nome: string, cor: string }) => {
    const icone = icones.find(i => i.nome === nome)
    if (icone) {
      const IconComponent = icone.componente
      return <IconComponent className="h-4 w-4" style={{ color: cor }} />
    }
    return null
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gerenciar Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={salvarTag} className="space-y-4">
          <Input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da tag"
            required
          />
          <Select value={icone} onValueChange={setIcone}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um ícone" />
            </SelectTrigger>
            <SelectContent>
              {icones.map((ic) => (
                <SelectItem key={ic.nome} value={ic.nome}>
                  <div className="flex items-center">
                    <ic.componente className="mr-2 h-4 w-4" />
                    {ic.nome}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={cor} onValueChange={setCor}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma cor" />
            </SelectTrigger>
            <SelectContent>
              {cores.map((c) => (
                <SelectItem key={c} value={c}>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: c }}></div>
                    {c}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">
            {editando ? 'Atualizar' : 'Adicionar'} Tag
          </Button>
        </form>

        <div className="mt-8 space-y-4">
          {tags.map((tag) => (
            <Card key={tag.id}>
              <CardContent className="flex justify-between items-center p-4">
                <div className="flex items-center">
                  <IconeComponent nome={tag.icone} cor={tag.cor} />
                  <span className="ml-2">{tag.nome}</span>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setEditando(tag.id)
                      setNome(tag.nome)
                      setIcone(tag.icone)
                      setCor(tag.cor)
                    }}
                    className="mr-2"
                  >
                    Editar
                  </Button>
                  <Button onClick={() => excluirTag(tag.id)} variant="destructive">
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}