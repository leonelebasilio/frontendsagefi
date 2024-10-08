import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { queryGemini } from '@/components/uisys/AIGemini'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function BodyBuscarAI() {
  const location = useLocation()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { query, result, error } = location.state || {}
    if (query) {
      setMessages([
        { role: 'user', content: query },
        { role: 'ai', content: result || error || 'Desculpe, não foi possível processar sua solicitação.' }
      ])
    }
  }, [location])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const aiResponse = await queryGemini(input)
      const aiMessage: Message = { role: 'ai', content: aiResponse }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Erro ao obter resposta:', error)
      const errorMessage: Message = { role: 'ai', content: 'Desculpe, ocorreu um erro ao processar sua solicitação.' }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Chat com IA</h1>
      <Card className="flex-grow overflow-hidden flex flex-col">
        <ScrollArea className="flex-grow p-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex items-start ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.role === 'user' ? "/user-avatar.png" : "/ai-avatar.png"} />
                  <AvatarFallback>{message.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                </Avatar>
                <Card className={`max-w-[70%] ${message.role === 'user' ? 'ml-2 bg-blue-100' : 'mr-2 bg-gray-100'}`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{message.content}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}