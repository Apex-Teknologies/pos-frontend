'use client'
import { useNotificationStore } from '@/lib/store/notificationStore'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCheck, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const typeIcon = {
  warning: <AlertTriangle size={16} className="text-yellow-500" />,
  success: <CheckCircle size={16} className="text-green-500" />,
  info: <Info size={16} className="text-blue-500" />,
  error: <XCircle size={16} className="text-red-500" />,
}

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead } = useNotificationStore()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Bell size={22} /> Notifications</h1>
          <p className="text-muted-foreground text-sm">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
            <CheckCheck size={14} /> Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">No notifications</div>
        )}
        {notifications.map((n) => (
          <Card
            key={n.id}
            className={cn('cursor-pointer transition-colors hover:bg-slate-50', !n.read && 'border-blue-200 bg-blue-50/30')}
            onClick={() => markRead(n.id)}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className="mt-0.5">{typeIcon[n.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-sm">{n.title}</p>
                  {!n.read && <Badge className="text-xs px-1.5 py-0 h-4 bg-blue-500">New</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(n.createdAt)}</p>
              </div>
              {n.link && (
                <Link href={n.link} className="text-xs text-blue-600 hover:underline shrink-0" onClick={(e) => e.stopPropagation()}>
                  View →
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
