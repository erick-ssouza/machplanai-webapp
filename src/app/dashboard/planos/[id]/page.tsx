'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MachiningPlan } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, Calendar, Settings, FileText } from 'lucide-react'
import Link from 'next/link'

export default function PlanoDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const [plan, setPlan] = useState<MachiningPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlan()
  }, [params.id])

  const loadPlan = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('machining_plans')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

      if (data) {
        setPlan(data)
      } else {
        router.push('/dashboard/planos')
      }
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!plan) {
    return null
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/planos">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{plan.title}</h1>
          <p className="text-gray-600 mt-1">Detalhes do plano de usinagem</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Material</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">{plan.material}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Máquina</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">{plan.machine_type}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Criado em</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(plan.created_at).toLocaleDateString('pt-BR')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Informações do Processo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Descrição da Peça</h3>
            <p className="text-gray-700">{plan.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Operação Principal</h3>
            <p className="text-gray-700">{plan.main_operation}</p>
          </div>

          {plan.secondary_operations && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Operações Secundárias</h3>
              <p className="text-gray-700">{plan.secondary_operations}</p>
            </div>
          )}

          {plan.restrictions && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Restrições e Tolerâncias</h3>
              <p className="text-gray-700">{plan.restrictions}</p>
            </div>
          )}

          {plan.observations && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Observações</h3>
              <p className="text-gray-700">{plan.observations}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Plano de Processo Gerado
          </CardTitle>
          <CardDescription>
            Plano detalhado gerado pela inteligência artificial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {plan.generated_plan}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Link href="/dashboard/planos">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Lista
          </Button>
        </Link>
        <Button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Imprimir Plano
        </Button>
      </div>
    </div>
  )
}
