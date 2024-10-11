// BodyCartao.tsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Configuração do Supabase
const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko';
const supabase = createClient(supabaseUrl, supabaseKey);

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

export default function BodyCartao() {
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [novoCartao, setNovoCartao] = useState<Partial<Cartao>>({});
  const [expandido, setExpandido] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      carregarCartoes();
    }
  }, [user]);

  // Função para carregar os cartões do usuário
  const carregarCartoes = async () => {
    try {
      const { data, error } = await supabase
        .from('cartoes')
        .select('*')
        .eq('user_id', user?.id)
        .order('id', { ascending: true });

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

  // Função para salvar ou atualizar um cartão
  const salvarCartao = async (cartao: Partial<Cartao>) => {
    try {
      if (cartao.id) {
        // Atualizar cartão existente
        const { error } = await supabase
          .from('cartoes')
          .update(cartao)
          .eq('id', cartao.id);
        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Cartão atualizado com sucesso!",
        });
      } else {
        // Criar novo cartão
        const { error } = await supabase
          .from('cartoes')
          .insert({ ...cartao, user_id: user?.id });
        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Novo cartão adicionado com sucesso!",
        });
      }
      carregarCartoes();
      setNovoCartao({});
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o cartão. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para excluir um cartão
  const excluirCartao = async (id: number) => {
    try {
      const { error } = await supabase
        .from('cartoes')
        .delete()
        .eq('id', id);
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

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, cartao: Partial<Cartao>) => {
    const { name, value } = e.target;
    const updatedCartao = { ...cartao, [name]: value };
    if (cartao.id) {
      // Atualizar cartão existente
      const updatedCartoes = cartoes.map(c => c.id === cartao.id ? updatedCartao : c);
      setCartoes(updatedCartoes);
      salvarCartao(updatedCartao);
    } else {
      // Novo cartão
      setNovoCartao(updatedCartao);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Cartões</h1>
      
      {/* Formulário para adicionar novo cartão */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Adicionar Novo Cartão</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            salvarCartao(novoCartao);
          }} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome do Cartão</Label>
              <Input
                id="nome"
                name="nome"
                value={novoCartao.nome || ''}
                onChange={(e) => handleChange(e, novoCartao)}
                required
              />
            </div>
            <Button type="submit">Adicionar Cartão</Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de cartões */}
      {cartoes.map((cartao) => (
        <Card key={cartao.id} className="mb-4">
          <CardHeader>
            <CardTitle>{cartao.nome}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Button onClick={() => setExpandido(expandido === cartao.id ? null : cartao.id)}>
                {expandido === cartao.id ? 'Menos Detalhes' : 'Mais Detalhes'}
              </Button>
              <Button variant="destructive" onClick={() => excluirCartao(cartao.id)}>Excluir</Button>
            </div>
            {expandido === cartao.id && (
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor={`numero-${cartao.id}`}>Número do Cartão</Label>
                  <Input
                    id={`numero-${cartao.id}`}
                    name="numero"
                    value={cartao.numero || ''}
                    onChange={(e) => handleChange(e, cartao)}
                  />
                </div>
                <div>
                  <Label htmlFor={`tipo-${cartao.id}`}>Tipo do Cartão</Label>
                  <Select
                    value={cartao.tipo || ''}
                    onValueChange={(value) => handleChange({ target: { name: 'tipo', value } } as any, cartao)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credito">Crédito</SelectItem>
                      <SelectItem value="debito">Débito</SelectItem>
                      <SelectItem value="multiplo">Múltiplo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`data_vencimento-${cartao.id}`}>Data de Vencimento</Label>
                  <Input
                    id={`data_vencimento-${cartao.id}`}
                    name="data_vencimento"
                    type="date"
                    value={cartao.data_vencimento || ''}
                    onChange={(e) => handleChange(e, cartao)}
                  />
                </div>
                <div>
                  <Label htmlFor={`data_fechamento-${cartao.id}`}>Data de Fechamento</Label>
                  <Input
                    id={`data_fechamento-${cartao.id}`}
                    name="data_fechamento"
                    type="date"
                    value={cartao.data_fechamento || ''}
                    onChange={(e) => handleChange(e, cartao)}
                  />
                </div>
                <div>
                  <Label htmlFor={`data_validade-${cartao.id}`}>Data de Validade</Label>
                  <Input
                    id={`data_validade-${cartao.id}`}
                    name="data_validade"
                    type="date"
                    value={cartao.data_validade || ''}
                    onChange={(e) => handleChange(e, cartao)}
                  />
                </div>
                <div>
                  <Label htmlFor={`limite_total-${cartao.id}`}>Limite Total</Label>
                  <Input
                    id={`limite_total-${cartao.id}`}
                    name="limite_total"
                    type="number"
                    value={cartao.limite_total || ''}
                    onChange={(e) => handleChange(e, cartao)}
                  />
                </div>
                <div>
                  <Label htmlFor={`limite_disponivel-${cartao.id}`}>Limite Disponível</Label>
                  <Input
                    id={`limite_disponivel-${cartao.id}`}
                    name="limite_disponivel"
                    type="number"
                    value={cartao.limite_disponivel || ''}
                    onChange={(e) => handleChange(e, cartao)}
                  />
                </div>
                <div>
                  <Label htmlFor={`cor_icone-${cartao.id}`}>Cor do Ícone</Label>
                  <Input
                    id={`cor_icone-${cartao.id}`}
                    name="cor_icone"
                    type="color"
                    value={cartao.cor_icone || '#000000'}
                    onChange={(e) => handleChange(e, cartao)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}