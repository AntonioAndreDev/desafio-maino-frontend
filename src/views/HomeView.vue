<template>
    <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 w-fit">
        Mainô Pokédex
    </h1>

    <div class="grid md:grid-cols-3 gap-4 mb-4 items-center">
        <div class="md:col-span-2 flex flex-col gap-y-2">
            <label
                class="text-md font-medium"
                for="pokemon_search">
                Pesquise um Pokémon pelo(a) {{ filterBy }}
            </label>
            <input
                id="pokemon_search"
                name="pokemon_search"
                type="text"
                placeholder="Pesquise..."
                class="bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm shadow-xl border border-gray-700 w-full focus:outline-2 focus:outline-blue-500 h-14"
                v-model="searchQuery"
                v-debounce:1s.unlock="searchPokemons"
            >
        </div>

        <div class="flex flex-col gap-y-2">
            <label
                class="text-md font-medium"
                for="pokemon_filter">
                Filtrar por
            </label>
            <select v-model="filterBy"
                    class="bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm shadow-xl border border-gray-700 w-full focus:outline-2 focus:outline-blue-500 h-14"
                    id="pokemon_filter"
                    name="pokemon_filter"
            >
                <option value="nome">Nome</option>
                <option value="especie">Espécie</option>
                <option value="tipo">Tipo</option>
                <option value="id">ID</option>
            </select>
        </div>

    </div>

    <div :class="['grid gap-4', pokemons.length === 1 ? 'grid-cols-1' : 'lg:grid-cols-3 md:grid-cols-2']">
        <RouterLink
            v-for="pokemon in pokemons"
            :key="pokemon.id"
            :to="{ name: 'pokemon', params: { id: pokemon.id } }"
            class="bg-gray-800/50 rounded-2xl md:p-6 p-4 backdrop-blur-sm shadow-xl border border-gray-700 hover:scale-105 hover:border-gray-400 duration-300"
        >
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold capitalize text-blue-300">{{ pokemon.name }}</h2>
                <span class="bg-gray-800 px-4 py-2 rounded-full text-blue-300 font-mono">#{{ pokemon.id }}</span>
            </div>

            <div class="mt-2 bg-gray-700/40 px-4 py-2 rounded-lg flex flex-col gap-y-2">
                <div class="text-sm ">
                    <span class="font-medium">Espécie: <span class="capitalize">{{ pokemon.species }}</span></span>

                </div>

                <div class="mt-1 flex  items-center gap-1.5">
                    <span class="text-sm font-medium ">Tipos:</span>
                    <div class="flex flex-wrap gap-1">
                            <span
                                v-for="type in pokemon.types"
                                :key="type"
                                class="bg-indigo-600/50 py-1 px-4 rounded-lg text-sm transition-colors"
                            >
                                {{ type }}
                            </span>
                    </div>
                </div>
            </div>
        </RouterLink>

        <div v-if="errorMessage"
             class="flex flex-col items-center justify-center mt-4 w-full col-span-3 border-l-4 border-red-600 bg-red-200 rounded-xl p-4 shadow-lg">
            <p class="text-red-800 font-medium">{{ errorMessage }}</p>
        </div>
    </div>


    <div v-if="loading || detailsLoading" class="flex justify-center items-center mt-4">
        <div class="size-8 border-4 border-blue-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p class="ml-4 text-xl font-medium text-blue-300">Carregando...</p>
    </div>
</template>

<script setup>
import {onMounted, ref, onBeforeUnmount} from 'vue'
import {useApi} from '@/composables/useApi.js'

const {data, fetchData: listAllPokemons, loading} = useApi()
const pokemons = ref([])
const nextUrl = ref(null)
const detailsLoading = ref(false)
const searchQuery = ref('')
const errorMessage = ref('')
const filterBy = ref('nome')

const extractPokemonId = (url) => {
    const urlParts = url.split('/')
    return urlParts[urlParts.length - 2]
}

const fetchPokemonDetails = async (pokemon) => {
    const {fetchData: fetchDetails, data: detailsData} = useApi()

    let id = pokemon.id

    if (pokemon.url) {
        id = extractPokemonId(pokemon.url)
    }

    await fetchDetails(`/pokemon/${id}`)

    if (detailsData.value) {
        pokemon.id = id
        pokemon.types = detailsData.value.types.map(t => t.type.name)

        const {fetchData: fetchSpecies, data: speciesData} = useApi()
        await fetchSpecies(`/pokemon-species/${id}`)

        if (speciesData.value) {
            pokemon.species = speciesData.value.name
        }

        return pokemon
    }
}

const loadAndAppendPokemons = async (url) => {
    await listAllPokemons(url)
    if (data.value) {
        const newPokemons = data.value.results

        detailsLoading.value = true
        try {
            const pokemonsWithDetails = await Promise.all(
                newPokemons.map(pokemon => fetchPokemonDetails(pokemon))
            )

            pokemons.value.push(...pokemonsWithDetails)
        } catch (error) {
            console.error('Erro ao carregar detalhes:', error)
        } finally {
            detailsLoading.value = false
        }

        nextUrl.value = data.value.next?.replace('https://pokeapi.co/api/v2', '')
    }

}

const handleScroll = () => {
    const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50
    if (scrollBottom && nextUrl.value && !loading.value && !detailsLoading.value) {
        loadAndAppendPokemons(nextUrl.value)
    }
}

const renderPokemonByNameOrId = async () => {
    const {fetchData: showPokemon, data: pokemonData} = useApi()
    await showPokemon(`/pokemon/${searchQuery.value.toLowerCase()}`)

    if (pokemonData.value) {
        pokemons.value = await Promise.all([fetchPokemonDetails(pokemonData.value)])
        errorMessage.value = ''
    } else {
        pokemons.value = []
        errorMessage.value = 'Pokémon não encontrado'
    }
}

const renderPokemonBySpecie = async () => {
    const {fetchData: showPokemon, data: pokemonData} = useApi()
    await showPokemon(`/pokemon-species/${searchQuery.value.toLowerCase()}`)

    if (pokemonData.value) {
        pokemons.value = await Promise.all([fetchPokemonDetails(pokemonData.value)])
        errorMessage.value = ''
    } else {
        pokemons.value = []
        errorMessage.value = 'Pokémon não encontrado'
    }
}

const renderPokemonByType = async () => {
    const {fetchData: showPokemon, data: pokemonData} = useApi()
    await showPokemon(`/type/${searchQuery.value.toLowerCase()}`)

    if (pokemonData.value) {
        pokemons.value = await Promise.all(
            pokemonData.value.pokemon.map(p => fetchPokemonDetails(p.pokemon))
        )
        errorMessage.value = ''
    } else {
        pokemons.value = []
        errorMessage.value = 'Pokémon não encontrado'
    }
}

const searchPokemons = async () => {
    if (searchQuery.value === '') {
        pokemons.value = []
        errorMessage.value = ''
        await loadAndAppendPokemons('/pokemon?offset=0&limit=50')
        return
    }

    if (filterBy.value === 'id') {
        await renderPokemonByNameOrId()
        return
    }

    if (filterBy.value === 'nome') {
        await renderPokemonByNameOrId()
        return
    }

    if (filterBy.value === 'especie') {
        await renderPokemonBySpecie()
        return
    }

    if (filterBy.value === 'tipo') {
        await renderPokemonByType()
    }
}

onMounted(async () => {
    await loadAndAppendPokemons('/pokemon?offset=0&limit=50')
})
window.addEventListener('scroll', handleScroll)

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>