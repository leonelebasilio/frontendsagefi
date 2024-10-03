// import React from "react";
// import { useAuth } from '/SaudeFinanceira/frontendsagefi/src/components/AuthProvider'; 

// export default function Dashboard() {
//   console.log('Dashboard renderizado!');
//   const { user } = useAuth();

//     return (
//       <div>
//         <h1 className = "text-3x1 font-bold underline"  > Dashboard 

//         </h1>
//         {user && <p>ID do usuário: {user.id}</p>} 
//       </div>
//     );
//   }

/////////////////////



import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Menu, Search, Bell, User, ChevronDown, BarChart2, DollarSign, ShoppingCart, ChevronRight, ArrowUp, ArrowDown, Target, BookOpen, AlertTriangle, PieChart, Home, CreditCard, Briefcase, Settings, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Line, Pie, Radar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale)

const translations = {
  pt: {
    dashboard: "Painel",
    search: "Buscar",
    home: "Início",
    transactions: "Transações",
    goals: "Metas",
    investments: "Investimentos",
    settings: "Configurações",
    help: "Ajuda",
    balance: "Saldo",
    income: "Renda",
    expenses: "Despesas",
    budgetOverview: "Visão Geral do Orçamento",
    categories: "Categorias",
    financialHealth: "Saúde Financeira",
    financialGoals: "Metas Financeiras",
    investmentSimulator: "Simulador de Investimentos",
    educationalContent: "Conteúdo Educacional",
    alerts: "Alertas",
    today: "Hoje",
    viewAll: "Ver Tudo",
    freePlan: "Plano Gratuito",
    personalPlan: "Plano Pessoa Física",
    businessPlan: "Plano Empresa",
    days: "dias",
    month: "/mês",
    tryForFree: "Experimente Grátis",
    subscribe: "Assinar"
  },
  en: {
    dashboard: "Dashboard",
    search: "Search",
    home: "Home",
    transactions: "Transactions",
    goals: "Goals",
    investments: "Investments",
    settings: "Settings",
    help: "Help",
    balance: "Balance",
    income: "Income",
    expenses: "Expenses",
    budgetOverview: "Budget Overview",
    categories: "Categories",
    financialHealth: "Financial Health",
    financialGoals: "Financial Goals",
    investmentSimulator: "Investment Simulator",
    educationalContent: "Educational Content",
    alerts: "Alerts",
    today: "Today",
    viewAll: "View All",
    freePlan: "Free Plan",
    personalPlan: "Personal Plan",
    businessPlan: "Business Plan",
    days: "days",
    month: "/month",
    tryForFree: "Try for Free",
    subscribe: "Subscribe"
  },
  es: {
    dashboard: "Tablero",
    search: "Buscar",
    home: "Inicio",
    transactions: "Transacciones",
    goals: "Metas",
    investments: "Inversiones",
    settings: "Configuración",
    help: "Ayuda",
    balance: "Saldo",
    income: "Ingresos",
    expenses: "Gastos",
    budgetOverview: "Resumen del Presupuesto",
    categories: "Categorías",
    financialHealth: "Salud Financiera",
    financialGoals: "Metas Financieras",
    investmentSimulator: "Simulador de Inversiones",
    educationalContent: "Contenido Educativo",
    alerts: "Alertas",
    today: "Hoy",
    viewAll: "Ver Todo",
    freePlan: "Plan Gratuito",
    personalPlan: "Plan Personal",
    businessPlan: "Plan Empresarial",
    days: "días",
    month: "/mes",
    tryForFree: "Prueba Gratis",
    subscribe: "Suscribirse"
  }
}

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [lang, setLang] = useState('pt')
  const t = translations[lang]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const miniChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        tension: 0.1
      }
    ]
  }

  const miniChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  }

  const budgetOverviewData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [4500, 5000, 4800, 5200, 5100, 5500],
        borderColor: '#2ECC71',
        tension: 0.1
      },
      {
        label: 'Expenses',
        data: [3500, 3800, 3600, 3900, 3700, 4000],
        borderColor: '#E74C3C',
        tension: 0.1
      },
      {
        label: 'Balance',
        data: [1000, 1200, 1200, 1300, 1400, 1500],
        borderColor: '#3498DB',
        tension: 0.1
      }
    ]
  }

  const categoryData = {
    labels: ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment'],
    datasets: [
      {
        data: [35, 25, 15, 15, 10],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }
    ]
  }

  const financialHealthData = {
    labels: ['Savings', 'Debt', 'Investments', 'Budget', 'Income', 'Expenses'],
    datasets: [
      {
        label: 'Financial Health',
        data: [65, 59, 90, 81, 56, 55],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }
    ]
  }

  /// API para obter o saldo do usuário
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    const buscarSaldo = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/saldo/14');
        const data = await response.json();
  
        // Convertendo o saldo (string) para um número:
        const saldoNumerico = parseFloat(data.saldo); 
  
        // Agora você pode usar toFixed()
        setSaldo(saldoNumerico); 
      } catch (error) {
        console.error('Erro ao buscar saldo:', error);
      }
    };
  
    buscarSaldo();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div 
        className="bg-white shadow-lg"
        initial={false}
        animate={{ width: isMenuOpen ? 240 : 80 }}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className={`text-2xl font-bold text-[#2ECC71] ${!isMenuOpen && 'hidden'}`}>SageFI</h1>
          <button onClick={toggleMenu}>
            <Menu className="text-gray-500" />
          </button>
        </div>
        <nav className="mt-8">
          {[
            { icon: Home, label: t.home },
            { icon: CreditCard, label: t.transactions },
            { icon: Target, label: t.goals },
            { icon: Briefcase, label: t.investments, to: '/ImportData' },
            { icon: Settings, label: t.settings },
            { icon: HelpCircle, label: t.help },
          ].map((item, index) => (
            <Link 
              to={item.to} 
              key={index} href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
              <item.icon className="h-5 w-5 mr-2" />
              {isMenuOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="relative w-64">
              <input
                type="text"
                placeholder={t.search}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-[#3498DB]"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-white border border-gray-300 rounded-md text-gray-700 py-1 px-2"
              >
                <option value="pt">PT</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
              <Bell className="text-gray-500" />
              <User className="text-gray-500" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Balance Card */}
              <div className="bg-[#3498DB] rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{t.balance}</h2>
                  <BarChart2 size={24} />
                </div>
                <p className="text-3xl font-bold">R$ {saldo.toFixed(2)}</p>
                <p className="text-sm mt-2">+30% from last month</p>
                <div className="h-16 mt-4">
                  <Line data={miniChartData} options={miniChartOptions} />
                </div>
              </div>

              {/* Income Card */}
              <div className="bg-[#2ECC71] rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{t.income}</h2>
                  <DollarSign size={24} />
                </div>
                <p className="text-3xl font-bold">R$ 5.000,00</p>
                <p className="text-sm mt-2">+12.5% from last month</p>
                <div className="h-16 mt-4">
                  <Line data={miniChartData} options={miniChartOptions} />
                </div>
              </div>

              {/* Expenses Card */}
              <div className="bg-[#E74C3C] rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{t.expenses}</h2>
                  <ShoppingCart size={24} />
                </div>
                <p className="text-3xl font-bold">R$ 3.500,00</p>
                <p className="text-sm mt-2">-3.2% from last month</p>
                <div className="h-16 mt-4">
                  <Line data={miniChartData} options={miniChartOptions} />
                </div>
              </div>
            </div>

            {/* Budget Overview */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{t.budgetOverview}</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{t.month}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
              <div className="h-64">
                <Line data={budgetOverviewData} />
              </div>
            </div>

            {/* Categories and Financial Health */}
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.categories}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-48">
                    <Pie data={categoryData} />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment'].map((category, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap">{category}</td>
                            <td className="px-4 py-2 whitespace-nowrap">R$ {(Math.random() * 1000).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.financialHealth}</h2>
                <div className="h-64">
                  <Radar data={financialHealthData} />
                </div>
              </div>
            </div>

            {/* Financial Goals */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{t.financialGoals}</h2>
                <button className="text-[#3498DB] hover:underline flex items-center">
                  {t.viewAll} <ChevronRight size={16} />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Emergency Fund', target: 10000, current: 5000 },
                  { name: 'Vacation', target: 5000, current: 2000 },
                  { name: 'New Car', target: 30000, current: 10000 },
                ].map((goal) => (
                  <div key={goal.name} className="flex items-center">
                    <Target className="text-[#2ECC71] mr-2" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-[#2ECC71] h-2.5 rounded-full" style={{ width: `${(goal.current / goal.target) * 100}%` }}></div>
                      </div>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">R$ {goal.current} / R$ {goal.target}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Simulator and Educational Content */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <PieChart className="text-[#3498DB] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">{t.investmentSimulator}</h2>
                </div>
                {/* Add investment simulator component here */}
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="text-[#F39C12] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">{t.educationalContent}</h2>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <ChevronRight className="text-[#F39C12] mr-2" />
                    <a href="#" className="text-[#3498DB] hover:underline">How to create a budget</a>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="text-[#F39C12] mr-2" />
                    <a href="#" className="text-[#3498DB] hover:underline">Understanding investment risks</a>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="text-[#F39C12] mr-2" />
                    <a href="#" className="text-[#3498DB] hover:underline">Tips for saving money</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Alerts */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="text-[#F39C12] mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">{t.alerts}</h2>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center text-red-500">
                  <AlertTriangle className="mr-2" />
                  <span>You've exceeded your dining out budget by 20%</span>
                </li>
                <li className="flex items-center text-[#F39C12]">
                  <AlertTriangle className="mr-2" />
                  <span>Your credit card bill is due in 3 days</span>
                </li>
                <li className="flex items-center text-[#2ECC71]">
                  <AlertTriangle className="mr-2" />
                  <span>You've reached 80% of your savings goal!</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard