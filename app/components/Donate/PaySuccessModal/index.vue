<script lang="ts" setup>
const visible = defineModel<boolean>('visible', { required: true });

function payCancelHandler() {
  visible.value = false;
}

// function paySuccessHandler() {
//   visible.value = false
// }
</script>

<template>
  <Dialog
    v-model:visible="visible" modal header="感谢大爷的支持" class="box-border w-100 max-w-[85vw] overflow-hidden" :closable="false" :pt="{
      header: {
        // class: 'p-4',
      },
    }"
  >
    <template #header>
      <div />
    </template>
    <div class="text-center text-2xl">
      感谢大爷的投喂！
    </div>
    <div class="my-2 flex justify-center gap-2">
      <Button class="flex-1" type="button" label="再来一笔" @click="payCancelHandler" />
    </div>
  </Dialog>
</template>
