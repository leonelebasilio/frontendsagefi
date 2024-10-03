import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "/SaudeFinanceira/frontendsagefi/src/components/ui/button"
import { PieChart, ShoppingCart, HelpCircle, DollarSign, Brain, Wallet, BarChart } from "lucide-react"

const translations = {
  pt: {
    home: "Início",
    features: "Funcionalidades",
    faq: "Perguntas Frequentes",
    pricing: "Preços",
    login: "Entrar",
    signUp: "Cadastrar",
    heroTitle: "Como está sua Saúde Financeira?",
    heroDescription: "Assuma o controle de suas finanças com nossas ferramentas alimentadas por IA e conselhos de especialistas.",
    getStarted: "Comece Agora",
    manageFinances: "Gerencie suas finanças automaticamente com IA",
    smartAnalytics: "Análises Inteligentes",
    smartAnalyticsDesc: "Obtenha uma visão clara de suas receitas e despesas.",
    smartBudget: "Orçamento Inteligente",
    smartBudgetDesc: "Deixe a IA ajudar você a criar e manter um orçamento ideal.",
    purchaseOptimization: "Otimização de Compras",
    purchaseOptimizationDesc: "Obtenha insights sobre seus hábitos de consumo e tendências de compras.",
    faqTitle: "Perguntas Frequentes",
    pricingTitle: "Preços e Funcionalidades",
    free: "Gratuito",
    individual: "Individual",
    company: "Empresa",
    month: "/mês",
    choosePlan: "Escolher Plano",
    privacyPolicy: "Política de Privacidade",
    termsOfService: "Termos de Serviço",
    aboutUs: "Quem Somos",
    copyright: "© 2023 SageFI. Todos os direitos reservados.",
  },
  en: {
    home: "Home",
    features: "Features",
    faq: "FAQ",
    pricing: "Pricing",
    login: "Login",
    signUp: "Sign Up",
    heroTitle: "How's your Financial Health?",
    heroDescription: "Take control of your finances with our AI-powered tools and expert advice.",
    getStarted: "Get Started",
    manageFinances: "Manage your finances automatically with AI",
    smartAnalytics: "Smart Analytics",
    smartAnalyticsDesc: "Get a clear view of your income and expenses.",
    smartBudget: "Smart Budget",
    smartBudgetDesc: "Let AI help you create and maintain an optimal budget.",
    purchaseOptimization: "Purchase Optimization",
    purchaseOptimizationDesc: "Gain insights into your consumption habits and shopping trends.",
    faqTitle: "Frequently Asked Questions",
    pricingTitle: "Pricing & Features",
    free: "Free",
    individual: "Individual",
    company: "Company",
    month: "/month",
    choosePlan: "Choose Plan",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    aboutUs: "About Us",
    copyright: "© 2023 SageFI. All rights reserved.",
  },
  es: {
    home: "Inicio",
    features: "Características",
    faq: "Preguntas Frecuentes",
    pricing: "Precios",
    login: "Iniciar Sesión",
    signUp: "Registrarse",
    heroTitle: "¿Cómo está tu Salud Financiera?",
    heroDescription: "Toma el control de tus finanzas con nuestras herramientas impulsadas por IA y asesoramiento experto.",
    getStarted: "Comienza Ahora",
    manageFinances: "Gestiona tus finanzas automáticamente con IA",
    smartAnalytics: "Análisis Inteligente",
    smartAnalyticsDesc: "Obtén una visión clara de tus ingresos y gastos.",
    smartBudget: "Presupuesto Inteligente",
    smartBudgetDesc: "Deja que la IA te ayude a crear y mantener un presupuesto óptimo.",
    purchaseOptimization: "Optimización de Compras",
    purchaseOptimizationDesc: "Obtén información sobre tus hábitos de consumo y tendencias de compra.",
    faqTitle: "Preguntas Frecuentes",
    pricingTitle: "Precios y Características",
    free: "Gratis",
    individual: "Individual",
    company: "Empresa",
    month: "/mes",
    choosePlan: "Elegir Plan",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    aboutUs: "Quiénes Somos",
    copyright: "© 2023 SageFI. Todos los derechos reservados.",
  }
}

export default function HomePage() {
  const [lang, setLang] = useState('pt')
  const t = translations[lang]

  const faqData = [
    {
      question: {
        pt: "Quão seguros estão meus dados financeiros?",
        en: "How secure is my financial data?",
        es: "¿Qué tan seguros están mis datos financieros?"
      },
      answer: {
        pt: "Usamos criptografia de nível bancário para garantir que seus dados estejam sempre protegidos.",
        en: "We use bank-level encryption to ensure your data is always protected.",
        es: "Utilizamos encriptación de nivel bancario para garantizar que sus datos estén siempre protegidos."
      }
    },
    {
      question: {
        pt: "Posso conectar várias contas?",
        en: "Can I connect multiple accounts?",
        es: "¿Puedo conectar varias cuentas?"
      },
      answer: {
        pt: "Sim, você pode conectar e gerenciar várias contas financeiras em um só lugar.",
        en: "Yes, you can connect and manage multiple financial accounts in one place.",
        es: "Sí, puede conectar y gestionar varias cuentas financieras en un solo lugar."
      }
    },
    {
      question: {
        pt: "Existe um aplicativo móvel disponível?",
        en: "Is there a mobile app available?",
        es: "¿Hay una aplicación móvil disponible?"
      },
      answer: {
        pt: "Sim, oferecemos aplicativos móveis para plataformas iOS e Android.",
        en: "Yes, we offer mobile apps for both iOS and Android platforms.",
        es: "Sí, ofrecemos aplicaciones móviles para plataformas iOS y Android."
      }
    },
    {
      question: {
        pt: "Com que frequência meus dados são atualizados?",
        en: "How often is my data updated?",
        es: "¿Con qué frecuencia se actualizan mis datos?"
      },
      answer: {
        pt: "Seus dados são atualizados em tempo real para fornecer o panorama financeiro mais preciso.",
        en: "Your data is updated in real-time to provide the most accurate financial picture.",
        es: "Sus datos se actualizan en tiempo real para proporcionar la imagen financiera más precisa."
      }
    },
    {
      question: {
        pt: "Posso exportar meus relatórios financeiros?",
        en: "Can I export my financial reports?",
        es: "¿Puedo exportar mis informes financieros?"
      },
      answer: {
        pt: "Sim, você pode exportar seus relatórios financeiros em vários formatos, incluindo PDF e CSV.",
        en: "Yes, you can export your financial reports in various formats including PDF and CSV.",
        es: "Sí, puede exportar sus informes financieros en varios formatos, incluyendo PDF y CSV."
      }
    }
  ]

  const pricingData = [
    {
      plan: t.free,
      price: "R$ 0",
      features: [
        t.smartAnalytics,
        t.smartBudget,
      ]
    },
    {
      plan: t.individual,
      price: "R$ 15",
      features: [
        t.smartAnalytics,
        t.smartBudget,
        t.purchaseOptimization,
      ]
    },
    {
      plan: t.company,
      price: "R$ 80",
      features: [
        t.smartAnalytics,
        t.smartBudget,
        t.purchaseOptimization,
        "API Access",
        "Dedicated Support",
      ]
    }
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">SageFI</span>
          </div>
          <div className="hidden md:flex space-x-4">
            <a href="#features" className="text-gray-600 hover:text-gray-900">{t.features}</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900">{t.faq}</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">{t.pricing}</a>
          </div>
          <div className="flex space-x-4 items-center">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-white border border-gray-300 rounded-md text-gray-700 py-1 px-2"
            >
              <option value="pt">PT</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
            <Button variant="ghost" as={Link} to="/Login">{t.login}</Button>
            <Button as={Link} to="/cadastrar">{t.signUp}</Button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.heroTitle}</h1>
          <p className="text-xl text-gray-600 mb-8">{t.heroDescription}</p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">{t.getStarted}</Button>
        </section>

        <section id="features" className="mb-16">
          <div className="flex items-center mb-8">
            <Brain className="w-8 h-8 text-blue-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">{t.manageFinances}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <BarChart className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t.smartAnalytics}</h3>
              <p className="text-gray-600">{t.smartAnalyticsDesc}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Wallet className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t.smartBudget}</h3>
              <p className="text-gray-600">{t.smartBudgetDesc}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ShoppingCart className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t.purchaseOptimization}</h3>
              <p className="text-gray-600">{t.purchaseOptimizationDesc}</p>
            </div>
          </div>
        </section>

        <section id="faq" className="mb-16">
          <div className="flex items-center mb-8">
            <HelpCircle className="w-8 h-8 text-blue-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">{t.faqTitle}</h2>
          </div>
          <ul className="space-y-4">
            {faqData.map((faq, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">{faq.question[lang]}</h3>
                <p className="text-gray-600">{faq.answer[lang]}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="pricing" className="mb-16">
          <div className="flex items-center mb-8">
            <DollarSign className="w-8 h-8 text-blue-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">{t.pricingTitle}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingData.map((plan, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                <h3 className="text-xl font-semibold mb-2">{plan.plan}</h3>
                <p className="text-3xl font-bold mb-4">{plan.price} <span className="text-xl font-normal text-gray-600">{t.month}</span></p>
                <ul className="mb-6 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center mb-2">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-auto">{t.choosePlan}</Button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <span className="text-lg font-semibold mb-4 md:mb-0">SageFI</span>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <a href="#" className="hover:text-blue-300">{t.privacyPolicy}</a>
              <a href="#" className="hover:text-blue-300">{t.termsOfService}</a>
              <a href="#" className="hover:text-blue-300">{t.aboutUs}</a>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-400 text-center md:text-left">{t.copyright}</p>
        </div>
      </footer>
    </div>
  )
}


// import { Link } from 'react-router-dom'; // Importe o Link
// import { Button } from "C://SaudeFinanceira/TestAuth/src/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "C://SaudeFinanceira/TestAuth/src/components/ui/cards"
// import { BarChart, PieChart, Users } from "lucide-react"

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
//       <header className="bg-white shadow-sm">
//         <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="text-2xl font-bold text-blue-600">FinControl</div>
//           <div className="space-x-4">
//             <a href="#" className="text-gray-600 hover:text-blue-600">Saúde Financeira</a>
//             <a href="#" className="text-gray-600 hover:text-blue-600">Perguntas Frequentes</a>
//             <a href="#" className="text-gray-600 hover:text-blue-600">Preços & Funcionalidades</a>
//             <a href="#" className="text-gray-600 hover:text-blue-600">Quem Somos</a>
//             <a href="#" className="text-gray-600 hover:text-blue-600">Seja Parceiro</a>
//           </div>
//           <Button variant="outline" as={Link} to="/Login"> 
//   Login 
// </Button>
//         </nav>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <section className="mb-16 text-center">
//           <h1 className="text-4xl font-bold mb-4 text-gray-800">Como anda a sua Saúde Financeira?</h1>
//           <p className="text-xl mb-8 text-gray-600">Descubra como melhorar sua situação financeira com nossa análise personalizada.</p>
//           <Button size="lg">Comece Hoje | Teste 7 dias Grátis</Button>
//         </section>

//         <section className="mb-16">
//           <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Gerencie sua saúde financeira de maneira automatizada com IA</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <BarChart className="w-6 h-6 mr-2 text-blue-600" />
//                   Análise de Gastos
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>Visualize seus gastos de forma clara e intuitiva, identificando áreas de melhoria.</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <PieChart className="w-6 h-6 mr-2 text-blue-600" />
//                   Orçamento Inteligente
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>Crie orçamentos personalizados com base em seus hábitos de gastos e metas financeiras.</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Users className="w-6 h-6 mr-2 text-blue-600" />
//                   Consultoria Especializada
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>Receba orientações de especialistas para melhorar sua saúde financeira.</p>
//               </CardContent>
//             </Card>
//           </div>
//         </section>

//         <section className="mb-16 text-center">
//           <h2 className="text-3xl font-bold mb-4 text-gray-800">Perguntas Frequentes</h2>
//           <p className="text-xl mb-8 text-gray-600">Encontre respostas para as dúvidas mais comuns sobre nossos serviços.</p>
//           <Button variant="outline" size="lg">Ver Todas as Perguntas</Button>
//         </section>

//         <section className="mb-16 text-center">
//           <h2 className="text-3xl font-bold mb-4 text-gray-800">Preços & Funcionalidades</h2>
//           <p className="text-xl mb-8 text-gray-600">Escolha o plano que melhor se adapta às suas necessidades financeiras.</p>
//           <Button variant="outline" size="lg">Ver Planos</Button>
//         </section>

//         <section className="text-center">
//           <h2 className="text-3xl font-bold mb-4 text-gray-800">Quem Somos</h2>
//           <p className="text-xl mb-8 text-gray-600">Conheça nossa equipe e missão para ajudar você a alcançar a liberdade financeira.</p>
//           <Button variant="outline" size="lg">Saiba Mais</Button>
//         </section>
//       </main>

//       <footer className="bg-gray-100 mt-16">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex justify-between items-center">
//             <div className="text-2xl font-bold text-blue-600">FinControl</div>
//             <div className="space-x-4">
//               <a href="#" className="text-gray-600 hover:text-blue-600">Termos de Uso</a>
//               <a href="#" className="text-gray-600 hover:text-blue-600">Política de Privacidade</a>
//             </div>
//           </div>
//           <div className="mt-4 text-center text-gray-500">
//             © 2023 FinControl. Todos os direitos reservados.
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }