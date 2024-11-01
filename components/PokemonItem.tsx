import { Pokemons } from '@/pages'
import { FC, memo, useEffect, useRef, useState } from 'react'

const cacheMap = new Map<string, string>()

const PokemonItem: FC<Pokemons[number]> = ({ name, imageUrl }) => {
  const [render, setRender] = useState(cacheMap.has(name))
  const figureRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!figureRef.current) return

    const observer = new IntersectionObserver((entries, cb) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRender(true), 1_000)
          cb.disconnect()

          // Includes this name to the cache so it would
          // never re-render everytime query is changed.
          cacheMap.set(name, name)
        }
      })
    })

    observer.observe(figureRef.current)
    return () => observer.disconnect()
  }, [name])

  return (
    <li>
      <figure
        ref={figureRef}
        className={[
          'pt-[100%] bg-zinc-200 rounded-lg relative',
          render ? '' : 'animate-pulse',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ animationDuration: '1s' }}
      >
        <div className=' absolute left-0 right-0 bottom-0 top-0 flex items-center justify-center'>
          {render && (
            // eslint-disable-next-line @next/next/no-img-element
            <img width={215} height={215} src={imageUrl} alt={name} />
          )}
        </div>
      </figure>
      {render ? (
        <p className='text-center mt-2.5 capitalize'>
          {name.replace(/-/g, ' ')}
        </p>
      ) : (
        <div
          className='rounded-lg bg-zinc-300 mt-2.5 h-6 w-1/2 mx-auto animate-pulse'
          style={{ animationDuration: '1000ms' }}
        />
      )}
    </li>
  )
}

export default memo(PokemonItem)
