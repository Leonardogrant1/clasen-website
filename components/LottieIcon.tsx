"use client"
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import contact from "@/public/animations/contact.json"
import handshake from "@/public/animations/handshake.json"
import money from "@/public/animations/money.json"

const lotties = {
  contact,
  handshake,
  money,
} as const;

type Props = {
  name: keyof typeof lotties;
  className?: string;
};

export default function LottieIcon({ name, className }: Props) {
  return <Lottie animationData={lotties[name]} loop={true} className={className ?? "w-24 h-24"} />;
}
