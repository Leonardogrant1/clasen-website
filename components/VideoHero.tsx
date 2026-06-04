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
        video.play().catch(() => { });
    }, []);

    return (
        <video
            ref={ref}
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className={className}
        />
    );
}