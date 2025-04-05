<template>
  <div
    v-if="errorMessage"
    class="bg-red-900/60 p-6 rounded-lg mb-8 border-l-4 border-red-500"
  >
    <div class="flex items-center gap-x-2">
      <Icon class="size-6 text-red-500" icon="ri:alert-line" />
      <p class="text-red-300">Error: {{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

defineProps(["errorMessage"]);
</script>
