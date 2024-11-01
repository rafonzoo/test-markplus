import { Pokemons } from './pages'

const API_URL = 'https://pokeapi.co/api/v2/pokemon'

const IMG_URL = 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail'

export async function getPokemon(url: string) {
  const res = await fetch(url)
  const poke: { next: string | null; results: Pokemons } = await res.json()
  const pokeWithImage = poke.results.map((item) => {
    const id = item.url.replace(API_URL, '').replace(/\//g, '')

    return {
      ...item,
      imageUrl: [IMG_URL, `00${id}`.slice(-3) + '.png'].join('/'),
    }
  })

  return { pokemons: pokeWithImage, nextUrl: poke.next }
}

export { API_URL }
