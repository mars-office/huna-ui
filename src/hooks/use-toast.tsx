import {
  Button,
  Toast,
  ToastBody,
  ToastIntent,
  ToastTitle,
  ToastTrigger,
  useToastController,
} from '@fluentui/react-components';
import environment from '../environment';
import { useTranslation } from 'react-i18next';
import { DismissRegular } from '@fluentui/react-icons';

export const useToast = () => {
  const { t } = useTranslation();
  const { dispatchToast } = useToastController('toaster');
  const toast = (toastType: ToastIntent, message: string, title: string | undefined = undefined) => {
    dispatchToast(
      <Toast>
        <ToastTitle
          action={
            <ToastTrigger>
              <Button appearance="subtle" icon={<DismissRegular />} />
            </ToastTrigger>
          }
        >
          {title || t('ui.toast.' + toastType)}
        </ToastTitle>
        <ToastBody>{message}</ToastBody>
      </Toast>,
      {
        intent: toastType,
        timeout: environment.toast.timeout,
        position: 'top-end',
        pauseOnWindowBlur: true,
        pauseOnHover: true,
      },
    );
  };

  const fromError = (err: any) => {
    for (const errorProperty of Object.keys(err.response!.data)) {
      toast(
        'error',
        err.response.data[errorProperty].map((x: string) => t(x)).join('; '),
        t('ui.toast.error') + ' ' + errorProperty,
      );
    }
  }

  return {
    toast,
    fromError
  };
};
