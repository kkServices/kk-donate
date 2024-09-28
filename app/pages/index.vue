<script setup lang="ts">
useHead({
  title: '在线扶贫',
  script: [
    { src: 'https://www.recaptcha.net/recaptcha/api.js?render=6LcYZCQqAAAAAO9bjJLxXZciH5Uu_Hm6DfFZpZgt' },
  ],
  link: [
    { rel: 'preconnect', href: 'https://www.recaptcha.net' },
    { rel: 'preconnect', href: 'https://www.gstatic.com' },
  ],
});
</script>

<template>
  <div class="mx-auto box-border grid max-w-[1440px] grid-cols-12 px-6 md:px-0">
    <div
      class=" col-span-12 mt-6 box-border rounded-lg px-6 py-10 shadow-xl bg-card sm:col-span-12 md:col-span-6 md:col-start-4"
    >
      <suspense>
        <donate-default-form />
      </suspense>

      <DonatePayList class="mt-5" />
    </div>
  </div>
</template>

<style scoped></style>
