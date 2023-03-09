import { motion } from "framer-motion"
import Image from "next/image"
import React from "react"

interface Project {
  id: number
  title: string
  overview: string
  features: string[]
  tech: string[]
  image: string
  links: string[]
}

interface IProps {
  projects: Project
}

export const Project: React.FC<IProps> = ({ projects }) => {
  const fixName = (name: string) => {
    let index

    if (name.includes("js")) {
      index = name.indexOf("js")
    } else {
      index = name.indexOf("io")
    }

    const fixedName = name.slice(0, index) + "." + name.slice(index)

    return fixedName
  }

  return (
    <div className="relative h-full overflow-y-auto xl:h-screen 4k:h-full cursor-grab">
      <motion.div
        layout
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        viewport={{ once: true }}
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // transition={{ duration: 5 }}
        className="absolute grid grid-rows-2 overflow-x-hidden xl:flex xl:flex-row 4k:grid 4k:grid-rows-2 4k:grid-cols-3 4k:justify-center"
      >
        <div className="flex flex-col w-full row-start-1 mx-auto 4k:col-start-2">
          <div className="flex items-center content-center justify-center w-full row-start-1 mt-6 xl:mt-10 ">
            <Image
              priority
              src={`/${projects.image}.png`}
              width={860}
              height={600}
              // objectFit="contain"
              // layout="fixed"
              // object-fit="contain"
              alt={projects.image}
            />
          </div>
          <div className="relative flex items-center justify-center w-full gap-4 text-center bottom-8 md:bottom-12 ">
            <div className="flex items-center gap-4">
              <a
                href={projects.links[0]}
                target="_blank"
                className="inline-flex items-center justify-center w-full px-2.5 py-2 text-xs tracking-wide text-center text-white duration-200 bg-black border-2 border-black md:text-base md:px-6 dark:text-black dark:hover:bg-black dark:hover:text-white dark:bg-white hover:bg-transparent hover:border-black rounded-xl hover:text-black focus:outline-none lg:w-auto focus-visible:outline-black focus-visible:ring-black"
              >
                Live Demo
              </a>
              <a
                href={projects.links[1]}
                target="_blank"
                className="inline-flex items-center justify-center w-full px-2.5 py-2 text-xs tracking-wide text-center text-white duration-200 bg-black border-2 border-black md:text-base md:px-6 whitespace-nowrap dark:text-black dark:hover:bg-black dark:hover:text-white dark:bg-white hover:bg-transparent hover:border-black rounded-xl hover:text-black focus:outline-none lg:w-auto focus-visible:outline-black focus-visible:ring-black"
              >
                Source Code
              </a>
            </div>
          </div>
        </div>
        <div className="absolute flex flex-col justify-start w-full row-start-2 gap-2 mx-4 4k:col-start-2 md:gap-4 md:static lg:mt-10 4k:content-center ">
          <h1 className="mx-2 text-3xl font-bold tracking-tighter 4k:text-5xl md:mx-4 md:text-4xl h-fit">
            {projects.title}
          </h1>
          <div className="flex flex-col gap-3 md:mx-2">
            <div className="flex flex-col gap-2">
              <h2 className="mx-2 text-lg font-semibold tracking-tighter 4k:text-3xl md:text-xl">
                Project Overview
              </h2>
              <p className="mx-2  text-sm w-[90%] md:text-base">
                {projects.overview}
              </p>
            </div>
            <div>
              {/* <h1 className="mb-2 text-xl font-semibold">Tech Stack</h1> */}
              <div className="flex gap-4 mt-2 ">
                <div className="md:mt-4 w-[90%]">
                  <h2 className="mx-2 text-xl font-semibold tracking-tighter 4k:text-3xl">
                    Features
                  </h2>
                  <ul className="mx-2 space-y-2 text-sm list-disc md:text-base">
                    {projects.features.map((feature, index) => {
                      return (
                        <li className="my-1" key={index}>
                          {feature}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className=" py-4 mb-16 md:mb-0 md:mt-8 border w-[90%] xl:w-full  rounded-lg xl:px-2  ">
              <h1 className="flex justify-center pb-4 text-lg font-semibold tracking-tighter text-center 4k:text-3xl md:text-xl">
                Tech Stack
              </h1>
              <div className="grid items-center justify-center w-full grid-cols-3 gap-3 md:w-full md:gap-4 md:grid-cols-4 ">
                {projects.tech.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center gap-2"
                    >
                      <div className="flex items-center justify-center w-8 h-8 ">
                        <img
                          key={index}
                          src={`/tech/${item}.svg`}
                          className="w-8 h-8"
                          width={item === "Solidity" ? 16 : 36}
                          height={item === "Solidity" ? 16 : 36}
                          alt={item}
                        />
                      </div>
                      <span className="text-xs text-black md:text-sm dark:text-white text-opacity-40">
                        {item.includes("js") || item.includes("io")
                          ? fixName(item)
                          : item}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
