'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { createClient } from '@supabase/supabase-js'
import debounce from 'lodash/debounce'

// Configuração do cliente Supabase
const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function BodyPersonalPage() {
  // Estado para armazenar os dados do usuário
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    genero: '',
    profissao: '',
    rendaMensal: '',
    estadoCivil: '',
    escolaridade: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pessoasNaCasa: '',
    televisores: '',
    possuiFilhos: '',
    numeroFilhos: '',
    estaEmpregado: '',
    hobbies: '',
    estiloVida: '',
    frequenciaCompras: '',
    preferenciaCompras: '',
    gastosMediaMensal: '',
  })

  // Estado para armazenar erros de validação
  const [errors, setErrors] = useState({})

  // Efeito para carregar os dados do usuário ao montar o componente
  useEffect(() => {
    carregarDadosUsuario()
  }, [])

  // Função para carregar os dados do usuário do Supabase
  const carregarDadosUsuario = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        if (data) {
          setUserData(prevData => ({
            ...prevData,
            ...data,
            nome: user.user_metadata.full_name || data.nome,
            email: user.email || data.email
          }))
        } else {
          // Se não houver dados, preencha pelo menos o nome e e-mail
          setUserData(prevData => ({
            ...prevData,
            nome: user.user_metadata.full_name || '',
            email: user.email || ''
          }))
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus dados. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  // Função para salvar dados com debounce para evitar chamadas excessivas
  const salvarDados = useCallback(debounce(async (campo, valor) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('usuarios')
        .upsert({ id: user.id, [campo]: valor })

      if (error) throw error

      toast({
        title: "Salvo",
        description: "Dados atualizados com sucesso.",
        duration: 2000,
      })
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar os dados. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }, 1000), [])

  // Função para validar campos
  const validateField = (name, value) => {
    let error = null
    switch (name) {
      case 'telefone':
        if (!/^\d{10,11}$/.test(value)) {
          error = 'Telefone inválido. Use apenas números (10 ou 11 dígitos).'
        }
        break
      case 'cep':
        if (!/^\d{8}$/.test(value)) {
          error = 'CEP inválido. Use apenas números (8 dígitos).'
        }
        break
      // Adicione mais validações conforme necessário
    }
    setErrors(prev => ({ ...prev, [name]: error }))
    return !error
  }

  // Função para lidar com mudanças nos inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
    if (validateField(name, value)) {
      salvarDados(name, value)
    }
  }

  // Função para lidar com mudanças nos selects
  const handleSelectChange = (name, value) => {
    setUserData(prev => ({ ...prev, [name]: value }))
    if (validateField(name, value)) {
      salvarDados(name, value)
    }
  }

  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCEP = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      if (!data.erro) {
        setUserData(prev => ({
          ...prev,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }))
        salvarDados('endereco', data.logradouro)
        salvarDados('bairro', data.bairro)
        salvarDados('cidade', data.localidade)
        salvarDados('estado', data.uf)
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dados Pessoais</h1>
      
      <div className="space-y-8">
        {/* Bloco de Informações Pessoais */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" name="nome" value={userData.nome} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input id="email" name="email" type="email" value={userData.email} readOnly className="bg-gray-100" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Para alterar o e-mail, é necessário criar uma nova conta.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input 
                id="telefone" 
                name="telefone" 
                value={userData.telefone} 
                onChange={handleInputChange} 
                placeholder="Ex: 11987654321"
              />
              {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
            </div>
            <div>
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input id="dataNascimento" name="dataNascimento" type="date" value={userData.dataNascimento} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="genero">Gênero</Label>
              <Select name="genero" value={userData.genero} onValueChange={(value) => handleSelectChange('genero', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                  <SelectItem value="prefiro-nao-dizer">Prefiro não dizer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Bloco de Endereço */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input 
                id="cep" 
                name="cep" 
                value={userData.cep} 
                onChange={(e) => {
                  handleInputChange(e)
                  if (e.target.value.length === 8) {
                    buscarEnderecoPorCEP(e.target.value)
                  }
                }}
                placeholder="Ex: 12345678"
              />
              {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
            </div>
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" name="endereco" value={userData.endereco} onChange={handleInputChange} placeholder="Ex: Rua das Flores" />
            </div>
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" name="numero" value={userData.numero} onChange={handleInputChange} placeholder="Ex: 123" />
            </div>
            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" name="complemento" value={userData.complemento} onChange={handleInputChange} placeholder="Ex: Apto 101" />
            </div>
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" name="bairro" value={userData.bairro} onChange={handleInputChange} placeholder="Ex: Centro" />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" name="cidade" value={userData.cidade} onChange={handleInputChange} placeholder="Ex: São Paulo" />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input id="estado" name="estado" value={userData.estado} onChange={handleInputChange} placeholder="Ex: SP" />
            </div>
          </div>
        </div>

        {/* Bloco de Informações Socioeconômicas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informações Socioeconômicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profissao">Profissão</Label>
              <Input id="profissao" name="profissao" value={userData.profissao} onChange={handleInputChange} placeholder="Ex: Engenheiro, Professor, Médico" />
            </div>
            <div>
              <Label htmlFor="rendaMensal">Renda Mensal</Label>
              <Select name="rendaMensal" value={userData.rendaMensal} onValueChange={(value) => handleSelectChange('rendaMensal', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ate-2000">Até R$ 2.000</SelectItem>
                  <SelectItem value="2001-5000">R$ 2.001 a R$ 5.000</SelectItem>
                  <SelectItem value="5001-10000">R$ 5.001 a R$ 10.000</SelectItem>
                  <SelectItem value="acima-10000">Acima de R$ 10.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="estadoCivil">Estado Civil</Label>
              <Select name="estadoCivil" value={userData.estadoCivil} onValueChange={(value) => handleSelectChange('estadoCivil', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                  <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                  <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="escolaridade">Escolaridade</Label>
              <Select name="escolaridade" value={userData.escolaridade} onValueChange={(value) => handleSelectChange('escolaridade', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                  <SelectItem value="medio">Ensino Médio</SelectItem>
                  <SelectItem value="superior">Ensino Superior</SelectItem>
                  <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pessoasNaCasa">Quantas pessoas moram na sua casa?</Label>
              <Select name="pessoasNaCasa" value={userData.pessoasNaCasa} onValueChange={(value) => handleSelectChange('pessoasNaCasa', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, '10+'].map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="televisores">Quantos televisores possui em casa?</Label>
              <Select name="televisores" value={userData.televisores} onValueChange={(value) => handleSelectChange('televisores', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, '5+'].map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Possui filhos?</Label>
              <RadioGroup name="possuiFilhos" value={userData.possuiFilhos} onValueChange={(value) => handleSelectChange('possuiFilhos', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="filhos-sim" />
                  <Label htmlFor="filhos-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="filhos-nao" />
                  <Label htmlFor="filhos-nao">Não</Label>
                </div>
              </RadioGroup>
            </div>
            {userData.possuiFilhos === 'sim' && (
              <div>
                <Label htmlFor="numeroFilhos">Quantos filhos?</Label>
                <Select name="numeroFilhos" value={userData.numeroFilhos} onValueChange={(value) => handleSelectChange('numeroFilhos', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, '6+'].map((num) => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Está empregado?</Label>
              <RadioGroup name="estaEmpregado" value={userData.estaEmpregado} onValueChange={(value) => handleSelectChange('estaEmpregado', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="empregado-sim" />
                  <Label htmlFor="empregado-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="empregado-nao" />
                  <Label htmlFor="empregado-nao">Não</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Bloco de Estilo de Vida e Hábitos de Consumo */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Estilo de Vida e Hábitos de Consumo</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="hobbies">Hobbies (separe por vírgulas)</Label>
              <Input id="hobbies" name="hobbies" value={userData.hobbies} onChange={handleInputChange} placeholder="Ex: leitura, esportes, viagens" />
            </div>
            <div>
              <Label htmlFor="estiloVida">Descreva seu estilo de vida</Label>
              <Textarea id="estiloVida" name="estiloVida" value={userData.estiloVida} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="frequenciaCompras">Com que frequência você faz compras online?</Label>
              <Select name="frequenciaCompras" value={userData.frequenciaCompras} onValueChange={(value) => handleSelectChange('frequenciaCompras', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diariamente">Diariamente</SelectItem>
                  <SelectItem value="semanalmente">Semanalmente</SelectItem>
                  <SelectItem value="mensalmente">Mensalmente</SelectItem>
                  <SelectItem value="raramente">Raramente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="preferenciaCompras">Quais são suas preferências de compra?</Label>
              <Textarea id="preferenciaCompras" name="preferenciaCompras" value={userData.preferenciaCompras} onChange={handleInputChange} placeholder="Ex: roupas, eletrônicos, livros, produtos para casa" />
            </div>
            <div>
              <Label htmlFor="gastosMediaMensal">Qual é a sua média de gastos mensais com compras não essenciais?</Label>
              <Select name="gastosMediaMensal" value={userData.gastosMediaMensal} onValueChange={(value) => handleSelectChange('gastosMediaMensal', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ate-100">Até R$ 100</SelectItem>
                  <SelectItem value="101-500">R$ 101 a R$ 500</SelectItem>
                  <SelectItem value="501-1000">R$ 501 a R$ 1.000</SelectItem>
                  <SelectItem value="acima-1000">Acima de R$ 1.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}