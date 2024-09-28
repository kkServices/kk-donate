import type { HTMLAttributes } from 'vue';

export interface DonatePayListItemProps {
  class?: HTMLAttributes['class']
  userName: string
  time: string
  message: string
  emailHash: string
  amount: number
}

export const defaultProps = {
  class: '',
};
