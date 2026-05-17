'use client'
import { useState } from 'react'
import { useBranchStore } from '@/lib/store/branchStore'
import { mockBusiness } from '@/lib/mock/business'
import { Branch } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, MapPin, Phone, Plus, Edit, Save } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

export default function BusinessPage() {
  const { branches, setBranch, currentBranch } = useBranchStore()
  const [business, setBusiness] = useState(mockBusiness)
  const [saved, setSaved] = useState(false)
  const [branchOpen, setBranchOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [branchForm, setBranchForm] = useState({ name: '', address: '', phone: '' })

  const saveBusiness = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const openBranchEdit = (b?: Branch) => {
    setEditingBranch(b ?? null)
    setBranchForm(b ? { name: b.name, address: b.address, phone: b.phone } : { name: '', address: '', phone: '' })
    setBranchOpen(true)
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Building2 size={22} /> Business Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your business settings and branches</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Business Info</TabsTrigger>
          <TabsTrigger value="tax">Tax & Currency</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Business Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <Label>Business Name</Label>
                  <Input value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Phone</Label>
                  <Input value={business.phone} onChange={(e) => setBusiness({ ...business, phone: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input value={business.email} onChange={(e) => setBusiness({ ...business, email: e.target.value })} />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label>Address</Label>
                  <Input value={business.address} onChange={(e) => setBusiness({ ...business, address: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Tax Number / TIN</Label>
                  <Input value={business.taxNumber} onChange={(e) => setBusiness({ ...business, taxNumber: e.target.value })} />
                </div>
              </div>
              <Button onClick={saveBusiness} className="gap-2">
                <Save size={15} /> {saved ? 'Saved!' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Tax & Currency Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={business.taxRate}
                    onChange={(e) => setBusiness({ ...business, taxRate: +e.target.value })}
                    min={0} max={100}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Tax Mode</Label>
                  <select
                    value={business.taxInclusive ? 'inclusive' : 'exclusive'}
                    onChange={(e) => setBusiness({ ...business, taxInclusive: e.target.value === 'inclusive' })}
                    className="w-full h-10 border rounded-md px-3 text-sm"
                  >
                    <option value="exclusive">Exclusive (added on top)</option>
                    <option value="inclusive">Inclusive (included in price)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Currency Code</Label>
                  <Input
                    value={business.currency}
                    onChange={(e) => setBusiness({ ...business, currency: e.target.value })}
                    placeholder="GHS"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Currency Symbol</Label>
                  <Input
                    value={business.currencySymbol}
                    onChange={(e) => setBusiness({ ...business, currencySymbol: e.target.value })}
                    placeholder="₵"
                  />
                </div>
              </div>
              <Button onClick={saveBusiness} className="gap-2">
                <Save size={15} /> {saved ? 'Saved!' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="mt-4">
          <div className="space-y-3">
            <div className="flex justify-end">
              <Button onClick={() => openBranchEdit()} className="gap-2"><Plus size={15} /> Add Branch</Button>
            </div>
            {branches.map((b) => (
              <Card key={b.id} className={currentBranch.id === b.id ? 'border-blue-400 ring-1 ring-blue-400' : ''}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{b.name}</p>
                      {currentBranch.id === b.id && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Active</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={12} /> {b.address}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone size={12} /> {b.phone}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => openBranchEdit(b)}>
                    <Edit size={13} /> Edit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={branchOpen} onOpenChange={setBranchOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>Branch Name</Label>
              <Input value={branchForm.name} onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <Input value={branchForm.address} onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input value={branchForm.phone} onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBranchOpen(false)}>Cancel</Button>
            <Button onClick={() => setBranchOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
