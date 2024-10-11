// BodyCartaoItem.tsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

// Configuração do Supabase
const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interfaces
interface CartaoItem {
  id: number;
  user_id: string;
  cartao_id: number;
  descricao: string;
  data_transacao: string;
  valor: number;
  parcelamento: boolean;
  qtd_parcela: number;
  categoria_id: number;
  tag_id: number;
  cor_icone: string;
}

interface Categoria {
  id: number;
  nome: string;
  padrao: boolean;
}

interface Tag {
  id: number;
  nome: string;
}

interface BodyCartaoItemProps {
  cartaoId: number;
}

const BodyCartaoItem: React.FC<BodyCartaoItemProps> = ({ cartaoId }) => {
  const [itens, setItens] = useState<CartaoItem[]>([]);
  const [novoItem, setNovoItem] = useState<Partial<CartaoItem>>({});
  const [expandido, setExpandido] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [novaTag, setNovaTag] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      carregarItens();
      carregarCategorias();
      carregarTags();
    }
  }, [user, cartaoId]);

  // Função para carregar os itens do cartão
  const carregarItens = async () => {
    try {
      const { data, error } = await supabase
        .from('cartao_item')
        .select('*')
        .eq('user_id', user?.id)
        .eq('cartao_id', cartaoId)
        .order('data_transacao', { ascending: false });

      if (error) throw error;
      setItens(data || []);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os itens. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para carregar as categorias
  const carregarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('categoria')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para carregar as tags
  const carregarTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tag')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tags. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para salvar ou atualizar um item
  const salvarItem = async (item: Partial<CartaoItem>) => {
    try {
      if (item.id) {
        // Atualizar item existente
        const { error } = await supabase
          .from('cartao_item')
          .update(item)
          .eq('id', item.id);
        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Item atualizado com sucesso!",
        });
      } else {
        // Criar novo item
        const { error } = await supabase
          .from('cartao_item')
          .insert({ ...item, user_id: user?.id, cartao_id: cartaoId });
        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Novo item adicionado com sucesso!",
        });
      }
      carregarItens();
      setNovoItem({});
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o item. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para excluir um item
  const excluirItem = async (id: number) => {
    try {
      const { error } = await supabase
        .from('cartao_item')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Item excluído com sucesso!",
      });
      carregarItens();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o item. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para adicionar nova categoria
  const adicionarCategoria = async () => {
    try {
      const { data, error } = await supabase
        .from('categoria')
        .insert({ nome: novaCategoria, padrao: false })
        .select();
      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Nova categoria adicionada com sucesso!",
      });
      carregarCategorias();
      setNovaCategoria('');
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a categoria. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para adicionar nova tag
  const adicionarTag = async () => {
    try {
      const { data, error } = await supabase
        .from('tag')
        .insert({ nome: novaTag })
        .select();
      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Nova tag adicionada com sucesso!",
      });
      carregarTags();
      setNovaTag('');
    } catch (error) {
      console.error('Erro ao adicionar tag:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a tag. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, item: Partial<CartaoItem>) => {
    const { name, value, type } = e.target;
    const updatedValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const updatedItem = { ...item, [name]: updatedValue };
    if (item.id) {
      // Atualizar item existente
      const updatedItens = itens.map(i => i.id === item.id ? updatedItem : i);
      setItens(updatedItens);
      salvarItem(updatedItem);
    } else {
      // Novo item
      setNovoItem(updatedItem);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Itens do Cartão</h1>
      
      {/* Formulário para adicionar novo item */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Adicionar Novo Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            salvarItem(novoItem);
          }} className="space-y-4">
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                name="descricao"
                value={novoItem.descricao || ''}
                onChange={(e) => handleChange(e, novoItem)}
                required
              />
            </div>
            <div>
              <Label htmlFor="data_transacao">Data da Transação</Label>
              <Input
                id="data_transacao"
                name="data_transacao"
                type="date"
                value={novoItem.data_transacao || ''}
                onChange={(e) => handleChange(e, novoItem)}
                required
              />
            </div>
            <div>
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                step="0.01"
                value={novoItem.valor || ''}
                onChange={(e) => handleChange(e, novoItem)}
                required
              />
            </div>
            <Button type="submit">Adicionar Item</Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de itens */}
      {itens.map((item) => (
        <Card key={item.id} className="mb-4">
          <CardHeader>
            <CardTitle>{item.descricao}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p>Data: {new Date(item.data_transacao).toLocaleDateString()}</p>
                <p>Valor: R$ {item.valor.toFixed(2)}</p>
              </div>
              <div>
                <Button onClick={() => setExpandido(expandido === item.id ? null : item.id)}>
                  {expandido === item.id ? 'Menos Detalhes' : 'Mais Detalhes'}
                </Button>
                <Button variant="destructive" onClick={() => excluirItem(item.id)} className="ml-2">Excluir</Button>
              </div>
            </div>
            {expandido === item.id && (
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor={`parcelamento-${item.id}`}>Parcelamento</Label>
                  <Switch
                    id={`parcelamento-${item.id}`}
                    name="parcelamento"
                    checked={item.parcelamento}
                    onCheckedChange={(checked) => handleChange({ target: { name: 'parcelamento', value: checked, type: 'checkbox' } } as any, item)}
                  />
                </div>
                {item.parcelamento && (
                  <div>
                    <Label htmlFor={`qtd_parcela-${item.id}`}>Quantidade de Parcelas</Label>
                    <Input
                      id={`qtd_parcela-${item.id}`}
                      name="qtd_parcela"
                      type="number"
                      value={item.qtd_parcela || ''}
                      onChange={(e) => handleChange(e, item)}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor={`categoria-${item.id}`}>Categoria</Label>
                  <Select
                    value={item.categoria_id?.toString() || ''}
                    onValueChange={(value) => handleChange({ target: { name: 'categoria_id', value } } as any, item)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id.toString()}>
                          {categoria.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`tag-${item.id}`}>Tag</Label>
                  <Select
                    value={item.tag_id?.toString() || ''}
                    onValueChange={(value) => handleChange({ target: { name: 'tag_id', value } } as any, item)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id.toString()}>
                          {tag.nome}
                        </SelectItem>
                      
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`cor_icone-${item.id}`}>Cor do Ícone</Label>
                  <Input
                    id={`cor_icone-${item.id}`}
                    name="cor_icone"
                    type="color"
                    value={item.cor_icone || '#000000'}
                    onChange={(e) => handleChange(e, item)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Modal para adicionar nova categoria */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Adicionar Nova Categoria</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome da categoria"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
            />
            <Button onClick={adicionarCategoria}>Adicionar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para adicionar nova tag */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="ml-2">Adicionar Nova Tag</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome da tag"
              value={novaTag}
              onChange={(e) => setNovaTag(e.target.value)}
            />
            <Button onClick={adicionarTag}>Adicionar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BodyCartaoItem;