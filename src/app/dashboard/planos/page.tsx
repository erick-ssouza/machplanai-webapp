'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MachiningPlan } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Search, Loader2, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function PlanosPage() {
  const [plans, setPlans] = useState<MachiningPlan[]>([])
  const [filteredPlans, setFilteredPlans] = useState<MachiningPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    loadPlans()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = plans.filter(plan =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.main_operation.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPlans(filtered)
    } else {
      setFilteredPlans(plans)
    }
  }, [searchTerm, plans])

  const loadPlans = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('machining_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        setPlans(data)
        setFilteredPlans(data)
      }
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const { error } = await supabase
      .from('machining_plans')
      .delete()
      .eq('id', deleteId)

    if (!error) {
      setPlans(plans.filter(p => p.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Planos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os seus planos de usinagem
          </p>
        </div>
        <Link href="/dashboard/novo-plano">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="mr-2 h-4 w-4" />
            Novo Plano
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Planos</CardTitle>
          <CardDescription>
            Pesquise por título, material ou operação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar planos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredPlans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchTerm ? 'Nenhum plano encontrado' : 'Nenhum plano criado ainda'}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/novo-plano">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  Criar Primeiro Plano
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg truncate">{plan.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium text-gray-900">{plan.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Operação:</span>
                    <span className="font-medium text-gray-900 truncate ml-2">
                      {plan.main_operation}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Máquina:</span>
                    <span className="font-medium text-gray-900 truncate ml-2">
                      {plan.machine_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Criado em:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(plan.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/dashboard/planos/${plan.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setDeleteId(plan.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
