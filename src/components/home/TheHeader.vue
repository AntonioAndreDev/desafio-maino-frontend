<template>
  <div class="flex md:flex-row flex-col gap-4 justify-between items-center">
    <RouterLink :to="{ name: 'home' }">
      <h1
        class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 w-fit"
      >
        Mainô Pokédex
      </h1>
    </RouterLink>

    <ChangeIdiom class="mb-6" />
  </div>

  <div class="grid md:grid-cols-3 gap-4 mb-4 items-center">
    <div class="md:col-span-2 flex flex-col gap-y-2">
      <label class="text-md font-medium" for="pokemon_search">
        {{ $t("pesquise") }}
      </label>
      <input
        v-if="filterBy !== 'tipo'"
        id="pokemon_search"
        name="pokemon_search"
        type="text"
        :placeholder="$t('pesquise_placeholder')"
        class="bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm shadow-xl border border-gray-700 w-full focus:outline-2 focus:outline-blue-500 h-14"
        v-model="searchQuery"
        v-debounce:300ms.unlock="searchPokemons"
      />
      <select
        v-else
        id="pokemon_search"
        name="pokemon_search"
        class="bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm shadow-xl border border-gray-700 w-full focus:outline-2 focus:outline-blue-500 h-14 capitalize"
        v-model="searchQuery"
        v-debounce:300ms.unlock="searchPokemons"
      >
        <option
          v-if="allTypesData?.results"
          v-for="type in allTypesData.results"
          :key="type.name"
          :value="type.name"
        >
          {{ type.name }}
        </option>
      </select>
    </div>

    <div class="flex flex-col gap-y-2">
      <label class="text-md font-medium" for="pokemon_filter">
        {{ $t("filtrar_por") }}
      </label>
      <select
        v-model="filterBy"
        class="bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm shadow-xl border border-gray-700 w-full focus:outline-2 focus:outline-blue-500 h-14 capitalize"
        id="pokemon_filter"
        name="pokemon_filter"
      >
        <option class="capitalize" value="nome">{{ $t("nome") }}</option>
        <option class="capitalize" value="especie">{{ $t("especie") }}</option>
        <option class="capitalize" value="tipo">{{ $t("tipo") }}</option>
        <option class="capitalize" value="id">ID</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import ChangeIdiom from "@/components/ChangeIdiom.vue";
import { useApi } from "@/composables/useApi.js";

const emit = defineEmits(["searchPokemons"]);
const filterBy = ref("nome");
const searchQuery = ref("");

const searchPokemons = () => {
  emit("searchPokemons", searchQuery.value, filterBy.value);
};

const { data: allTypesData, fetchData: fetchAllTypes } = useApi();

watch(filterBy, async (newVal) => {
  if (newVal === "tipo") {
    await fetchAllTypes("/type?offset=0&limit=18");
  }

  if (searchQuery.value) {
    searchPokemons();
  }
});

watch(searchQuery, (newVal) => {
  if (filterBy.value === "tipo" && newVal) {
    searchPokemons();
  }
});
</script>
