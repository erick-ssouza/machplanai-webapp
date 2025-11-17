'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PlanFormData } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles } from 'lucide-react'

export default function NovoPlanoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const planData: PlanFormData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      material: formData.get('material') as string,
      main_operation: formData.get('main_operation') as string,
      secondary_operations: formData.get('secondary_operations') as string || undefined,
      restrictions: formData.get('restrictions') as string || undefined,
      machine_type: formData.get('machine_type') as string,
      observations: formData.get('observations') as string || undefined,
    }

    try {
      // Gerar plano com IA
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar plano')
      }

      const { generatedPlan } = await response.json()

      // Salvar no banco
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const { error: dbError } = await supabase
        .from('machining_plans')
        .insert({
          user_id: user.id,
          title: planData.title,
          description: planData.description,
          material: planData.material,
          main_operation: planData.main_operation,
          secondary_operations: planData.secondary_operations,
          restrictions: planData.restrictions,
          machine_type: planData.machine_type,
          observations: planData.observations,
          generated_plan: generatedPlan,
        })

      if (dbError) throw dbError

      router.push('/dashboard/planos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar plano')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Criar Novo Plano</h1>
        <p className="text-gray-600 mt-1">
          Preencha as informações abaixo para gerar um plano de usinagem com IA
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Processo</CardTitle>
          <CardDescription>
            Forneça os detalhes do processo de usinagem que deseja planejar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Plano *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ex: Usinagem de Eixo Principal"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição da Peça *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descreva a peça que será usinada..."
                rows={3}
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material *</Label>
                <Input
                  id="material"
                  name="material"
                  placeholder="Ex: Aço AISI 1045"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="machine_type">Tipo de Máquina *</Label>
                <Input
                  id="machine_type"
                  name="machine_type"
                  placeholder="Ex: Torno CNC"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="main_operation">Operação Principal *</Label>
              <Input
                id="main_operation"
                name="main_operation"
                placeholder="Ex: Torneamento cilíndrico"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_operations">Operações Secundárias</Label>
              <Input
                id="secondary_operations"
                name="secondary_operations"
                placeholder="Ex: Furação, rosqueamento"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restrictions">Restrições e Tolerâncias</Label>
              <Textarea
                id="restrictions"
                name="restrictions"
                placeholder="Ex: Tolerância dimensional ±0.05mm, acabamento Ra 1.6"
                rows={2}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observações Adicionais</Label>
              <Textarea
                id="observations"
                name="observations"
                placeholder="Informações extras sobre o processo..."
                rows={2}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando Plano...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar Plano com IA
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
