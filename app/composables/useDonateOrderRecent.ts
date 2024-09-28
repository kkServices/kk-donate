export async function useDonateOrderRecent(immediate = true) {
  return useRequest('/donate/order/recent', {
    server: false,
    key: 'donate-order-recent',
    dedupe: 'defer',
    immediate,
  });
}
