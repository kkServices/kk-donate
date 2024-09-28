<script setup lang="ts">
import type { DonatePayFormProps } from './props';
import { toTypedSchema } from '@vee-validate/zod';
import { Form as VeeForm } from 'vee-validate';
import { z } from 'zod';
import { defaultProps } from './props';

const props = withDefaults(defineProps<DonatePayFormProps>(), defaultProps);

const emits = defineEmits(['submit']);

const runtimeConfig = useRuntimeConfig();

const route = useRoute();

const moneySelect = ref<number | string | null>();
const getRecaptchaTokenIng = ref(false);
const isShowCustomInputNumber = computed(() => moneySelect.value === 'custom');

const { errors, defineField, handleSubmit, setFieldValue, resetField, resetForm } = useForm({

  validationSchema: toTypedSchema(
    z.object({
      money: z.number({ message: '请输入金额' }).max(999999999, { message: '咱可不敢收这么大一笔钱啊！' }),
      message: z.string({ message: '请输入留言' }).max(20, { message: '最长可输入20个字符哦！' }),
      email: z.union([z.string().email({ message: '请输入正确的邮箱' }), z.literal(''), z.undefined()]).optional(),
    }),
  ),
});

const [money] = defineField('money');
const [message] = defineField('message');
const [email] = defineField('email');

function randomMessage() {
  const messages = props.messageList;
  const randomIndex = Math.floor(Math.random() * messages.length);
  setFieldValue('message', messages[randomIndex]);
}
function recaptchaToken() {
  getRecaptchaTokenIng.value = true;
  return new Promise((resolve, reject) => {
    (window as any).grecaptcha.execute(runtimeConfig.public.baseGoogleRecaptchaPublic, { action: 'submit' }).then((token: string) => {
      resolve(token);
      getRecaptchaTokenIng.value = false;
    }).catch((err: Error) => {
      reject(err);
      getRecaptchaTokenIng.value = false;
    });
  });
}

function reset() {
  resetForm();
  moneySelect.value = null;
}

const onSubmit = handleSubmit(async (values) => {
  const recaptcha = await recaptchaToken();
  emits('submit', { ...values, recaptcha });
});

watch(moneySelect, () => {
  if (typeof moneySelect.value === 'number') {
    setFieldValue('money', moneySelect.value);
  } else {
    if (moneySelect.value === 'custom') {
      resetField('money');
    }
  }
});
onMounted(() => {
  if (route.query.money && !Number.isNaN(Number(route.query.money)) && Number(route.query.money) > 0) {
    moneySelect.value = 'custom';
    nextTick(() => {
      setFieldValue('money', Number(route.query.money));
    });
  }
});
defineExpose({ reset });
</script>

<template>
  <VeeForm class="flex flex-col gap-2" @submit="(onSubmit as any)">
    <div class="flex flex-col gap-2">
      <label class="block text-lg font-bold" for="money">金额</label>
      <Select v-model="moneySelect" :options="moneyOptions" option-label="name" option-value="value" placeholder="请选择您要投喂的金额" class="w-full" />
      <InputNumber v-show="isShowCustomInputNumber" v-model="money" mode="currency" currency="CNY" name="money" :min-fraction-digits="0" :max-fraction-digits="2" placeholder="请输入您要投喂的金额" />

      <p class="text-xs text-red-500">
        {{ errors.money }}
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <label class="block text-lg font-bold" for="name">
        留言
        <Button label="整两句" size="small" class="leading-none" outlined @click="randomMessage" />
      </label>
      <Textarea v-model="message" :class="{ 'p-invalid': errors.message }" name="message" maxlength="20" />
      <p class="text-xs text-red-500">
        {{ errors.message }}
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <label class="block text-lg font-bold" for="name">邮箱</label>
      <InputText v-model="email" :class="{ 'p-invalid': errors.email }" placeholder="用于头像显示" class="w-full" />
      <p class="text-xs text-red-500">
        {{ errors.email }}
      </p>
    </div>

    <Button :loading="props.loading || getRecaptchaTokenIng" class="mt-4" type="submit" label="立即投喂" />
  </VeeForm>
</template>
