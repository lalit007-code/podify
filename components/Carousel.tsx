import React, { useCallback } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { DotButton, useDotButton } from "@/components/EmblaCarouselDot";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselProps } from "@/types/Index";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoaderSpinner from "./LoaderSpinner";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

const EmblaCarousel = ({ fansLikeDetail }: CarouselProps) => {
  const router = useRouter();
  const fansLikeDetails = useQuery(api.podcasts.getTrendingPodcasts);
  console.log(fansLikeDetails);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [Autoplay()]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay || !("stopOnInteraction" in autoplay.options)) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? (autoplay.reset as () => void)
        : (autoplay.stop as () => void);

    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );

  // Safely handle the case when fansLikeDetails is undefined or null
  const slides =
    fansLikeDetails && fansLikeDetails.length > 0 ? fansLikeDetails : [];

  if (slides.length === 0) return <LoaderSpinner />;

  return (
    <section
      className="flex w-full flex-col gap-4 overflow-hidden"
      ref={emblaRef}
    >
      <div className="flex">
        {slides.slice(0, 5).map((item: any) => (
          <figure
            key={item._id}
            className="carousel_box"
            onClick={() => router.push(`/podcasts/${item._id}`)}
          >
            <Image
              src={item.imageUrl}
              alt="card"
              fill
              className="absolute size-full rounded-xl border-none"
            />
            <div className="glassmorphism-black relative z-10 flex flex-col rounded-b-xl p-4">
              <h2 className="text-14 font-semibold text-white-1">
                {item.podcastTitle}
              </h2>
              <p className="text-12 font-normal text-white-2">
                {item.podcastDescription}
              </p>
              <p className="text-12 font-normal text-white-2">
                Duration: {item.audioDuration}
              </p>
            </div>
          </figure>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    </section>
  );
};

export default EmblaCarousel;
