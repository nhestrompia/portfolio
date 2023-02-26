import React, { useEffect, useState } from "react"
import { ANSWERS } from "../utils/answers"
export const GPT: React.FC = () => {
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
    setQuestion(val.target.value)
  }

  const handleClick = (index: number) => {
    const newQuestion = questions[index].replaceAll(`"`, ``)
    setQuestion(newQuestion)
  }

  const answerQuestion = () => {
    const structuredAnswer = ANSWERS[0].split(" ")
  }

  useEffect(() => {
    if (isAsked) {
      answerQuestion()
    }
  }, [isAsked])

  return (
    <div className="flex items-center justify-center overflow-hidden bg-gray-800 min-w-screen ">
      <div className="h-full grid-cols-3 grid-rows-2 text-center text-white min-w-fit">
        <div className="relative flex flex-col items-center justify-center col-start-2 row-start-1 gap-2 top-24">
          <h1 className="mt-4 text-4xl font-bold tracking-tighter ">
            Ask me anything!
          </h1>
          <p className="mb-8 text-xl tracking-tighter opacity-40">
            Type your question below and I'll try to answer it.
          </p>

          {/* <h1 className="relative text-xl tracking-tighter top-12">Examples</h1> */}
        </div>
        {isAsked ? (
          <div className="relative grid h-screen grid-cols-3 col-start-1 grid-rows-3 row-start-2 text-center text-white snap-start min-w-fit ">
            <div className="relative flex flex-col items-end col-start-1 row-start-2 gap-4 p-4 ">
              <div className="flex flex-col items-center justify-center gap-2 w-52 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
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
                    className=" mb-2 w-52 text-sm shadow-lg  transition duration-300 ease-in-out hover:bg-[#32333c] px-3 py-2 rounded-lg bg-[#3E3F4B] font-light tracking-tight"
                  >
                    <span className="p-1 text-slate-300">{question}</span>
                  </button>
                )
              })}
            </div>
            <div className="relative flex flex-col items-center col-start-2 row-start-2 gap-4 p-4 ">
              <div className="flex flex-col items-center justify-center gap-2 w-52 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 fill-current"
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
                    className=" mb-2 w-52 text-sm shadow-lg  transition duration-300 ease-in-out hover:bg-[#32333c] px-3 py-2 rounded-lg bg-[#3E3F4B] font-light tracking-tight"
                  >
                    <span className="p-1 text-slate-300">{question}</span>
                  </div>
                )
              })}
            </div>
            <div className="relative flex flex-col items-center col-start-3 row-start-2 gap-4 p-4 text-center ">
              <div className="flex flex-col items-center justify-center gap-2 w-52 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 fill-current"
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
                    key={index}
                    className=" mb-2 w-52 text-sm shadow-lg  transition duration-300 ease-in-out hover:bg-[#32333c] px-3 py-2 rounded-lg bg-[#3E3F4B] font-light tracking-tight"
                  >
                    <span className="p-1 text-slate-300">{question}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="relative grid h-screen max-w-3xl grid-cols-2 col-start-1 grid-rows-3 row-start-2 text-center text-white snap-start ">
            <div className="relative flex flex-col h-screen col-start-1 row-start-2 gap-4 text-center text-white bottom-16 left-44 snap-start ">
              <div className="flex gap-2 px-2 py-4 border h-fit">
                <h1>Visitor - </h1>
                <h1> {question}</h1>
              </div>
              <div className="flex gap-2 px-2 py-4 border h-fit ">
                <h1>Umut - </h1>
                <h1 className="tracking-tight ">
                  {/* <Typewriter
                options={{
                  strings: ANSWERS[0],
                  autoStart: true,
                  delay: 40,
                }}
              /> */}
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
          </div>
        )}
        <div className="relative flex flex-col content-center justify-center w-full col-span-3 col-start-1 row-start-2 mt-auto bottom-4">
          <div className="flex items-center py-2">
            <input
              className="min-w-full rounded-lg shadow-lg placeholder:text-sm text-sm placeholder:tracking-tight  px-3.5 py-3  bg-[#40414F] max-w-full  text-white leading-tight focus:outline-none"
              id="search"
              type="text"
              value={question}
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
              onClick={() => setIsAsked(true)}
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
          <p className="relative mt-2 text-xs text-center text-gray-400">
            Press Enter to submit your question
          </p>
        </div>
      </div>
    </div>
  )
}
