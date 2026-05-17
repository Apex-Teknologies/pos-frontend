'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { HelpCircle, Search, BookOpen, Keyboard, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  { q: 'How do I process a refund?', a: 'Go to Transactions, find the transaction you want to refund, click on it to open the receipt, then click the "Refund" button. The transaction status will update to "refunded" and stock will be restored.' },
  { q: 'How do I add a new product?', a: 'Navigate to Inventory → Products, click "Add Product", fill in the product details including name, SKU, price, cost, stock quantity, and category. Click Save to create the product.' },
  { q: 'How do I apply a discount at checkout?', a: 'In the POS screen, use the discount input field at the bottom of the cart panel to apply a flat discount amount. The discount will be deducted from the order total.' },
  { q: 'How do loyalty points work?', a: 'Customers earn loyalty points automatically on purchases (1 point per currency unit spent by default). Points are tracked in the Customers section and can be redeemed for discounts.' },
  { q: 'How do I create a purchase order?', a: 'Go to Purchase Orders, click "New Order", select a supplier, add products and quantities, then save. When the goods arrive, click "Mark Received" to automatically update inventory stock levels.' },
  { q: 'How do I switch branches?', a: 'Click the branch name in the top navigation bar to open the branch switcher dropdown. Select any branch to switch your active branch. All data shown will reflect the selected branch.' },
  { q: 'Can I print receipts?', a: 'Yes! After completing a sale, the receipt dialog will appear. Click "Print Receipt" to open the browser print dialog. You can also view and reprint past receipts from the Transactions page.' },
  { q: 'How do I export sales data?', a: 'Go to Reports, select your date range, then click "Export CSV". This will download a CSV file with all transactions for the selected period, which can be opened in Excel or Google Sheets.' },
]

const shortcuts = [
  { key: 'F1', desc: 'Focus product search in POS' },
  { key: 'F4', desc: 'Open checkout from POS' },
  { key: 'ESC', desc: 'Clear cart / close modal' },
  { key: '?', desc: 'Show keyboard shortcuts help' },
]

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><HelpCircle size={22} /> Help & Support</h1>
        <p className="text-muted-foreground text-sm">Find answers and learn how to use ApexTek POS</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search help articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Quick links */}
      {!search && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: BookOpen, title: 'Getting Started', desc: 'Set up your business, add products, and make your first sale', color: 'bg-blue-50 text-blue-700' },
            { icon: Keyboard, title: 'Keyboard Shortcuts', desc: 'Speed up your workflow with keyboard shortcuts', color: 'bg-purple-50 text-purple-700' },
            { icon: MessageCircle, title: 'Contact Support', desc: 'Get in touch with our support team', color: 'bg-green-50 text-green-700' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <Card key={title} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                  <Icon size={20} />
                </div>
                <p className="font-semibold text-sm mb-1">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Keyboard shortcuts */}
      {!search && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Keyboard size={16} /> Keyboard Shortcuts</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {shortcuts.map(({ key, desc }) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono font-semibold min-w-[40px] text-center">{key}</kbd>
                <span className="text-sm text-muted-foreground">{desc}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* FAQs */}
      <Card>
        <CardHeader><CardTitle className="text-base">Frequently Asked Questions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {filteredFaqs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No results for "{search}"</p>}
          {filteredFaqs.map((faq, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm font-medium">{faq.q}</span>
                {openFaq === i ? <ChevronUp size={16} className="text-muted-foreground shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground border-t bg-slate-50">{faq.a}</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-5 flex items-start gap-4">
          <MessageCircle size={24} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-blue-900">Need more help?</p>
            <p className="text-sm text-blue-700 mt-1">Our support team is available 24/7. Reach us at <a href="mailto:support@apextek.com" className="underline">support@apextek.com</a> or through the in-app chat once connected to backend.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
