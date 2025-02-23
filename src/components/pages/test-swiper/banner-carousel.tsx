"use client"

import Image from "next/image"
import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"

type BannerCarouselProps = {
  listBannerImage: { id: number; src: string }[]
}

const BannerCarousel = forwardRef((props: BannerCarouselProps, ref) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const animationFrameId = useRef<number | null>(null)
  const accumulatedScroll = useRef(0) // Thêm accumulator
  const speed = 0.5 // Có thể đặt nhỏ hơn 1

  const scroll = () => {
    if (carouselRef.current) {
      accumulatedScroll.current += speed // Tích lũy tốc độ
      const delta = Math.floor(accumulatedScroll.current) // Lấy phần nguyên

      if (delta > 0) {
        carouselRef.current.scrollLeft += delta
        accumulatedScroll.current -= delta // Giữ lại phần thập phân

        // Reset khi chạm điểm giữa
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

  useEffect(() => {
    startScroll()
    return () => pauseScroll()
  }, [])

  const duplicatedImages = [...props.listBannerImage, ...props.listBannerImage]

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
