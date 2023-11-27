import { useTranslation } from "react-i18next";

const Loading = () => {
    const {t} = useTranslation();
    return <div>{t('ui.loading.loading')}...</div>
}

export default Loading;