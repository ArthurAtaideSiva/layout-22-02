import { useState } from 'react'
import { streamAgentChat } from '@/lib/skipAi'
import pb from '@/lib/pocketbase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BotMessageSquare, Send, Sparkles, User, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Olá, sócio! Sou o seu Assistente Comercial de Maquinário. Posso consultar sua carteira de clientes, oportunidades, chamados de manutenção e trocas pendentes. Como posso te ajudar hoje?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)

  const quickPrompts = [
    'Quais clientes estão sem contato há 60 dias?',
    'Quais propostas estão sem resposta?',
    'Quais equipamentos precisam de troca este trimestre?',
    'Resumo do cliente Supermercado Mateus',
  ]

  const handleSend = async (textToSend?: string) => {
    const message = textToSend || input
    if (!message.trim() || loading) return

    setMessages((prev) => [...prev, { role: 'user', content: message }])
    if (!textToSend) setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/ask-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: pb.authStore.token,
        },
        body: JSON.stringify({ message, conversation_id: conversationId }),
      })

      let fullReply = ''
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      const result = await streamAgentChat(res, {
        onChunk: (_delta, accumulated) => {
          fullReply = accumulated
          setMessages((prev) => {
            const next = [...prev]
            next[next.length - 1].content = accumulated
            return next
          })
        },
      })

      if (result.conversation_id) {
        setConversationId(result.conversation_id)
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro ao consultar seus dados comerciais.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] max-w-4xl mx-auto space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
        <div className="h-9 w-9 rounded-full bg-[#25d366] text-white flex items-center justify-center">
          <BotMessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-800">Assistente Comercial</h1>
          <p className="text-xs text-slate-500">IA treinada na sua carteira de supermercados</p>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full shrink-0 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="h-3 w-3 text-amber-500" /> {prompt}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="h-7 w-7 rounded-full bg-[#25d366] text-white flex items-center justify-center shrink-0 text-xs">
                <BotMessageSquare className="h-4 w-4" />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[85%] text-xs md:text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                m.role === 'user'
                  ? 'bg-[#1e3a8a] text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex items-center gap-2 pt-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte algo sobre vendas, trocas, clientes..."
          className="bg-white"
        />
        <Button type="submit" disabled={loading} className="bg-[#1e3a8a] hover:bg-[#172a63]">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
