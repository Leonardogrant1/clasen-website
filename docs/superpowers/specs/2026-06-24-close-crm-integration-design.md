# Close CRM Integration — Design Spec

**Date:** 2026-06-24  
**Scope:** Funnel contact form → Close CRM lead creation

---

## Goal

When a user completes any funnel (Seller, Investor, Owner) and submits their contact details, a lead is automatically created in Close CRM with the contact info and funnel metadata as custom fields.

---

## Architecture

```
FunnelContactForm (client)
  └─ POST /api/close-lead  { name, email, phone, type, answers }
       └─ Close API  POST /api/v1/lead/
```

Files involved:

1. **`scripts/setup-close-fields.ts`** — one-time script to create custom fields in Close and generate `lib/close-fields.ts`
2. **`lib/close-fields.ts`** — generated file with real `cf_xxx` IDs
3. **`app/api/close-lead/route.ts`** — Next.js API route that creates the lead
4. **`components/funnel/FunnelContactForm.tsx`** — updated to POST to the route on submit

---

## Custom Fields

The setup script creates these Lead-level custom fields in Close. Script is idempotent (matched by name — skips existing fields).

### Shared (all funnels)

| Key | Close Name | Type | Choices |
|---|---|---|---|
| `leadType` | Lead-Typ | choices | Verkäufer, Investor, Eigentümer |
| `funnelSource` | Funnel-Quelle | choices | Seller-Funnel, Investor-Funnel, Owner-Funnel |

### Seller Funnel

| Key | Close Name | Type | Choices / Notes |
|---|---|---|---|
| `propertyType` | Immobilientyp | choices | Mehrfamilienhaus, Villa / Einfamilienhaus, Doppelhaus / Villenhälfte, Reihenhaus, Reiheneckhaus, Wohnung, Baugrundstück, Gewerbe, Neubau / Projekt |
| `salePhase` | Verkaufsphase | choices | Vorbereitungsphase, War auf dem Markt, Auf dem Markt |
| `district` | Stadtteil | text | district label from MUNICH_DISTRICTS |
| `partnerType` | Partner-Typ | choices | Äußerst erfahren, Harter Verhandler, Erreichbar & einfühlsam |
| `priorities` | Prioritäten | text | comma-joined ranked list, e.g. "Preis, Geschwindigkeit, Kommunikation" |

### Investor Funnel

| Key | Close Name | Type | Choices |
|---|---|---|---|
| `equity` | Eigenkapital | choices | Unter 100k €, 100k–250k €, 250k–500k €, 500k–1M €, Über 1M € |
| `priorities` | Prioritäten | text | (same field as seller — comma-joined, e.g. "Rendite, Sicherheit, Steuervorteil") |
| `propertyType` | Immobilientyp | choices | (same field — investor values: Mehrfamilienhaus, Gewerbe, Wohnung, Neubau / Projekt) |

### Owner Funnel

| Key | Close Name | Type | Choices |
|---|---|---|---|
| `lifePhase` | Lebensphase | choices | Wir werden zu zweit, Wir werden mehr, Wir wollen ankommen, Wir sind bereit für mehr, Ein neues Kapitel beginnt |
| `homePriorities` | Wohn-Prioritäten | text | comma-joined, e.g. "Familienraum, Rückzugsort, Repräsentanz" |
| `moodLocation` | Mood: Lage | number | 0–100 slider value |
| `moodStyle` | Mood: Stil | number | 0–100 slider value |
| `moodSize` | Mood: Größe | number | 0–100 slider value |

### Reserved (commented out in script)

| Key | Close Name | Notes |
|---|---|---|
| `clasenDbId` | Clasen DB ID | future internal reference — not created yet |

---

## Data Mapping

### Lead

```
name: contact.name   // e.g. "Anna Müller"
```

### Contact

```
name:   contact.name
email:  contact.email  (type: "office")
phone:  contact.phone  (type: "mobile")  — omitted if empty
```

### Custom Field Values by Funnel Type

**Seller (`type === "seller"`):**

| Field | Mapping |
|---|---|
| `leadType` | "Verkäufer" |
| `funnelSource` | "Seller-Funnel" |
| `propertyType` | see objectType table below |
| `salePhase` | `preparation`→"Vorbereitungsphase", `was-on-market`→"War auf dem Markt", `on-market`→"Auf dem Markt" |
| `district` | `answers.district` label (looked up from MUNICH_DISTRICTS slug) |
| `partnerType` | `experienced`→"Äußerst erfahren", `negotiator`→"Harter Verhandler", `communicative`→"Erreichbar & einfühlsam" |
| `priorities` | `["speed","price","communication"]` → "Geschwindigkeit, Preis, Kommunikation & Informationsfluss" |

**Investor (`type === "investor"`):**

| Field | Mapping |
|---|---|
| `leadType` | "Investor" |
| `funnelSource` | "Investor-Funnel" |
| `equity` | `under-100k`→"Unter 100k €", `100k-250k`→"100k–250k €", `250k-500k`→"250k–500k €", `500k-1m`→"500k–1M €", `over-1m`→"Über 1M €" |
| `propertyType` | see objectType table below |
| `priorities` | `["return","tax-benefit","security"]` → "Rendite, Steuervorteil, Sicherheit" |

**Owner (`type === "owner"`):**

| Field | Mapping |
|---|---|
| `leadType` | "Eigentümer" |
| `funnelSource` | "Owner-Funnel" |
| `lifePhase` | slug → German label (1:1 from LIFE_PHASES) |
| `homePriorities` | `["retreat","family-space","representation"]` → "Rückzugsort, Familienraum, Repräsentanz" |
| `moodLocation` | `answers.moodLocation` (number) |
| `moodStyle` | `answers.moodStyle` (number) |
| `moodSize` | `answers.moodSize` (number) |

**`objectType` → `propertyType` mapping (shared):**

| Funnel value | Close choice |
|---|---|
| `apartment-building` | Mehrfamilienhaus |
| `villa` | Villa / Einfamilienhaus |
| `semi-detached` | Doppelhaus / Villenhälfte |
| `terraced` | Reihenhaus |
| `corner-terraced` | Reiheneckhaus |
| `apartment` | Wohnung |
| `land` | Baugrundstück |
| `commercial` | Gewerbe |
| `new-build` | Neubau / Projekt |
| _(missing)_ | field omitted |

---

## API Route

`POST /api/close-lead`

**Request body:**
```ts
{
  name: string
  email: string
  phone: string
  type: "seller" | "investor" | "owner"
  answers: FunnelAnswers
}
```

**Success:** `{ success: true }` — 200  
**Error:** `{ success: false }` — 500, with `console.error` of Close response body

Auth: HTTP Basic — API key as username, empty password.

---

## FunnelContactForm Changes

On submit:
1. Existing `trackEvent(...)` call stays
2. Add fire-and-forget `fetch("/api/close-lead", { method: "POST", body: JSON.stringify({ name, email, phone, type, answers }) })`
3. `setSubmitted(true)` called immediately — success screen does not wait for CRM response
4. CRM failures are server-side only; user experience is unaffected

---

## Error Handling

- Close API errors → `console.error` server-side, route returns 500
- Missing `CLOSE_API_KEY` → route returns 500 immediately
- Form never surfaces CRM errors to the user

---

## Setup Flow

1. Run: `CLOSE_API_KEY=api_xxx npx tsx scripts/setup-close-fields.ts`
2. Copy the printed `CLOSE_LEAD_FIELDS` object into `lib/close-fields.ts`
3. Deploy with `CLOSE_API_KEY` in environment
