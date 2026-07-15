import StatsBox from "./StatsBox";
import type { Dictionary } from "@/app/[lang]/(main)/dictionaries";
import VideoHero from "./VideoHero";

type Props = {
  dict: Dictionary["hero"];
  statsDict: Dictionary["stats"];
  forceItemIndex?: number;
  overrideVision?: string;
};

export default function HeroSection({ dict, statsDict, forceItemIndex, overrideVision }: Props) {

  const itemIndex = forceItemIndex !== undefined ? forceItemIndex : Math.floor(Math.random() * dict.items.length);
  const item = dict.items[itemIndex];
  const label = overrideVision || dict.vision;
  return (
    <>
      {/* Mobile */}
      <section className="flex flex-col md:hidden bg-background">
        <div className="relative h-[70vh] overflow-hidden">
          <VideoHero src={item.videoPath.replace(".mp4", "_mobile.mp4")} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10" />

          <div className="absolute bottom-6 left-4 right-4 z-10">
            <div className="flex items-end justify-start gap-2 mb-2">
              <span className="text-[#C9A84C] text-2xl font-semibold tracking-widest uppercase">01</span>
              <p className="text-[#C9A84C] text-sm uppercase tracking-widest mb-1 font-semibold">{label}</p>
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground whitespace-pre-line text-left">
              {item.title}
            </h1>
          </div>
        </div>

        <div className="px-4 py-4 flex flex-col gap-2">
          <p className="text-muted leading-relaxed text-[0.99rem] whitespace-pre-line">{item.subtitle}</p>
        </div>

        <StatsBox dict={statsDict} inline />
      </section>

      {/* Desktop */}
      <section className="hidden md:block relative h-screen overflow-hidden">
        <VideoHero src={item.videoPath} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />

        <div className="absolute bottom-16 lg:bottom-16 xl:bottom-14 2xl:bottom-12 left-8 xl:left-12 2xl:left-16 z-10 max-w-xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-3xl">
          <div className="flex items-end gap-1 align-bottom">
            <span className="text-[#C9A84C] text-3xl xl:text-3xl 2xl:text-4xl font-semibold tracking-widest uppercase z-10">01</span>
            <p className="text-[#C9A84C] text-lg xl:text-lg 2xl:text-2xl uppercase tracking-widest mb-1 font-semibold">{label}</p>
          </div>
          <h1 className="text-4xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold leading-tight tracking-tight text-foreground mb-3 2xl:mb-4 whitespace-pre-line">
            {item.title}
          </h1>
          <p className="text-muted max-w-xl lg:max-w-xl xl:max-w-xl 2xl:max-w-2xl leading-relaxed text-base md:text-xl whitespace-pre-line">{item.subtitle}</p>
        </div>

        <StatsBox dict={statsDict} />
      </section>
    </>
  );
}
