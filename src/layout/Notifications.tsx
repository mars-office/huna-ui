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
import { UIEvent, useCallback, useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { NotificationDto } from '../dto/notification.dto';
import notificationsService from '../services/notifications.service';
import { AlertBadgeRegular, AlertRegular } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import { ToastRefWithSettings, useToast } from '../hooks/use-toast';
import { useSignalrData } from '../hooks/use-signalr-data';
import { toLocaleDateString } from '../helpers/date.helper';
import { useNavigate } from 'react-router-dom';

export const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const toast = useToast();
  const [visibleToasts, setVisibleToasts] = useState<
    { toastRef: ToastRefWithSettings; n: NotificationDto }[]
  >([]);
  const [prevScrollTop, setPrevScrollTop] = useState(0);
  const [debounceTimeout, setDebounceTimeout] = useState<any | null>(null);
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
        } catch (err: any) {
          toast.fromError(err);
        }
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    })();
  }, [isAuthenticated]);

  const onNotificationListScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const element = e.target as HTMLDivElement;
      const currentScrollTop = element.scrollTop;
      const isScrollingDown = currentScrollTop > prevScrollTop;
      const tolerance = 1; // Tolerance value to account for fractional differences
      const isAtEnd =
        Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) <= tolerance;
      if (isScrollingDown && isAtEnd) {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        const newDebounceTimeout = setTimeout(() => {
          (async () => {
            console.log('Loading more notifications...');
            const notifBatch = await notificationsService.getNotifications(
              notifications.length,
              50,
            );
            if (notifBatch.length) {
              setNotifications([...notifications, ...notifBatch]);
            }
          })();
        }, 300);

        setDebounceTimeout(newDebounceTimeout);
      }
      setPrevScrollTop(currentScrollTop);
    },
    [
      notifications,
      setNotifications,
      prevScrollTop,
      setPrevScrollTop,
      debounceTimeout,
      setDebounceTimeout,
    ],
  );

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
        setUnreadCount(unreadCount - 1);
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
          onScroll={onNotificationListScroll}
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
