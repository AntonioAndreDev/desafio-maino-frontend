<template>
  <select
    v-model="selectedIdiom"
    id="idiom_select"
    name="idiom_select"
    @change="updateIdiom"
    class="bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm shadow-xl border border-gray-700 md:w-40 w-full focus:outline-2 focus:outline-blue-500 h-14 capitalize"
  >
    <option v-for="idiom in idioms" :key="idiom.id" :value="idiom.id">
      {{ idiom.name }}
      <Icon :icon="idiom.icon" class="size-2 ml-2" />
    </option>
  </select>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStorage } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { Icon } from "@iconify/vue";

const storedLocale = useStorage("selectedLocale", "pt_BR");
const { locale } = useI18n();

const selectedIdiom = ref(storedLocale.value);

const idioms = ref([
  { id: "en_US", name: "🇺🇸 English" },
  { id: "pt_BR", name: "🇧🇷 Português" },
  { id: "es", name: "🇪🇸Español" },
]);

const updateIdiom = () => {
  storedLocale.value = selectedIdiom.value;
  locale.value = selectedIdiom.value;
};

onMounted(() => {
  const storedIdiom = localStorage.getItem("selectedLocale");
  if (storedIdiom) {
    selectedIdiom.value = storedIdiom;
    locale.value = storedIdiom;
  }
});
</script>
