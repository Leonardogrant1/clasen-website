"use client";
import { useRef, useState } from "react";
import posthog from "posthog-js";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type Props = {
    dict: Dictionary["contact"];
};

export default function ContactForm({ dict }: Props) {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [topic, setTopic] = useState<string>("portfolio");
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('submitting');
        const formData = new FormData(formRef.current!);
        const email = formData.get('email') as string;
        posthog.capture('contact_form_submitted', { has_phone: !!formData.get('phone') });
        const topicLabel = dict.topics.find((t) => t.value === topic)?.label ?? topic;
        const freeText = (formData.get('message') as string ?? "").trim();
        const message = freeText || topicLabel;

        try {
            const res = await fetch('/api/send-mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-POSTHOG-DISTINCT-ID': posthog.get_distinct_id(),
                    'X-POSTHOG-SESSION-ID': posthog.get_session_id() ?? '',
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email,
                    phone: formData.get('phone'),
                    topic: topicLabel,
                    message,
                }),
            });
            if (res.ok) {
                posthog.capture('contact_form_succeeded');
                if (email) posthog.identify(posthog.get_distinct_id(), { email });
                setStatus('success');
            } else {
                posthog.capture('contact_form_failed', { status: res.status });
                setStatus('error');
            }
        } catch {
            posthog.capture('contact_form_failed', { status: 'network_error' });
            setStatus('error');
        }
    }

    if (status === 'success') {
        return (
            <div className="flex flex-col gap-4 py-6">
                <div className="w-10 h-10 rounded-full border border-accent/40 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                        <polyline points="3 9 7 13 15 5" />
                    </svg>
                </div>
                <p className="text-accent text-xs uppercase tracking-widest font-semibold">{dict.submit}</p>
                <p className="text-foreground text-xl font-semibold leading-snug">Vielen Dank —<br />wir melden uns bald.</p>
                <p className="text-muted text-sm leading-relaxed">Ihre Anfrage ist eingegangen. Ein Mitarbeiter wird sich in Kürze bei Ihnen melden.</p>
            </div>
        );
    }

    const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-all duration-200";
    const labelClass = "text-white/40 text-[11px] uppercase tracking-widest";

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className={labelClass}>{dict.nameLabel} <span className="text-accent">*</span></label>
                    <input type="text" name="name" required placeholder={dict.namePlaceholder} className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                        <span className="hidden sm:inline">{dict.phoneFieldLabel}</span>
                        <span className="sm:hidden">{dict.phoneFieldLabelShort}</span>
                    </label>
                    <input type="tel" name="phone" placeholder={dict.phonePlaceholder} className={inputClass} />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className={labelClass}>{dict.emailFieldLabel} <span className="text-accent">*</span></label>
                <input type="email" name="email" required placeholder={dict.emailPlaceholder} className={inputClass} />
            </div>

            <div className="flex flex-col gap-2">
                <label className={labelClass}>{dict.topicLabel} <span className="text-accent">*</span></label>
                <div className="relative">
                    <select
                        name="topic"
                        required
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className={`${inputClass} appearance-none cursor-pointer pr-10`}
                    >
                        {dict.topics.map((t) => (
                            <option key={t.value} value={t.value} className="bg-[#1a1a1a] text-foreground">
                                {t.label}
                            </option>
                        ))}
                    </select>
                    <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="2 4 6 8 10 4" />
                    </svg>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className={labelClass}>{dict.messageLabel} <span className="text-accent">*</span></label>
                <textarea name="message" rows={4} placeholder={dict.messagePlaceholder}
                    className={`${inputClass} resize-none`} />
            </div>

            {status === 'error' && (
                <p className="text-red-400/80 text-xs leading-relaxed">
                    Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.
                </p>
            )}

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-1 w-full py-3 rounded-full border border-accent text-accent text-sm uppercase tracking-widest font-semibold hover:bg-accent hover:text-background disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
                {status === 'submitting' ? '…' : status === 'error' ? dict.submit : dict.submit}
            </button>
        </form>
    );
}
