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

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Video might not be loaded yet on iOS Safari — wait for canplay
                    if (video.readyState >= 2) {
                        tryPlay();
                    } else {
                        video.addEventListener("canplay", tryPlay, { once: true });
                    }
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