import axios from "axios";

export const gptService = {
    test: async () => {
        return (await axios.get<string>(`/api/gpt/test`)).data;
    }
};