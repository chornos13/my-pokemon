import { useEffect, useRef } from 'react'
import * as yup from 'yup'
import usePersistedState from 'hooks/usePersistedState/usePersistedState'

export const schemaPokemon = yup.object({
  nickname: yup.string().required('nickname is required!'),
})

interface UseStoragePokemonData {
  name: string
  image: string
  nickname: string
}

function useStoragePokemon(key) {
  const [value, setValue, isLoading] = usePersistedState<
    UseStoragePokemonData[]
  >(key, [])
  const { current: mapOwned } = useRef(new Map())

  const countOwned = (name) => {
    return mapOwned.get(name) || 0
  }

  const increment = (name) => {
    mapOwned.set(name, countOwned(name) + 1)
    return true
  }

  const decrement = (name) => {
    const owned = countOwned(name)
    mapOwned.set(name, owned - 1)
    return true
  }

  useEffect(() => {
    mapOwned.clear()
    value.forEach((pokemon) => {
      const { name } = pokemon
      increment(name)
    })
  }, [isLoading])

  return {
    data: value,
    add: (pokemon: UseStoragePokemonData) => {
      schemaPokemon.validateSync(pokemon)
      const curPokemon = value.find(
        (iPokemon) => iPokemon.nickname === pokemon.nickname,
      )
      if (curPokemon) {
        throw new Error('nickname already exist!')
      }

      return setValue((pokemons) => {
        increment(pokemon.name)
        return [pokemon, ...pokemons]
      })
    },
    remove: (nickname: string) => {
      return setValue((pokemons) => {
        const removedPokemon = pokemons.find(
          (pokemon) => pokemon.nickname === nickname,
        )
        if (removedPokemon) {
          decrement(removedPokemon.name)
        }
        return pokemons.filter((pokemon) => pokemon.nickname !== nickname)
      })
    },
    mapOwned,
    countOwned,
  }
}

export default useStoragePokemon
