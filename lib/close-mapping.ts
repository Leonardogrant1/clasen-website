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
  'villa': 'Villa',
  'semi-detached': 'Doppelhaushälfte',
  'terraced': 'Reihenhaus',
  'corner-terraced': 'Reiheneckhaus',
  'apartment': 'Wohnung',
  'penthouse': 'Penthouse',
  'house': 'Einfamilienhaus',
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
  'under-50k':  '0 – 50.000 €',
  '50k-100k':   '50.000 – 100.000 €',
  '100k-250k':  '100.000 – 250.000 €',
  'over-250k':  '250.000 € +',
}

const INVESTOR_PRIORITY_LABELS: Record<string, string> = {
  'return': 'Rendite',
  'tax-benefit': 'Steuervorteil',
  'stability': 'Wertstabilität',
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
    if (answers.investorType) payload[cf('propertyType')] = { bestandshalter: 'Bestandshalter', optimierer: 'Optimierer', portfoliodenker: 'Portfoliodenker' }[answers.investorType] ?? answers.investorType
    if (answers.equity) payload[cf('equity')] = EQUITY_LABELS[answers.equity] ?? answers.equity
    if (answers.priorities?.length) payload[cf('priorities')] = mapPriorities(answers.priorities, INVESTOR_PRIORITY_LABELS)
  }

  if (type === 'owner') {
    if (answers.objectType) {
      const types = Array.isArray(answers.objectType) ? answers.objectType : [answers.objectType]
      payload[cf('propertyType')] = types.map((t) => PROPERTY_TYPE_LABELS[t] ?? t).join(', ')
    }
    if (answers.districts?.length) payload[cf('district')] = answers.districts.map((s) => DISTRICT_LABELS.get(s) ?? s).join(', ')
    if (answers.sqm) payload[cf('sqm')] = { '<50': 'unter 50 m²', '50-80': '50 – 80 m²', '80-120': '80 – 120 m²', '120-200': '120 – 200 m²', '200+': 'über 200 m²' }[answers.sqm] ?? answers.sqm
  }

  return payload
}
