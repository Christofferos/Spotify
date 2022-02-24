import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Sidebar } from '../components/Sidebar'

const Home: NextPage = () => {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Spotify Boost</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Spotify Boost</h1>
      <main>
        <Sidebar />
        {/* Center */}
      </main>

      <div>{/* Player */}</div>
    </div>
  )
}

export default Home
