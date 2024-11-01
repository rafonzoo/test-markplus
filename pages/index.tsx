import { InferGetServerSidePropsType } from 'next'
import { Inter } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'
import { API_URL, getPokemon } from '@/helpers'
import ListOfPokemons from '@/components/ListOfPokemon'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export type Pokemons = { name: string; url: string; imageUrl: string }[]

// Run at request time.
export const getServerSideProps = async () => {
  return { props: await getPokemon(API_URL + '?limit=20&offset=0') }
}

export default function Home({
  nextUrl: initialNextUrl,
  pokemons: initialList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const loadingRef = useRef<HTMLParagraphElement | null>(null)
  const [showMore, setShowMore] = useState(true)
  const [{ pokemons, nextUrl }, setState] = useState({
    pokemons: initialList,
    nextUrl: initialNextUrl,
  })

  useEffect(() => {
    if (!loadingRef.current || !showMore) return

    const observer = new IntersectionObserver((entries, cb) => {
      entries.forEach((entry) => {
        if (!nextUrl) {
          setShowMore(false)
          cb.disconnect()

          return
        }

        if (entry.isIntersecting) {
          getPokemonData(nextUrl)
        }
      })
    })

    observer.observe(loadingRef.current)
    return () => observer.disconnect()
  }, [showMore, nextUrl])

  async function getPokemonData(url: string) {
    const delay = await new Promise((res) => setTimeout(res, 1000))
    const result = await getPokemon(url)

    setState((prev) => ({
      nextUrl: result.nextUrl,
      pokemons: [...prev.pokemons, ...result.pokemons],
    }))
  }

  return (
    <main className={inter.className}>
      <Head>
        <title>Pokemon App</title>
      </Head>
      <h1 className='text-3xl text-center mt-8 mb-2.5 font-bold !leading-[1.2] tracking-tight md:text-5xl md:mt-12'>
        Find your <br />
        Pokemon now!
      </h1>
      <ListOfPokemons
        {...{ pokemons }}
        onQueryChanged={(value) => setShowMore(!value)}
      />
      <div className='text-center my-12'>
        {nextUrl && showMore && (
          <p ref={loadingRef}>
            <svg
              className='animate-spin h-6 w-6 mx-auto'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          </p>
        )}
      </div>
    </main>
  )
}
