import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Search, Filter, Download, CalendarIcon, PlusCircle, MinusCircle, CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

// Definição dos textos em português
const t = {
  transactionHistory: "Histórico de Transações",
  searchTransactions: "Buscar transações",
  search: "Buscar",
  filter: "Filtrar",
  export: "Exportar",
  date: "Data",
  description: "Descrição",
  amount: "Valor",
  category: "Categoria",
  itemsPerPage: "Itens por página",
  perPage: "por página",
  startDate: "Data inicial",
  endDate: "Data final",
  selectStartDate: "Selecione a data inicial",
  selectEndDate: "Selecione a data final",
  addTransaction: "Adicionar Transação",
  expense: "Despesa",
  income: "Receita",
  creditCard: "Cartão de Crédito",
  enterDescription: "Digite a descrição",
  enterAmount: "Digite o valor",
  selectCategory: "Selecione a categoria",
  selectDate: "Selecione a data",
  fixedExpense: "Despesa Fixa",
  fixedIncome: "Receita Fixa",
  save: "Salvar",
  home: "Casa",
  food: "Alimentação",
  transport: "Transporte",
  salary: "Salário",
  investment: "Investimento",
  other: "Outro",
  card: "Cartão",
  selectCard: "Selecione o cartão",
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  installments: "Parcelado"
}

export default function BodysysTransactionsPage() {
  // Estados para controle da página
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [transactionType, setTransactionType] = useState('expense')

  // Dados fictícios para demonstração
  const transactions = [
    { id: 1, date: '2023-05-01', description: 'Compras no Supermercado', amount: -50.00, category: 'Alimentação' },
    { id: 2, date: '2023-05-02', description: 'Salário', amount: 3000.00, category: 'Receita' },
    // Adicione mais transações fictícias aqui
  ]

  // Filtragem de transações baseada no termo de busca
  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage)

  // Função para mudar a página atual
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Função para mudar o número de itens por página
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value))
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Card para adicionar nova transação */}
      <Card>
        <CardHeader>
          <CardTitle>{t.addTransaction}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={transactionType} onValueChange={setTransactionType}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="expense">
                <MinusCircle className="w-4 h-4 mr-2" />
                {t.expense}
              </TabsTrigger>
              <TabsTrigger value="income">
                <PlusCircle className="w-4 h-4 mr-2" />
                {t.income}
              </TabsTrigger>
              <TabsTrigger value="creditCard">
                <CreditCard className="w-4 h-4 mr-2" />
                {t.creditCard}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="expense">
              <TransactionForm type="expense" />
            </TabsContent>
            <TabsContent value="income">
              <TransactionForm type="income" />
            </TabsContent>
            <TabsContent value="creditCard">
              <TransactionForm type="creditCard" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Card para exibir o histórico de transações */}
      <Card>
        <CardHeader>
          <CardTitle>{t.transactionHistory}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Barra de pesquisa e filtros */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0 md:space-x-2">
            <div className="flex items-center w-full md:w-auto">
              <Input
                placeholder={t.searchTransactions}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mr-2"
              />
              <Button size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">{t.search}</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              {/* Seletores de data */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>{t.selectStartDate}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>{t.selectEndDate}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {/* Botões de filtro e exportação */}
              <Button size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">{t.filter}</span>
              </Button>
              <Button size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">{t.export}</span>
              </Button>
            </div>
          </div>
          {/* Tabela de transações */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.date}</TableHead>
                  <TableHead>{t.description}</TableHead>
                  <TableHead>{t.amount}</TableHead>
                  <TableHead>{t.category}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}>
                        {transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {/* Controles de paginação */}
          <div className="flex justify-between items-center mt-4">
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t.itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 {t.perPage}</SelectItem>
                <SelectItem value="20">20 {t.perPage}</SelectItem>
                <SelectItem value="50">50 {t.perPage}</SelectItem>
              </SelectContent>
            </Select>
            <Pagination
              currentPage={currentPage}
              totalPages={pageCount}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de formulário para adicionar transações
function TransactionForm({ type }: { type: 'expense' | 'income' | 'creditCard' }) {
  const [date, setDate] = useState<Date>()

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">{t.description}</Label>
          <Input id="description" placeholder={t.enterDescription} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">{t.amount}</Label>
          <Input id="amount" type="number" placeholder={t.enterAmount} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">{t.category}</Label>
          <Select>
            <SelectTrigger id="category">
              <SelectValue placeholder={t.selectCategory} />
            </SelectTrigger>
            <SelectContent>
              {type === 'expense' && (
                <>
                  <SelectItem value="home">{t.home}</SelectItem>
                  <SelectItem value="food">{t.food}</SelectItem>
                  <SelectItem value="transport">{t.transport}</SelectItem>
                </>
              )}
              {type === 'income' && (
                <>
                  <SelectItem value="salary">{t.salary}</SelectItem>
                  <SelectItem value="investment">{t.investment}</SelectItem>
                </>
              )}
              <SelectItem value="other">{t.other}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t.date}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>{t.selectDate}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {type === 'creditCard' && (
        <div className="space-y-2">
          <Label htmlFor="card">{t.card}</Label>
          <Select>
            <SelectTrigger id="card">
              <SelectValue placeholder={t.selectCard} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visa">{t.visa}</SelectItem>
              <SelectItem value="mastercard">{t.mastercard}</SelectItem>
              <SelectItem value="amex">{t.amex}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Switch id="fixed-transaction" />
        <Label htmlFor="fixed-transaction">
          {type === 'expense' ? t.fixedExpense : type === 'income' ? t.fixedIncome : t.installments}
        </Label>
      </div>
      <Button type="submit" className="w-full">{t.save}</Button>
    </form>
  )
}