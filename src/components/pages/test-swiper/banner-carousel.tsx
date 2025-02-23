"use client"

import Image from "next/image"
import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"

type BannerCarouselProps = {
  listBannerImage: { id: number; src: string }[]
}

const BannerCarousel = forwardRef((props: BannerCarouselProps, ref) => {
  const carouselRef = useRef<HTMLDivElement>(null) // reference to the carousel
  const animationFrameId = useRef<number | null>(null) // save id of requestAnimationFrame to cancel it
  const accumulatedScroll = useRef(0) // cumulative scroll distance
  const speed = 0.5 // speed of scroll

  /**
   * accumulatedScroll.current += speed: Accumulate speed.
   * Math.floor(accumulatedScroll.current): Get the integer part for smooth scrolling.
   * accumulatedScroll.current -= delta: Keep the decimal part for the next scroll.
   * scrollLeft >= scrollWidth / 2: Reset to 0 when scrolling is half way.
   * requestAnimationFrame(scroll): Continue the scroll loop.
   */
  const scroll = () => {
    if (carouselRef.current) {
      accumulatedScroll.current += speed // accumulate speed
      const delta = Math.floor(accumulatedScroll.current) // get integer part

      if (delta > 0) {
        carouselRef.current.scrollLeft += delta
        accumulatedScroll.current -= delta // keep the decimal part

        // Reset when reach the middle
        if (
          carouselRef.current.scrollLeft >=
          carouselRef.current.scrollWidth / 2
        ) {
          carouselRef.current.scrollLeft = 0
        }
      }

      animationFrameId.current = requestAnimationFrame(scroll)
    }
  }

  const startScroll = () => {
    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(scroll)
    }
  }

  const pauseScroll = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }
  }

  useImperativeHandle(ref, () => ({
    startScroll,
    pauseScroll,
  }))

  // Start scroll when component mount
  useEffect(() => {
    startScroll()
    return () => pauseScroll() // stop scroll when component unmount
  }, [])

  const duplicatedImages = [...props.listBannerImage, ...props.listBannerImage] // duplicate images to create infinite scroll effect

  return (
    <div
      ref={carouselRef}
      className="relative overflow-hidden bg-section-carousel h-[11.0625rem] w-full"
    >
      <div className="flex gap-[7px] whitespace-nowrap">
        {duplicatedImages.map((item, index) => (
          <div key={index} className="h-[177px] w-fit shrink-0">
            <Image
              src={item.src}
              alt={`banner-${item.id}`}
              width={300}
              height={177}
              className="h-full w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
})

BannerCarousel.displayName = "BannerCarousel"
export default BannerCarousel
