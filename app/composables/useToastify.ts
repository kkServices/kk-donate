export function useToastify() {
  const { $toast } = useNuxtApp();
  return $toast;
}
