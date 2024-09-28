<script setup lang="ts">
import { moneyOptions as _moneyOptions, messageList } from './data';

const [visible, setVisible] = useToggle(false);
const [paySuccessVisible] = useToggle(false);
const formRef = ref();

const formData = reactive({
  totalAmount: 0,
  message: '',
  email: null,
  recaptcha: '',
});

const { refresh } = await useDonateOrderRecent(false);

const { data, execute, status, error } = await useAsyncData('/donate/order/create', async () => {
  return useNuxtApp().$request('/donate/order/create', {
    body: formData,
    method: 'POST',

  });
}, { immediate: false });

const loading = computed(() => status.value === 'pending');

function onSubmitHandler(values: { email?: string, message: string, money: number, recaptcha: string }) {
  formData.email = (values.email || null) as null;
  formData.message = values.message || '';
  formData.totalAmount = values.money;
  formData.recaptcha = values.recaptcha;
  execute().then(() => {
    if (!error.value) {
      setVisible(true);
    }
  });
}

function paySuccessHandler() {
  setVisible(false);
  paySuccessVisible.value = true;
  formRef.value.reset();
  refresh();
}
</script>

<template>
  <div>
    <h1 class="text-center text-2xl font-bold">
      要饭网
    </h1>
    <div class="my-6 indent-8">
      <p>当想象力、创造力和巧克力都渐渐变得遥不可及，我只能向您寻求一点点温暖。您的善意不止是对我的帮助，更是一份珍贵的鼓励。</p>
      <p>
        同时也希望您通过
        <a class="text-primary" href="https://gongyi.qq.com/">腾讯公益</a>、
        <a class="text-primary" href="https://love.alipay.com/">支付宝公益</a>、
        <a class="text-primary" href="https://gongyi.sina.com.cn/">新浪公益</a>
        等平台，为更多无助的人点燃希望的火苗。您每一份微小的心意，都是通向未来的桥梁。
      </p>
    </div>
    <DonatePayForm
      ref="formRef"
      :message-list="messageList"
      :money-options="_moneyOptions"
      :loading="loading"
      @submit="onSubmitHandler"
    />

    <DonatePayModal
      v-model:visible="visible"
      :qr-code="data?.qrCode"
      :is-api="data?.isApi"
      :out-trade-no="data?.outTradeNo"
      :email="formData.email"
      :message="formData.message"
      @pay-success="paySuccessHandler"
    />
    <DonatePaySuccessModal v-model:visible="paySuccessVisible" />
  </div>
</template>
