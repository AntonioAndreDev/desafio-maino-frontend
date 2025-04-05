<template>
    <div v-if="!loading">
        <h1>Pokemon</h1>
        <div v-if="error">Error: {{ error }}</div>
        <div v-if="pokemonDetailsData">
            <div v-if="pokemonDetailsData.sprites" v-for="(sprite, key) in pokemonDetailsData.sprites" :key="key">
                <img class="size-32"
                     v-if="['back_default', 'front_shiny', 'front_default', 'back_shiny'].includes(key) && sprite"
                     :src="sprite" :alt="`Sprite ${key}`"/>
            </div>

            <hr>

            <div>
                <h1>Movimentos</h1>
                <div v-if="pokemonDetailsData.moves" v-for="moves in pokemonDetailsData.moves" :key="moves.move.name">
                    <p>{{ moves.move.name }}</p>
                </div>
            </div>

            <hr>

            <div v-if="pokemonEvolutionChain"
                 v-for="(evolution, index) in getAllEvolutions(pokemonEvolutionChain.chain)"
                 :key="index"
            >
                <p>Evolução {{ index + 1 }}: {{ evolution.species.name }}</p>

            </div>

            <hr>

            <div>
                <h1>Games</h1>
                <div v-if="pokemonDetailsData.game_indices"
                     v-for="(game, index) in pokemonDetailsData.game_indices"
                     :key="index"
                >

                    <p>Jogo {{ index + 1 }}: {{ game.version.name }}</p>

                </div>

            </div>
        </div>

    </div>

    
    <div v-if="loading" class="text-center my-6 py-4 text-gray-600">
        <div
            class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-400 border-t-blue-500 mr-2"></div>
        Carregando...
    </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import {useApi} from "@/composables/useApi.js";
import {onMounted} from "vue";

const route = useRoute()

const pokemonId = route.params.id

const {fetchData: fetchPokemonDetails, data: pokemonDetailsData, loading, error} = useApi()
const {fetchData: fetchPokemonEvolutionChain, data: pokemonEvolutionChain} = useApi()

const getAllEvolutions = (chain) => {
    const evolutions = [];
    let currentChain = chain;
    while (currentChain) {
        evolutions.push(currentChain);
        currentChain = currentChain.evolves_to[0];
    }
    return evolutions;
};

onMounted(async () => {
    await fetchPokemonDetails(`/pokemon/${pokemonId}`)
    await fetchPokemonEvolutionChain(`/evolution-chain/${pokemonId}`)
})


</script>

