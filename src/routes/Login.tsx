import { CompoundButton, Title1 } from '@fluentui/react-components';
import { useAuth } from 'react-oidc-context';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { PersonLockFilled } from '@fluentui/react-icons';

export const Login = () => {
  const auth = useAuth();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const login = useCallback(async () => {
    await auth.signinRedirect({
      state: {
        returnTo: searchParams.get('returnTo') || '/',
      },
    });
  }, [auth, searchParams]);
  

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <Title1>{t('ui.login.login')}</Title1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CompoundButton appearance='primary'
          icon={<PersonLockFilled />}
          secondaryContent={t('ui.login.loginWithIdp')}
          onClick={() => login()}
        >
          {t('ui.login.login')}
        </CompoundButton>
      </div>
    </div>
  );
};

export default Login;
