import { Link, Text } from '@fluentui/react-components';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface TrimmedTextProps {
  maxCharacterCount?: number;
  text: string;
  moreTextSize?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;
}

export const TrimmedText = (props: TrimmedTextProps) => {
  const { t } = useTranslation();
  const maxCharCount = useMemo(() => props.maxCharacterCount || 100, [props.maxCharacterCount]);
  const [isVisible, setIsVisible] = useState(props.text.length <= maxCharCount);
  return (
    <>
      {isVisible ? (
        <>{props.text}</>
      ) : (
        <>
          {props.text.substring(0, maxCharCount)}{' '}
          <Link autoFocus={false} tabIndex={-1} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsVisible(true);
          }}>
            <Text size={props.moreTextSize || 200}>{t('ui.components.trimmedText.more')}...</Text>
          </Link>
        </>
      )}
    </>
  );
};

export default TrimmedText;
