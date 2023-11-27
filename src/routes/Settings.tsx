import { Button } from "@fluentui/react-components";
import { useCallback, useEffect } from "react";
import { gptService } from "../services/gpt.service";

export const Settings = () => {
    const test = useCallback(async () => {
        const reply = await gptService.test();
        alert(reply);
    }, []);

    useEffect(() => {
        (async () => {
            const x = await gptService.test();
            console.log(x);
        })();
    }, []);

    return <div>
        <h2>settings here</h2>
        <Button onClick={test}>Test</Button>
    </div>
}

export default Settings;