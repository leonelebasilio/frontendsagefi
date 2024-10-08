import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart2, DollarSign, Target, PieChart, Upload, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type MainMenuProps = {
  t: {
    home: string;
    transactions: string;
    goals: string;
    investments: string;
    importData: string;
  };
}

export function MainMenu({ t }: MainMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: BarChart2, label: t.home, to: "/" },
    { icon: DollarSign, label: t.transactions, to: "/transactions" },
    { icon: Target, label: t.goals, to: "/goals" },
    { icon: PieChart, label: t.investments, to: "/investments" },
    { icon: Upload, label: t.importData, to: "/ImportData" },
  ]

  const toggleMenu = () => setIsOpen(!isOpen)

  const MenuContent = () => (
    <nav className="flex flex-col space-y-4">
      {menuItems.map((item, index) => (
        <Button key={index} variant="ghost" className="justify-start" asChild>
          <Link to={item.to} onClick={() => setIsOpen(false)}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  )

  return (
    <>
      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" onClick={toggleMenu}>
              {isOpen ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <MenuContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:block">
        <MenuContent />
      </div>
    </>
  )
}