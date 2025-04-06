<template>
  <BaseLayout>
    <template #header>
      <TheHeader @search-pokemons="searchPokemons" />
    </template>

    <template #default>
      <PokemonsList :pokemons="pokemons" />

      <GenericErrorMessage v-if="errorMessage" :error-message="errorMessage" />

      <Loading v-if="loading || detailsLoading || searchLoading" />
    </template>
  </BaseLayout>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import { useApi } from "@/composables/useApi.js";
import BaseLayout from "@/components/layouts/BaseLayout.vue";
import Loading from "@/components/Loading.vue";
import TheHeader from "@/components/home/TheHeader.vue";
import GenericErrorMessage from "@/components/GenericErrorMessage.vue";
import PokemonsList from "@/components/home/PokemonsList.vue";
import {
  renderPokemonByNameOrId,
  renderPokemonBySpecie,
  renderPokemonByType,
} from "@/utils/pokemonSearchUtils.js";

const { data: allPokemonsData, fetchData: listAllPokemons, loading } = useApi();
const pokemons = ref([]);
const nextUrl = ref(null);
const detailsLoading = ref(false);
const searchLoading = ref(false);
const errorMessage = ref("");
const isSearchMode = ref(false);

const extractPokemonId = (url) => {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 2];
};

const loadAndAppendPokemons = async (url) => {
  await listAllPokemons(url);
  if (allPokemonsData.value) {
    // Renderiza além do limite de 1025 pokémons (id)
    // const newPokemons = allPokemonsData.value.results;
    const newPokemons = allPokemonsData.value.results
      .map((pokemon) => {
        const id = parseInt(extractPokemonId(pokemon.url));
        return { ...pokemon, id };
      })
      .filter((pokemon) => pokemon.id <= 1025);

    detailsLoading.value = true;
    try {
      const pokemonsWithDetails = await Promise.all(
        newPokemons.map((pokemon) => fetchPokemonDetails(pokemon)),
      );

      pokemons.value.push(...pokemonsWithDetails);
    } finally {
      detailsLoading.value = false;
    }

    nextUrl.value = allPokemonsData.value.next?.replace(
      "https://pokeapi.co/api/v2",
      "",
    );
  }
};

const fetchPokemonDetails = async (pokemon) => {
  const { fetchData: fetchDetails, data: detailsData } = useApi();
  let id = pokemon.id;

  if (pokemon.url) {
    id = extractPokemonId(pokemon.url);
  }

  await fetchDetails(`/pokemon/${id}`);

  if (detailsData.value) {
    pokemon.id = id;
    pokemon.types = detailsData.value.types.map((t) => t.type.name);

    const { fetchData: fetchSpecies, data: speciesData } = useApi();
    await fetchSpecies(`/pokemon-species/${id}`);

    if (speciesData.value) {
      pokemon.species = speciesData.value.name;
    }

    return pokemon;
  }
};

const searchPokemons = async (searchQuery, filter) => {
  try {
    searchLoading.value = true;
    errorMessage.value = "";
    pokemons.value = [];

    if (searchQuery === "") {
      isSearchMode.value = false;
      await loadAndAppendPokemons("/pokemon?offset=0&limit=50");
      return;
    }

    isSearchMode.value = true;

    let result = { pokemons: [], errorMessage: "" };

    if (filter === "id" || filter === "nome") {
      result = await renderPokemonByNameOrId(searchQuery, fetchPokemonDetails);
    }
    if (filter === "especie") {
      result = await renderPokemonBySpecie(searchQuery, fetchPokemonDetails);
    }
    if (filter === "tipo") {
      result = await renderPokemonByType(searchQuery, fetchPokemonDetails);
    }

    pokemons.value = result.pokemons;
    errorMessage.value = result.errorMessage;
  } finally {
    searchLoading.value = false;
  }
};

const handleScroll = () => {
  const scrollBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
  if (
    scrollBottom &&
    nextUrl.value &&
    !loading.value &&
    !detailsLoading.value &&
    !searchLoading.value &&
    !isSearchMode.value
  ) {
    loadAndAppendPokemons(nextUrl.value);
  }
};

onMounted(async () => {
  await loadAndAppendPokemons("/pokemon?offset=0&limit=50");

  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
