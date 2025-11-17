'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Settings, LayoutDashboard, FileText, PlusCircle, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const links = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/novo-plano',
      label: 'Novo Plano',
      icon: PlusCircle,
    },
    {
      href: '/dashboard/planos',
      label: 'Meus Planos',
      icon: FileText,
    },
  ]

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">MachPlan AI</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  )
}
