<script setup lang="ts">
import type { DonatePayModalProps } from './props';
import { defaultProps } from './props';

const props = withDefaults(defineProps<DonatePayModalProps>(), defaultProps);
const emits = defineEmits(['paySuccess']);
const toastify = useToastify();
const visible = defineModel<boolean>('visible', { required: true });
const tradeNo = ref<null | string>(null);
const { data, refresh, status } = await useAsyncData('/donate/order/status', () => {
  return useNuxtApp().$request('/donate/order/status', {
    params: {
      outTradeNo: props.outTradeNo,
    },
  });
}, {
  immediate: false,
});
const { execute: createOrderByTradeNo, data: createOrderData } = await useAsyncData('/donate/order/addByOrderNo', () => {
  return useNuxtApp().$request('/donate/order/createByTradeNo', {
    method: 'post',
    body: {
      tradeNo: tradeNo.value,
      message: props.message,
      email: props.email,
    },
  });
}, {
  immediate: false,
});

async function createOrderHandler() {
  createOrderByTradeNo().then(() => {
    if (createOrderData.value) {
      visible.value = false;
      tradeNo.value = null;
      emits('paySuccess');
    }
  });
}

async function paySuccessHandler() {
  await refresh();
  if (data.value) {
    visible.value = false;
    emits('paySuccess');
  } else {
    toastify.error('该订单暂未支付，请稍后重试');
  }
}

function payCancelHandler() {
  visible.value = false;
}
</script>

<template>
  <Dialog
    v-model:visible="visible" modal header="支付" class="box-border w-100 max-w-[85vw] overflow-hidden" :closable="false" :pt="{
      header: {
        class: 'p-4',
      },
    }"
  >
    <template #header>
      <div />
    </template>
    <Message :severity="props.isApi ? 'info' : 'warn'" class="my-2">
      {{ props.isApi ? '请使用支付宝扫码' : '该订单超出单笔限制，需支付完成后手动输入订单号或等站长手动更新' }}
    </Message>
    <div class="flex-center">
      <k-qrcode :text="props.qrCode" :loading="false" class="size-40" />
    </div>

    <div v-if="!isApi" class="flex items-center justify-between gap-2">
      <InputText v-model="tradeNo" placeholder="支付宝订单号" class="flex-1" />
      <Button label="提交" class="block" :disabled="!tradeNo" @click="createOrderHandler" />
    </div>

    <div class="my-2 flex justify-center gap-2">
      <Button class="flex-1" type="button" label="取消" severity="secondary" @click="payCancelHandler" />
      <Button v-if="props.outTradeNo" :loading="status === 'pending'" class="flex-1" type="button" label="赞助成功" @click="paySuccessHandler" />
    </div>
  </Dialog>
</template>
