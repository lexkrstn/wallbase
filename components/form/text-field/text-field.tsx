import React, {
  ChangeEventHandler,
  FocusEventHandler,
  forwardRef,
  KeyboardEventHandler,
} from 'react';
import styles from './text-field.module.scss';

interface TextFieldProps {
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  placeholder?: string;
  password?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
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
