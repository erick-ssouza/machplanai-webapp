'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MachiningPlan } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, FileText, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [plans, setPlans] = useState<MachiningPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecentPlans()
  }, [])

  const loadRecentPlans = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('machining_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (data) {
        setPlans(data)
      }
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo ao MachPlan AI - Gerador de planos de usinagem com inteligência artificial
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Total de Planos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{plans.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Criados Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {plans.filter(p => {
                const today = new Date().toDateString()
                return new Date(p.created_at).toDateString() === today
              }).length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Produtividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">Alta</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/novo-plano">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="mr-2 h-5 w-5" />
                Criar Novo Plano
              </Button>
            </Link>
            <Link href="/dashboard/planos">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-5 w-5" />
                Ver Todos os Planos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Planos Criados</CardTitle>
            <CardDescription>Seus planos mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : plans.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum plano criado ainda</p>
            ) : (
              <div className="space-y-3">
                {plans.map((plan) => (
                  <Link
                    key={plan.id}
                    href={`/dashboard/planos/${plan.id}`}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <p className="font-medium text-gray-900 truncate">{plan.title}</p>
                    <p className="text-sm text-gray-500 truncate">{plan.material}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(plan.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
