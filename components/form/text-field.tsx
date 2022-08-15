import React, { ChangeEventHandler, forwardRef } from 'react';
import styles from './text-field.module.scss';

interface TextFieldProps {
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  password?: boolean;
  disabled?: boolean;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>((
  { className, password, ...props },
  ref,
) => {
  const classes = [styles.textField];
  if (className) classes.push(className);
  return (
    <input
      {...props}
      ref={ref}
      className={classes.join(' ')}
      type={password ? 'password' : 'text'}
    />
  );
});

TextField.displayName = 'TextField';

export default TextField;
