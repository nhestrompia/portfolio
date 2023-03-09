import { GPT } from "@/components/GPT"
import { Header } from "@/components/Header"
import { Showcase } from "@/components/Showcase"
import { Inter } from "next/font/google"
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Umut</title>
        <meta name="description" content="Umut's portfolio website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen  dark:bg-[#244c53] h-screen overflow-x-hidden overflow-y-scroll scroll-smooth snap-y snap-mandatory ">
        <Header />
        <GPT />
        <Showcase />
      </main>
    </>
  )
}
