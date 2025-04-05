<template>
  <div
    v-if="pokemonEvolutionChain"
    class="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl border border-gray-700"
  >
    <h2 class="text-2xl font-semibold mb-6 text-blue-300">
      Cadeia de Evolução
    </h2>

    <div class="flex md:flex-row flex-col items-center justify-center gap-4">
      <div
        v-for="(evolution, index) in getAllEvolutions(
          pokemonEvolutionChain.chain,
        )"
        :key="index"
        class="flex items-center md:w-fit w-full"
      >
        <div class="bg-gray-700/60 p-4 rounded-lg text-center md:w-fit w-full">
          <p class="capitalize font-medium">
            {{ evolution.species.name }}
          </p>
        </div>

        <div
          v-if="
            index < getAllEvolutions(pokemonEvolutionChain.chain).length - 1
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
</template>

<script setup>
defineProps(["pokemonEvolutionChain"]);

const getAllEvolutions = (chain) => {
  let evolutions = [];
  let currentChain = chain;
  while (currentChain) {
    evolutions.push(currentChain);
    currentChain = currentChain.evolves_to[0];
  }
  return evolutions;
};
</script>
