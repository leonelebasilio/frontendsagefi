import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, HelpCircle, DollarSign, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
    faq1: "Como protegemos seus dados financeiros?",
    faqAnswer1: "Utilizamos criptografia de nível bancário e seguimos as melhores práticas de segurança para proteger seus dados.",
    faq2: "Posso conectar múltiplas contas bancárias?",
    faqAnswer2: "Sim, você pode conectar e gerenciar várias contas bancárias em uma única interface.",
    faq3: "Como a IA melhora minha gestão financeira?",
    faqAnswer3: "Nossa IA analisa seus padrões de gastos e fornece recomendações personalizadas para melhorar sua saúde financeira.",
    faq4: "Vocês oferecem planejamento para aposentadoria?",
    faqAnswer4: "Sim, nossos planos incluem ferramentas de planejamento para aposentadoria com projeções e recomendações personalizadas.",
    faq5: "Posso cancelar minha assinatura a qualquer momento?",
    faqAnswer5: "Absolutamente. Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.",
    pricingTitle: "Preços e Funcionalidades",
    free: "Gratuito",
    individual: "Individual",
    company: "Empresa",
    month: "/mês",
    choosePlan: "Escolher Plano",
    freeFeatures: [
      "Rastreamento de despesas básico",
      "Visão geral do orçamento",
      "Alertas de gastos",
      "Conexão com 1 conta bancária",
      "Relatórios mensais"
    ],
    individualFeatures: [
      "Todas as funcionalidades do plano Gratuito",
      "Conexão com múltiplas contas",
      "Categorização automática de transações",
      "Metas financeiras personalizadas",
      "Análise de investimentos"
    ],
    companyFeatures: [
      "Todas as funcionalidades do plano Individual",
      "Gestão de despesas de equipe",
      "Relatórios financeiros avançados",
      "Integração com sistemas de contabilidade",
      "Suporte prioritário 24/7"
    ],
    privacyPolicy: "Política de Privacidade",
    termsOfService: "Termos de Serviço",
    aboutUs: "Quem Somos",
    copyright: "© 2024 Todos os direitos reservados.",
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
    purchaseOptimizationDesc: "Gain insights into your spending habits and purchase trends.",
    faqTitle: "Frequently Asked Questions",
    faq1: "How do we protect your financial data?",
    faqAnswer1: "We use bank-level encryption and follow best security practices to protect your data.",
    faq2: "Can I connect multiple bank accounts?",
    faqAnswer2: "Yes, you can connect and manage multiple bank accounts in a single interface.",
    faq3: "How does AI improve my financial management?",
    faqAnswer3: "Our AI analyzes your spending patterns and provides personalized recommendations to improve your financial health.",
    faq4: "Do you offer retirement planning?",
    faqAnswer4: "Yes, our plans include retirement planning tools with personalized projections and recommendations.",
    faq5: "Can I cancel my subscription at any time?",
    faqAnswer5: "Absolutely. You can cancel your subscription at any time without any additional fees.",
    pricingTitle: "Pricing and Features",
    free: "Free",
    individual: "Individual",
    company: "Company",
    month: "/month",
    choosePlan: "Choose Plan",
    freeFeatures: [
      "Basic expense tracking",
      "Budget overview",
      "Spending alerts",
      "Connect 1 bank account",
      "Monthly reports"
    ],
    individualFeatures: [
      "All Free plan features",
      "Connect multiple accounts",
      "Automatic transaction categorization",
      "Custom financial goals",
      "Investment analysis"
    ],
    companyFeatures: [
      "All Individual plan features",
      "Team expense management",
      "Advanced financial reporting",
      "Accounting system integration",
      "24/7 priority support"
    ],
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    aboutUs: "About Us",
    copyright: "© 2024 All rights reserved.",
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
    purchaseOptimizationDesc: "Obtén información sobre tus hábitos de gasto y tendencias de compra.",
    faqTitle: "Preguntas Frecuentes",
    faq1: "¿Cómo protegemos tus datos financieros?",
    faqAnswer1: "Utilizamos encriptación de nivel bancario y seguimos las mejores prácticas de seguridad para proteger tus datos.",
    faq2: "¿Puedo conectar múltiples cuentas bancarias?",
    faqAnswer2: "Sí, puedes conectar y gestionar varias cuentas bancarias en una sola interfaz.",
    faq3: "¿Cómo mejora la IA mi gestión financiera?",
    faqAnswer3: "Nuestra IA analiza tus patrones de gasto y proporciona recomendaciones personalizadas para mejorar tu salud financiera.",
    faq4: "¿Ofrecen planificación para la jubilación?",
    faqAnswer4: "Sí, nuestros planes incluyen herramientas de planificación para la jubilación con proyecciones y recomendaciones personalizadas.",
    faq5: "¿Puedo cancelar mi suscripción en cualquier momento?",
    faqAnswer5: "Absolutamente. Puedes cancelar tu suscripción en cualquier momento sin cargos adicionales.",
    pricingTitle: "Precios y Características",
    free: "Gratis",
    individual: "Individual",
    company: "Empresa",
    month: "/mes",
    choosePlan: "Elegir Plan",
    freeFeatures: [
      "Seguimiento básico de gastos",
      "Resumen de presupuesto",
      "Alertas de gastos",
      "Conexión con 1 cuenta bancaria",
      "Informes mensuales"
    ],
    individualFeatures: [
      "Todas las características del plan Gratis",
      "Conexión con múltiples cuentas",
      "Categorización automática de transacciones",
      "Metas financieras personalizadas",
      "Análisis de inversiones"
    ],
    companyFeatures: [
      "Todas las características del plan Individual",
      "Gestión de gastos de equipo",
      "Informes financieros avanzados",
      "Integración con sistemas de contabilidad",
      "Soporte prioritario 24/7"
    ],
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    aboutUs: "Sobre Nosotros",
    copyright: "© 2024 Todos los derechos reservados.",
  }
};

export default function HomePage() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang];
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const getCurrencySymbol = () => {
    return lang === 'pt' ? 'R$' : '$';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm">
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
            <Button variant="ghost" onClick={handleLoginClick}>{t.login}</Button>
            <Button onClick={handleLoginClick}>{t.signUp}</Button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.heroTitle}</h1>
          <p className="text-xl text-gray-600 mb-8">{t.heroDescription}</p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleLoginClick}>
            {t.getStarted}
          </Button>
        </section>

        <section id="features" className="mb-16">
          <div className="flex items-center mb-8">
            <Brain className="w-8 h-8 text-blue-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">{t.manageFinances}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{t.smartAnalytics}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t.smartAnalyticsDesc}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t.smartBudget}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t.smartBudgetDesc}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t.purchaseOptimization}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t.purchaseOptimizationDesc}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="faq" className="mb-16">
          <div className="flex items-center mb-8">
            <HelpCircle className="w-8 h-8 text-blue-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">{t.faqTitle}</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{t.faq1}</AccordionTrigger>
              <AccordionContent>{t.faqAnswer1}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>{t.faq2}</AccordionTrigger>
              <AccordionContent>{t.faqAnswer2}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>{t.faq3}</AccordionTrigger>
              <AccordionContent>{t.faqAnswer3}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>{t.faq4}</AccordionTrigger>
              <AccordionContent>{t.faqAnswer4}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>{t.faq5}</AccordionTrigger>
              <AccordionContent>{t.faqAnswer5}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section id="pricing" className="mb-16">
          <div className="flex items-center mb-8">
            <DollarSign className="w-8 h-8 text-blue-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">{t.pricingTitle}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>{t.free}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-4xl font-bold">{getCurrencySymbol()}0</p>
                <p>{t.month}</p>
                <ul className="mt-4 space-y-2">
                  {t.freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 mt-auto">
                <Button className="w-full" onClick={handleLoginClick}>{t.choosePlan}</Button>
              </div>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>{t.individual}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-4xl font-bold">{getCurrencySymbol()}9,99</p>
                <p>{t.month}</p>
                <ul className="mt-4 space-y-2">
                  {t.individualFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 mt-auto">
                <Button className="w-full" onClick={handleLoginClick}>{t.choosePlan}</Button>
              </div>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>{t.company}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-4xl font-bold">{getCurrencySymbol()}49,99</p>
                <p>{t.month}</p>
                <ul className="mt-4 space-y-2">
                  {t.companyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 mt-auto">
                <Button className="w-full" onClick={handleLoginClick}>{t.choosePlan}</Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600">{t.privacyPolicy}</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">{t.termsOfService}</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">{t.aboutUs}</a>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">{t.copyright}</p>
        </div>
      </footer>
    </div>
  );
}