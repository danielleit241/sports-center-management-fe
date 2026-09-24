import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MembershipExperience } from './membership-experience'
import { server } from '../../test/setup'
import type { MembershipRecord, PackageOption } from './membership-api'

const yoga: PackageOption = { id: 1, code: 'YOGA-90', name: 'Yoga Chuyên Sâu', description: 'Các lớp Yoga', price: 1800000, durationDays: 90, sportType: 'Yoga', benefits: ['36 buổi tập'], status: 'ACTIVE' }
const gym: PackageOption = { id: 2, code: 'GYM-30', name: 'Gym Tự Do', description: 'Tự do tập Gym', price: 500000, durationDays: 30, sportType: 'Gym', benefits: ['Không giới hạn'], status: 'ACTIVE' }
const all: PackageOption = { id: 3, code: 'ALL-365', name: 'Toàn diện', description: null, price: 6000000, durationDays: 365, sportType: 'Toàn diện', benefits: [], status: 'ACTIVE' }
const yogaMembership: MembershipRecord = { id: 7, packageId: 1, packageName: yoga.name, sportType: 'Yoga', durationDays: 90, listedPrice: 1800000, startDate: '2026-09-20T00:00:00.000Z', endDate: '2026-12-19T00:00:00.000Z', status: 'ACTIVE' }
let history: MembershipRecord[]
let registered: boolean
let simulateConflict: boolean

beforeEach(() => {
  history = [yogaMembership]; registered = false; simulateConflict = false
  server.use(
    http.get('/api/packages', () => HttpResponse.json([yoga, gym, all])),
    http.get('/api/memberships', () => HttpResponse.json(history)),
    http.post('/api/memberships', async ({ request }) => {
      const body = await request.json() as { packageId: number }
      if (simulateConflict || body.packageId === 3) return HttpResponse.json({ code: 'SPORT_MEMBERSHIP_CONFLICT', message: 'Bạn đang có gói tập còn hiệu lực cho bộ môn này' }, { status: 409 })
      registered = true
      history = [...history, { id: 8, packageId: 2, packageName: gym.name, sportType: gym.sportType, durationDays: gym.durationDays, listedPrice: gym.price, startDate: '2026-09-24T10:00:00.000Z', endDate: '2026-10-24T10:00:00.000Z', status: 'ACTIVE' }]
      return HttpResponse.json(history[1], { status: 201 })
    }),
  )
})

describe('membership purchase and history screens', () => {
  it('loads package comparison, selects a different sport, registers and signals parent navigation', async () => {
    const onOpenMemberships = vi.fn()
    const onRegistrationComplete = vi.fn()
    render(<MembershipExperience accessToken="token" view="packages" successMessage="" onOpenMemberships={onOpenMemberships} onRegistrationComplete={onRegistrationComplete} />)
    expect(await screen.findByRole('button', { name: /Yoga Chuyên Sâu/ })).toBeVisible()
    const yogaOption = screen.getByRole('button', { name: /Yoga Chuyên Sâu/ })
    expect(yogaOption).toBeDisabled()
    expect(screen.getByRole('button', { name: /Toàn diện/ })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: /Gym Tự Do/ }))
    expect(screen.getByText(/Thanh toán được thực hiện bên ngoài ứng dụng/)).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: /Đăng ký gói/ }))
    await waitFor(() => expect(registered).toBe(true))
    expect(onOpenMemberships).toHaveBeenCalledOnce()
    expect(onRegistrationComplete).toHaveBeenCalledWith('Gym Tự Do đã có hiệu lực ngay. Thanh toán được thực hiện bên ngoài ứng dụng.')
  })

  it('shows stable conflict feedback from server', async () => {
    simulateConflict = true
    history = []
    render(<MembershipExperience accessToken="token" view="packages" successMessage="" onOpenMemberships={() => undefined} onRegistrationComplete={() => undefined} />)
    await screen.findByRole('button', { name: /Yoga Chuyên Sâu/ })
    fireEvent.click(screen.getByRole('button', { name: /Đăng ký gói/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Bạn đang có gói tập còn hiệu lực cho bộ môn này')
  })

  it('renders membership snapshots and helpful empty states', async () => {
    render(<MembershipExperience accessToken="token" view="memberships" successMessage="" onOpenMemberships={() => undefined} onRegistrationComplete={() => undefined} />)
    const historyHeading = await screen.findByRole('heading', { name: 'Membership của tôi.' })
    expect(historyHeading).toBeVisible()
    const activeSection = screen.getByRole('heading', { name: 'Đang hiệu lực' }).parentElement!
    expect(within(activeSection).getByText('Yoga Chuyên Sâu')).toBeVisible()
    expect(within(activeSection).getByText('1.800.000 đ')).toBeVisible()
  })

  it('shows an empty catalogue and legacy history without fabricating snapshot values', async () => {
    server.use(http.get('/api/packages', () => HttpResponse.json([])))
    const empty = render(<MembershipExperience accessToken="token" view="packages" successMessage="" onOpenMemberships={() => undefined} onRegistrationComplete={() => undefined} />)
    expect(await screen.findByText('Hiện chưa có gói tập đang mở.')).toBeVisible()
    empty.unmount()
    history = [{ ...yogaMembership, packageId: null, packageName: null, sportType: null, durationDays: null, listedPrice: null }]
    render(<MembershipExperience accessToken="token" view="memberships" successMessage="" onOpenMemberships={() => undefined} onRegistrationComplete={() => undefined} />)
    expect(await screen.findByText('Tên gói chưa lưu')).toBeVisible()
    expect(screen.getByText('Bộ môn chưa lưu')).toBeVisible()
    expect(screen.getAllByText('—')).toHaveLength(2)
  })

  it('shows catalog request errors accessibly', async () => {
    server.use(http.get('/api/packages', () => HttpResponse.json({ code: 'UNAVAILABLE', message: 'Không thể tải gói lúc này' }, { status: 503 })))
    render(<MembershipExperience accessToken="token" view="packages" successMessage="" onOpenMemberships={() => undefined} onRegistrationComplete={() => undefined} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Không thể tải gói lúc này')
  })
})
