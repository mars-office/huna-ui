import { Button } from "@fluentui/react-components";
import { useCallback } from "react";

export const Settings = () => {
    const test = useCallback(async () => {
    }, []);

    return <div>
        <h2>settings here</h2>
        <Button onClick={test}>Test</Button>
    </div>
}

export default Settings;