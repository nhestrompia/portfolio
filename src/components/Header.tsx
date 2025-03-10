import React from "react"
import { ThemeToggle } from "./Theme"

export const Header: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen px-8 py-16 mx-auto overflow-y-clip snap-normal snap-start max-w-7xl lg:px-16 md:px-12 lg:py-24">
      <nav className="absolute flex items-end justify-end w-full mr-8 top-6">
        <ThemeToggle />
      </nav>

      <div className="flex flex-col items-center justify-center w-full mt-8 text-center h-1/2 md:mt-4 lg:p-10">
        <div className="w-full mx-auto ">
          <p className="mt-8 text-4xl tracking-tighter text-light-font md:text-5xl dark:text-white">
            Hello I am Umut
          </p>
          <p className="max-w-xl mx-auto mt-4 text-lg tracking-tighter text-light-font text-opacity-80 dark:text-opacity-100 dark:text-gray-300">
            Front-end developer
          </p>{" "}
        </div>

        <div className="flex justify-center gap-6 mt-6">
          <a
            className="p-1 -m-1 transition fill-current text-light-font group dark:text-white"
            aria-label="Follow on Twitter"
            target="_blank"
            href="https://twitter.com/nhestrompia"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 "
              viewBox="0 0 512 512"
            >
              <title>Twitter</title>
              <path d="M496 109.5a201.8 201.8 0 01-56.55 15.3 97.51 97.51 0 0043.33-53.6 197.74 197.74 0 01-62.56 23.5A99.14 99.14 0 00348.31 64c-54.42 0-98.46 43.4-98.46 96.9a93.21 93.21 0 002.54 22.1 280.7 280.7 0 01-203-101.3A95.69 95.69 0 0036 130.4c0 33.6 17.53 63.3 44 80.7A97.5 97.5 0 0135.22 199v1.2c0 47 34 86.1 79 95a100.76 100.76 0 01-25.94 3.4 94.38 94.38 0 01-18.51-1.8c12.51 38.5 48.92 66.5 92.05 67.3A199.59 199.59 0 0139.5 405.6a203 203 0 01-23.5-1.4A278.68 278.68 0 00166.74 448c181.36 0 280.44-147.7 280.44-275.8 0-4.2-.11-8.4-.31-12.5A198.48 198.48 0 00496 109.5z" />
            </svg>
          </a>

          <a
            className="p-1 -m-1 transition fill-current text-light-font group dark:text-white"
            aria-label="Follow on GitHub"
            target="_blank"
            href="https://github.com/nhestrompia"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 "
              viewBox="0 0 512 512"
            >
              <title>Github</title>
              <path d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z" />
            </svg>
          </a>
          <a
            className="p-1 -m-1 transition fill-current text-light-font group dark:text-white"
            aria-label="Follow on GitHub"
            href="mailto:nhestrompia@gmail.com?subject=&body="
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 512 512"
            >
              <title>Mail</title>
              <path d="M424 80H88a56.06 56.06 0 00-56 56v240a56.06 56.06 0 0056 56h336a56.06 56.06 0 0056-56V136a56.06 56.06 0 00-56-56zm-14.18 92.63l-144 112a16 16 0 01-19.64 0l-144-112a16 16 0 1119.64-25.26L256 251.73l134.18-104.36a16 16 0 0119.64 25.26z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center w-screen gap-2 mt-auto text-white  bg-[#011627] h-3/4 lg:h-2/3 top-48 md:top-24 ">
        <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl -mt-14 lg:mt-4">
          Ask me anything!
        </h1>
        <p className="w-64 mb-8 text-lg tracking-tighter text-center md:text-xl md:w-full opacity-40">
          Type your question below and I&apos;ll try to answer it.
        </p>
      </div>
    </div>
  )
}
