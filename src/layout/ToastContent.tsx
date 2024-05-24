import { Button, Toast, ToastBody, ToastIntent, ToastTitle } from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';

export interface ToastContentProps {
  toastType: ToastIntent;
  message: string;
  title?: string | undefined;
  onClick?: (() => void) | (() => Promise<void>);
  onClose: (() => void) | (() => Promise<void>);
}

export const ToastContent = (props: ToastContentProps) => {

  const {t} = useTranslation();

  return (
    <Toast style={{
      cursor: props.onClick ? 'pointer' : 'initial'
    }} onClick={props.onClick}>
      <ToastTitle
        action={
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              props.onClose();
            }}
            appearance="subtle"
            icon={<DismissRegular />}
          />
        }
      >
        {props.title || t('ui.toast.' + props.toastType)}
      </ToastTitle>
      <ToastBody>{props.message}</ToastBody>
    </Toast>
  );
};

export default ToastContent;
