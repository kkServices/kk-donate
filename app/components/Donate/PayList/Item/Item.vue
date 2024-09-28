<script setup lang="ts">
import type { DonatePayListItemProps } from './props';
import { defaultProps } from './props';

const props = withDefaults(defineProps<DonatePayListItemProps>(), defaultProps);
</script>

<template>
  <Card>
    <template #content>
      <div class="flex justify-between">
        <div class="flex flex-1 items-center overflow-hidden">
          <Avatar :image="`https://gravatar.loli.net/avatar/${props.emailHash}?d=robohash&s=60`" />
          <div class="ml-4 min-w-0 flex-1">
            <h5 class="truncate text-lg font-600">
              {{ props.userName }}
            </h5>
            <p class="truncate text-sm text-gray-500">
              {{ props.time }}
            </p>
          </div>
        </div>
        <div>
          <Tag icon="icon-[f7--money-yen]" :severity="props.amount > 10 ? 'danger' : 'info'" :value="props.amount" />
        </div>
      </div>
      <p class="mt-2">
        {{ props.message || '审核中。。。' }}
      </p>
    </template>
  </Card>
</template>
