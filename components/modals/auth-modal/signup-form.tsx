import { faSignIn, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { FC, useCallback } from 'react';
import { MIN_LOGIN, MIN_PASSWORD, useSignUp } from '@/lib/hooks/use-sign-up';
import Alert from '@/components/alert';
import Button from '@/components/buttons/button';
import { FormGroup, Label, TextField } from '@/components/form';
import { ModalFooter } from '@/components/modals/modal';
import styles from './signin-form.module.scss';

interface SignUpFormProps {
  onSignedUp?: () => void;
  onCancel?: () => void;
}

const SignUpForm: FC<SignUpFormProps> = ({ onCancel, onSignedUp }) => {
  const { error, invalidate, processing, onSubmit } = useSignUp({
    onComplete: onSignedUp,
  });

  const handleCancelClick = useCallback(() => onCancel && onCancel(), []);

  return (
    <form onSubmit={onSubmit}>
      {!!error && (
        <Alert icon={faExclamationCircle} className={styles.alert}>
          {error}
        </Alert>
      )}
      <FormGroup>
        <Label htmlFor="signup-login">Login:</Label>
        <TextField
          name="login"
          placeholder={`At least ${MIN_LOGIN} letters`}
          id="signup-login"
          onChange={invalidate}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="signup-email">Email:</Label>
        <TextField
          name="email"
          placeholder="E.g. your@email.com"
          id="signup-email"
          onChange={invalidate}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="signup-password">Password:</Label>
        <TextField
          name="password"
          placeholder={`At least ${MIN_PASSWORD} symbols`}
          id="signup-password"
          onChange={invalidate}
          password
        />
      </FormGroup>
      <ModalFooter spaceAround>
        <Button
          submit
          iconPrepend={faSignIn}
          loading={processing}
          disabled={processing}
        >
          Register
        </Button>
        <Button onClick={handleCancelClick} iconPrepend={faTimes} dark>
          Cancel
        </Button>
      </ModalFooter>
    </form>
  );
};

SignUpForm.displayName = 'SignUpForm';

export default SignUpForm;
