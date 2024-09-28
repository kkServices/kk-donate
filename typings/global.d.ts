import type { $Fetch } from 'ofetch';
import type { toast } from 'vue3-toastify';
import type { Logger } from 'winston';

declare module '#app' {
  interface NuxtApp {
    $toast: toast
    $logger?: Logger
    $request: $Fetch
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $toast: toast
    $logger?: Logger
    $request: $Fetch
  }
}

export {};
