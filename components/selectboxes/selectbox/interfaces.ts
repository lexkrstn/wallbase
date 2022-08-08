export interface SelectboxItemDto<V = string> {
  label: string;
  value: V;
}

export interface SelectboxDescribedItemDto<V = string> extends SelectboxItemDto<V> {
  description: string;
}
