'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Settings size={22} /> Settings</h1>
        <p className="text-muted-foreground text-sm">System preferences</p>
      </div>
      <Card>
        <CardContent className="py-16 text-center text-muted-foreground">
          Additional settings coming in Week 2.
        </CardContent>
      </Card>
    </div>
  )
}
