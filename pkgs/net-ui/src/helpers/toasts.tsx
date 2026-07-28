import { type ReactNode } from 'react';
import { toast } from 'sonner';

// Brand-free: the caller supplies the (i18n-translated, brand-interpolated)
// message — net-ui never hardcodes a product name.
export const submitRegistrationNoCodeNonPristineError = (message: ReactNode) => {
  return toast.error(<div>{message}</div>, { position: 'bottom-center' });
};

export const submitRegistrationNoCodeError = (message: ReactNode) => {
  return toast.error(<div>{message}</div>, { position: 'bottom-center' });
};
