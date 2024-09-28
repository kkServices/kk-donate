export interface QRCodeProps {
  text: string
  loading: boolean
  class: string
}

export const defaultProps: QRCodeProps = {
  text: '',
  loading: false,
  class: '',
};
