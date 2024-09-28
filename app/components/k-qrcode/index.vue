<script setup lang="ts">
import type { QRCodeProps } from './props';
import { useQRCode } from '@vueuse/integrations/useQRCode';
import { cn } from '~~/utils';
import { defaultProps } from './props';

const props = withDefaults(defineProps<QRCodeProps>(), defaultProps);

const text = toRef(props, 'text');

const url = useQRCode(text, { margin: 1 });
const className = computed(() => {
  return cn(
    'h-full w-full transition',
    props.loading ? 'blur-sm' : '',
    props.class,
  );
});
</script>

<template>
  <img v-if="url" :class="className" :src="url" alt="qrcode">
</template>
