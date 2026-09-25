import { useCallback, useEffect, useMemo, useState } from 'react'
import { hasActiveSportConflict, listActivePackages, listMemberships, registerMembership, type MembershipRecord, type PackageOption } from './membership-api'
import './memberships.css'

type Props = { accessToken: string; view: 'packages' | 'memberships'; successMessage: string; onOpenMemberships: () => void; onRegistrationComplete: (message: string) => void }
const money = (value: number | null) => value === null ? '—' : `${value.toLocaleString('vi-VN')} đ`
const duration = (days: number | null) => days === null ? '—' : days >= 365 ? `${Math.round(days / 365)} năm` : days >= 30 ? `${Math.round(days / 30)} tháng` : `${days} ngày`
const date = (value: string) => new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

export function MembershipExperience({ accessToken, view, successMessage, onOpenMemberships, onRegistrationComplete }: Props) {
  const [packages, setPackages] = useState<PackageOption[]>([])
  const [memberships, setMemberships] = useState<MembershipRecord[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const refreshMemberships = useCallback(async () => setMemberships(await listMemberships(accessToken)), [accessToken])
  useEffect(() => {
    let cancelled = false
    const packageRequest = view === 'packages' ? listActivePackages(accessToken) : Promise.resolve([] as PackageOption[])
    Promise.all([packageRequest, listMemberships(accessToken)])
      .then(([catalog, history]) => { if (!cancelled) { const activePackages = catalog.filter((item) => item.status === 'ACTIVE'); setPackages(activePackages); setMemberships(history); if (view === 'packages') setSelectedId(activePackages.find((item) => !hasActiveSportConflict(item.sportType, history))?.id ?? activePackages[0]?.id ?? null) } })
      .catch((cause: unknown) => { if (!cancelled) setError(cause instanceof Error ? cause.message : 'Không thể tải gói tập') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [accessToken, view])

  const selected = useMemo(() => packages.find((item) => item.id === selectedId) ?? null, [packages, selectedId])
  const activeMemberships = memberships.filter((item) => item.status === 'ACTIVE' && new Date(item.startDate) <= new Date() && new Date(item.endDate) > new Date())

  async function submit() {
    if (!selected || hasActiveSportConflict(selected.sportType, memberships)) return
    setSubmitting(true); setError(''); setNotice('')
    try {
      await registerMembership(accessToken, selected.id)
      await refreshMemberships()
      const confirmation = `${selected.name} đã có hiệu lực ngay. Thanh toán được thực hiện bên ngoài ứng dụng.`
      setNotice(confirmation)
      onRegistrationComplete(confirmation)
      onOpenMemberships()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể đăng ký gói tập')
      await refreshMemberships().catch(() => undefined)
    } finally { setSubmitting(false) }
  }

  if (view === 'memberships') return <MembershipHistory memberships={memberships} loading={loading} error={error} successMessage={successMessage} />

  return (
    <section className="membership-page" aria-labelledby="membership-title">
      <header className="membership-heading">
        <div><p className="eyebrow">MEMBER / MEMBERSHIP</p><h1 id="membership-title">Chọn gói tập phù hợp.</h1><p className="lead">So sánh thời hạn và quyền lợi, membership bắt đầu ngay sau khi đăng ký.</p></div>
        <button className="membership-history-link" type="button" onClick={onOpenMemberships}>Membership của tôi <span aria-hidden="true">↗</span></button>
      </header>
      {notice && <p className="membership-feedback success" role="status">{notice}</p>}
      {error && <p className="membership-feedback error" role="alert">{error}</p>}
      {loading ? <p className="membership-empty" role="status">Đang tải gói tập...</p> : packages.length === 0 ? <p className="membership-empty">Hiện chưa có gói tập đang mở.</p> : (
        <div className="membership-layout">
          <div className="package-comparison" aria-label="Danh sách gói tập">
            {packages.map((item) => {
              const conflict = hasActiveSportConflict(item.sportType, memberships)
              return <button className={`package-option ${selectedId === item.id ? 'selected' : ''}`} type="button" aria-pressed={selectedId === item.id} aria-describedby={conflict ? `package-conflict-${item.id}` : undefined} disabled={conflict} key={item.id} onClick={() => setSelectedId(item.id)}>
                <span className="package-option-main"><strong>{item.name}</strong><span id={conflict ? `package-conflict-${item.id}` : undefined}>{item.sportType}{conflict ? ' · Đã có membership cùng phạm vi' : ''}</span></span>
                <span className="package-option-meta"><strong>{duration(item.durationDays)}</strong><span>{money(item.price)}</span></span>
              </button>
            })}
          </div>
          <aside className="package-summary" aria-label="Gói đang chọn">
            <p className="panel-kicker">GÓI ĐANG CHỌN</p>
            {selected ? <><h2>{selected.name}</h2><p className="summary-sport">{selected.sportType} <span>·</span> {duration(selected.durationDays)}</p><p className="summary-price">{money(selected.price)}</p><p className="summary-description">{selected.description || 'Thông tin gói tập hiện chưa có mô tả.'}</p>
              {selected.benefits.length > 0 && <ul className="summary-benefits">{selected.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>}
              <div className="payment-notice"><strong>Hiệu lực ngay khi đăng ký</strong><span>Thanh toán được thực hiện bên ngoài ứng dụng. Chưa có giao dịch thanh toán nào được xử lý tại đây.</span></div>
              <button className="primary-button membership-submit" type="button" disabled={submitting || hasActiveSportConflict(selected.sportType, memberships)} onClick={submit}>{submitting ? 'Đang đăng ký...' : hasActiveSportConflict(selected.sportType, memberships) ? 'Đã có membership này' : 'Đăng ký gói'} <span aria-hidden="true">↗</span></button>
            </> : <p>Chọn một gói trong danh sách để xem chi tiết.</p>}
            <p className="active-count">{activeMemberships.length} membership đang hiệu lực</p>
          </aside>
        </div>
      )}
    </section>
  )
}

function MembershipHistory({ memberships, loading, error, successMessage }: { memberships: MembershipRecord[]; loading: boolean; error: string; successMessage: string }) {
  const active = memberships.filter((item) => item.status === 'ACTIVE')
  const ended = memberships.filter((item) => item.status !== 'ACTIVE')
  return <section className="membership-page" aria-labelledby="history-title">
    <header className="membership-heading"><div><p className="eyebrow">MEMBER / YOUR MEMBERSHIPS</p><h1 id="history-title">Membership của tôi.</h1><p className="lead">Lịch sử giữ nguyên thông tin gói tại thời điểm bạn đăng ký.</p></div></header>
    {successMessage && <p className="membership-feedback success" role="status">{successMessage}</p>}
    {error && <p className="membership-feedback error" role="alert">{error}</p>}
    {loading ? <p className="membership-empty" role="status">Đang tải membership...</p> : memberships.length === 0 ? <p className="membership-empty">Bạn chưa đăng ký gói tập nào.</p> : <div className="history-groups">
      <HistoryGroup title="Đang hiệu lực" memberships={active} />
      <HistoryGroup title="Đã kết thúc" memberships={ended} />
    </div>}
  </section>
}

function HistoryGroup({ title, memberships }: { title: string; memberships: MembershipRecord[] }) {
  return <section className="history-group"><h2>{title}</h2>{memberships.length === 0 ? <p className="history-empty">Chưa có membership.</p> : memberships.map((item) => <article className="history-card" key={item.id}>
    <div className="history-title"><div><p>{item.sportType ?? 'Bộ môn chưa lưu'}</p><h3>{item.packageName ?? 'Tên gói chưa lưu'}</h3></div><span className={`membership-status ${item.status === 'ACTIVE' ? 'is-active' : ''}`}>{item.status === 'ACTIVE' ? 'Đang hiệu lực' : item.status === 'EXPIRED' ? 'Đã hết hạn' : 'Đã hủy'}</span></div>
    <dl><div><dt>Thời hạn</dt><dd>{duration(item.durationDays)}</dd></div><div><dt>Giá lúc đăng ký</dt><dd>{money(item.listedPrice)}</dd></div><div><dt>Ngày bắt đầu</dt><dd>{date(item.startDate)}</dd></div><div><dt>Ngày kết thúc</dt><dd>{date(item.endDate)}</dd></div></dl>
  </article>)}</section>
}
