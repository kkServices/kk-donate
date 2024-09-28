import type { ToastContainerOptions } from 'vue3-toastify';
import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import '~/style/override/vue3-toastify.scss';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, { autoClose: 3000, closeButton: false } as ToastContainerOptions);
  return {
    provide: { toast },
  };
});
