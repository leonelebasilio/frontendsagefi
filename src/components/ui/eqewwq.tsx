import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from '@/contexts/LanguageContext'

const translations = {
  pt: {
    dashboard: "Painel",
    transactions: "Transações",
    goals: "Metas",
    investments: "Investimentos",
    settings: "Configurações",
    help: "Ajuda",
  },
  en: {
    dashboard: "Dashboard",
    transactions: "Transactions",
    goals: "Goals",
    investments: "Investments",
    settings: "Settings",
    help: "Help",
  },
  es: {
    dashboard: "Panel",
    transactions: "Transacciones",
    goals: "Metas",
    investments: "Inversiones",
    settings: "Configuración",
    help: "Ayuda",
  }
}


export default function ImportDataMenu() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = translations[language]

  const menuItems = [
    { label: t.dashboard, path: '/dashboard' },
    { label: t.transactions, path: '/transactions' },
    { label: t.goals, path: '/goals' },
    { label: t.investments, path: '/investments' },
    { label: t.settings, path: '/settings' },
    { label: t.help, path: '/help' },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {menuItems.map((item) => (
          <DropdownMenuItem key={item.path} onSelect={() => navigate(item.path)}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}