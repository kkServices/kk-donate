<script setup lang="ts">
import { appName } from '~~/constants';

useHead({
  titleTemplate: (productCategory) => {
    return productCategory
      ? `${productCategory} - ${appName}`
      : appName;
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
