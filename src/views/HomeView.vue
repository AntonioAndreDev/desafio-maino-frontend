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

const { data: allPokemonsData, fetchData: listAllPokemons, loading } = useApi();
const pokemons = ref([]);
const nextUrl = ref(null);
const detailsLoading = ref(false);
const searchLoading = ref(false);
const errorMessage = ref("");

const extractPokemonId = (url) => {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 2];
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

const loadAndAppendPokemons = async (url) => {
  await listAllPokemons(url);
  if (allPokemonsData.value) {
    const newPokemons = allPokemonsData.value.results;

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

const handleScroll = () => {
  const scrollBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
  if (
    scrollBottom &&
    nextUrl.value &&
    !loading.value &&
    !detailsLoading.value
  ) {
    loadAndAppendPokemons(nextUrl.value);
  }
};

const renderPokemonByNameOrId = async (searchQuery) => {
  const { fetchData: showPokemon, data: pokemonData } = useApi();
  await showPokemon(`/pokemon/${searchQuery.toLowerCase()}`);

  if (pokemonData.value) {
    pokemons.value = await Promise.all([
      fetchPokemonDetails(pokemonData.value),
    ]);
    errorMessage.value = "";
  } else {
    pokemons.value = [];
    errorMessage.value = "Pokémon não encontrado";
  }
};

const renderPokemonBySpecie = async (searchQuery) => {
  const { fetchData: showPokemon, data: pokemonData } = useApi();
  await showPokemon(`/pokemon-species/${searchQuery.toLowerCase()}`);

  if (pokemonData.value) {
    pokemons.value = await Promise.all([
      fetchPokemonDetails(pokemonData.value),
    ]);
    errorMessage.value = "";
  } else {
    pokemons.value = [];
    errorMessage.value = "Pokémon não encontrado";
  }
};

const renderPokemonByType = async (searchQuery) => {
  const { fetchData: showPokemon, data: pokemonData } = useApi();
  await showPokemon(`/type/${searchQuery.toLowerCase()}`);

  if (pokemonData.value) {
    pokemons.value = await Promise.all(
      pokemonData.value.pokemon.map((p) => fetchPokemonDetails(p.pokemon)),
    );
    errorMessage.value = "";
  } else {
    pokemons.value = [];
    errorMessage.value = "Pokémon não encontrado";
  }
};

const searchPokemons = async (searchQuery, filter) => {
  try {
    searchLoading.value = true;

    if (searchQuery === "") {
      pokemons.value = [];
      errorMessage.value = "";
      await loadAndAppendPokemons("/pokemon?offset=0&limit=50");
      return;
    }

    if (filter === "id") {
      await renderPokemonByNameOrId(searchQuery);
      return;
    }

    if (filter === "nome") {
      await renderPokemonByNameOrId(searchQuery);
      return;
    }

    if (filter === "especie") {
      await renderPokemonBySpecie(searchQuery);
      return;
    }

    if (filter === "tipo") {
      await renderPokemonByType(searchQuery);
    }
  } finally {
    searchLoading.value = false;
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
