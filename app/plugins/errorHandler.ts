export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    if (import.meta.server) {
      console.error('Vue error', { error, info, instance });
    }
  };

  nuxtApp.hook('vue:error', (error, instance, info) => {
    if (import.meta.server) {
      console.error('vue:error', { error, info, instance });
    }
  });
});
