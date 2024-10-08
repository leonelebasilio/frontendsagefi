import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, CreditCard, Target, Briefcase, Settings, HelpCircle, Upload, ChevronLeft, Menu as MenuIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'

interface MenusysProps {
  t: {
    home: string;
    transactions: string;
    goals: string;
    investments: string;
    settings: string;
    importData: string;
    help: string;
    toggleMenu: string;
    closeMenu: string;
    [key: string]: string;
  };
}

export default function Menusys({ t }: MenusysProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      setIsMenuOpen(!isMobileView)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const menuItems = [
    { icon: Home, labelKey: 'home', path: '/' },
    { icon: CreditCard, labelKey: 'transactions', path: '/transactions' },
    { icon: Target, labelKey: 'goals', path: '/goals' },
    { icon: Briefcase, labelKey: 'investments', path: '/investments' },
    { icon: Settings, labelKey: 'settings', path: '/settings' },
    { icon: Upload, labelKey: 'importData', path: '/import' },
    { icon: HelpCircle, labelKey: 'help', path: '/help' },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMenu} 
        className="fixed top-4 left-4 z-50 md:hidden" 
        aria-label={t.toggleMenu}
      >
        <MenuIcon className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {(isMenuOpen || !isMobile) && (
          <motion.div 
            className="fixed inset-y-0 left-0 z-40 bg-white shadow-lg md:relative"
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-blue-600">SageFI</h1>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  aria-label={t.closeMenu}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
            <nav className="mt-8">
              {menuItems.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path} 
                  className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 ease-in-out ${location.pathname === item.path ? 'bg-gray-100' : ''}`}
                  onClick={() => isMobile && setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">{t[item.labelKey]}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}