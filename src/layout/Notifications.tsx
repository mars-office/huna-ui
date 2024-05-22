import {
  Caption1,
  Caption2,
  Link,
  Menu,
  MenuGroupHeader,
  MenuOpenChangeData,
  MenuOpenEvent,
  MenuPopover,
  MenuTrigger,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  ToastIntent,
  ToolbarButton,
} from '@fluentui/react-components';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { NotificationDto } from '../dto/notification.dto';
import notificationsService from '../services/notifications.service';
import { AlertBadgeRegular, AlertRegular } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import { useToast } from '../hooks/use-toast';
import { useSignalrData } from '../hooks/use-signalr-data';
import { toLocaleDateString } from '../helpers/date.helper';

export const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const toast = useToast();

  const onMenuOpenChange = useCallback(
    (_: MenuOpenEvent, data: MenuOpenChangeData) => {
      setMenuOpen(data.open);
    },
    [setMenuOpen],
  );

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        try {
          const unreadCountResponse = await notificationsService.getUnreadNotificationsCount();
          setUnreadCount(unreadCountResponse.count);
          const notificationsResponse = await notificationsService.getNotifications(0, 50);
          setNotifications(notificationsResponse);
        } catch (err: any) {
          toast.fromError(err);
        }
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    })();
  }, [isAuthenticated]);

  const showNotificationToast = useCallback(
    (n: NotificationDto) => {
      toast.toast(n.severity as ToastIntent, n.message, n.title);
    },
    [toast],
  );

  useSignalrData<NotificationDto>(
    'Huna.Notifications.Contracts.NotificationDto',
    async (n) => {
      setNotifications([n, ...notifications]);
      setUnreadCount(unreadCount + 1);
      showNotificationToast(n);
    },
    (e) => {
      toast.fromError(e);
    },
    [toast, notifications, setNotifications, unreadCount, setUnreadCount, showNotificationToast],
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead();
      const newNotifications = [...notifications];
      const now = new Date().toISOString();
      newNotifications.forEach((n) => {
        if (!n.readAt) {
          n.readAt = now;
        }
      });
      setNotifications([...newNotifications]);
      setUnreadCount(0);
      setMenuOpen(false);
    } catch (err: any) {
      toast.fromError(err);
    }
  }, [setUnreadCount, notifications, setNotifications, setMenuOpen, toast]);

  const markAsRead = useCallback(
    async (n: NotificationDto) => {
      try {
        await notificationsService.markAsRead(n._id!);
        n.readAt = new Date().toISOString();
        const newNotifications = [...notifications];
        setNotifications([...newNotifications]);
        setUnreadCount(unreadCount - 1);
      } catch (err: any) {
        toast.fromError(err);
      }
    },
    [setUnreadCount, unreadCount, notifications, setNotifications, toast],
  );

  const notificationClicked = useCallback(
    async (n: NotificationDto) => {
      if (!n.readAt) {
        await markAsRead(n);
      }
      setMenuOpen(false);
    },
    [markAsRead, setMenuOpen],
  );

  return (
    <Menu open={menuOpen} onOpenChange={onMenuOpenChange}>
      <MenuTrigger>
        <ToolbarButton icon={unreadCount <= 0 ? <AlertRegular /> : <AlertBadgeRegular />} />
      </MenuTrigger>
      <MenuPopover
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxHeight: '70vh',
        }}
      >
        <MenuGroupHeader>{t('ui.notifications.notifications')}</MenuGroupHeader>
        <div
          style={{
            flex: '1 1 auto',
            overflow: 'auto',
            minHeight: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
          }}
        >
          {notifications.length === 0 && (
            <MessageBar>
              <MessageBarBody>
                <Caption2>{t('ui.notifications.noNotifications')}</Caption2>
              </MessageBarBody>
            </MessageBar>
          )}
          {notifications.map((n) => (
            <MessageBar
              onClick={() => notificationClicked(n)}
              key={n._id!}
              intent={n.severity}
              layout="multiline"
              style={{
                cursor: 'pointer',
                filter: !n.readAt ? 'grayscale(0%)' : 'grayscale(70%)',
                minHeight: 'initial',
              }}
            >
              <MessageBarBody>
                <MessageBarTitle
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <Caption1 style={{ fontWeight: !n.readAt ? 'bold' : '' }}>{n.title}</Caption1>
                  <Caption2 italic>{toLocaleDateString(n.issuedAt)}</Caption2>
                </MessageBarTitle>
                <Caption2>{n.message}</Caption2>
              </MessageBarBody>
            </MessageBar>
          ))}
        </div>
        {unreadCount > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Link onClick={markAllAsRead}>
              <Caption2>{t('ui.notifications.markAllAsRead')}</Caption2>
            </Link>
          </div>
        )}
      </MenuPopover>
    </Menu>
  );
};

export default Notifications;
