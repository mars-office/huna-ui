import { Button, ButtonProps } from '@fluentui/react-components';
import { QuestionCircleRegular } from '@fluentui/react-icons';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ConfirmationButton = (props: ButtonProps) => {
  const { t } = useTranslation();
  const [clicked, setClicked] = useState(false);

  const onFocus = useCallback(() => {
    if (!clicked) {
      setClicked(true);
      return;
    }
  }, [clicked, setClicked]);

  const onBlur = useCallback(() => {
    if (clicked) {
      setClicked(false);
      return;
    }
  }, [clicked, setClicked]);

  const onClick = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      setClicked(false);
      if (props.onClick) {
        props.onClick(e);
      }
    },
    [props, setClicked],
  );

  return (
    <>
      {clicked && (
        <Button {...props} onClick={onClick} onTouchStart={onClick} autoFocus={true} onBlur={onBlur} icon={<QuestionCircleRegular />}>
          {t('ui.components.confirmationButton.areYouSure')}
        </Button>
      )}
      {!clicked && <Button {...props} onTouchStart={onFocus} onFocus={onFocus} />}
    </>
  );
};

export default ConfirmationButton;
