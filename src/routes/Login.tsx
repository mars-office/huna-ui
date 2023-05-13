import { Button, Text } from "@fluentui/react-components";
import { useAuth } from "oidc-react";
import { useCallback } from "react";

export const Login = () => {
    const auth = useAuth();

    const login = useCallback(async () => {
        await auth.signIn();
    }, [auth]);

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