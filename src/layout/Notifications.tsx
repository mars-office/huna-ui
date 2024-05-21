import {
  Card,
  CardHeader,
  Link,
  Menu,
  MenuOpenChangeData,
  MenuOpenEvent,
  MenuPopover,
  MenuTrigger,
  ToolbarButton,
} from '@fluentui/react-components';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { NotificationDto } from '../dto/notification.dto';
import notificationsService from '../services/notifications.service';
import { AlertBadgeRegular, AlertRegular } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import { useToast } from '../hooks/use-toast';

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
  }, [setUnreadCount, notifications, setNotifications, setMenuOpen]);

  return (
    <Menu open={menuOpen} onOpenChange={onMenuOpenChange}>
      <MenuTrigger>
        <ToolbarButton icon={unreadCount <= 0 ? <AlertRegular /> : <AlertBadgeRegular />} />
      </MenuTrigger>
      <MenuPopover
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {notifications.map((n) => (
          <Card key={n._id!}>
            <CardHeader header={<>{n.title} - {new Date(Date.parse(n.issuedAt)).toLocaleString()}</>} />
            {n.message}
          </Card>
        ))}
        {unreadCount > 0 && (
          <Link onClick={markAllAsRead} style={{ fontSize: '9px' }}>
            {t('ui.notifications.markAllAsRead')}
          </Link>
        )}
      </MenuPopover>
    </Menu>
  );
};

export default Notifications;
