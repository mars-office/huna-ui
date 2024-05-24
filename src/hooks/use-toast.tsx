import { ToastIntent, useToastController } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import ToastContent from '../layout/ToastContent';
import { v4 } from 'uuid';

export interface ToastRefWithSettings {
  toastId: string;
  toastType: ToastIntent;
  message: string;
  title?: string;
  onClick?: (() => void) | (() => Promise<void>);
  afterClose?: (() => void) | (() => Promise<void>);
  onDismissed?: (() => void) | (() => Promise<void>);
}

export const useToast = () => {
  const { t } = useTranslation();
  const { dispatchToast, dismissToast, updateToast, dismissAllToasts } =
    useToastController('toaster');

  const dismiss = (toastId: string) => {
    dismissToast(toastId);
  };

  const dismissAll = () => {
    dismissAllToasts();
  };

  const updateToastInPlace = (
    toastId: string,
    toastType: ToastIntent,
    message: string,
    title?: string | undefined,
    onClick?: (() => void) | (() => Promise<void>),
    afterClose?: (() => void) | (() => Promise<void>),
    onDismissed?: (() => void) | (() => Promise<void>),
  ) => {
    updateToast({
      toastId: toastId,
      intent: toastType,
      onStatusChange: (_, d) => {
        if (d.status === 'dismissed' && onDismissed) {
          onDismissed();
        }
      },
      content: (
        <ToastContent
          message={message}
          title={title}
          onClick={onClick}
          onClose={() => {
            dismiss(toastId);
            if (afterClose) {
              afterClose();
            }
          }}
          toastType={toastType}
        />
      ),
    });
    return {
      message,
      toastId,
      toastType,
      title,
      onClick,
      afterClose,
      onDismissed,
    } as ToastRefWithSettings;
  };

  const toast = (
    toastType: ToastIntent,
    message: string,
    title?: string | undefined,
    onClick?: (() => void) | (() => Promise<void>),
    afterClose?: (() => void) | (() => Promise<void>),
    onDismissed?: (() => void) | (() => Promise<void>),
  ) => {
    const toastId = v4();
    dispatchToast(
      <ToastContent
        message={message}
        title={title}
        onClick={onClick}
        onClose={() => {
          dismiss(toastId);
          if (afterClose) {
            afterClose();
          }
        }}
        toastType={toastType}
      />,
      {
        intent: toastType,
        toastId: toastId,
        onStatusChange: (_, d) => {
          if (d.status === 'dismissed' && onDismissed) {
            onDismissed();
          }
        },
      },
    );
    return {
      toastId,
      toastType,
      onClick,
      afterClose,
      message,
      title,
      onDismissed,
    } as ToastRefWithSettings;
  };

  const fromError = (err: any) => {
    const results: ToastRefWithSettings[] = [];
    for (const errorProperty of Object.keys(err.response!.data)) {
      results.push(
        toast(
          'error',
          err?.response?.data
            ? err.response.data[errorProperty].map((x: string) => t(x)).join('; ')
            : t('ui.toast.unknownError'),
          t('ui.toast.error') + ' ' + errorProperty,
        ),
      );
    }
    return results;
  };

  return {
    toast,
    fromError,
    updateToastInPlace,
    dismiss,
    dismissAll,
  };
};
