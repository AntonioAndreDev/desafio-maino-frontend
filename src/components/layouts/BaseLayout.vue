<template>
  <div class="max-w-7xl mx-auto">
    <header v-if="$slots.header">
      <slot name="header" />
    </header>

    <slot v-if="$slots.default" name="default" />
  </div>
</template>
