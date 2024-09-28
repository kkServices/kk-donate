<script setup lang="ts">
const router = useRouter();
</script>

<template>
  <main class="px-4 py-10 text-center text-primary-700 dark:text-gray-200">
    <div class="text-4xl">
      <div class="icon-[carbon--warning] inline-block" />
    </div>
    <div>Not found</div>
    <div>
      <Button class="m-3 mt-8 text-sm" @click="router.back()">
        Back
      </Button>
    </div>
  </main>
</template>
