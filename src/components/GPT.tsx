import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import { ANSWERS } from "../utils/answers"
import { Message } from "./Message"

interface MessageData {
  sender: string
  text: string[]
}

export const GPT: React.FC = () => {
  const [value, setValue] = useState("")
  // const [question, setQuestion] = useState(
  //   "What inspired you to become a developer?"
  // )
  const [isAsked, setIsAsked] = useState(false)
  const [messages, setMessages] = useState<MessageData[]>([])
  const [isScrollable, setIsScrollable] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  const questions = [
    `"What inspired you to become a developer?"`,
    // `"What are you working on right now?"`,
    // `"What programming languages and frameworks are you most comfortable with"`,
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
  }

  const scrollToBottom = () => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    })
    setIsScrollable(false)
  }

  const answerQuestion = () => {
    if (messages[messages.length - 1].sender === "Visitor" && !isTyping) {
      const currentQuestion = messages[messages.length - 1].text[0]
      let structuredAnswer: string[]
      // setIsTyping(true)
      switch (true) {
        case currentQuestion.includes("inspired"):
          structuredAnswer = ANSWERS[0]

          break
        case currentQuestion.includes("tech"):
          structuredAnswer = ANSWERS[1]

          break
        case currentQuestion.includes("interest"):
          structuredAnswer = ANSWERS[2]

          "I can answer questions, provide information, and even tell jokes!"
          break
        case currentQuestion.includes("interest"):
          structuredAnswer = ANSWERS[2]

          "I can answer questions, provide information, and even tell jokes!"
          break
        default:
          // structuredAnswer = ANSWERS[0]

          "I'm sorry, I didn't understand your question. Could you please rephrase it?"
          break
      }
      setMessages((prevState: MessageData[]) => [
        ...prevState,
        {
          sender: "Umut",
          text: structuredAnswer,
        },
      ])
      setIsTyping(true)
    }
  }

  const resetChat = () => {
    setMessages([])
    setIsAsked(false)
    setIsScrollable(!isScrollable)
    setIsTyping(false)
  }

  const handleSubmit = () => {
    if (value.length > 0 && !isTyping) {
      if (messages.length === 0) {
        setIsAsked((prevState) => !prevState)
      }
      const newValue = value
      setMessages((prevState: MessageData[]) => [
        ...prevState,
        {
          sender: "Visitor",
          text: [newValue],
        },
      ])
      setValue("")
    }
  }

  const handleScroll = () => {
    if (chatRef.current && isAsked) {
      const isAtBottom =
        chatRef.current.scrollTop + chatRef.current.clientHeight >=
        chatRef.current.scrollHeight

      if (isAtBottom) {
        setIsScrollable(false)
      } else {
        setIsScrollable(true)
      }
    }
  }

  useEffect(() => {
    if (isAsked) {
      answerQuestion()
    }
    handleScroll()
  }, [messages])

  useEffect(() => {
    if (chatRef.current && isAsked) {
      const hasOverflow =
        chatRef.current.scrollHeight > chatRef.current.clientHeight

      setIsScrollable(hasOverflow)

      chatRef.current.addEventListener("scroll", handleScroll)

      return () => {
        chatRef.current!.removeEventListener("scroll", handleScroll)
      }
    }
  }, [messages, isTyping])

  return (
    <div className="flex items-center justify-center h-full min-w-full bg-[#152835] lg:overflow-hidden lg:h-screen snap-normal snap-start ">
      <div
        className={` container h-full max-h-screen max-w-3xl ${
          isAsked ? "" : "overflow-y-auto"
        }  md:overflow-hidden text-center relative text-white min-w-fit`}
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
              className="relative grid items-center justify-center h-full grid-cols-1 grid-rows-3 mx-auto text-center text-white md:gap-0 lg:overflow-y-hidden md:h-full md:grid-cols-3 md:bottom-16 max-w-fit"
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
              ref={chatRef}
              key={"chat"}
              className="relative grid justify-center w-full h-[85%] scroll-smooth max-w-3xl max-h-screen grid-cols-2 grid-rows-3 mt-8 overflow-y-auto text-center text-white  md:scroll-p-4 "
            >
              <div className="relative flex flex-col min-w-full col-span-2 col-start-1 row-start-1 gap-4 text-center text-white ">
                <div className="relative min-w-full gap-4 text-center text-white ">
                  {messages!.map((message, index) => {
                    return (
                      <Message
                        key={index}
                        textIndex={index}
                        sender={message!.sender}
                        text={message!.text}
                        resetChat={resetChat}
                        setIsTyping={setIsTyping}
                      />
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {isScrollable && isAsked && (
          <motion.button
            initial={{ opacity: 1 }}
            whileTap={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute bg-[#40414f] p-1.5 transition ease-in-out text-gray-200 duration-300 hover:text-[#1F2937]  rounded-lg shrink-0 hover:bg-gray-400 z-10 flex justify-center right-4 bottom-24"
            onClick={scrollToBottom}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 fill-current"
              viewBox="0 0 512 512"
            >
              <title>Scroll Down</title>
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="48"
                d="M112 268l144 144 144-144M256 392V100"
              />
            </svg>
          </motion.button>
        )}
        <div
          id="input"
          className={`absolute flex flex-col justify-center w-full ${
            isAsked ? "" : "-bottom-24"
          }  md:bottom-0 pb-3`}
        >
          <div className="flex flex-row flex-grow items-center w-[90%] mx-auto lg:w-full py-2">
            <input
              className=" rounded-lg flex-grow shadow-lg  w-full pr-10 md:pr-16 pl-3.5 placeholder:text-sm text-sm placeholder:tracking-tight  shrink-0   py-3  bg-[#40414F]  text-white leading-tight focus:outline-none"
              id="search"
              type="text"
              value={value}
              onChange={handleChange}
              required
              placeholder="Ask me anything"
            />

            {isTyping ? (
              <div className="relative flex justify-center w-full -left-10 md:-left-12">
                <span className="inline-flex items-center gap-px">
                  <span className="animate-blink mx-px h-1.5 w-1.5 rounded-full dark:bg-[#c3fcf2] bg-gray-500"></span>
                  <span className="animate-blink animation-delay-200 mx-px h-1.5 w-1.5 rounded-full dark:bg-[#c3fcf2] bg-gray-500"></span>
                  <span className="animate-blink animation-delay-400 mx-px h-1.5 w-1.5 rounded-full dark:bg-[#c3fcf2] bg-gray-500"></span>
                </span>
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                className=" p-1.5 transition ease-in-out text-gray-200 duration-300 hover:text-[#1F2937]  rounded-lg shrink-0 hover:bg-gray-400 relative  -left-10 md:-left-12 "
              >
                <svg
                  className="w-4 h-4 fill-current md:w-6 md:h-6 "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="fillCurrent"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
