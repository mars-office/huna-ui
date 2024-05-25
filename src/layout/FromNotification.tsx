import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import globalEventsService from "../services/global-events.service";
import { ConfirmNotification } from "../models/confirm-notification";
import { useTranslation } from "react-i18next";

export const FromNotification = () => {
  const params = useParams();
  const [queryParams, _] = useSearchParams();
  const {t} = useTranslation();

  useEffect(() => {
    globalEventsService.publish('confirmNotification', {
      _id: params.id,
      returnTo: queryParams.get('returnTo')
    } as ConfirmNotification);
  }, []);

  return <div>{t('ui.notifications.pleaseWait')}...</div>
}

export default FromNotification;