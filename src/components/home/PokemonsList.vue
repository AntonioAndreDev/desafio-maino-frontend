<template>
  <div
    :class="[
      'grid gap-4',
      pokemons.length === 1 ? 'grid-cols-1' : 'lg:grid-cols-3 md:grid-cols-2',
    ]"
  >
    <RouterLink
      v-for="pokemon in pokemons"
      :key="pokemon.id"
      :to="{ name: 'pokemon', params: { id: pokemon.id } }"
      class="bg-gray-800/50 rounded-2xl md:p-6 p-4 backdrop-blur-sm shadow-xl border border-gray-700 hover:scale-105 hover:border-gray-400 duration-300"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold capitalize text-blue-300">
          {{ pokemon.name }}
        </h2>
        <span
          class="bg-gray-800 px-4 py-2 rounded-full text-blue-300 font-mono"
        >
          #{{ pokemon.id }}
        </span>
      </div>

      <div
        class="mt-2 bg-gray-700/40 px-4 py-2 rounded-lg flex flex-col gap-y-2"
      >
        <div v-if="pokemon.species" class="text-sm">
          <span class="font-medium"
            >Espécie: <span class="capitalize">{{ pokemon.species }}</span>
          </span>
        </div>

        <div v-if="pokemon.types" class="mt-1 flex items-center gap-1.5">
          <span class="text-sm font-medium">Tipos:</span>
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
  </div>
</template>

<script setup>
defineProps(["pokemons"]);
</script>
