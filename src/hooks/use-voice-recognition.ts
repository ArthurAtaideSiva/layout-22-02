import { useState, useRef, useCallback, useEffect } from 'react'

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SR) {
      setSupported(true)
      const rec = new SR()
      rec.lang = 'pt-BR'
      rec.continuous = false
      rec.interimResults = true
      rec.onresult = (event: any) => {
        let text = ''
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript
        }
        setTranscript(text)
      }
      rec.onend = () => setIsListening(false)
      rec.onerror = () => setIsListening(false)
      recognitionRef.current = rec
    }
    return () => {
      try {
        recognitionRef.current?.stop()
      } catch {
        /* intentionally ignored */
      }
    }
  }, [])

  const start = useCallback(() => {
    setTranscript('')
    try {
      recognitionRef.current?.start()
      setIsListening(true)
    } catch {
      /* intentionally ignored */
    }
  }, [])

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch {
      /* intentionally ignored */
    }
    setIsListening(false)
  }, [])

  return { isListening, transcript, start, stop, supported }
}
