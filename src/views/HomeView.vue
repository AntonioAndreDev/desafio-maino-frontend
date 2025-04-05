<template>
    <main>
        <h1 class="text-3xl mb-4">Hello Mainô!</h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            <RouterLink
                v-for="pokemon in pokemons"
                :key="pokemon.id"
                :to="{ name: 'pokemon', params: { id: pokemon.id } }"
                class="bg-white p-4 rounded shadow border border-gray-200 hover:shadow-lg transition-shadow"
            >
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold capitalize">{{ pokemon.name }}</h2>
                    <span class="text-gray-500 font-medium">#{{ pokemon.id }}</span>
                </div>

                <div class="mt-2">
                    <div class="text-sm text-gray-600">
                        <span class="font-medium">Espécie:</span>
                        <span class="capitalize">{{ pokemon.species }}</span>
                    </div>

                    <div class="mt-1 flex items-center gap-1.5">
                        <span class="text-sm font-medium text-gray-600">Tipos:</span>
                        <div class="flex flex-wrap gap-1">
                            <span
                                v-for="type in pokemon.types"
                                :key="type"
                                class="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full capitalize"
                            >
                                {{ type }}
                            </span>
                        </div>
                    </div>
                </div>
            </RouterLink>

        </div>

        <div v-if="loading || detailsLoading" class="text-center my-6 py-4 text-gray-600">
            <div
                class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-400 border-t-blue-500 mr-2"></div>
            Carregando...
        </div>
    </main>
</template>

<script setup>
import {onMounted, ref, onBeforeUnmount} from 'vue'
import {useApi} from '@/composables/useApi.js'

const {data, fetchData: listAllPokemons, loading} = useApi()
const pokemons = ref([])
const nextUrl = ref(null)
const detailsLoading = ref(false)

const extractPokemonId = (url) => {
    const urlParts = url.split('/')
    return urlParts[urlParts.length - 2]
}

const fetchPokemonDetails = async (pokemon) => {
    const {fetchData: fetchDetails, data: detailsData} = useApi()

    const id = extractPokemonId(pokemon.url)

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

onMounted(async () => {
    await loadAndAppendPokemons('/pokemon?offset=0&limit=50')
    window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>