import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(200, 'Nome muito longo'),
  cnpj: z.string().max(20, 'CNPJ muito longo').optional().or(z.literal('')),
  porte: z.enum(['Pequeno', 'Médio', 'Grande rede']).optional(),
  cidade: z.string().max(100).optional().or(z.literal('')),
  estado: z.string().max(2, 'UF deve ter 2 caracteres').optional().or(z.literal('')),
  regiao: z.string().max(100).optional().or(z.literal('')),
  status: z.enum(['Prospecção', 'Ativo', 'Pós-venda', 'Inativo']).optional(),
  telefone_whatsapp: z.string().max(20).optional().or(z.literal('')),
})

export const oportunidadeSchema = z.object({
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  equipamento: z.string().min(1, 'Equipamento é obrigatório').max(200),
  status: z.enum(['Prospecção', 'Cotação enviada', 'Em análise', 'Fechado', 'Perdido']).optional(),
  valor_estimado: z.number().min(0, 'Valor deve ser positivo').optional(),
  comissao_estimada: z.number().min(0, 'Comissão deve ser positiva').optional(),
  prazo_resposta: z.string().optional().or(z.literal('')),
})

export const chamadoSchema = z.object({
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  equipamento: z.string().min(1, 'Equipamento é obrigatório').max(200),
  problema: z.string().min(3, 'Descreva o problema').max(2000, 'Descrição muito longa'),
})

export const interacaoSchema = z.object({
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  tipo: z.enum(['visita', 'ligação', 'WhatsApp', 'email', 'proposta']),
  resultado: z.string().min(3, 'Descreva o resultado').max(2000),
  proximo_passo: z.string().max(500).optional().or(z.literal('')),
})

export const visitaSchema = z.object({
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  motivo: z.enum(['comercial', 'técnica', 'follow-up']).optional(),
  resultado: z.string().min(3, 'Descreva o resultado').max(2000),
  proximos_passos: z.string().max(500).optional().or(z.literal('')),
  regiao: z.string().max(100).optional().or(z.literal('')),
})

export function sanitizeString(input: string): string {
  return input.trim().slice(0, 2000)
}

export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as string
    if (!errors[field]) {
      errors[field] = issue.message
    }
  }
  return { success: false, errors }
}
