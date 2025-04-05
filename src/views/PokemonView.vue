<template>
  <BaseLayout>
    <template #header>
      <!-- Header -->
      <div class="flex justify-between items-center mb-8 gap-y-4 flex-wrap">
        <div class="flex items-center gap-x-2">
          <BackButton />
          <h1
            class="md:text-4xl text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase w-fit"
          >
            {{ pokemonDetailsData?.name }}
          </h1>
        </div>
        <span
          class="bg-gray-800 px-4 py-2 rounded-full text-blue-300 font-mono"
        >
          #{{ pokemonId }}
        </span>
      </div>

      <div
        v-if="error"
        class="bg-red-900/60 p-6 rounded-lg mb-8 border-l-4 border-red-500"
      >
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-red-400 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p class="text-red-300">Error: {{ error }}</p>
        </div>
      </div>
    </template>

    <template #default>
      <div v-if="!loading">
        <div v-if="pokemonDetailsData" class="space-y-12">
          <!-- Sprites Section -->
          <div
            class="bg-gray-800/50 rounded-2xl md:p-6 p-4 backdrop-blur-sm shadow-xl border border-gray-700"
          >
            <h2 class="text-2xl font-semibold mb-6 text-blue-300">Sprites</h2>
            <div
              class="flex md:flex-row-reverse flex-col-reverse justify-center"
            >
              <div
                v-for="(sprite, key) in pokemonDetailsData.sprites"
                :key="key"
              >
                <div
                  v-if="
                    [
                      'back_default',
                      'front_shiny',
                      'front_default',
                      'back_shiny',
                    ].includes(key) && sprite
                  "
                  class="bg-gray-900/60 m-4 rounded-lg p-4 flex flex-col items-center hover:bg-indigo-900/40 group transition-all duration-300 transform hover:scale-105"
                >
                  <img
                    class="size-44 object-contain filter drop-shadow-lg"
                    :src="sprite"
                    :alt="`Sprite ${key}`"
                  />
                  <span
                    class="mt-2 text-xs uppercase tracking-wider text-gray-400 group-hover:text-blue-300 transition-colors"
                  >
                    {{ formatSpriteKey(key) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Moves Section -->
          <div
            class="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl border border-gray-700"
          >
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-semibold text-blue-300">Movimentos</h2>
              <div class="text-sm text-gray-400">
                Total: {{ pokemonDetailsData.moves?.length || 0 }}
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              <div
                v-for="move in pokemonDetailsData.moves?.slice(0, movesLimit)"
                :key="move.move.name"
                class="bg-gray-700/40 px-3 py-2 rounded hover:bg-indigo-800/40 transition-colors"
              >
                <p class="capitalize text-sm">
                  {{ move.move.name.replace("-", " ") }}
                </p>
              </div>
            </div>

            <div
              v-if="pokemonDetailsData.moves?.length > 20 && movesLimit <= 20"
              class="mt-4 text-center"
            >
              <button
                @click="movesLimit = pokemonDetailsData.moves?.length"
                class="bg-indigo-600/50 hover:bg-indigo-600 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Ver mais {{ pokemonDetailsData.moves.length - 20 }} movimentos
              </button>
            </div>
            <div v-else-if="movesLimit > 20" class="mt-4 text-center">
              <button
                @click="movesLimit = 20"
                class="bg-indigo-600/50 hover:bg-indigo-600 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Ver menos movimentos
              </button>
            </div>
          </div>

          <!-- Evolution Chain -->
          <div
            v-if="pokemonEvolutionChain"
            class="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl border border-gray-700"
          >
            <h2 class="text-2xl font-semibold mb-6 text-blue-300">
              Cadeia de Evolução
            </h2>

            <div
              class="flex md:flex-row flex-col items-center justify-center gap-4"
            >
              <div
                v-for="(evolution, index) in getAllEvolutions(
                  pokemonEvolutionChain.chain,
                )"
                :key="index"
                class="flex items-center md:w-fit w-full"
              >
                <div
                  class="bg-gray-700/60 p-4 rounded-lg text-center md:w-fit w-full"
                >
                  <p class="capitalize font-medium">
                    {{ evolution.species.name }}
                  </p>
                </div>

                <div
                  v-if="
                    index <
                    getAllEvolutions(pokemonEvolutionChain.chain).length - 1
                  "
                  class="mx-2 text-gray-500 md:block hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Games Section -->
          <div
            class="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl border border-gray-700"
          >
            <h2 class="text-2xl font-semibold mb-6 text-blue-300">
              Aparições em Jogos
            </h2>

            <div
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
            >
              <div
                v-for="(game, index) in pokemonDetailsData.game_indices"
                :key="index"
                class="bg-gray-700/40 px-3 py-2 rounded-lg text-center hover:bg-indigo-800/40 transition-colors"
              >
                <p class="capitalize text-sm">
                  {{ game.version.name.replace("-", " ") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="flex justify-center items-center h-screen">
        <div class="relative">
          <div
            class="w-20 h-20 border-4 border-blue-300 border-t-blue-500 rounded-full animate-spin"
          ></div>
          <div
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div
              class="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center"
            >
              <div
                class="w-8 h-8 bg-white rounded-full border-4 border-gray-900"
              ></div>
            </div>
          </div>
        </div>
        <p class="ml-4 text-xl font-medium text-blue-300">Carregando...</p>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useApi } from "@/composables/useApi.js";
import { onMounted, ref } from "vue";
import BackButton from "@/components/BackButton.vue";
import BaseLayout from "@/components/layouts/BaseLayout.vue";

const route = useRoute();
const pokemonId = route.params.id;
const movesLimit = ref(20);

const {
  fetchData: fetchPokemonDetails,
  data: pokemonDetailsData,
  loading,
  error,
} = useApi();
const { fetchData: fetchPokemonEvolutionChain, data: pokemonEvolutionChain } =
  useApi();

const formatSpriteKey = (key) => {
  const parts = key.split("_");
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getAllEvolutions = (chain) => {
  let evolutions = [];
  let currentChain = chain;
  while (currentChain) {
    evolutions.push(currentChain);
    currentChain = currentChain.evolves_to[0];
  }
  return evolutions;
};

onMounted(async () => {
  await fetchPokemonDetails(`/pokemon/${pokemonId}`);
  await fetchPokemonEvolutionChain(`/evolution-chain/${pokemonId}`);
});
</script>
