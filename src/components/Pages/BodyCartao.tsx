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

// Interface para o tipo Cartao
interface Cartao {
  id: number;
  user_id: string;
  nome: string;
  numero: string;
  tipo: string;
  data_vencimento: string;
  data_fechamento: string;
  data_validade: string;
  limite_total: number;
  limite_disponivel: number;
  cor_icone: string;
}

// Array de ícones para seleção
const icones = [
  'credit-card', 'dollar-sign', 'shopping-cart', 'gift', 'briefcase',
  'airplane', 'car', 'home', 'heart', 'star'
]

export default function BodyCartao() {
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [novoCartao, setNovoCartao] = useState<Partial<Cartao>>({});
  const [editando, setEditando] = useState<number | null>(null);
  const [mostrarBusca, setMostrarBusca] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      carregarCartoes();
    }
  }, [user]);

  useEffect(() => {
    if (mostrarBusca && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [mostrarBusca]);

  // Função para carregar os cartões do usuário
  const carregarCartoes = async () => {
    try {
      const { data, error } = await supabase
        .from('tbcartao')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCartoes(data || []);
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cartões. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para adicionar um novo cartão
  const adicionarCartao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('tbcartao')
        .insert({ ...novoCartao, user_id: user?.id });

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Novo cartão adicionado com sucesso!",
      });
      setNovoCartao({});
      carregarCartoes();
    } catch (error) {
      console.error('Erro ao adicionar cartão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cartão. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para atualizar um cartão
  const atualizarCartao = async (cartaoAtualizado: Partial<Cartao>) => {
    try {
      const { error } = await supabase
        .from('tbcartao')
        .update(cartaoAtualizado)
        .eq('id', cartaoAtualizado.id)
        .eq('user_id', user?.id);

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Cartão atualizado com sucesso!",
      });
      setEditando(null);
      carregarCartoes();
    } catch (error) {
      console.error('Erro ao atualizar cartão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cartão. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para excluir um cartão
  const excluirCartao = async (id: number) => {
    try {
      const { error } = await supabase
        .from('tbcartao')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Cartão excluído com sucesso!",
      });
      carregarCartoes();
    } catch (error) {
      console.error('Erro ao excluir cartão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cartão. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para filtrar os cartões
  const cartoesFiltrados = cartoes.filter(cartao =>
    cartao.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    cartao.numero.includes(termoBusca) ||
    cartao.tipo.toLowerCase().includes(termoBusca.toLowerCase())
  );

  // Função para lidar com mudanças nos campos de edição
  const handleEditChange = (id: number, field: keyof Cartao, value: any) => {
    setCartoes(cartoes.map(cartao =>
      cartao.id === id ? { ...cartao, [field]: value } : cartao
    ));
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciar Cartões</CardTitle>
          <div className="flex items-center">
            {mostrarBusca && (
              <Input
                ref={searchInputRef}
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Buscar cartões..."
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
          <form onSubmit={adicionarCartao} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">Nome do Cartão</Label>
                <Input
                  id="nome"
                  type="text"
                  value={novoCartao.nome || ''}
                  onChange={(e) => setNovoCartao({ ...novoCartao, nome: e.target.value })}
                  placeholder="Nome do novo cartão"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero" className="text-sm font-medium">Número do Cartão</Label>
                <Input
                  id="numero"
                  type="text"
                  value={novoCartao.numero || ''}
                  onChange={(e) => setNovoCartao({ ...novoCartao, numero: e.target.value })}
                  placeholder="Número do cartão"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-sm font-medium">Tipo do Cartão</Label>
                <Select
                  value={novoCartao.tipo || ''}
                  onValueChange={(value) => setNovoCartao({ ...novoCartao, tipo: value })}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Crédito">Crédito</SelectItem>
                    <SelectItem value="Débito">Débito</SelectItem>
                    <SelectItem value="Múltiplo">Múltiplo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_vencimento" className="text-sm font-medium">Data de Vencimento</Label>
                <Input
                  id="data_vencimento"
                  type="date"
                  value={novoCartao.data_vencimento || ''}
                  onChange={(e) => setNovoCartao({ ...novoCartao, data_vencimento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_fechamento" className="text-sm font-medium">Data de Fechamento</Label>
                <Input
                  id="data_fechamento"
                  type="date"
                  value={novoCartao.data_fechamento || ''}
                  onChange={(e) => setNovoCartao({ ...novoCartao, data_fechamento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_validade" className="text-sm font-medium">Data de Validade</Label>
                <Input
                  id="data_validade"
                  type="date"
                  value={novoCartao.data_validade || ''}
                  onChange={(e) => setNovoCartao({ ...novoCartao, data_validade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limite_total" className="text-sm font-medium">Limite Total</Label>
                <Input
                  id="limite_total"
                  type="number"
                  value={novoCartao.limite_total || ''}
                  onChange={(e) => setNovoCartao({ ...novoCartao, limite_total: parseFloat(e.target.value) })}
                  placeholder="Limite total do cartão"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limite_disponivel" className="text-sm font-medium">Limite Disponível</Label>
                <Input
                  id="limite_disponivel"
                  type="number"
                  value={novoCartao.limite_disponivel || ''}
                  onChange={(e) => setNovoCartao({ ...novoCartao, limite_disponivel: parseFloat(e.target.value) })}
                  placeholder="Limite disponível"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cor_icone" className="text-sm font-medium">Ícone do Cartão</Label>
                <Select
                  value={novoCartao.cor_icone || ''}
                  onValueChange={(value) => setNovoCartao({ ...novoCartao, cor_icone: value })}
                >
                  <SelectTrigger id="cor_icone">
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    {icones.map((icone) => (
                      <SelectItem key={icone} value={icone}>{icone}</SelectItem>
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
                <TableHead>Nome do Cartão</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Limite Total</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartoesFiltrados.map((cartao) => (
                <>
                  <TableRow key={cartao.id}>
                    <TableCell>{cartao.nome}</TableCell>
                    <TableCell>{cartao.numero}</TableCell>
                    <TableCell>{cartao.tipo}</TableCell>
                    <TableCell>{cartao.limite_total}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditando(editando === cartao.id ? null : cartao.id)}
                        >
                          {editando === cartao.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button
                          
                          size="sm"
                          variant="ghost"
                          onClick={() => excluirCartao(cartao.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {editando === cartao.id && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          atualizarCartao(cartao);
                        }} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`nome-${cartao.id}`} className="text-sm font-medium">Nome do Cartão</Label>
                              <Input
                                id={`nome-${cartao.id}`}
                                type="text"
                                value={cartao.nome}
                                onChange={(e) => handleEditChange(cartao.id, 'nome', e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`numero-${cartao.id}`} className="text-sm font-medium">Número do Cartão</Label>
                              <Input
                                id={`numero-${cartao.id}`}
                                type="text"
                                value={cartao.numero}
                                onChange={(e) => handleEditChange(cartao.id, 'numero', e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`tipo-${cartao.id}`} className="text-sm font-medium">Tipo do Cartão</Label>
                              <Select
                                value={cartao.tipo}
                                onValueChange={(value) => handleEditChange(cartao.id, 'tipo', value)}
                              >
                                <SelectTrigger id={`tipo-${cartao.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Crédito">Crédito</SelectItem>
                                  <SelectItem value="Débito">Débito</SelectItem>
                                  <SelectItem value="Múltiplo">Múltiplo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`data_vencimento-${cartao.id}`} className="text-sm font-medium">Data de Vencimento</Label>
                              <Input
                                id={`data_vencimento-${cartao.id}`}
                                type="date"
                                value={cartao.data_vencimento}
                                onChange={(e) => handleEditChange(cartao.id, 'data_vencimento', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`data_fechamento-${cartao.id}`} className="text-sm font-medium">Data de Fechamento</Label>
                              <Input
                                id={`data_fechamento-${cartao.id}`}
                                type="date"
                                value={cartao.data_fechamento}
                                onChange={(e) => handleEditChange(cartao.id, 'data_fechamento', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`data_validade-${cartao.id}`} className="text-sm font-medium">Data de Validade</Label>
                              <Input
                                id={`data_validade-${cartao.id}`}
                                type="date"
                                value={cartao.data_validade}
                                onChange={(e) => handleEditChange(cartao.id, 'data_validade', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`limite_total-${cartao.id}`} className="text-sm font-medium">Limite Total</Label>
                              <Input
                                id={`limite_total-${cartao.id}`}
                                type="number"
                                value={cartao.limite_total}
                                onChange={(e) => handleEditChange(cartao.id, 'limite_total', parseFloat(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`limite_disponivel-${cartao.id}`} className="text-sm font-medium">Limite Disponível</Label>
                              <Input
                                id={`limite_disponivel-${cartao.id}`}
                                type="number"
                                value={cartao.limite_disponivel}
                                onChange={(e) => handleEditChange(cartao.id, 'limite_disponivel', parseFloat(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`cor_icone-${cartao.id}`} className="text-sm font-medium">Ícone do Cartão</Label>
                              <Select
                                value={cartao.cor_icone}
                                onValueChange={(value) => handleEditChange(cartao.id, 'cor_icone', value)}
                              >
                                <SelectTrigger id={`cor_icone-${cartao.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {icones.map((icone) => (
                                    <SelectItem key={icone} value={icone}>{icone}</SelectItem>
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
  );
}