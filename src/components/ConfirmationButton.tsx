import { Button, ButtonProps } from '@fluentui/react-components';
import { QuestionCircleRegular } from '@fluentui/react-icons';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ClickAway from 'react-hook-click-away';

export const ConfirmationButton = (props: ButtonProps) => {
  const { t } = useTranslation();
  const [clicked, setClicked] = useState(false);
  const [isInitialClick, setIsInitialClick] = useState(true);

  const onClickAway = useCallback(() => {
    if (isInitialClick) {
      setIsInitialClick(false);
      return;
    }
    if (clicked) {
      setClicked(false);
      setIsInitialClick(true);
    }
  }, [clicked, setClicked, isInitialClick, setIsInitialClick]);

  const onInitialClick = useCallback(() => {
    setClicked(true);
  }, [setClicked]);

  const onReclick = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      setClicked(false);
      setIsInitialClick(true);
      if (props.onClick) {
        props.onClick(e);
      }
    },
    [props, setClicked, setIsInitialClick],
  );

  return (
    <>
      {clicked && (
        <ClickAway onClickAway={onClickAway}>
          <Button {...props} onClick={onReclick} icon={<QuestionCircleRegular />}>
            {t('ui.components.confirmationButton.areYouSure')}
          </Button>
        </ClickAway>
      )}
      {!clicked && <Button {...props} onClick={onInitialClick} />}
    </>
  );
};

export default ConfirmationButton;
