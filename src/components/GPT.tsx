import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useState } from "react"
import Typewriter from "typewriter-effect"
import { ANSWERS } from "../utils/answers"

export const GPT: React.FC = () => {
  const [value, setValue] = useState("")
  const [question, setQuestion] = useState(
    "What inspired you to become a developer?"
  )
  const [isAsked, setIsAsked] = useState(false)
  const [answer, setAnswer] = useState("")

  const questions = [
    `"What inspired you to become a developer?"`,
    // `"What are you working on right now?"`,
    `"What is your tech stack currently?"`,
    `"What are your interests besides coding?"`,
  ]

  const capabilities = [
    "Can write and test smart contracts",
    "Create user friendly applications",
    "Always eager to learn new technologies",
  ]

  const limitations = [
    "May occasionally talk about a new technology he saw",
    "May occasionally jams with strangers",
    "Limited knowledge of anime aka non existent",
  ]

  const handleChange = (val: React.ChangeEvent<HTMLInputElement>) => {
    setValue(val.target.value)
  }

  const handleClick = (index: number) => {
    const newQuestion = questions[index].replaceAll(`"`, ``)
    setValue(newQuestion)

    return <Typewriter />
  }

  const answerQuestion = () => {
    const structuredAnswer = ANSWERS[0].split(" ")
  }

  const handleSubmit = () => {
    setIsAsked((prevState) => !prevState)
    setValue("")
  }

  useEffect(() => {
    if (isAsked) {
      answerQuestion()
    }
  }, [isAsked])

  return (
    <div className="flex items-center justify-center h-screen min-w-full overflow-hidden bg-gray-800 snap-start">
      <div
        className={` container h-full max-h-screen max-w-3xl  overflow-hidden text-center relative text-white min-w-fit`}
      >
        {/* <div className="relative flex flex-col items-center justify-center col-start-2 row-start-1 gap-2 top-24">
          <h1 className="mt-4 text-4xl font-bold tracking-tighter ">
            Ask me anything!
          </h1>
          <p className="mb-8 text-xl tracking-tighter opacity-40">
            Type your question below and I'll try to answer it.
          </p>

        </div> */}
        <AnimatePresence>
          {!isAsked ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="info"
              className="relative grid items-center justify-center grid-cols-1 grid-rows-3 mx-auto overflow-y-hidden text-center text-white h-fit md:h-full md:grid-cols-3 top-4 md:bottom-16 max-w-fit"
            >
              <div className="flex flex-col items-center justify-end col-start-1 row-start-1 gap-3 p-2 md:gap-4 md:p-4 h-fit md:h-full md:justify-center md:row-start-2 ">
                <div className="flex flex-row items-center justify-center gap-2 md:flex-col w-52 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 md:w-8 md:h-8"
                    viewBox="0 0 512 512"
                  >
                    <title>Book</title>
                    <path
                      d="M256 160c16-63.16 76.43-95.41 208-96a15.94 15.94 0 0116 16v288a16 16 0 01-16 16c-128 0-177.45 25.81-208 64-30.37-38-80-64-208-64-9.88 0-16-8.05-16-17.93V80a15.94 15.94 0 0116-16c131.57.59 192 32.84 208 96zM256 160v288"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                    />
                  </svg>
                  <h1 className="tracking-tighter">Examples</h1>
                </div>
                {questions.map((question, index) => {
                  return (
                    <button
                      key={index}
                      onClick={() => handleClick(index)}
                      className=" mb-2 w-full md:w-52 text-sm shadow-lg  transition duration-300 ease-in-out hover:bg-[#32333c] px-3 py-2 rounded-lg bg-[#3E3F4B] font-light tracking-tight"
                    >
                      <span className="p-1 text-slate-300">{question}</span>
                    </button>
                  )
                })}
              </div>
              <div className="flex flex-col items-center justify-end col-start-1 row-start-2 gap-3 p-2 md:gap-4 h-fit md:h-full md:p-4 md:justify-center md:col-start-2 md:row-start-2 ">
                <div className="flex flex-row items-center justify-center gap-2 md:flex-col w-52 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 fill-current md:w-8 md:h-8"
                    viewBox="0 0 512 512"
                  >
                    <title>Flash</title>
                    <path
                      d="M315.27 33L96 304h128l-31.51 173.23a2.36 2.36 0 002.33 2.77h0a2.36 2.36 0 001.89-.95L416 208H288l31.66-173.25a2.45 2.45 0 00-2.44-2.75h0a2.42 2.42 0 00-1.95 1z"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                    />
                  </svg>
                  <h1 className="tracking-tighter">Capabilities</h1>
                </div>
                {capabilities.map((question, index) => {
                  return (
                    <div
                      key={index}
                      className=" mb-2 w-full md:w-52 text-sm shadow-lg  transition duration-300 ease-in-out hover:bg-[#32333c] px-3 py-2 rounded-lg bg-[#3E3F4B] font-light tracking-tight"
                    >
                      <span className="p-1 text-slate-300">{question}</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex flex-col items-center justify-end col-start-1 row-start-3 gap-3 p-2 md:gap-4 md:p-4 h-fit md:h-full md:justify-center md:col-start-3 md:row-start-2 ">
                <div className="flex flex-row items-center justify-center gap-2 md:flex-col w-52 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 fill-current md:w-8 md:h-8"
                    viewBox="0 0 512 512"
                  >
                    <title>Alert Circle</title>
                    <path
                      d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                      fill="none"
                      stroke="currentColor"
                      strokeMiterlimit="10"
                      strokeWidth="32"
                    />
                    <path
                      d="M250.26 166.05L256 288l5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 6z"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                    />
                    <path d="M256 367.91a20 20 0 1120-20 20 20 0 01-20 20z" />
                  </svg>
                  <h1 className="tracking-tighter">Limitations</h1>
                </div>
                {limitations.map((question, index) => {
                  return (
                    <div
                      onClick={() => setIsAsked((prevState) => !prevState)}
                      key={index}
                      className=" mb-2 w-full md:w-52 text-sm shadow-lg  transition duration-300 ease-in-out hover:bg-[#32333c] px-3 py-2 rounded-lg bg-[#3E3F4B] font-light tracking-tight"
                    >
                      <span className="p-1 text-slate-300">{question}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={"chat"}
              className="relative grid justify-center w-full h-[85%] max-w-3xl max-h-screen grid-cols-2 grid-rows-3 mt-8 overflow-y-auto text-center text-white scroll-p-4 "
            >
              <div className="relative min-w-full col-span-2 col-start-1 row-start-1 gap-4 text-center text-white ">
                <div className="flex w-full gap-2 px-2 py-4 gap- bg-slate-600 h-fit">
                  <h1 className="">Visitor</h1>
                  <h1 className=""> {question}</h1>
                </div>
                <div
                  onClick={() => setIsAsked((prevState) => !prevState)}
                  className="flex gap-3 px-2 py-4 h-fit "
                >
                  <h1>Umut </h1>
                  <h1 className="leading-7 tracking-tight text-start ">
                    {/* <Typewriter
                    options={{
                      strings: ANSWERS[0],
                      autoStart: true,
                      delay: 40,
                    }}
                  /> */}{" "}
                  </h1>
                </div>
                <div className="flex w-full gap-2 px-2 py-4 gap- bg-slate-600 h-fit">
                  <h1>Visitor</h1>
                  <h1 className=""> {question}</h1>
                </div>
                <div
                  onClick={() => setIsAsked((prevState) => !prevState)}
                  className="flex gap-3 px-2 py-4 h-fit "
                >
                  <h1>Umut </h1>
                  <h1 className="leading-7 tracking-tight text-start ">
                    {/* <Typewriter
                    options={{
                      strings: ANSWERS[0],
                      autoStart: true,
                      delay: 40,
                    }}
                  /> */}{" "}
                    " Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Cum similique voluptatum laudantium maxime, ab reiciendis
                    dolore magnam cumque quam natus suscipit nulla reprehenderit
                    illo voluptatibus eveniet optio eaque! Nulla iusto officiis
                    laborum sit ducimus ex soluta at, amet, itaque tenetur modi,
                    rem officia reprehenderit odit quam suscipit quos quisquam
                    nam placeat? Laboriosam nulla aspernatur accusamus
                    exercitationem cupiditate incidunt aliquam repudiandae quod
                    repellendus, consequatur ",
                  </h1>
                </div>
                <div
                  onClick={() => setIsAsked((prevState) => !prevState)}
                  className="flex gap-3 px-2 py-4 h-fit "
                >
                  <h1>Umut </h1>
                  <h1 className="tracking-tight text-start ">
                    {/* <Typewriter
                    options={{
                      strings: ANSWERS[0],
                      autoStart: true,
                      delay: 40,
                    }}
                  /> */}{" "}
                    " Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Cum similique voluptatum laudantium maxime, ab reiciendis
                    dolore magnam cumque quam natus suscipit nulla reprehenderit
                    illo voluptatibus eveniet optio eaque! Nulla iusto officiis
                    laborum sit ducimus ex soluta at, amet, itaque tenetur modi,
                    rem officia reprehenderit odit quam suscipit quos quisquam
                    nam placeat? Laboriosam nulla aspernatur accusamus
                    exercitationem cupiditate incidunt aliquam repudiandae quod
                    repellendus, consequatur ",
                  </h1>
                </div>
                <div className="flex w-full gap-2 px-2 py-4 gap- bg-slate-600 h-fit">
                  <h1>Visitor</h1>
                  <h1 className=""> {question}</h1>
                </div>
                <div
                  onClick={() => setIsAsked((prevState) => !prevState)}
                  className="flex gap-3 px-2 py-4 h-fit "
                >
                  <h1>Umut </h1>
                  <h1 className="tracking-tight text-start ">
                    {/* <Typewriter
                    options={{
                      strings: ANSWERS[0],
                      autoStart: true,
                      delay: 40,
                    }}
                  /> */}{" "}
                    " Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Cum similique voluptatum laudantium maxime, ab reiciendis
                    dolore magnam cumque quam natus suscipit nulla reprehenderit
                    illo voluptatibus eveniet optio eaque! Nulla iusto officiis
                    laborum sit ducimus ex soluta at, amet, itaque tenetur modi,
                    rem officia reprehenderit odit quam suscipit quos quisquam
                    nam placeat? Laboriosam nulla aspernatur accusamus
                    exercitationem cupiditate incidunt aliquam repudiandae quod
                    repellendus, consequatur ",
                  </h1>
                </div>
              </div>
              {/* <div className="flex flex-col col-start-2 row-start-3 gap-4 text-center text-white snap-start">
              <div className="flex gap-2 px-2 py-4 border h-fit">
                <h1>Visitor - </h1>
                <h1> {question}</h1>
              </div>
              <div className="flex gap-2 px-2 py-4 border h-fit ">
                <h1>Umut - </h1>
                <h1 className="tracking-tight ">
                  <Typewriter
                options={{
                  strings: ANSWERS[0],
                  autoStart: true,
                  delay: 40,
                }}
              />
                </h1>
              </div>
            </div> */}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          id="input"
          className={`absolute  flex flex-col justify-center w-full bottom-0 pb-3`}
        >
          <div className="flex items-center w-full py-2">
            <input
              className=" rounded-lg shadow-lg w-full max-w-2xl  placeholder:text-sm text-sm placeholder:tracking-tight shrink-0  px-3.5 py-3  bg-[#40414F] min-w-full  text-white leading-tight focus:outline-none"
              id="search"
              type="text"
              value={value}
              onChange={handleChange}
              required
              placeholder="Ask me anything"
            />
            {/* <button
              className="bg-[#1F2937] hover:bg-[#2f3e53] text-white font-bold py-2 px-4 rounded"
              id="search-btn"
            >
              Ask
            </button> */}
            <button
              onClick={handleSubmit}
              className="relative p-1.5 transition ease-in-out text-gray-200 duration-300 hover:text-[#1F2937]  rounded-lg shrink-0 hover:bg-gray-400 -left-10"
            >
              <svg
                className="w-6 h-6 fill-current "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="fillCurrent"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          {/* <p className="relative mt-2 text-xs text-center text-gray-400">
            Press Enter to submit your question
          </p> */}
        </div>
      </div>
    </div>
  )
}
