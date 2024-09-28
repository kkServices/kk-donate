import type { HTMLAttributes } from 'vue';

export interface SkeletonProps {
  class?: HTMLAttributes['class']
}

export const defaultProps: SkeletonProps = {
  class: '',
};
