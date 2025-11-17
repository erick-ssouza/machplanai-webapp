export interface MachiningPlan {
  id: string
  user_id: string
  title: string
  description: string
  material: string
  main_operation: string
  secondary_operations?: string
  restrictions?: string
  machine_type: string
  observations?: string
  generated_plan: string
  created_at: string
  updated_at: string
}

export interface PlanFormData {
  title: string
  description: string
  material: string
  main_operation: string
  secondary_operations?: string
  restrictions?: string
  machine_type: string
  observations?: string
}
