import Image from "next/legacy/image"
import React from "react"
import Typewriter from "typewriter-effect"

interface IProps {
  text: string[]
  sender: string
  textIndex: number
  resetChat: () => void
  setIsTyping: (val: boolean) => void
}

export const Message: React.FC<IProps> = ({
  text,
  sender,
  textIndex,
  resetChat,
  setIsTyping,
}) => {
  if (sender === "Umut") {
    // console.log("text", text)
    return (
      <div className="flex gap-4 px-2 py-4 lg:px-3 h-fit ">
        <div className="flex flex-col items-center justify-center w-6 h-6">
          <Image
            src={"/umut.svg"}
            layout="fixed"
            objectFit="contain"
            width={32}
            height={32}
            alt="umut"
          />
        </div>
        <h1
          id="message"
          className="text-sm leading-7 tracking-tight md:text-base text-start"
        >
          <Typewriter
            options={{
              // strings: text,
              autoStart: true,
              delay: 5,
              loop: false,
              cursor: "",

              // cursorClassName: "type-cursor",
            }}
            onInit={(typewriter) => {
              // typewriter.typeString(parag[0]).pauseFor(20)
              // typewriter.typeString(parag[1])
              text.map((paragraph) => {
                typewriter.typeString(paragraph).pauseFor(20)
              })

              typewriter
                // .callFunction(() => {
                //   let cursor = document.querySelector(
                //     ".Typewriter__cursor"
                //   ) as HTMLElement
                //   // cursor!.classList.add(".type-cursor")
                //   // const element = document.querySelector(
                //   //   ".type-cursor"
                //   // ) as HTMLElement

                //   cursor!.style.display = "none"
                // })
                .callFunction(() => {
                  setIsTyping(false)
                })
                .start()
              // .stop()
            }}
          />{" "}
          {/* " Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          similique voluptatum laudantium maxime, ab reiciendis dolore magnam
          cumque quam natus suscipit nulla reprehenderit illo voluptatibus
          eveniet optio eaque! Nulla iusto officiis laborum sit ducimus ex
          soluta at, amet, itaque tenetur modi, rem officia reprehenderit odit
          quam suscipit quos quisquam nam placeat? Laboriosam nulla aspernatur
          accusamus exercitationem cupiditate incidunt aliquam repudiandae quod
          repellendus, consequatur ", */}
        </h1>
      </div>
    )
  } else {
    return (
      <div className="relative flex items-center w-full gap-2  md:gap-4 px-2 lg:px-3 py-4 text-center rounded-md bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-blue-600 via-red-400 to-rose-500 h-fit">
        <div className="flex flex-col justify-center">
          <Image src={"/visitor.svg"} width={24} height={24} alt="visitor" />
        </div>

        <h1 className="w-4/5 text-sm leading-7 tracking-tight md:w-full md:text-base text-start">
          {" "}
          {text}
        </h1>
        {textIndex === 0 && (
          <button
            onClick={resetChat}
            className="absolute p-1.5 transition ease-in-out text-white duration-300  rounded-lg shrink-0 hover:bg-[#011627] -right-2 md:right-0 mx-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 fill-current md:w-6 md:h-6"
              viewBox="0 0 512 512"
            >
              <title>Reset</title>
              <path
                d="M320 146s24.36-12-64-12a160 160 0 10160 160"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="32"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M256 58l80 80-80 80"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
}
