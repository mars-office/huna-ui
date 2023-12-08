import { Text } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const ParkingLots = () => {
  const {t} = useTranslation();

  return <>
    <Text size={500}>{t('ui.admin.parkingLots.parkingLots')}</Text>
  </>
}

export default ParkingLots;