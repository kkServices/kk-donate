<script setup lang="ts">
const color = useColorMode();

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#18171d' : '#f7f9fe',
  }],
});

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark';
}
</script>

<template>
  <div>
    <button class="!outline-none" @click="toggleDark">
      <div class="icon-[carbon--sun] dark:icon-[carbon--moon]" />
    </button>
  </div>
</template>
