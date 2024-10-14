'use client'

import React, { useState, useEffect, useRef } from 'react'
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

// Interface para o tipo Transacao
interface Transacao {
  id: number;
  user_id: string;
  tipo_transacao: 'Receita' | 'Despesa' | 'Transferência';
  valor: number;
  titulo: string;
  data_transacao: string;
  categoria_id: number;
  conta_id?: number;
  cartao_id?: number;
  tag_id?: number;
  tipo_lancamento: 'Único' | 'Recorrente' | 'Parcelado';
  qtd_parcela?: number;
}

// Interface para as opções de dropdown
interface DropdownOption {
  id: number;
  nome: string;
}

export default function BodyTransacao() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [novaTransacao, setNovaTransacao] = useState<Partial<Transacao>>({
    tipo_transacao: 'Despesa',
    tipo_lancamento: 'Único',
    data_transacao: new Date().toISOString().split('T')[0],
  });
  const [editando, setEditando] = useState<number | null>(null);
  const [mostrarBusca, setMostrarBusca] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [categorias, setCategorias] = useState<DropdownOption[]>([]);
  const [contas, setContas] = useState<DropdownOption[]>([]);
  const [cartoes, setCartoes] = useState<DropdownOption[]>([]);
  const [tags, setTags] = useState<DropdownOption[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      carregarTransacoes();
      carregarOpcoes();
    }
  }, [user]);

  useEffect(() => {
    if (mostrarBusca && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [mostrarBusca]);

  // Função para carregar as transações do usuário
  const carregarTransacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('tbtransacao')
        .select('*')
        .eq('user_id', user?.id)
        .order('data_transacao', { ascending: false });

      if (error) throw error;
      setTransacoes(data || []);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as transações. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para carregar opções de dropdown
  const carregarOpcoes = async () => {
    try {
      const [categoriaData, contaData, cartaoData, tagData] = await Promise.all([
        supabase.from('tbcategoria').select('id, nome'),
        supabase.from('tbconta').select('id, nome'),
        supabase.from('tbcartao').select('id, nome'),
        supabase.from('tbtag').select('id, nome')
      ]);

      if (categoriaData.error) throw categoriaData.error;
      if (contaData.error) throw contaData.error;
      if (cartaoData.error) throw cartaoData.error;
      if (tagData.error) throw tagData.error;

      setCategorias(categoriaData.data || []);
      setContas(contaData.data || []);
      setCartoes(cartaoData.data || []);
      setTags(tagData.data || []);
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as opções. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para adicionar uma nova transação
  const adicionarTransacao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('tbtransacao')
        .insert({ ...novaTransacao, user_id: user?.id });

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Nova transação adicionada com sucesso!",
      });
      setNovaTransacao({
        tipo_transacao: 'Despesa',
        tipo_lancamento: 'Único',
        data_transacao: new Date().toISOString().split('T')[0],
      });
      carregarTransacoes();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a transação. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para atualizar uma transação
  const atualizarTransacao = async (transacaoAtualizada: Partial<Transacao>) => {
    try {
      const { error } = await supabase
        .from('tbtransacao')
        .update(transacaoAtualizada)
        .eq('id', transacaoAtualizada.id)
        .eq('user_id', user?.id);

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Transação atualizada com sucesso!",
      });
      setEditando(null);
      carregarTransacoes();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a transação. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para excluir uma transação
  const excluirTransacao = async (id: number) => {
    try {
      const { error } = await supabase
        .from('tbtransacao')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Transação excluída com sucesso!",
      });
      carregarTransacoes();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a transação. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para filtrar as transações
  const transacoesFiltradas = transacoes.filter(transacao =>
    transacao.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
    transacao.tipo_transacao.toLowerCase().includes(termoBusca.toLowerCase()) ||
    transacao.valor.toString().includes(termoBusca)
  );

  // Função para lidar com mudanças nos campos de edição
  const handleEditChange = (id: number, field: keyof Transacao, value: any) => {
    setTransacoes(transacoes.map(transacao =>
      transacao.id === id ? { ...transacao, [field]: value } : transacao
    ));
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciar Transações</CardTitle>
          <div className="flex items-center">
            {mostrarBusca && (
              <Input
                ref={searchInputRef}
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Buscar transações..."
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
          <form onSubmit={adicionarTransacao} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_transacao" className="text-sm font-medium">Tipo de Transação</Label>
                <Select
                  value={novaTransacao.tipo_transacao}
                  onValueChange={(value) => setNovaTransacao({ ...novaTransacao, tipo_transacao: value as Transacao['tipo_transacao'] })}
                >
                  <SelectTrigger id="tipo_transacao">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Receita">Receita</SelectItem>
                    <SelectItem value="Despesa">Despesa</SelectItem>
                    <SelectItem value="Transferência">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor" className="text-sm font-medium">Valor</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={novaTransacao.valor || ''}
                  onChange={(e) => setNovaTransacao({ ...novaTransacao, valor: parseFloat(e.target.value) })}
                  placeholder="Valor da transação"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-sm font-medium">Título</Label>
                <Input
                  id="titulo"
                  type="text"
                  value={novaTransacao.titulo || ''}
                  onChange={(e) => setNovaTransacao({ ...novaTransacao, titulo: e.target.value })}
                  placeholder="Título da transação"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_transacao" className="text-sm font-medium">Data da Transação</Label>
                <Input
                  id="data_transacao"
                  type="date"
                  value={novaTransacao.data_transacao}
                  onChange={(e) => setNovaTransacao({ ...novaTransacao, data_transacao: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria_id" className="text-sm font-medium">Categoria</Label>
                <Select
                  value={novaTransacao.categoria_id?.toString()}
                  onValueChange={(value) => setNovaTransacao({ ...novaTransacao, categoria_id: parseInt(value) })}
                >
                  <SelectTrigger id="categoria_id">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id.toString()}>{categoria.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="conta_id" className="text-sm font-medium">Conta</Label>
                <Select
                  value={novaTransacao.conta_id?.toString()}
                  onValueChange={(value) => setNovaTransacao({ ...novaTransacao, conta_id: parseInt(value) })}
                >
                  <SelectTrigger id="conta_id">
                    <SelectValue placeholder="Selecione a conta" />
                  </SelectTrigger>
                  <SelectContent>
                    {contas.map((conta) => (
                      <SelectItem key={conta.id} value={conta.id.toString()}>{conta.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cartao_id" className="text-sm font-medium">Cartão</Label>
                
                <Select
                  value={novaTransacao.cartao_id?.toString()}
                  onValueChange={(value) => setNovaTransacao({ ...novaTransacao, cartao_id: parseInt(value) })}
                >
                  <SelectTrigger id="cartao_id">
                    <SelectValue placeholder="Selecione o cartão" />
                  </SelectTrigger>
                  <SelectContent>
                    {cartoes.map((cartao) => (
                      <SelectItem key={cartao.id} value={cartao.id.toString()}>{cartao.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag_id" className="text-sm font-medium">Tag</Label>
                <Select
                  value={novaTransacao.tag_id?.toString()}
                  onValueChange={(value) => setNovaTransacao({ ...novaTransacao, tag_id: parseInt(value) })}
                >
                  <SelectTrigger id="tag_id">
                    <SelectValue placeholder="Selecione a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id.toString()}>{tag.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_lancamento" className="text-sm font-medium">Tipo de Lançamento</Label>
                <Select
                  value={novaTransacao.tipo_lancamento}
                  onValueChange={(value) => setNovaTransacao({ ...novaTransacao, tipo_lancamento: value as Transacao['tipo_lancamento'] })}
                >
                  <SelectTrigger id="tipo_lancamento">
                    <SelectValue placeholder="Selecione o tipo de lançamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Único">Único</SelectItem>
                    <SelectItem value="Recorrente">Recorrente</SelectItem>
                    <SelectItem value="Parcelado">Parcelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {novaTransacao.tipo_lancamento === 'Parcelado' && (
                <div className="space-y-2">
                  <Label htmlFor="qtd_parcela" className="text-sm font-medium">Quantidade de Parcelas</Label>
                  <Input
                    id="qtd_parcela"
                    type="number"
                    value={novaTransacao.qtd_parcela || ''}
                    onChange={(e) => setNovaTransacao({ ...novaTransacao, qtd_parcela: parseInt(e.target.value) })}
                    placeholder="Número de parcelas"
                    required
                  />
                </div>
              )}
            </div>
            <Button type="submit">Adicionar Transação</Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoesFiltradas.map((transacao) => (
                <React.Fragment key={transacao.id}>
                  <TableRow>
                    <TableCell>{transacao.titulo}</TableCell>
                    <TableCell>{transacao.tipo_transacao}</TableCell>
                    <TableCell>{transacao.valor.toFixed(2)}</TableCell>
                    <TableCell>{new Date(transacao.data_transacao).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditando(editando === transacao.id ? null : transacao.id)}
                        >
                          {editando === transacao.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => excluirTransacao(transacao.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {editando === transacao.id && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          atualizarTransacao(transacao);
                        }} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`tipo_transacao-${transacao.id}`} className="text-sm font-medium">Tipo de Transação</Label>
                              <Select
                                value={transacao.tipo_transacao}
                                onValueChange={(value) => handleEditChange(transacao.id, 'tipo_transacao', value)}
                              >
                                <SelectTrigger id={`tipo_transacao-${transacao.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Receita">Receita</SelectItem>
                                  <SelectItem value="Despesa">Despesa</SelectItem>
                                  <SelectItem value="Transferência">Transferência</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`valor-${transacao.id}`} className="text-sm font-medium">Valor</Label>
                              <Input
                                id={`valor-${transacao.id}`}
                                type="number"
                                step="0.01"
                                value={transacao.valor}
                                onChange={(e) => handleEditChange(transacao.id, 'valor', parseFloat(e.target.value))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`titulo-${transacao.id}`} className="text-sm font-medium">Título</Label>
                              <Input
                                id={`titulo-${transacao.id}`}
                                type="text"
                                value={transacao.titulo}
                                onChange={(e) => handleEditChange(transacao.id, 'titulo', e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`data_transacao-${transacao.id}`} className="text-sm font-medium">Data da Transação</Label>
                              <Input
                                id={`data_transacao-${transacao.id}`}
                                type="date"
                                value={transacao.data_transacao}
                                onChange={(e) => handleEditChange(transacao.id, 'data_transacao', e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`categoria_id-${transacao.id}`} className="text-sm font-medium">Categoria</Label>
                              <Select
                                value={transacao.categoria_id.toString()}
                                onValueChange={(value) => handleEditChange(transacao.id, 'categoria_id', parseInt(value))}
                              >
                                <SelectTrigger id={`categoria_id-${transacao.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {categorias.map((categoria) => (
                                    <SelectItem key={categoria.id} value={categoria.id.toString()}>{categoria.nome}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`conta_id-${transacao.id}`} className="text-sm font-medium">Conta</Label>
                              <Select
                                value={transacao.conta_id?.toString()}
                                onValueChange={(value) => handleEditChange(transacao.id, 'conta_id', value ? parseInt(value) : undefined)}
                              >
                                <SelectTrigger id={`conta_id-${transacao.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {contas.map((conta) => (
                                    <SelectItem key={conta.id} value={conta.id.toString()}>{conta.nome}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`cartao_id-${transacao.id}`} className="text-sm font-medium">Cartão</Label>
                              <Select
                                value={transacao.cartao_id?.toString()}
                                onValueChange={(value) => handleEditChange(transacao.id, 'cartao_id', value ? parseInt(value) : undefined)}
                              >
                                <SelectTrigger id={`cartao_id-${transacao.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {cartoes.map((cartao) => (
                                    <SelectItem key={cartao.id} value={cartao.id.toString()}>{cartao.nome}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`tag_id-${transacao.id}`} className="text-sm font-medium">Tag</Label>
                              <Select
                                value={transacao.tag_id?.toString()}
                                onValueChange={(value) => handleEditChange(transacao.id, 'tag_id', value ? parseInt(value) : undefined)}
                              >
                                <SelectTrigger id={`tag_id-${transacao.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {tags.map((tag) => (
                                    <SelectItem key={tag.id} value={tag.id.toString()}>{tag.nome}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`tipo_lancamento-${transacao.id}`} className="text-sm font-medium">Tipo de Lançamento</Label>
                              <Select
                                value={transacao.tipo_lancamento}
                                onValueChange={(value) => handleEditChange(transacao.id, 'tipo_lancamento', value)}
                              >
                                <SelectTrigger id={`tipo_lancamento-${transacao.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Único">Único</SelectItem>
                                  <SelectItem value="Recorrente">Recorrente</SelectItem>
                                  <SelectItem value="Parcelado">Parcelado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {transacao.tipo_lancamento === 'Parcelado' && (
                              <div className="space-y-2">
                                <Label htmlFor={`qtd_parcela-${transacao.id}`} className="text-sm font-medium">Quantidade de Parcelas</Label>
                                <Input
                                  id={`qtd_parcela-${transacao.id}`}
                                  type="number"
                                  value={transacao.qtd_parcela || ''}
                                  onChange={(e) => handleEditChange(transacao.id, 'qtd_parcela', parseInt(e.target.value))}
                                  required
                                />
                              </div>
                            )}
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
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Toaster />
    </>
  );
}