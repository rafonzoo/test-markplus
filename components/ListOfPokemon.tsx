import { Pokemons } from '@/pages'
import { FC, memo, useEffect, useRef, useState } from 'react'
import PokemonItem from './PokemonItem'

const sorted = [
  {
    value: 'none',
    label: 'None',
  },
  {
    value: 'asc',
    label: 'A to Z',
  },
  {
    value: 'desc',
    label: 'Z to A',
  },
] as const

const ListOfPokemons: FC<{
  pokemons: Pokemons
  onQueryChanged?: (value: string) => void
}> = ({ pokemons: initialList, onQueryChanged }) => {
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<(typeof sorted)[number]['value']>('none')
  const lastScrollY = useRef(0)
  const pokemons = initialList.filter((item) => item.name.startsWith(query))
  const pokemonSorted =
    sortBy === 'none'
      ? pokemons
      : pokemons.sort((a, b) =>
          sortBy === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        )

  // Stick to the current scroll
  useEffect(() => window.scroll({ top: lastScrollY.current }), [sortBy])

  return (
    <div>
      <div className='md:mx-auto md:max-w-2xl'>
        <input
          name='search'
          type='search'
          value={query}
          autoComplete='off'
          className='bg-zinc-100 w-full rounded-lg inline-flex items-center px-3 py-2.5 mb-4'
          placeholder='Or just type name...'
          onChange={(e) => {
            setQuery(e.target.value)
            onQueryChanged?.(e.target.value)
          }}
        />
      </div>
      {!!pokemonSorted.length && (
        <div className='py-2.5'>
          <div className='flex justify-between md:mx-auto md:max-w-2xl lg:max-w-[980px]'>
            <p>Sort by:</p>
            <select
              name='sortBy'
              id='sortBy'
              value={sortBy}
              className='text-blue-600'
              onChange={(e) => {
                setSortBy(e.target.value as 'none')
                lastScrollY.current = window.scrollY
              }}
            >
              {sorted.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {!!pokemonSorted.length ? (
        <ul className='grid gap-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {pokemonSorted.map((poke) => (
            <PokemonItem key={poke.name} {...poke} />
          ))}
        </ul>
      ) : (
        <div>
          <p className='text-center text-zinc-500'>
            No result for {`"${query}"`}
          </p>
        </div>
      )}
    </div>
  )
}

export default memo(ListOfPokemons)
