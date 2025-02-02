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
        <title>
          Umut&apos;s Portfolio | Front-end Developer{" "}
        </title>
        <meta name="description" content="Umut's portfolio website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-fuchsia-200 via-indigo-400 to-red-100 dark:bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] dark:from-teal-800 dark:via-rose-700 dark:to-red-900  h-screen overflow-x-hidden overflow-y-scroll scroll-smooth snap-y snap-mandatory ">
        <Header />
        <GPT />
        <Showcase />
      </main>
    </>
  )
}
