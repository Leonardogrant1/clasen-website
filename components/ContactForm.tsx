"use client";
import { useRef, useState } from "react";
import posthog from "posthog-js";


export default function ContactForm() {

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('submitting');
        const formData = new FormData(formRef.current!);
        const email = formData.get('email') as string;
        posthog.capture('contact_form_submitted', {
            has_phone: !!formData.get('phone'),
        });
        const res = await fetch('/api/send-mail', {
            method: 'POST',
            headers: {
                'X-POSTHOG-DISTINCT-ID': posthog.get_distinct_id(),
                'X-POSTHOG-SESSION-ID': posthog.get_session_id() ?? '',
            },
            body: JSON.stringify({
                name: formData.get('name'),
                email,
                phone: formData.get('phone'),
                message: formData.get('message'),
            }),
        });

        if (res.ok) {
            posthog.capture('contact_form_succeeded');
            if (email) {
                posthog.identify(posthog.get_distinct_id(), { email });
            }
            setStatus('success');
        } else {
            posthog.capture('contact_form_failed', { status: res.status });
            setStatus('error');
        }
    }

    const statusContent = () => {
        switch (status) {
            case 'error':
                return <div className="text-red-400 text-sm">Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut oder rufen Sie uns direkt an.</div>;
            case 'success':
                return <div className="text-green-400 text-sm">Nachricht erfolgreich gesendet! Wir werden uns bald bei Ihnen melden.</div>;
            case 'submitting':
                return <div className="text-green-400 text-sm">Nachricht wird gesendet...</div>;
            default:
                return <button
                    type="submit"
                    className="mt-2 w-full py-3 rounded-full bg-white text-black text-sm uppercase tracking-widest font-semibold hover:bg-white/90 transition-colors duration-200"
                >
                    Nachricht senden
                </button>;
        }
    }

    return <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
            <label className="text-muted text-xs uppercase tracking-widest">Name</label>
            <input
                type="text"
                name="name"
                required
                placeholder="Max Mustermann"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors duration-200"
            />
        </div>

        <div className="flex flex-col gap-1.5">
            <label className="text-muted text-xs uppercase tracking-widest">E-Mail</label>
            <input
                type="email"
                name="email"
                required
                placeholder="max@beispiel.de"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors duration-200"
            />
        </div>

        <div className="flex flex-col gap-1.5">
            <label className="text-muted text-xs uppercase tracking-widest">Telefon (optional)</label>
            <input
                type="tel"
                name="phone"
                placeholder="+49 000 000000"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors duration-200"
            />
        </div>

        <div className="flex flex-col gap-1.5">
            <label className="text-muted text-xs uppercase tracking-widest">Nachricht</label>
            <textarea
                name="message"
                required
                rows={5}
                placeholder="Wie können wir Ihnen helfen?"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors duration-200 resize-none"
            />
        </div>

        {statusContent()}
    </form>;
}