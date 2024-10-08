'use client'

import React, { useState, useEffect } from 'react'
import { Menu, Search, Bell, User, Home, CreditCard, Target, Briefcase, Settings, HelpCircle, Upload, UserCircle, Building2, Cog, LogOut, Zap, ShieldCheck, AlertTriangle, Gift, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Translations object containing all text in multiple languages
const translations = {
  pt: {
    search: "Faça uma pergunta!",
    home: "Início",
    transactions: "Transações",
    goals: "Objetivos",
    investments: "Investimentos",
    settings: "Configurações",
    help: "Ajuda",
    importData: "Importar Dados",
    footer: "© 2024 SageFI. Todos os direitos reservados.",
    menu: "Menu",
    profile: "Perfil",
    personalData: "Dados Pessoais",
    companyData: "Dados Empresa",
    myPlan: "Meu Plano",
    logoff: "Sair",
    notifications: "Notificações",
    viewAll: "Ver Todas",
    searchExamples: "Exemplos de perguntas",
    unreadNotifications: "Notificações não lidas",
    privacyPolicy: "Política de Privacidade",
    termsOfService: "Termos de Serviço",
    aboutUs: "Quem Somos",
    toggleMenu: "Alternar menu",
    closeMenu: "Fechar menu",
    searchPlaceholder: "O que você gostaria de saber?",
    notificationAlt: "Ícone de notificação",
    userProfileAlt: "Ícone de perfil do usuário",
  },
  en: {
    search: "Ask a question!",
    home: "Home",
    transactions: "Transactions",
    goals: "Goals",
    investments: "Investments",
    settings: "Settings",
    help: "Help",
    importData: "Import Data",
    footer: "© 2024 SageFI. All rights reserved.",
    menu: "Menu",
    profile: "Profile",
    personalData: "Personal Data",
    companyData: "Company Data",
    myPlan: "My Plan",
    logoff: "Log Out",
    notifications: "Notifications",
    viewAll: "View All",
    searchExamples: "Example questions",
    unreadNotifications: "Unread notifications",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    aboutUs: "About Us",
    toggleMenu: "Toggle menu",
    closeMenu: "Close menu",
    searchPlaceholder: "What would you like to know?",
    notificationAlt: "Notification icon",
    userProfileAlt: "User profile icon",
  },
  es: {
    search: "¡Haz una pregunta!",
    home: "Inicio",
    transactions: "Transacciones",
    goals: "Objetivos",
    investments: "Inversiones",
    settings: "Configuración",
    help: "Ayuda",
    importData: "Importar Datos",
    footer: "© 2024 SageFI. Todos los derechos reservados.",
    menu: "Menú",
    profile: "Perfil",
    personalData: "Datos Personales",
    companyData: "Datos de la Empresa",
    myPlan: "Mi Plan",
    logoff: "Cerrar Sesión",
    notifications: "Notificaciones",
    viewAll: "Ver Todas",
    searchExamples: "Ejemplos de preguntas",
    unreadNotifications: "Notificaciones no leídas",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    aboutUs: "Quiénes Somos",
    toggleMenu: "Alternar menú",
    closeMenu: "Cerrar menú",
    searchPlaceholder: "¿Qué te gustaría saber?",
    notificationAlt: "Icono de notificación",
    userProfileAlt: "Icono de perfil de usuario",
  }
}

// Menu items array for sidebar navigation
const menuItems = [
  { icon: Home, labelKey: 'home', path: '/' },
  { icon: CreditCard, labelKey: 'transactions', path: '/transactions' },
  { icon: Target, labelKey: 'goals', path: '/goals' },
  { icon: Briefcase, labelKey: 'investments', path: '/investments' },
  { icon: Settings, labelKey: 'settings', path: '/settings' },
  { icon: Upload, labelKey: 'importData', path: '/import' },
  { icon: HelpCircle, labelKey: 'help', path: '/help' },
]

// SidebarContent component for rendering the sidebar menu
const SidebarContent = ({ isMenuOpen, t, currentPath }) => (
  <nav className="mt-8">
    {menuItems.map((item, index) => (
      <Link 
        key={index} 
        to={item.path} 
        className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 ease-in-out ${currentPath === item.path ? 'bg-gray-100' : ''}`}
      >
        <item.icon className="h-5 w-5 mr-2" />
        {isMenuOpen && <span className="text-sm font-medium">{t[item.labelKey]}</span>}
      </Link>
    ))}
  </nav>
)

// NotificationItem component for rendering individual notification items
const NotificationItem = ({ title, message, link, icon: Icon }) => (
  <Link to={link} className="flex items-start px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
    <Icon className="h-5 w-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
    <div className="flex-grow">
      <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
      <p className="text-xs text-gray-600 mt-1">{message}</p>
    </div>
  </Link>
)

// Main TemplatePage component
export default function TemplatePage({ children }: { children: React.ReactNode }) {
  // State hooks
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [lang, setLang] = useState(() => {
    // Initialize language from localStorage or browser settings
    const savedLang = localStorage.getItem('language')
    if (savedLang && ['pt', 'en', 'es'].includes(savedLang)) {
      return savedLang
    }
    const browserLang = navigator.language.split('-')[0]
    return ['pt', 'en', 'es'].includes(browserLang) ? browserLang : 'en'
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchExamplesOpen, setIsSearchExamplesOpen] = useState(false)

  // Hooks
  const navigate = useNavigate()
  const location = useLocation()

  // Get translations for the current language
  const t = translations[lang]

  // Effect to save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', lang)
  }, [lang])

  // Handler for user logout
  const handleLogout = () => {
    // Implement actual logout logic here
    console.log('Logging out...')
    navigate('/login')
  }

  // Handler for search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Toggle sidebar menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Mock notifications data
  const notifications = [
    { icon: Zap, title: t.searchExamples, message: t.searchExamples, link: "/features" },
    { icon: ShieldCheck, title: t.unreadNotifications, message: t.unreadNotifications, link: "/account" },
    { icon: AlertTriangle, title: t.viewAll, message: t.viewAll, link: "/payments" },
    { icon: Gift, title: t.notifications, message: t.notifications, link: "/goals" },
    { icon: AlertTriangle, title: t.searchExamples, message: t.searchExamples, link: "/security" },
  ]

  // Search examples data
  const searchExamples = [
    { icon: DollarSign, question: t.searchExamples },
    { icon: Gift, question: t.searchExamples },
    { icon: HelpCircle, question: t.searchExamples },
  ]

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="bg-white shadow-lg hidden md:block relative"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-blue-600">SageFI</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label={t.closeMenu}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <SidebarContent isMenuOpen={isMenuOpen} t={t} currentPath={location.pathname} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Mobile menu button */}
            <div className="flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden mr-2" aria-label={t.toggleMenu}>
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <div className="py-4">
                    <h2 className="text-lg font-semibold mb-4 text-blue-600">SageFI</h2>
                    <SidebarContent isMenuOpen={true} t={t} currentPath={location.pathname} />
                  </div>
                </SheetContent>
              </Sheet>
              {/* Desktop menu toggle button */}
              {!isMenuOpen && (
                <Button variant="ghost" size="icon" onClick={toggleMenu} className="hidden md:flex" aria-label={t.toggleMenu}>
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}
            </div>
            
            {/* Search form */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto relative">
              <Input
                type="search"
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                <Search className="h-4 w-4" />
                <span className="sr-only">{t.search}</span>
              </Button>
              {/* Search examples tooltip */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute left-1 top-1/2 transform -translate-y-1/2" onClick={() => setIsSearchExamplesOpen(true)}>
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.searchExamples}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </form>

            {/* Search examples dialog */}
            <Dialog open={isSearchExamplesOpen} onOpenChange={setIsSearchExamplesOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t.searchExamples}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  {searchExamples.map((example, index) => (
                    <div key={index} className="flex items-center mb-4 last:mb-0">
                      <example.icon className="h-5 w-5 mr-2 text-blue-500" />
                      <span className="text-sm text-gray-700">{example.question}</span>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Notifications and user profile dropdowns */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Notifications dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">{t.notifications}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  <DropdownMenuLabel>{t.notifications}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notification, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <NotificationItem {...notification} />
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/notifications" className="w-full text-center text-blue-600 hover:text-blue-700 font-medium">
                      {t.viewAll}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* User profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">{t.profile}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>{t.profile}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate('/personal-data')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>{t.personalData}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/company-data')}>
                    <Building2 className="mr-2 h-4 w-4" />
                    <span>{t.companyData}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/my-plan')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>{t.myPlan}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/settings')}>
                    <Cog className="mr-2 h-4 w-4" />
                    <span>{t.settings}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t.logoff}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white shadow-sm mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <span className="mb-2 sm:mb-0">{t.footer}</span>
            <div className="space-x-4">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-700 transition-colors duration-150 ease-in-out">{t.privacyPolicy}</Link>
              <Link to="/terms-of-service" className="text-gray-500 hover:text-gray-700 transition-colors duration-150 ease-in-out">{t.termsOfService}</Link>
              <Link to="/about-us" className="text-gray-500 hover:text-gray-700 transition-colors duration-150 ease-in-out">{t.aboutUs}</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}