<script setup>
import {onMounted, ref, onBeforeUnmount} from 'vue'
import {useApi} from '@/composables/useApi.js'

const {data, fetchData: listAllPokemons, loading} = useApi()
const pokemons = ref([])
const nextUrl = ref(null)

const loadAndAppendPokemons = async (url) => {
    await listAllPokemons(url)
    if (data.value) {
        pokemons.value.push(...data.value.results)
        nextUrl.value = data.value.next?.replace('https://pokeapi.co/api/v2', '')
    }
}

const handleScroll = () => {
    const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50
    if (scrollBottom && nextUrl.value && !loading.value) {
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


<template>
    <main>
        <h1 class="text-3xl mb-4">Hello Mainô!</h1>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
                v-for="(pokemon, index) in pokemons"
                :key="index"
                class="bg-gray-200 p-4 rounded shadow"
            >
                {{ pokemon.name }}
            </div>
        </div>

        <div v-if="loading" class="text-center my-4 text-gray-600">Carregando mais...</div>
    </main>
</template>

