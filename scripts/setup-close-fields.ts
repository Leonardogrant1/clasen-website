import dotenv from "dotenv";
dotenv.config({ path: `.env.local` });

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
    choices: ['0 – 50.000 €', '50.000 – 100.000 €', '100.000 – 250.000 €', '250.000 € +'],
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
