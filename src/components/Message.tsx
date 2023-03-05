import Image from "next/legacy/image"
import React from "react"
import Typewriter from "typewriter-effect"

interface IProps {
  text: string
  sender: string
}

export const Message: React.FC<IProps> = ({ text, sender }) => {
  if (sender === "Umut") {
    return (
      <div className="flex gap-4 px-2 py-4 h-fit ">
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
        <h1 className="leading-7 tracking-tight text-start ">
          <Typewriter
            options={{
              strings: text,
              autoStart: true,
              delay: 20,
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
      <div className="flex items-center w-full gap-4 px-2 py-4 text-center rounded-md bg-slate-600 h-fit">
        <div>
          <Image src={"/visitor.svg"} width={24} height={24} alt="visitor" />
        </div>

        <h1 className="leading-7 tracking-tight text-start"> {text}</h1>
      </div>
    )
  }
}
