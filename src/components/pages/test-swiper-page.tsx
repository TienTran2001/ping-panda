"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"
import Image from "next/image"

const images = [
  "https://images.unsplash.com/photo-1738447429433-69e3ecd0bdd0?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1738941316860-fa7065bd2518?q=80&w=1958&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1739032713558-017ad58b0fbb?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

const TestSwiperPage = () => {
  return (
    <Swiper
      loop
      speed={500}
      slidesPerView={"auto"}
      spaceBetween={20}
      autoplay={{
        delay: 3000,
      }}
    >
      {images.map((src, index) => (
        <SwiperSlide key={index} className="!w-auto !h-[300px]">
          <div className="max-w-[500px] w-full" style={{ height: "300px" }}>
            <Image
              unoptimized
              src={src}
              alt={`Slide ${index + 1}`}
              height={300}
              width={300} // Adjusted width to 300px to match the height
              className="object-cover w-full h-full"
              sizes="300px"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default TestSwiperPage
