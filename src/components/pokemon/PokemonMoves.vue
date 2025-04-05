<template>
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
</template>

<script setup>
import { ref } from "vue";

defineProps(["pokemonDetailsData"]);
const movesLimit = ref(20);
</script>
