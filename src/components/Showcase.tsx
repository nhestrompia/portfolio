import React from "react"
import { Pagination } from "swiper"
import "swiper/css"
// import "swiper/css/effect-cube"
import "swiper/css/pagination"
import { Swiper, SwiperSlide } from "swiper/react"

import { projects } from "../utils/projects"
import { Project } from "./Project"

interface Project {
  id: number
  title: string
  overview: string
  features: string[]
  tech: string[]
  image: string
  links: string[]
}

export const Showcase: React.FC = () => {
  // const marqueeVariants = {
  //   animate: {
  //     rotate: 90,
  //     x: 1400,
  //     y: [0, 1000],
  //     transition: {
  //       y: {
  //         repeat: Infinity,
  //         repeatType: "loop",
  //         duration: 5,
  //         ease: "linear",
  //       },
  //     },
  //   },
  // }

  const marqueeVariants = {
    animate: {
      x: ["-100%", "0%"],
      transition: {
        x: {
          duration: 5,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      },
    },
  }

  return (
    <div className="h-screen overflow-y-auto smooth-scroll snap-start">
      {/* // initial={{ opacity: 1 }}
      // viewport={{ once: true }}
      // whileInView={{ opacity: 0 }}
      // transition={{ duration: 2 }} */}
      {/* <motion.div
        initial={{ x: 1400 }}
        variants={marqueeVariants}
        animate="animate"
        className="absolute z-10 inline-block whitespace-nowrap"
      >
        <h1 className="text-6xl font-bold tracking-tighter border-gray-400 ">
          Projects
        </h1>
      </motion.div> */}
      {/* <div className="absolute z-10 overflow-hidden">
        <div className="relative z-10 inline-block overflow-hidden">
          <motion.span
            className="absolute inline-block whitespace-nowrap"
            variants={marqueeVariants}
            animate="animate"
            style={{ willChange: "transform" }}
          >
            Projects
          </motion.span>
          <motion.span
            className="absolute inline-block whitespace-nowrap"
            variants={marqueeVariants}
            animate="animate"
            style={{ willChange: "transform" }}
            // style={{ marginLeft: '100%' }}
          >
            Projects
          </motion.span>
        </div>
      </div> */}

      <Swiper
        // mousewheel={{ thresholdDelta: 0.5 }}
        className="h-full min-h-full "
        pagination={{
          bulletActiveClass: "active-bullet",
          clickable: true,
        }}
        // style={{ backgroundColor: "#e54b4b" }}
        modules={[Pagination]}

        // effect="cube"
      >
        {projects.map((project) => {
          return (
            <SwiperSlide key={project!.id}>
              <Project key={project!.id} projects={project!} />
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
