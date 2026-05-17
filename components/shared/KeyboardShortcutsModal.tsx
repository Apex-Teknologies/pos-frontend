'use client'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Keyboard } from 'lucide-react'

const shortcuts = [
  { category: 'POS / Checkout', items: [
    { key: 'F1', desc: 'Focus product search' },
    { key: 'F4', desc: 'Open checkout' },
    { key: 'ESC', desc: 'Clear cart' },
  ]},
  { category: 'Navigation', items: [
    { key: '?', desc: 'Show keyboard shortcuts' },
    { key: 'Alt + D', desc: 'Go to Dashboard' },
    { key: 'Alt + P', desc: 'Go to POS' },
    { key: 'Alt + I', desc: 'Go to Inventory' },
  ]},
]

export default function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setOpen(true)
      }
      if (e.altKey && e.key === 'd') { e.preventDefault(); window.location.href = '/' }
      if (e.altKey && e.key === 'p') { e.preventDefault(); window.location.href = '/pos' }
      if (e.altKey && e.key === 'i') { e.preventDefault(); window.location.href = '/inventory' }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Keyboard size={18} /> Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {shortcuts.map(({ category, items }) => (
            <div key={category}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{category}</p>
              <div className="space-y-2">
                {items.map(({ key, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">{desc}</span>
                    <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono font-semibold">{key}</kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">Press <kbd className="px-1 py-0.5 bg-slate-100 rounded text-xs font-mono">ESC</kbd> to close</p>
      </DialogContent>
    </Dialog>
  )
}
