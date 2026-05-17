'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Percent, DollarSign, Bell, Palette, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [tax, setTax] = useState({ rate: 15, inclusive: false, label: 'VAT' })
  const [currency, setCurrency] = useState({ symbol: '₵', code: 'GHS', name: 'Ghana Cedi' })
  const [notify, setNotify] = useState({ lowStock: true, newSale: true, newCustomer: false, dailyReport: true })
  const [appearance, setAppearance] = useState({ theme: 'light', primaryColor: '#3b82f6', compactMode: false })

  const save = (section: string) => toast.success(`${section} settings saved`)

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Settings size={22} /> Settings</h1>
        <p className="text-muted-foreground text-sm">Configure your POS system preferences</p>
      </div>

      <Tabs defaultValue="tax">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="tax" className="gap-1.5 text-xs"><Percent size={14} /> Tax</TabsTrigger>
          <TabsTrigger value="currency" className="gap-1.5 text-xs"><DollarSign size={14} /> Currency</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs"><Bell size={14} /> Alerts</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5 text-xs"><Palette size={14} /> Appearance</TabsTrigger>
        </TabsList>

        {/* Tax */}
        <TabsContent value="tax">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Percent size={16} /> Tax Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Tax Label</Label>
                <Input value={tax.label} onChange={(e) => setTax({ ...tax, label: e.target.value })} placeholder="VAT, GST, Sales Tax..." />
              </div>
              <div className="space-y-1">
                <Label>Tax Rate (%)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={tax.rate}
                    onChange={(e) => setTax({ ...tax, rate: +e.target.value })}
                    className="max-w-[120px]"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  id="taxInclusive"
                  checked={tax.inclusive}
                  onChange={(e) => setTax({ ...tax, inclusive: e.target.checked })}
                  className="w-4 h-4"
                />
                <div>
                  <label htmlFor="taxInclusive" className="text-sm font-medium cursor-pointer">Tax Inclusive Pricing</label>
                  <p className="text-xs text-muted-foreground">Prices shown include tax. Tax is calculated backwards from the total.</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-sm">
                <p className="font-medium mb-1">Preview</p>
                <p className="text-muted-foreground">Item price: ₵100.00 → {tax.inclusive ? `Tax (${tax.rate}%): ₵${(100 - 100 / (1 + tax.rate / 100)).toFixed(2)} · Net: ₵${(100 / (1 + tax.rate / 100)).toFixed(2)}` : `Tax (${tax.rate}%): ₵${(100 * tax.rate / 100).toFixed(2)} · Total: ₵${(100 + 100 * tax.rate / 100).toFixed(2)}`}</p>
              </div>
              <Button onClick={() => save('Tax')}>Save Tax Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Currency */}
        <TabsContent value="currency">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><DollarSign size={16} /> Currency Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Currency Symbol</Label>
                  <Input value={currency.symbol} onChange={(e) => setCurrency({ ...currency, symbol: e.target.value })} maxLength={3} />
                </div>
                <div className="space-y-1">
                  <Label>Currency Code</Label>
                  <Input value={currency.code} onChange={(e) => setCurrency({ ...currency, code: e.target.value.toUpperCase() })} maxLength={3} placeholder="GHS, USD, EUR..." />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Currency Name</Label>
                <Input value={currency.name} onChange={(e) => setCurrency({ ...currency, name: e.target.value })} />
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-sm">
                <p className="font-medium mb-1">Preview</p>
                <p className="text-muted-foreground">{currency.symbol}1,234.56 {currency.code}</p>
              </div>
              <Button onClick={() => save('Currency')}>Save Currency Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell size={16} /> Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {([
                { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Notify when product stock falls below reorder point' },
                { key: 'newSale', label: 'New Sale Completed', desc: 'Notify on every completed transaction' },
                { key: 'newCustomer', label: 'New Customer Registered', desc: 'Notify when a new customer joins' },
                { key: 'dailyReport', label: 'Daily Sales Report', desc: 'Daily summary of sales at end of day' },
              ] as const).map(({ key, label, desc }) => (
                <div key={key} className="flex items-center gap-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id={key}
                    checked={notify[key]}
                    onChange={(e) => setNotify({ ...notify, [key]: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <label htmlFor={key} className="text-sm font-medium cursor-pointer">{label}</label>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
              <Button onClick={() => save('Notification')}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Palette size={16} /> Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-3">
                  {['light', 'dark', 'system'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setAppearance({ ...appearance, theme: t })}
                      className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium capitalize transition-colors ${appearance.theme === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <Label>Primary Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={appearance.primaryColor}
                    onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer border"
                  />
                  <Input value={appearance.primaryColor} onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })} className="max-w-[120px] font-mono text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  id="compactMode"
                  checked={appearance.compactMode}
                  onChange={(e) => setAppearance({ ...appearance, compactMode: e.target.checked })}
                  className="w-4 h-4"
                />
                <div>
                  <label htmlFor="compactMode" className="text-sm font-medium cursor-pointer">Compact Mode</label>
                  <p className="text-xs text-muted-foreground">Reduce spacing and card padding for denser information display</p>
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                <Shield size={14} className="inline mr-1" />
                Theme changes will apply on next page reload after backend integration.
              </div>
              <Button onClick={() => save('Appearance')}>Save Appearance</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
