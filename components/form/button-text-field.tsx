import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, ReactNode } from 'react';
import Button from '../buttons/button';
import TextField from './text-field';
import styles from './button-text-field.module.scss';

interface ButtonTextFieldProps {
  placeholder?: string;
  submit?: boolean;
  icon?: IconProp;
  name?: string;
  disabled?: boolean;
}

const ButtonTextField: FC<ButtonTextFieldProps> = ({
  icon, placeholder, submit, disabled,
}) => {
  return (
    <div className={styles.host}>
      <TextField
        disabled={disabled}
        placeholder={placeholder}
      />
      <span className={styles.append}>
        <Button regular disabled submit={submit}>
          {!!icon && <FontAwesomeIcon icon={icon} /> }
        </Button>
      </span>
    </div>
  );
};

ButtonTextField.displayName = 'ButtonTextField';

export default ButtonTextField;
