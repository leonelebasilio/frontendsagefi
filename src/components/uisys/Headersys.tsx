import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Search, Bell, User, HelpCircle, Home, Receipt, Target, TrendingUp, Upload, Menu, AlertCircle, FileText, Mail, MessageSquare, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { createClient } from '@supabase/supabase-js'
import { queryGemini } from './AIGemini'

const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Headersys() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [infoModalContent, setInfoModalContent] = useState({ title: '', message: '' })
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    async function fetchUserName() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        if (data) {
          setUserName(data.full_name)
        } else if (error) {
          console.error('Erro ao buscar nome do usuário:', error)
        }
      }
    }
    fetchUserName()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && !isLoading) {
      setIsLoading(true)
      try {
        const result = await queryGemini(searchQuery)
        navigate('/buscarpage', { state: { query: searchQuery, result } })
      } catch (error) {
        console.error('Erro ao buscar:', error)
        navigate('/buscarpage', { state: { query: searchQuery, error: 'Ocorreu um erro ao processar sua busca. Por favor, tente novamente.' } })
      } finally {
        setIsLoading(false)
      }
    } else if (!searchQuery.trim()) {
      setInfoModalContent({
        title: 'Dica de Busca',
        message: 'Digite qualquer pergunta sobre as suas finanças e surpreenda-se!'
      })
      setIsInfoModalOpen(true)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const notifications = [
    { icon: AlertCircle, title: "Alerta de gastos", message: "Você ultrapassou o limite de gastos em alimentação", read: false },
    { icon: FileText, title: "Novo extrato disponível", message: "Seu extrato mensal está pronto para visualização", read: false },
    { icon: Mail, title: "Nova mensagem", message: "Você recebeu uma nova mensagem do seu consultor financeiro", read: false },
    { icon: MessageSquare, title: "Comentário em meta", message: "João comentou na sua meta de economia", read: true },
    { icon: DollarSign, title: "Oportunidade de investimento", message: "Nova oportunidade de investimento disponível", read: true },
  ]

  const menuItems = [
    { icon: Home, labelKey: 'Início', path: '/dashboard' },
    { icon: Receipt, labelKey: 'Transações', path: '/transactions' },
    { icon: Target, labelKey: 'Objetivos', path: '/goals' },
    { icon: TrendingUp, labelKey: 'Investimentos', path: '/investments' },
    { icon: Upload, labelKey: 'Importar Dados', path: '/importdata' },
  ]

  useEffect(() => {
    setUnreadNotifications(notifications.filter(n => !n.read).length)
  }, [])

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="text-2xl font-bold text-blue-600">SageFI</Link>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="O que você gostaria de saber?"
                className="w-full pl-4 pr-10 py-2 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="sr-only">Pesquisar</span>
              </Button>
            </div>
          </form>

          <nav className="hidden md:flex items-center space-x-4">
            {menuItems.map((item, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link 
                      to={item.path} 
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                        location.pathname === item.path
                          ? 'text-blue-600 bg-blue-100'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.labelKey}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.labelKey}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => navigate('/help')}>
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">Ajuda</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ajuda</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadNotifications}
                    </span>
                  )}
                  <span className="sr-only">Notificações</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification, index) => (
                  <DropdownMenuItem key={index} onClick={() => navigate('/alert')} className="flex items-start py-2">
                    <notification.icon className={`h-5 w-5 mr-2 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`} />
                    <div>
                      <p className={`text-sm font-medium ${notification.read ? 'text-gray-700' : 'text-black'}`}>{notification.title}</p>
                      <p className="text-xs text-gray-500">{notification.message}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Perfil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Olá, {userName || 'Usuário'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/personal-data')}>Dados Pessoais</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/company-data')}>Dados da Empresa</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-plan')}>Meu Plano</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>Configurações</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col space-y-4 mt-4">
                  {menuItems.map((item, index) => (
                    <Link 
                      key={index}
                      to={item.path} 
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                        location.pathname === item.path
                          ? 'text-blue-600 bg-blue-100'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      <span>{item.labelKey}</span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <Dialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{infoModalContent.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700 whitespace-pre-line">{infoModalContent.message}</p>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}