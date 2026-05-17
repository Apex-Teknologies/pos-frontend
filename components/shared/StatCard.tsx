import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  trend?: number
}

export default function StatCard({ title, value, subtitle, icon: Icon, iconColor = 'text-blue-600', trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={cn('p-2.5 rounded-xl bg-slate-100', iconColor)}>
            <Icon size={22} />
          </div>
        </div>
        {trend !== undefined && (
          <p className={cn('text-xs mt-3 font-medium', trend >= 0 ? 'text-green-600' : 'text-red-500')}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs yesterday
          </p>
        )}
      </CardContent>
    </Card>
  )
}
