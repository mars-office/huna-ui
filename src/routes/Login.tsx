import { Button, Text } from "@fluentui/react-components";
import { useAuth } from "oidc-react";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const Login = () => {
    const auth = useAuth();
    const [searchParams] = useSearchParams();

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
        <Text as="h2" size={800}>Login</Text>
        <Button onClick={() => login('google')}>Login with Google</Button>
        <Button onClick={() => login('facebook')}>Login with Facebook</Button>
        <Button onClick={() => login('microsoft')}>Login with Microsoft</Button>
    </div>
}

export default Login;