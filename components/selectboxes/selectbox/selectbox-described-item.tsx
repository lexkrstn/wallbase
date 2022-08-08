import { FC } from 'react';
import { SelectboxDescribedItemDto } from './interfaces';
import styles from './selectbox-described-item.module.scss';

const SelectboxDescribedItem: FC<SelectboxDescribedItemDto> = ({ label, description }) => {
  return (
    <div className={styles.host}>
      <span className={styles.label}>{label}</span>
      <span className={styles.description}>{description}</span>
    </div>
  );
};

SelectboxDescribedItem.displayName = 'SelectboxDescribedItem';

export default SelectboxDescribedItem;
