<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Clasen Immos Next.js App Router project. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest` to the EU PostHog endpoint. A server-side client (`lib/posthog-server.ts`) is used in API routes for server-side event capture. Environment variables are stored in `.env.local`.

| Event | Description | File |
|---|---|---|
| `contact_form_submitted` | User submits the contact form | `components/ContactForm.tsx` |
| `contact_form_succeeded` | Contact form submission was successful (API 200 OK) | `components/ContactForm.tsx` |
| `contact_form_failed` | Contact form submission failed (API error) | `components/ContactForm.tsx` |
| `contact_message_received` | Server-side: message received by the send-mail API | `app/api/send-mail/route.ts` |
| `property_tile_clicked` | User clicks a property listing tile | `app/[lang]/properties/ReferenzGrid.tsx` |
| `login_initiated` | User clicks the login button in the nav | `components/Nav.tsx` |
| `oauth_authorization_started` | Server: IS24 OAuth flow initiated | `app/api/oauth/init/route.ts` |
| `oauth_authorization_completed` | Server: IS24 OAuth access token obtained | `app/api/oauth/callback/route.ts` |
| `oauth_authorization_rejected` | Server: IS24 OAuth rejected by user | `app/api/oauth/callback/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/173375/dashboard/663638
- **Contact form conversion funnel**: https://eu.posthog.com/project/173375/insights/GXdGhVcs
- **Property tile clicks over time**: https://eu.posthog.com/project/173375/insights/HiG0YgzS
- **Login initiation funnel**: https://eu.posthog.com/project/173375/insights/Wmcj0JJn
- **IS24 OAuth connection funnel**: https://eu.posthog.com/project/173375/insights/8qwS3KMD
- **Contact form error rate**: https://eu.posthog.com/project/173375/insights/tYCTGu00

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
