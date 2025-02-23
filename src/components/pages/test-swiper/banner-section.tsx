"use client"

import { webroot } from "@/assets/webroot"
import { useEffect, useRef, useState } from "react"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react"
import BannerCarousel from "./banner-carousel"

export const listBannerImageRowFirst = [
  { id: 1, src: webroot.bannerSliderR1_1 },
  { id: 2, src: webroot.bannerSliderR1_2 },
  { id: 3, src: webroot.bannerSliderR1_3 },
  { id: 4, src: webroot.bannerSliderR1_4 },
  { id: 5, src: webroot.bannerSliderR1_5 },
  { id: 6, src: webroot.bannerSliderR1_6 },
  { id: 7, src: webroot.bannerSliderR1_7 },
  { id: 9, src: webroot.bannerSliderR1_9 },
  { id: 10, src: webroot.bannerSliderR1_10 },
  { id: 11, src: webroot.bannerSliderR1_11 },
  { id: 12, src: webroot.bannerSliderR1_12 },
  { id: 13, src: webroot.bannerSliderR1_13 },
]

export const listBannerImageRowSecond = [
  { id: 1, src: webroot.bannerSliderR2_1 },
  { id: 2, src: webroot.bannerSliderR2_2 },
  { id: 3, src: webroot.bannerSliderR2_3 },
  { id: 4, src: webroot.bannerSliderR2_4 },
  { id: 5, src: webroot.bannerSliderR2_5 },
  { id: 6, src: webroot.bannerSliderR2_6 },
  { id: 7, src: webroot.bannerSliderR2_7 },
  { id: 8, src: webroot.bannerSliderR2_8 },
  { id: 9, src: webroot.bannerSliderR2_9 },
  { id: 10, src: webroot.bannerSliderR2_10 },
  { id: 11, src: webroot.bannerSliderR2_11 },
  { id: 12, src: webroot.bannerSliderR2_12 },
]

export const listBannerImageRowThird = [
  { id: 1, src: webroot.bannerSliderR3_1 },
  { id: 2, src: webroot.bannerSliderR3_2 },
  { id: 3, src: webroot.bannerSliderR3_3 },
  { id: 4, src: webroot.bannerSliderR3_4 },
  { id: 5, src: webroot.bannerSliderR3_5 },
  { id: 6, src: webroot.bannerSliderR3_6 },
  { id: 7, src: webroot.bannerSliderR3_7 },
  { id: 8, src: webroot.bannerSliderR3_8 },
  { id: 9, src: webroot.bannerSliderR3_9 },
  { id: 10, src: webroot.bannerSliderR3_10 },
  { id: 11, src: webroot.bannerSliderR3_11 },
  { id: 12, src: webroot.bannerSliderR3_12 },
]

type CarouselRefType = {
  startScroll: () => void
  pauseScroll: () => void
}

export default function BannerSection() {
  const [autoplay, setAutoplay] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const loadedImages = useRef<Set<string>>(new Set())

  // Kiểm tra tất cả ảnh đã load
  const checkAllImagesLoaded = () => {
    const allImages = [
      ...listBannerImageRowFirst,
      ...listBannerImageRowSecond,
      ...listBannerImageRowThird,
    ].map((img) => img.src)

    if (allImages.every((src) => loadedImages.current.has(src))) {
      setIsLoading(false)
    }
  }

  // Hàm preload ảnh
  const preloadImages = (imageList: { src: string }[]) => {
    imageList.forEach(({ src }) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        loadedImages.current.add(src)
        checkAllImagesLoaded()
      }
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`)
        loadedImages.current.add(src) // Vẫn tính là đã load để tránh treo loading
        checkAllImagesLoaded()
      }
    })
  }

  const carouselRef1 = useRef<CarouselRefType>(null)
  const carouselRef2 = useRef<CarouselRefType>(null)
  const carouselRef3 = useRef<CarouselRefType>(null)

  const handlePlay = () => {
    setAutoplay(true)
    carouselRef1.current?.startScroll()
    carouselRef2.current?.startScroll()
    carouselRef3.current?.startScroll()
  }

  const handlePause = () => {
    setAutoplay(false)
    carouselRef1.current?.pauseScroll()
    carouselRef2.current?.pauseScroll()
    carouselRef3.current?.pauseScroll()
  }

  useEffect(() => {
    // Bắt đầu preload tất cả ảnh
    preloadImages([
      ...listBannerImageRowFirst,
      ...listBannerImageRowSecond,
      ...listBannerImageRowThird,
    ])

    // Timeout dự phòng nếu có ảnh không load được
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  if (isLoading) {
    return (
      <div className="container-fhd flex h-[560px] items-center justify-center bg-black/60 ">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <>
      <section className="container-fhd flex flex-col bg-background-primary !px-0 pb-0 md:pb-6">
        {/* slider mobile */}
        <div className="hidden gap-[0.4375rem] md:flex md:flex-col">
          <BannerCarousel
            ref={carouselRef1}
            listBannerImage={listBannerImageRowFirst}
          />

          <BannerCarousel
            ref={carouselRef2}
            listBannerImage={listBannerImageRowSecond}
          />
          <BannerCarousel
            ref={carouselRef3}
            listBannerImage={listBannerImageRowThird}
          />
          <div className="relative flex justify-end px-4">
            <button
              type="button"
              className=""
              onClick={() => {
                if (autoplay) {
                  handlePause()
                } else {
                  handlePlay()
                }
              }}
            >
              <div className="flex size-[2.125rem] items-center justify-center bg-gray-300">
                {autoplay ? <div>play</div> : <div>stop</div>}
              </div>
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
