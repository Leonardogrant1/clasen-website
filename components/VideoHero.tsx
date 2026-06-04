"use client";

import { useEffect, useRef } from "react";

type Props = {
    src: string;
    className?: string;
};

export default function VideoHero({ src, className }: Props) {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = ref.current;
        if (!video) return;
        video.muted = true;

        const tryPlay = () => video.play().catch(() => { });

        // Start immediately + retry on canplay (Safari needs both)
        tryPlay();
        video.addEventListener("canplay", tryPlay, { once: true });

        // Pause when scrolled out of view, resume when back
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    tryPlay();
                } else {
                    video.pause();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    return (
        <video
            ref={ref}
            src={src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={className}
        />
    );
}