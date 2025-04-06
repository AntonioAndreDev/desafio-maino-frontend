import { useApi } from "@/composables/useApi.js";

const extractPokemonId = (url) => {
  const urlParts = url.split("/");
  return parseInt(urlParts[urlParts.length - 2]);
};

export async function renderPokemonByNameOrId(
  searchQuery,
  fetchPokemonDetails,
) {
  const { fetchData: showPokemon, data: pokemonData } = useApi();
  await showPokemon(`/pokemon/${searchQuery.toLowerCase()}`);

  const id = pokemonData.value ? pokemonData.value.id : null;

  if (pokemonData.value && id <= 1025) {
    const pokemons = await Promise.all([
      fetchPokemonDetails(pokemonData.value),
    ]);
    return { pokemons, errorMessage: "" };
  } else {
    return {
      pokemons: [],
      errorMessage: "Pokémon não encontrado ou está além do limite de 1025",
    };
  }
}

export async function renderPokemonBySpecie(searchQuery, fetchPokemonDetails) {
  const { fetchData: showSpecies, data: speciesData } = useApi();
  await showSpecies(`/pokemon-species/${searchQuery.toLowerCase()}`);

  const id = speciesData.value ? speciesData.value.id : null;

  if (speciesData.value && id <= 1025) {
    const pokemons = await Promise.all([
      fetchPokemonDetails(speciesData.value),
    ]);
    return { pokemons, errorMessage: "" };
  } else {
    return {
      pokemons: [],
      errorMessage: "Espécie não encontrada ou está além do limite de 1025",
    };
  }
}

export async function renderPokemonByType(searchQuery, fetchPokemonDetails) {
  const { fetchData: showType, data: typeData } = useApi();
  await showType(`/type/${searchQuery.toLowerCase()}`);

  if (!typeData.value) {
    return {
      pokemons: [],
      errorMessage: "Tipo não encontrado",
    };
  }

  const filtered = typeData.value.pokemon
    .map((p) => {
      const id = extractPokemonId(p.pokemon.url);
      return { ...p.pokemon, id };
    })
    .filter((p) => p.id <= 1025);

  if (filtered.length === 0) {
    return {
      pokemons: [],
      errorMessage: "Nenhum Pokémon desse tipo com ID até 1025 encontrado",
    };
  }

  const pokemons = await Promise.all(
    filtered.map((p) => fetchPokemonDetails(p)),
  );

  return { pokemons, errorMessage: "" };
}
