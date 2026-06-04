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

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { });
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
            loop
            muted
            playsInline
            className={className}
        />
    );
}