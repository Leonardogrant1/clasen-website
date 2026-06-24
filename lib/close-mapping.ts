import { CLOSE_LEAD_FIELDS } from '@/lib/close-fields'
import { MUNICH_DISTRICTS } from '@/lib/munich-districts'
import type { FunnelType, FunnelAnswers } from '@/components/funnel/FunnelProvider'

// The shape of the Close API lead POST body
export type CloseLeadPayload = {
  name: string
  contacts: Array<{
    name: string
    emails: Array<{ email: string; type: string }>
    phones: Array<{ phone: string; type: string }>
  }>
  [customField: string]: unknown
}

// ── Label maps ────────────────────────────────────────────────────────────────

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  'apartment-building': 'Mehrfamilienhaus',
  'villa': 'Villa / Einfamilienhaus',
  'semi-detached': 'Doppelhaus / Villenhälfte',
  'terraced': 'Reihenhaus',
  'corner-terraced': 'Reiheneckhaus',
  'apartment': 'Wohnung',
  'land': 'Baugrundstück',
  'commercial': 'Gewerbe',
  'new-build': 'Neubau / Projekt',
}

const SALE_PHASE_LABELS: Record<string, string> = {
  'preparation': 'Vorbereitungsphase',
  'was-on-market': 'War auf dem Markt',
  'on-market': 'Auf dem Markt',
}

const PARTNER_TYPE_LABELS: Record<string, string> = {
  'experienced': 'Äußerst erfahren',
  'negotiator': 'Harter Verhandler',
  'communicative': 'Erreichbar & einfühlsam',
}

const SELLER_PRIORITY_LABELS: Record<string, string> = {
  'speed': 'Geschwindigkeit',
  'price': 'Preis',
  'communication': 'Kommunikation & Informationsfluss',
}

const EQUITY_LABELS: Record<string, string> = {
  'under-100k': 'Unter 100k €',
  '100k-250k': '100k–250k €',
  '250k-500k': '250k–500k €',
  '500k-1m': '500k–1M €',
  'over-1m': 'Über 1M €',
}

const INVESTOR_PRIORITY_LABELS: Record<string, string> = {
  'return': 'Rendite',
  'tax-benefit': 'Steuervorteil',
  'security': 'Sicherheit',
}

const LIFE_PHASE_LABELS: Record<string, string> = {
  'becoming-couple': 'Wir werden zu zweit',
  'growing-family': 'Wir werden mehr',
  'settling-down': 'Wir wollen ankommen',
  'ready-for-more': 'Wir sind bereit für mehr',
  'new-chapter': 'Ein neues Kapitel beginnt',
}

const HOME_PRIORITY_LABELS: Record<string, string> = {
  'retreat': 'Rückzugsort',
  'representation': 'Repräsentanz',
  'family-space': 'Familienraum',
}

const DISTRICT_LABELS = new Map(MUNICH_DISTRICTS.map((d) => [d.slug as string, d.label]))

// ── Shared helpers ────────────────────────────────────────────────────────────

function cf(key: keyof typeof CLOSE_LEAD_FIELDS): string {
  return `custom.${CLOSE_LEAD_FIELDS[key]}`
}

function mapPriorities(slugs: string[], labelMap: Record<string, string>): string {
  return slugs.map((s) => labelMap[s] ?? s).join(', ')
}

// ── Main builder ──────────────────────────────────────────────────────────────

export function buildClosePayload(
  type: FunnelType,
  answers: FunnelAnswers,
  contact: { name: string; email: string; phone: string }
): CloseLeadPayload {
  const payload: CloseLeadPayload = {
    name: contact.name,
    contacts: [
      {
        name: contact.name,
        emails: [{ email: contact.email, type: 'office' }],
        phones: contact.phone ? [{ phone: contact.phone, type: 'mobile' }] : [],
      },
    ],
  }

  // Shared fields
  const leadTypeMap = { seller: 'Verkäufer', investor: 'Investor', owner: 'Eigentümer' } as const
  const funnelSourceMap = { seller: 'Seller-Funnel', investor: 'Investor-Funnel', owner: 'Owner-Funnel' } as const
  payload[cf('leadType')] = leadTypeMap[type]
  payload[cf('funnelSource')] = funnelSourceMap[type]

  if (type === 'seller') {
    if (answers.objectType) payload[cf('propertyType')] = PROPERTY_TYPE_LABELS[answers.objectType] ?? answers.objectType
    if (answers.phase) payload[cf('salePhase')] = SALE_PHASE_LABELS[answers.phase] ?? answers.phase
    if (answers.district) payload[cf('district')] = DISTRICT_LABELS.get(answers.district) ?? answers.district
    if (answers.partnerType) payload[cf('partnerType')] = PARTNER_TYPE_LABELS[answers.partnerType] ?? answers.partnerType
    if (answers.priorities?.length) payload[cf('priorities')] = mapPriorities(answers.priorities, SELLER_PRIORITY_LABELS)
  }

  if (type === 'investor') {
    if (answers.objectType) payload[cf('propertyType')] = PROPERTY_TYPE_LABELS[answers.objectType] ?? answers.objectType
    if (answers.equity) payload[cf('equity')] = EQUITY_LABELS[answers.equity] ?? answers.equity
    if (answers.priorities?.length) payload[cf('priorities')] = mapPriorities(answers.priorities, INVESTOR_PRIORITY_LABELS)
  }

  if (type === 'owner') {
    if (answers.lifePhase) payload[cf('lifePhase')] = LIFE_PHASE_LABELS[answers.lifePhase] ?? answers.lifePhase
    if (answers.homePriorities?.length) payload[cf('homePriorities')] = mapPriorities(answers.homePriorities, HOME_PRIORITY_LABELS)
    if (answers.moodLocation != null) payload[cf('moodLocation')] = answers.moodLocation
    if (answers.moodStyle != null) payload[cf('moodStyle')] = answers.moodStyle
    if (answers.moodSize != null) payload[cf('moodSize')] = answers.moodSize
  }

  return payload
}
