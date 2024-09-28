export interface DonatePayFormProps {
  class?: string
  loading?: boolean
  messageList: string[]
  moneyOptions: { name: string, value: number | string }[]
}

export const defaultProps = {
  class: '',
  loading: false,
};
