import {
  Avatar,
  CompoundButton,
  Dropdown,
  Input,
  Option,
  OptionOnSelectData,
  SelectionEvents,
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOnOptionSelectData,
  Title1,
  useTagPickerFilter,
} from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { SendCustomNotificationDto } from '../contracts/send-custom-notification.dto';
import { DeliveryType } from '../contracts/delivery-type';
import { NotificationSeverity } from '../../dto/notification-severity';
import { SendRegular } from '@fluentui/react-icons';
import { useToast } from '../../hooks/use-toast';
import notificationsAdminService from '../services/notifications-admin.service';

const allDeliveryTypes: DeliveryType[] = ['email', 'push', 'signalr'];
const allSeverityTypes: NotificationSeverity[] = ['error', 'info', 'success', 'warning'];

export const NotificationsAdmin = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [userEmailsQuery, setUserEmailsQuery] = useState('');
  const [request, setRequest] = useState<SendCustomNotificationDto>({
    deliveryTypes: [],
    message: '',
    title: '',
    severity: 'info',
    toUserEmails: [],
  });

  const onUserEmailsSelect = useCallback(
    (_: SyntheticEvent | Event, data: TagPickerOnOptionSelectData) => {
      setRequest({ ...request, toUserEmails: data.selectedOptions });
      setUserEmailsQuery('');
    },
    [setRequest, request, setUserEmailsQuery],
  );

  const emailPickerList = useTagPickerFilter({
    query: userEmailsQuery,
    options: [userEmailsQuery],
    noOptionsElement: <div></div>,
  });

  const onDeliveryTypesSelect = useCallback(
    (_: SelectionEvents, data: OptionOnSelectData) => {
      setRequest({ ...request, deliveryTypes: data.selectedOptions as DeliveryType[] });
    },
    [setRequest, request],
  );

  const onSeveritySelect = useCallback(
    (_: SelectionEvents, data: OptionOnSelectData) => {
      setRequest({ ...request, severity: data.selectedOptions[0] as NotificationSeverity });
    },
    [setRequest, request],
  );

  const send = useCallback(async () => {
    try {
      const reply = await notificationsAdminService.send({
        deliveryTypes: request.deliveryTypes,
        data: request.data,
        url: request.url,
        message: request.message,
        title: request.title,
        severity: request.severity,
        toUserEmails: request.toUserEmails,
      });
      toast.toast(
        'success',
        t('ui.admin.notificationsAdmin.notificationsSent') +
          ': ' +
          reply.sent +
          ', ' +
          reply.errored,
        t('ui.admin.notificationsAdmin.sent'),
      );
      setRequest({
        deliveryTypes: [],
        message: '',
        severity: 'info',
        title: '',
        data: undefined,
        url: undefined,
        toUserEmails: []
      });
    } catch (err: any) {
      console.error(err);
      toast.fromError(err);
    }
  }, [setRequest, request, toast, t]);

  const requestIsInvalid = useMemo(() => {
    return (
      !request.toUserEmails ||
      request.toUserEmails.length === 0 ||
      !request.title ||
      request.title.length === 0 ||
      !request.message ||
      request.message.length === 0 ||
      !request.severity ||
      request.severity.length === 0
    );
  }, [request]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <Title1>{t('ui.admin.notificationsAdmin.notificationsAdmin')}</Title1>
      <TagPicker selectedOptions={request.toUserEmails} onOptionSelect={onUserEmailsSelect}>
        <TagPickerControl expandIcon={<></>}>
          <TagPickerGroup>
            {request.toUserEmails.map((option) => (
              <Tag
                key={option}
                shape="rounded"
                media={<Avatar aria-hidden name={option} color="colorful" />}
                value={option}
              >
                {option}
              </Tag>
            ))}
          </TagPickerGroup>
          <TagPickerInput
            type="email"
            placeholder={t('ui.admin.notificationsAdmin.userEmails')}
            value={userEmailsQuery}
            onChange={(e) => setUserEmailsQuery(e.target.value)}
          />
        </TagPickerControl>
        <TagPickerList style={{ visibility: 'hidden' }}>{emailPickerList}</TagPickerList>
      </TagPicker>

      <Dropdown
        selectedOptions={request.deliveryTypes}
        multiselect
        onOptionSelect={onDeliveryTypesSelect}
        placeholder={t('ui.admin.notificationsAdmin.deliveryTypes')}
      >
        {allDeliveryTypes.map((dt) => (
          <Option key={dt} value={dt}>
            {dt}
          </Option>
        ))}
      </Dropdown>

      <Dropdown
        selectedOptions={[request.severity]}
        value={request.severity}
        onOptionSelect={onSeveritySelect}
        placeholder={t('ui.admin.notificationsAdmin.severity')}
      >
        {allSeverityTypes.map((dt) => (
          <Option key={dt} value={dt}>
            {dt}
          </Option>
        ))}
      </Dropdown>

      <Input
        value={request.title}
        onChange={(e) => setRequest({ ...request, title: e.target.value })}
        placeholder={t('ui.admin.notificationsAdmin.title')}
        required
        type="text"
      />

      <Input
        value={request.message}
        onChange={(e) => setRequest({ ...request, message: e.target.value })}
        placeholder={t('ui.admin.notificationsAdmin.message')}
        required
        type="text"
      />

      <Input
        value={request.url}
        onChange={(e) => setRequest({ ...request, url: e.target.value })}
        placeholder={t('ui.admin.notificationsAdmin.url')}
        type="text"
      />

      <Input
        value={request.data}
        onChange={(e) => setRequest({ ...request, data: e.target.value })}
        placeholder={t('ui.admin.notificationsAdmin.data')}
        type="text"
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CompoundButton
          appearance="primary"
          icon={<SendRegular />}
          secondaryContent={t('ui.admin.notificationsAdmin.sendNotifications')}
          onClick={send}
          disabled={requestIsInvalid}
        >
          {t('ui.admin.notificationsAdmin.send')}
        </CompoundButton>
      </div>
    </div>
  );
};

export default NotificationsAdmin;
