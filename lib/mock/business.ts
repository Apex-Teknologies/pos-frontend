import { Business, Branch, User } from '@/lib/types'

export const mockBusiness: Business = {
  id: 'biz-1',
  name: 'ApexTek Store',
  address: '123 Commerce Street, Accra, Ghana',
  phone: '+233 24 000 0001',
  email: 'info@apextek.com',
  taxNumber: 'TIN-123456789',
  taxRate: 15,
  taxInclusive: false,
  currency: 'GHS',
  currencySymbol: '₵',
}

export const mockBranches: Branch[] = [
  {
    id: 'branch-1',
    businessId: 'biz-1',
    name: 'Main Branch',
    address: '123 Commerce Street, Accra',
    phone: '+233 24 000 0001',
    managerId: 'user-2',
  },
  {
    id: 'branch-2',
    businessId: 'biz-1',
    name: 'Kumasi Branch',
    address: '45 Market Circle, Kumasi',
    phone: '+233 24 000 0002',
    managerId: 'user-3',
  },
]

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Kwame Mensah',
    email: 'admin@apextek.com',
    role: 'admin',
    pin: '1234',
    branchId: 'branch-1',
  },
  {
    id: 'user-2',
    name: 'Ama Asante',
    email: 'manager@apextek.com',
    role: 'manager',
    pin: '5678',
    branchId: 'branch-1',
  },
  {
    id: 'user-3',
    name: 'Kofi Boateng',
    email: 'cashier@apextek.com',
    role: 'cashier',
    pin: '0000',
    branchId: 'branch-2',
  },
]
