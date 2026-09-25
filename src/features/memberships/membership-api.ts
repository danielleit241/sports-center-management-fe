export type PackageOption = {
  id: number
  code: string
  name: string
  description: string | null
  price: number
  durationDays: number
  sportType: string
  benefits: string[]
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
}

export type MembershipRecord = {
  id: number
  packageId: number | null
  packageName: string | null
  sportType: string | null
  durationDays: number | null
  listedPrice: number | null
  startDate: string
  endDate: string
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
}

export function normalizeSport(value: string) { return value.trim().toLocaleLowerCase('vi-VN') }

export function hasActiveSportConflict(candidateSport: string, memberships: MembershipRecord[], now = new Date()) {
  const all = normalizeSport('Toàn diện')
  return memberships.some((membership) => {
    if (membership.status !== 'ACTIVE' || new Date(membership.startDate) > now || new Date(membership.endDate) <= now || !membership.sportType) return false
    const currentSport = normalizeSport(membership.sportType)
    const candidate = normalizeSport(candidateSport)
    return candidate === all || currentSport === all || candidate === currentSport
  })
}

export async function listActivePackages(accessToken: string) {
  return apiRequest<PackageOption[]>('/api/packages', accessToken)
}

export async function listMemberships(accessToken: string) {
  return apiRequest<MembershipRecord[]>('/api/memberships', accessToken)
}

export async function registerMembership(accessToken: string, packageId: number) {
  return apiRequest<MembershipRecord>('/api/memberships', accessToken, { method: 'POST', body: JSON.stringify({ packageId }) })
}

async function apiRequest<T>(path: string, accessToken: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${import.meta.env.VITE_API_URL || ''}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', ...init.headers },
  })
  const payload = await response.json() as T & { message?: string }
  if (!response.ok) throw new Error('message' in payload && payload.message ? payload.message : 'Không thể kết nối máy chủ')
  return payload as T
}
