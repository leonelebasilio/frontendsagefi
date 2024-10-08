import React, { useState, useEffect } from 'react'
import { BarChart2, DollarSign, ShoppingCart, Target, BookOpen, AlertTriangle } from 'lucide-react'
import { Line, Pie, Radar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale } from 'chart.js'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Registering necessary ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale)

export default function BodyDashboard() {
  const [saldo, setSaldo] = useState(0)

  useEffect(() => {
    // Função para buscar o saldo
    const buscarSaldo = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/saldo/14')
        const data = await response.json()
        const saldoNumerico = parseFloat(data.saldo)
        setSaldo(saldoNumerico)
      } catch (error) {
        console.error('Erro ao buscar saldo:', error)
      }
    }
    buscarSaldo()
  }, [])

  // Dados para os mini gráficos
  const miniChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  // Opções para os mini gráficos
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
  }

  // Dados para o gráfico de pizza
  const pieChartData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  }

  // Dados para o gráfico de radar
  const radarChartData = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [
      {
        label: 'Financial Health',
        data: [65, 59, 90, 81, 56, 55, 40],
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

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Cards de saldo, renda e despesas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {saldo.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
            <div className="h-[80px]">
              <Line data={miniChartData} options={miniChartOptions} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renda</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 5,000.00</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
            <div className="h-[80px]">
              <Line data={miniChartData} options={miniChartOptions} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 3,500.00</div>
            <p className="text-xs text-muted-foreground">
              +7.2% from last month
            </p>
            <div className="h-[80px]">
              <Line data={miniChartData} options={miniChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de visão geral do orçamento e saúde financeira */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral do Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Pie data={pieChartData} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Saúde Financeira</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Radar data={radarChartData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de metas financeiras, simulador de investimentos e conteúdo educacional */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Metas Financeiras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Target className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Fundo de Emergência</span>
                <span className="ml-auto text-sm">75%</span>
              </div>
              <div className="flex items-center">
                <Target className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Economia para Férias</span>
                <span className="ml-auto text-sm">50%</span>
              </div>
              <div className="flex items-center">
                <Target className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Aposentadoria</span>
                <span className="ml-auto text-sm">25%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Simulador de Investimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use nosso simulador de investimentos para planejar seu futuro financeiro.
            </p>
            <Button className="mt-4 w-full">Iniciar Simulador</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo Educacional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Orçamento 101</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Fundamentos de Investimento</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Planejamento Tributário</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card de alertas */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Sua fatura do cartão de crédito vence em 3 dias</span>
            </div>
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Você atingiu sua meta de economia para este mês!</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}