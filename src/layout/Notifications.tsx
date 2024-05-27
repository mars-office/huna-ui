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
import { ToastRefWithSettings, useToast } from '../hooks/use-toast';
import { useSignalrData } from '../hooks/use-signalr-data';
import { toLocaleDateString } from '../helpers/date.helper';
import { useNavigate } from 'react-router-dom';
import globalEventsService from '../services/global-events.service';
import { ConfirmNotification } from '../models/confirm-notification';
import { Subscription } from '../helpers/behaviour-subject';
import pushService from '../services/push.service';

export const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loadingStopped, setLoadingStopped] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const toast = useToast();
  const [visibleToasts, setVisibleToasts] = useState<
    { toastRef: ToastRefWithSettings; n: NotificationDto }[]
  >([]);
  const navigate = useNavigate();

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
          setLoadingStopped(true);
        } catch (err: any) {
          setLoadingStopped(true);
          toast.fromError(err);
        }
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    })();
  }, [isAuthenticated]);

  const loadMore = useCallback(async () => {
    const notificationsResponse = await notificationsService.getNotifications(
      notifications.length,
      50,
    );
    if (notificationsResponse.length > 0) {
      setNotifications([...notifications, ...notificationsResponse]);
    }
  }, [notifications, setNotifications]);

  const markAsRead = useCallback(
    async (n: NotificationDto) => {
      if (n.readAt) {
        return;
      }
      try {
        await notificationsService.markAsRead(n._id!);
        n.readAt = new Date().toISOString();
        const newNotifications = [...notifications];
        setNotifications([...newNotifications]);
        if (unreadCount > 0) {
          setUnreadCount(unreadCount - 1);
        }
      } catch (err: any) {
        toast.fromError(err);
      }
    },
    [setUnreadCount, unreadCount, notifications, setNotifications, toast],
  );

  const showNotificationToast = useCallback(
    (n: NotificationDto) => {
      const ref = toast.toast(
        n.severity as ToastIntent,
        n.message,
        n.title,
        async () => {
          await markAsRead(n);
          toast.dismiss(ref.toastId);
          if (n.url) {
            navigate(n.url);
          }
        },
        async () => {
          await markAsRead(n);
        },
        () => {
          visibleToasts.splice(
            visibleToasts.findIndex((z) => z.toastRef.toastId === ref.toastId),
            1,
          );
          setVisibleToasts([...visibleToasts]);
        },
      );
      setVisibleToasts([...visibleToasts, { n: n, toastRef: ref }]);
    },
    [toast, markAsRead, setVisibleToasts, visibleToasts, navigate],
  );

  useEffect(() => {
    for (const vt of visibleToasts) {
      toast.updateToastInPlace(
        vt.toastRef.toastId,
        vt.toastRef.toastType,
        vt.toastRef.message,
        vt.toastRef.title,
        async () => {
          await markAsRead(vt.n);
          toast.dismiss(vt.toastRef.toastId);
          if (vt.n.url) {
            navigate(vt.n.url);
          }
        },
        async () => {
          await markAsRead(vt.n);
        },
        () => {
          visibleToasts.splice(
            visibleToasts.findIndex((z) => z.toastRef.toastId === vt.toastRef.toastId),
            1,
          );
          setVisibleToasts([...visibleToasts]);
        },
      );
    }
  }, [visibleToasts, setVisibleToasts, markAsRead, toast, navigate]);

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

  const notificationClicked = useCallback(
    async (n: NotificationDto) => {
      if (n.url) {
        navigate(n.url);
      }
      if (!n.readAt) {
        await markAsRead(n);
      }
      setMenuOpen(false);
    },
    [markAsRead, setMenuOpen, navigate],
  );

  useEffect(() => {
    let subscription: Subscription<ConfirmNotification> | undefined;
    if (loadingStopped) {
      subscription = globalEventsService.subscribe<ConfirmNotification>('confirmNotification', {
        onNext: (data, s) => {
          if (!data) {
            return;
          }
          const foundNotification = notifications.find((x) => x._id === data._id);
          if (foundNotification) {
            globalEventsService.clear('confirmNotification');
            if (s) {
              s.unsubscribe();
            }
            (async () => {
              await markAsRead(foundNotification);
            })();
          }
          navigate(data.returnTo || '/');
        },
        onError: (e) => {
          toast.fromError(e);
        },
      });
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [markAsRead, loadingStopped]);

  useEffect(() => {
    const listener = (me: MessageEvent<NotificationDto>) => {
      const n = me.data;
      console.log('Received app side', n);
      (async () => {
        await markAsRead(n);
        if (n.url) {
          navigate(n.url);
        }
      })();
    };
    (async () => {
      await pushService.setOnPushNotificationReceivedListener<NotificationDto>(listener);
    })();
    return () => {
      (async () => {
        await pushService.removeOnPushNotificationReceivedListener(listener);
      })();
    };
  }, [markAsRead, navigate]);

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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Link autoFocus={false} tabIndex={-1} onClick={loadMore}>
              <Caption2>{t('ui.notifications.loadMore')}</Caption2>
            </Link>
          </div>
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
