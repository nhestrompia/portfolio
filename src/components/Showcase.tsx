import React from "react"
import { Pagination } from "swiper"
import "swiper/css"
import "swiper/css/pagination"
import { Swiper, SwiperSlide } from "swiper/react"

import { projects } from "../utils/projects"
import { Project } from "./Project"

export const Showcase: React.FC = () => {
  return (
    <div className="relative h-screen snap-start">
      {/* <motion.div
        initial={{ opacity: 1 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-10 mx-auto"
      >
        <h1 className="text-6xl font-bold tracking-tighter border-gray-400 ">
          Projects
        </h1>
      </motion.div> */}

      <Swiper pagination={true} modules={[Pagination]}>
        {projects.map((project) => {
          return (
            <SwiperSlide key={project!.id}>
              <Project key={project!.id} projects={project!} />
            </SwiperSlide>
          )
        })}
      </Swiper>
      {/* <div className="absolute flex gap-8 bottom-8 right-[48%]">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-gray-400"
            viewBox="0 0 512 512"
          >
            <title>Chevron Back </title>
            <path
              d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="32"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
              d="M296 352l-96-96 96-96"
            />
          </svg>
        </button>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            viewBox="0 0 512 512"
          >
            <title>Chevron Forward Circle</title>
            <path
              d="M64 256c0 106 86 192 192 192s192-86 192-192S362 64 256 64 64 150 64 256z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="32"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
              d="M216 352l96-96-96-96"
            />
          </svg>
        </button>
      </div> */}
    </div>
  )
}
