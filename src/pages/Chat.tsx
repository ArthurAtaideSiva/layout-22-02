import { useState, useEffect, useRef } from 'react'
import { streamAgentChat } from '@/lib/skipAi'
import pb from '@/lib/pocketbase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BotMessageSquare,
  Send,
  Sparkles,
  Loader2,
  Mic,
  MicOff,
  Headphones,
  MessageSquare,
} from 'lucide-react'
import { useVoiceRecognition } from '@/hooks/use-voice-recognition'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const GESTAO_PROMPTS = [
  'Quais trocas vencem este mês?',
  'Quais propostas estão sem resposta?',
  'Quais equipamentos precisam de troca este trimestre?',
  'Resumo do cliente Supermercado Mateus',
]

const ATENDIMENTO_PROMPTS = [
  '1-Manutenção',
  '2-Orçamento',
  '3-Nova Venda/Troca',
  '4-Instalação',
  '5-Falar com Sócio',
]

export default function Chat() {
  const [mode, setMode] = useState<'gestao' | 'atendimento'>('gestao')
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
  const { isListening, transcript, start, stop, supported } = useVoiceRecognition()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (transcript) setInput(transcript)
  }, [transcript])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const switchMode = (newMode: 'gestao' | 'atendimento') => {
    setMode(newMode)
    setConversationId(null)
    setMessages([
      {
        role: 'assistant',
        content:
          newMode === 'gestao'
            ? 'Modo Gestão (BI) ativo. Consulte indicadores por voz ou texto. Ex: "Quais trocas vencem este mês?"'
            : 'Modo Atendimento ativo. Simule uma conversa de cliente via WhatsApp. Escolha uma opção do menu ou digite livremente.',
      },
    ])
  }

  const handleSend = async (textToSend?: string) => {
    const message = textToSend || input
    if (!message.trim() || loading) return

    setMessages((prev) => [...prev, { role: 'user', content: message }])
    if (!textToSend) setInput('')
    setLoading(true)

    const endpoint =
      mode === 'atendimento' ? '/backend/v1/atendimento-chat' : '/backend/v1/ask-assistant'
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: pb.authStore.token },
        body: JSON.stringify({ message, conversation_id: conversationId }),
      })

      const result = await streamAgentChat(res, {
        onChunk: (_delta, accumulated) => {
          setMessages((prev) => {
            const next = [...prev]
            next[next.length - 1].content = accumulated
            return next
          })
        },
      })

      if (result.conversation_id) setConversationId(result.conversation_id)
    } catch {
      setMessages((prev) => {
        const next = [...prev]
        next[next.length - 1].content = 'Desculpe, ocorreu um erro. Tente novamente.'
        return next
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleVoice = () => {
    if (isListening) {
      stop()
    } else {
      start()
    }
  }

  const prompts = mode === 'gestao' ? GESTAO_PROMPTS : ATENDIMENTO_PROMPTS

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] max-w-4xl mx-auto space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-[#25d366] text-white flex items-center justify-center">
            <BotMessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Assistente Layout 22</h1>
            <p className="text-xs text-slate-500">IA treinada na sua carteira de supermercados</p>
          </div>
        </div>
        <Tabs value={mode} onValueChange={(v) => switchMode(v as 'gestao' | 'atendimento')}>
          <TabsList className="h-8">
            <TabsTrigger value="gestao" className="text-xs px-2 py-0.5 gap-1">
              <Headphones className="h-3 w-3" /> BI
            </TabsTrigger>
            <TabsTrigger value="atendimento" className="text-xs px-2 py-0.5 gap-1">
              <MessageSquare className="h-3 w-3" /> Atend.
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full shrink-0 flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <Sparkles className="h-3 w-3 text-amber-500" /> {prompt}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="h-7 w-7 rounded-full bg-[#25d366] text-white flex items-center justify-center shrink-0">
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
              {m.content || '...'}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex items-center gap-2 pt-2"
      >
        {supported && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleVoice}
            className={
              isListening ? 'bg-red-50 border-red-300 text-red-600 animate-pulse' : 'bg-white'
            }
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isListening ? 'Ouvindo...' : 'Pergunte algo sobre vendas, trocas, clientes...'
          }
          className="bg-white"
          disabled={loading}
        />
        <Button type="submit" disabled={loading} className="bg-[#1e3a8a] hover:bg-[#172a63]">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
