import { describe, expect, it } from 'vitest'
import { hasActiveSportConflict, type MembershipRecord } from './membership-api'

const now = new Date('2026-09-24T00:00:00.000Z')
const record = (sportType: string, status: MembershipRecord['status'] = 'ACTIVE', endDate = '2026-09-25T00:00:00.000Z'): MembershipRecord => ({ id: 1, packageId: 2, packageName: 'Plan', sportType, durationDays: 30, listedPrice: 500000, startDate: '2026-09-23T00:00:00.000Z', endDate, status })

describe('membership sport rules', () => {
  it('blocks normalized same sport and all-sports membership both ways', () => {
    expect(hasActiveSportConflict(' yoga ', [record('Yoga')], now)).toBe(true)
    expect(hasActiveSportConflict('Toàn diện', [record('Gym')], now)).toBe(true)
    expect(hasActiveSportConflict('Gym', [record(' toàn diện ')], now)).toBe(true)
  })
  it('allows another sport and ignores ended memberships', () => {
    expect(hasActiveSportConflict('Gym', [record('Yoga')], now)).toBe(false)
    expect(hasActiveSportConflict('Yoga', [record('Yoga', 'EXPIRED')], now)).toBe(false)
    expect(hasActiveSportConflict('Yoga', [record('Yoga', 'ACTIVE', '2026-09-24T00:00:00.000Z')], now)).toBe(false)
  })
})
