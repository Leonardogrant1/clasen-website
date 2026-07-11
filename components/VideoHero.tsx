"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    src: string;
    className?: string;
    loop?: boolean;
};

export default function VideoHero({ src, className, loop = true }: Props) {
    const ref = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const video = ref.current;
        if (!video) return;
        video.muted = true;

        const handlePlaying = () => setIsLoaded(true);
        video.addEventListener("playing", handlePlaying);

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
        return () => {
            observer.disconnect();
            video.removeEventListener("playing", handlePlaying);
        };
    }, []);

    return (
        <video
            ref={ref}
            src={src}
            autoPlay
            loop={loop}
            muted
            playsInline
            preload="auto"
            className={`${className} transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        />
    );
}