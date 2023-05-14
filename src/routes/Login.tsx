import { Button, Text } from "@fluentui/react-components";
import { useAuth } from "oidc-react";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const Login = () => {
    const auth = useAuth();
    const [searchParams] = useSearchParams();

    const login = useCallback(async () => {
        await auth.signIn({
            state: encodeURIComponent(searchParams.get('returnTo') || '/')
        });
    }, [auth, searchParams]);

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    }}>
        <Text as="h2" size={800}>Login</Text>
        <Button onClick={login}>Login with Dex</Button>
    </div>
}

export default Login;