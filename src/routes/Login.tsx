import { Button, Text } from "@fluentui/react-components";
import { useAuth } from "oidc-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export const Login = () => {
    const auth = useAuth();
    const [searchParams] = useSearchParams();
    const {t} = useTranslation();

    const login = useCallback(async (provider: string) => {
        await auth.signIn({
            extraQueryParams: {
                connector_id: provider
            },
            state: {
                returnTo: searchParams.get('returnTo') || '/'
            }
        });
    }, [auth, searchParams]);

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    }}>
        <Text as="h2" size={800}>{t('ui.login.login')} </Text>
        <Button onClick={() => login('google')}>{t('ui.login.loginWith')} Google</Button>
        <Button onClick={() => login('facebook')}>{t('ui.login.loginWith')}  Facebook</Button>
        <Button onClick={() => login('microsoft')}>{t('ui.login.loginWith')}  Microsoft</Button>
    </div>
}

export default Login;