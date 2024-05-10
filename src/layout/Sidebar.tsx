import {
  Button,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  MenuDivider,
  MenuGroup,
  MenuGroupHeader,
  MenuItem,
  MenuList,
  OverlayDrawer,
} from '@fluentui/react-components';
import { Dismiss24Regular, HomeFilled, BoardFilled } from '@fluentui/react-icons';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useStore } from '../hooks/use-store';
import { userProfileStore } from '../stores/user-profile.store';

export interface SidebarProps {
  open: boolean;
  dismissed?: () => void;
}

export const Sidebar = (props: SidebarProps) => {
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userProfile, _] = useStore(userProfileStore);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open && props.dismissed) {
        props.dismissed();
      }
    },
    [props],
  );

  const onCloseClick = useCallback(() => {
    if (props.dismissed) {
      props.dismissed();
    }
  }, [props]);

  return (
    <OverlayDrawer
      position="start"
      open={props.open}
      onOpenChange={(_, { open }) => onOpenChange(open)}
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={<Button appearance="subtle" onClick={onCloseClick} icon={<Dismiss24Regular />} />}
        >
          {t('ui.sidebar.menu')}
        </DrawerHeaderTitle>
      </DrawerHeader>

      <DrawerBody>
        <MenuList hasIcons={true}>
          <MenuGroup>
            <MenuGroupHeader>{t('ui.sidebar.app')}</MenuGroupHeader>
            <NavLink
              onClick={onCloseClick}
              to="/"
              end
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              <MenuItem icon={<HomeFilled />}>{t('ui.sidebar.home')}</MenuItem>
            </NavLink>
          </MenuGroup>

          {userProfile?.isAdmin && (
            <>
              <MenuDivider />
              <MenuGroup>
                <MenuGroupHeader>{t('ui.sidebar.admin')}</MenuGroupHeader>
                <NavLink
                  onClick={onCloseClick}
                  end
                  to="/admin/dashboard"
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                >
                  <MenuItem icon={<BoardFilled />}>{t('ui.sidebar.dashboard')}</MenuItem>
                </NavLink>
              </MenuGroup>
            </>
          )}
        </MenuList>
      </DrawerBody>
    </OverlayDrawer>
  );
};

export default Sidebar;
