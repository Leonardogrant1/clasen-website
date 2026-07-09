# Close CRM Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When a funnel contact form is submitted, create a lead in Close CRM with all collected funnel data as custom fields.

**Architecture:** `FunnelContactForm` fires a fire-and-forget POST to `/api/close-lead`, which maps funnel answers to Close custom field IDs (from `lib/close-fields.ts`) and creates a lead via the Close REST API. A one-time setup script creates the custom fields in Close and prints the ID mapping.

**Tech Stack:** Next.js App Router (API route), TypeScript, Close CRM REST API v1

## Global Constraints

- `CLOSE_API_KEY` env var must be set; route returns 500 immediately if missing
- Lead name = contact name only (no metadata in name)
- Fire-and-forget: form shows success screen immediately, CRM errors are server-side only
- No new dependencies — use `fetch` (Node 18+)
- Follow existing patterns in `lib/` and `app/api/`

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `scripts/setup-close-fields.ts` | Create | One-time script: creates Close custom fields, prints `CLOSE_LEAD_FIELDS` mapping |
| `lib/close-fields.ts` | Create (manual after script) | Generated constant: maps key → `cf_xxx` ID |
| `lib/close-mapping.ts` | Create | Pure functions: maps `FunnelAnswers` → Close custom field payload |
| `app/api/close-lead/route.ts` | Create | Next.js POST handler: receives form data, calls Close API |
| `components/funnel/FunnelContactForm.tsx` | Modify | Add fire-and-forget POST on submit |

---

### Task 1: Setup script — create Close custom fields

**Files:**
- Create: `scripts/setup-close-fields.ts`

**Interfaces:**
- Produces: when run, prints a ready-to-paste `lib/close-fields.ts` export with real `cf_xxx` IDs
- Consumes: `CLOSE_API_KEY` env var

- [ ] **Step 1: Create the setup script**

Create `scripts/setup-close-fields.ts` with this exact content:

```ts
/**
 * setup-close-fields.ts
 *
 * Creates required Lead custom fields in Close CRM and prints
 * the ID mapping for lib/close-fields.ts. Idempotent.
 *
 * Run: CLOSE_API_KEY=api_xxx npx tsx scripts/setup-close-fields.ts
 */

const API_KEY = process.env.CLOSE_API_KEY
if (!API_KEY) {
  console.error('❌  CLOSE_API_KEY ist nicht gesetzt.')
  process.exit(1)
}

const BASE = 'https://api.close.com/api/v1'
const AUTH = 'Basic ' + Buffer.from(`${API_KEY}:`).toString('base64')

type FieldDef = {
  key: string
  name: string
  type: 'text' | 'number' | 'choices' | 'hidden'
  choices?: string[]
  description?: string
}

const FIELDS: FieldDef[] = [
  // Shared
  {
    key: 'leadType',
    name: 'Lead-Typ',
    type: 'choices',
    choices: ['Verkäufer', 'Investor', 'Eigentümer'],
    description: 'Welcher Funnel-Typ der Lead ist',
  },
  {
    key: 'funnelSource',
    name: 'Funnel-Quelle',
    type: 'choices',
    choices: ['Seller-Funnel', 'Investor-Funnel', 'Owner-Funnel'],
    description: 'Über welchen Funnel der Lead reinkam',
  },
  // Seller + Investor shared
  {
    key: 'propertyType',
    name: 'Immobilientyp',
    type: 'choices',
    choices: [
      'Mehrfamilienhaus',
      'Villa / Einfamilienhaus',
      'Doppelhaus / Villenhälfte',
      'Reihenhaus',
      'Reiheneckhaus',
      'Wohnung',
      'Baugrundstück',
      'Gewerbe',
      'Neubau / Projekt',
    ],
    description: 'Art der Immobilie',
  },
  {
    key: 'priorities',
    name: 'Prioritäten',
    type: 'text',
    description: 'Priorisierte Liste aus dem Funnel (kommagetrennt)',
  },
  // Seller only
  {
    key: 'salePhase',
    name: 'Verkaufsphase',
    type: 'choices',
    choices: ['Vorbereitungsphase', 'War auf dem Markt', 'Auf dem Markt'],
    description: 'In welcher Verkaufsphase sich der Eigentümer befindet',
  },
  {
    key: 'district',
    name: 'Stadtteil',
    type: 'text',
    description: 'Münchner Stadtteil der Immobilie',
  },
  {
    key: 'partnerType',
    name: 'Partner-Typ',
    type: 'choices',
    choices: ['Äußerst erfahren', 'Harter Verhandler', 'Erreichbar & einfühlsam'],
    description: 'Gewünschter Makler-Typ',
  },
  // Investor only
  {
    key: 'equity',
    name: 'Eigenkapital',
    type: 'choices',
    choices: ['Unter 100k €', '100k–250k €', '250k–500k €', '500k–1M €', 'Über 1M €'],
    description: 'Eigenkapital-Bereich des Investors',
  },
  // Owner only
  {
    key: 'lifePhase',
    name: 'Lebensphase',
    type: 'choices',
    choices: [
      'Wir werden zu zweit',
      'Wir werden mehr',
      'Wir wollen ankommen',
      'Wir sind bereit für mehr',
      'Ein neues Kapitel beginnt',
    ],
    description: 'Lebensphase des Käufers',
  },
  {
    key: 'homePriorities',
    name: 'Wohn-Prioritäten',
    type: 'text',
    description: 'Priorisierte Wohnwünsche (kommagetrennt)',
  },
  {
    key: 'moodLocation',
    name: 'Mood: Lage',
    type: 'number',
    description: 'Slider-Wert Lage (0–100)',
  },
  {
    key: 'moodStyle',
    name: 'Mood: Stil',
    type: 'number',
    description: 'Slider-Wert Stil (0–100)',
  },
  {
    key: 'moodSize',
    name: 'Mood: Größe',
    type: 'number',
    description: 'Slider-Wert Größe (0–100)',
  },
  // Reserved — uncomment when Clasen DB is wired up
  // {
  //   key: 'clasenDbId',
  //   name: 'Clasen DB ID',
  //   type: 'hidden',
  //   description: 'Interne Verknüpfung zur Clasen-Datenbank',
  // },
]

type CloseField = { id: string; name: string; type: string }

async function listLeadFields(): Promise<CloseField[]> {
  const fields: CloseField[] = []
  let skip = 0
  while (true) {
    const res = await fetch(`${BASE}/custom_field/lead/?_limit=100&_skip=${skip}`, {
      headers: { Authorization: AUTH, Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`Liste fehlgeschlagen: ${res.status} ${await res.text()}`)
    const json = await res.json()
    fields.push(...json.data)
    if (!json.has_more) break
    skip += 100
  }
  return fields
}

async function createLeadField(def: FieldDef): Promise<CloseField> {
  const body: Record<string, unknown> = { name: def.name, type: def.type }
  if (def.choices) body.choices = def.choices
  if (def.description) body.description = def.description

  const res = await fetch(`${BASE}/custom_field/lead/`, {
    method: 'POST',
    headers: { Authorization: AUTH, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Anlegen "${def.name}" fehlgeschlagen: ${res.status} ${await res.text()}`)
  return res.json()
}

async function main() {
  console.log('🔍  Lese vorhandene Lead-Custom-Fields …\n')
  const existing = await listLeadFields()
  const byName = new Map(existing.map((f) => [f.name.toLowerCase(), f]))
  const mapping: Record<string, string> = {}

  for (const def of FIELDS) {
    const hit = byName.get(def.name.toLowerCase())
    if (hit) {
      console.log(`✓  "${def.name}" existiert bereits  →  ${hit.id}`)
      mapping[def.key] = hit.id
      continue
    }
    const created = await createLeadField(def)
    console.log(`＋  "${def.name}" angelegt          →  ${created.id}`)
    mapping[def.key] = created.id
  }

  console.log('\n— — — — — — — — — — — — — — — — — — — — — — — — — —')
  console.log('Fertig. Kopiere dieses Mapping in lib/close-fields.ts:\n')
  console.log('export const CLOSE_LEAD_FIELDS = {')
  for (const [key, id] of Object.entries(mapping)) {
    console.log(`  ${key}: '${id}',`)
  }
  console.log('} as const')
}

main().catch((err) => {
  console.error('\n❌ ', err.message ?? err)
  process.exit(1)
})
```

- [ ] **Step 2: Run the script and create `lib/close-fields.ts`**

```bash
CLOSE_API_KEY=<your_key> npx tsx scripts/setup-close-fields.ts
```

Expected output — example (IDs will be real `cf_xxx` strings):
```
🔍  Lese vorhandene Lead-Custom-Fields …

＋  "Lead-Typ" angelegt          →  cf_abc123
＋  "Funnel-Quelle" angelegt     →  cf_def456
...

— — — — — — — — — — — — — — — — — — — — — — — — — —
Fertig. Kopiere dieses Mapping in lib/close-fields.ts:

export const CLOSE_LEAD_FIELDS = {
  leadType: 'cf_abc123',
  funnelSource: 'cf_def456',
  ...
} as const
```

Copy the printed block verbatim into `lib/close-fields.ts`. The file should look like:

```ts
export const CLOSE_LEAD_FIELDS = {
  leadType: 'cf_abc123',        // Lead-Typ
  funnelSource: 'cf_def456',    // Funnel-Quelle
  propertyType: 'cf_ghi789',    // Immobilientyp
  priorities: 'cf_jkl012',      // Prioritäten
  salePhase: 'cf_mno345',       // Verkaufsphase
  district: 'cf_pqr678',        // Stadtteil
  partnerType: 'cf_stu901',     // Partner-Typ
  equity: 'cf_vwx234',          // Eigenkapital
  lifePhase: 'cf_yza567',       // Lebensphase
  homePriorities: 'cf_bcd890',  // Wohn-Prioritäten
  moodLocation: 'cf_efg123',    // Mood: Lage
  moodStyle: 'cf_hij456',       // Mood: Stil
  moodSize: 'cf_klm789',        // Mood: Größe
} as const
```

- [ ] **Step 3: Commit the script**

```bash
git add scripts/setup-close-fields.ts lib/close-fields.ts
git commit -m "feat: add Close CRM field setup script and field ID mapping"
```

---

### Task 2: Mapping helpers — translate funnel answers to Close field values

**Files:**
- Create: `lib/close-mapping.ts`

**Interfaces:**
- Consumes: `CLOSE_LEAD_FIELDS` from `lib/close-fields.ts`, `FunnelAnswers` / `FunnelType` from `components/funnel/FunnelProvider.tsx`, `MUNICH_DISTRICTS` from `lib/munich-districts.ts`
- Produces: `buildClosePayload(type, answers, contact) → CloseLeadPayload` — the ready-to-POST JSON body for the Close API

- [ ] **Step 1: Create `lib/close-mapping.ts`**

```ts
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

const DISTRICT_LABELS = new Map(MUNICH_DISTRICTS.map((d) => [d.slug, d.label]))

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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. If you see "Cannot find module '@/lib/close-fields'" — make sure Task 1 Step 2 is done and `lib/close-fields.ts` exists.

- [ ] **Step 3: Commit**

```bash
git add lib/close-mapping.ts
git commit -m "feat: add Close CRM funnel answer mapping helpers"
```

---

### Task 3: API route — POST /api/close-lead

**Files:**
- Create: `app/api/close-lead/route.ts`

**Interfaces:**
- Consumes: `buildClosePayload` from `lib/close-mapping.ts`, `CLOSE_API_KEY` env var
- Produces: `POST /api/close-lead` → `{ success: true }` 200 or `{ success: false }` 500

- [ ] **Step 1: Create the route**

Create `app/api/close-lead/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { buildClosePayload } from '@/lib/close-mapping'
import type { FunnelType, FunnelAnswers } from '@/components/funnel/FunnelProvider'

export async function POST(req: NextRequest) {
  if (!process.env.CLOSE_API_KEY) {
    console.error('Close CRM: CLOSE_API_KEY not set')
    return NextResponse.json({ success: false }, { status: 500 })
  }

  const { name, email, phone, type, answers } = (await req.json()) as {
    name: string
    email: string
    phone: string
    type: FunnelType
    answers: FunnelAnswers
  }

  const auth = Buffer.from(`${process.env.CLOSE_API_KEY}:`).toString('base64')
  const payload = buildClosePayload(type, answers, { name, email, phone })

  const res = await fetch('https://api.close.com/api/v1/lead/', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    console.error('Close CRM error:', await res.text())
    return NextResponse.json({ success: false }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Smoke-test the route manually**

With the dev server running (`npm run dev`), run:

```bash
curl -s -X POST http://localhost:3000/api/close-lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Person",
    "email": "test@example.com",
    "phone": "+49 123 456789",
    "type": "seller",
    "answers": {
      "objectType": "apartment",
      "phase": "preparation",
      "partnerType": "experienced",
      "priorities": ["price", "speed", "communication"],
      "district": "schwabing-west"
    }
  }'
```

Expected: `{"success":true}` and a new lead "Test Person" appears in Close CRM with all custom fields set.

- [ ] **Step 4: Commit**

```bash
git add app/api/close-lead/route.ts
git commit -m "feat: add Close CRM API route"
```

---

### Task 4: Wire FunnelContactForm to the route

**Files:**
- Modify: `components/funnel/FunnelContactForm.tsx`

**Interfaces:**
- Consumes: existing `useFunnel()` hook (provides `type` and `answers`), existing `trackEvent`
- No new exports

- [ ] **Step 1: Update `handleSubmit` to fire the Close lead call**

In `components/funnel/FunnelContactForm.tsx`, replace the `handleSubmit` function:

```ts
function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  trackEvent(
    "funnel_submission",
    { type, answers, contact: { name, email, phone } },
    { metaEventName: "Lead", customData: { contentName: type } }
  )
  // Fire-and-forget — do not await, errors logged server-side
  fetch("/api/close-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, type, answers }),
  }).catch(() => {
    // intentionally silent — CRM outage must not affect UX
  })
  setSubmitted(true)
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: End-to-end test**

Start dev server (`npm run dev`), open a funnel, complete all steps, fill in contact form with real data, submit. Verify in Close CRM that a lead appears with:
- Lead name = contact name
- Contact with email + phone
- All relevant custom fields populated (check each funnel type separately if time allows)

- [ ] **Step 4: Commit**

```bash
git add components/funnel/FunnelContactForm.tsx
git commit -m "feat: send funnel leads to Close CRM on contact form submit"
```
