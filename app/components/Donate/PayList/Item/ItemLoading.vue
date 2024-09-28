<script setup lang="ts">

</script>

<template>
  <Card>
    <template #content>
      <div class="flex justify-between">
        <div class="flex flex-1 items-center overflow-hidden">
          <Skeleton shape="circle" size="2rem" class="mr-2" />
          <div class="min-w-0 flex-1">
            <Skeleton width="10rem" class="mt-2" />
            <Skeleton width="8rem" class="mt-2" />
          </div>
        </div>
        <Skeleton class="ml-4" width="3rem" height="1.2rem" />
      </div>
      <Skeleton class="mt-4" width="80%" height="1rem" />
    </template>
  </Card>
</template>
