import { faSignIn, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { FC, useCallback } from 'react';
import { useSignIn } from '@/lib/hooks/use-sign-in';
import Alert from '../../alert';
import Button from '../../buttons/button';
import { FormGroup, Label, TextField } from '../../form';
import { ModalFooter } from '../modal';
import styles from './signup-form.module.scss';

interface SignInFormProps {
  onLoggedIn?: () => void;
  onCancel?: () => void;
}

const SignInForm: FC<SignInFormProps> = ({ onCancel, onLoggedIn }) => {
  const { error, onSubmit, invalidate, loading } = useSignIn({ onLoggedIn });

  const handleCancelClick = useCallback(() => onCancel && onCancel(), []);

  return (
    <form onSubmit={onSubmit}>
      {!!error && (
        <Alert icon={faExclamationCircle} className={styles.alert}>
          {error}
        </Alert>
      )}
      <FormGroup>
        <Label htmlFor="signin-username">Username / Email:</Label>
        <TextField
          name="username"
          placeholder="Your login or email"
          id="signin-username"
          onChange={invalidate}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="signin-password">Password:</Label>
        <TextField
          name="password"
          placeholder="Your password"
          id="signin-password"
          onChange={invalidate}
          password
        />
      </FormGroup>
      <ModalFooter spaceAround>
        <Button
          submit
          iconPrepend={faSignIn}
          loading={loading}
          disabled={loading}
        >
          Log in
        </Button>
        <Button onClick={handleCancelClick} iconPrepend={faTimes} dark>
          Cancel
        </Button>
      </ModalFooter>
    </form>
  );
};

SignInForm.displayName = 'SignInForm';

export default SignInForm;
