import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { PlanFormData } from '@/lib/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const data: PlanFormData = await request.json()

    const prompt = `Você é um especialista em processos de usinagem. Gere um plano de processo detalhado e profissional baseado nas seguintes informações:

INFORMAÇÕES DA PEÇA:
- Título: ${data.title}
- Descrição: ${data.description}
- Material: ${data.material}
- Operação Principal: ${data.main_operation}
${data.secondary_operations ? `- Operações Secundárias: ${data.secondary_operations}` : ''}
${data.restrictions ? `- Restrições/Tolerâncias: ${data.restrictions}` : ''}
- Tipo de Máquina: ${data.machine_type}
${data.observations ? `- Observações: ${data.observations}` : ''}

FORMATO DO PLANO:
Gere um plano de processo completo e organizado com as seguintes seções:

1. RESUMO DO PROCESSO
   - Visão geral da operação

2. SEQUÊNCIA DE OPERAÇÕES
   - Liste cada etapa numerada com descrição detalhada

3. FERRAMENTAS RECOMENDADAS
   - Para cada operação, especifique:
     * Tipo de ferramenta
     * Material da ferramenta
     * Geometria recomendada

4. PARÂMETROS DE CORTE
   - Para cada operação, forneça:
     * Velocidade de corte (m/min)
     * Avanço (mm/rot ou mm/min)
     * Profundidade de corte (mm)
     * RPM recomendado

5. OBSERVAÇÕES DE SEGURANÇA
   - Cuidados importantes durante o processo

6. SUGESTÕES DE OTIMIZAÇÃO
   - Dicas para melhorar eficiência e qualidade

Seja técnico, preciso e profissional. Use valores realistas baseados no material e operação especificados.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em engenharia de manufatura e processos de usinagem com 20 anos de experiência.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const generatedPlan = completion.choices[0].message.content

    return NextResponse.json({ generatedPlan })
  } catch (error) {
    console.error('Erro ao gerar plano:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar plano com IA' },
      { status: 500 }
    )
  }
}
