import {
  Toolbar,
  ToolbarButton,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Image,
  MenuDivider,
  MenuGroup,
  MenuGroupHeader,
  Text,
  MenuItemRadio,
  MenuProps,
  MenuCheckedValueChangeEvent,
  MenuCheckedValueChangeData,
  Button,
} from '@fluentui/react-components';
import {
  MoreVertical28Regular,
  NavigationRegular,
  PersonFilled,
} from '@fluentui/react-icons';
import { useAuth } from 'react-oidc-context';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import environment from '../environment';
import { VERSION } from '../version';
import { useStore } from '../hooks/use-store';
import { userProfileStore } from '../stores/user-profile.store';
import Notifications from './Notifications';
import { AppTheme } from '../models/app-theme';
import pushService from '../services/push.service';

export interface HeaderProps {
  menuClick?: () => void;
  onSwitchTheme: (theme: AppTheme) => void;
  appTheme: AppTheme;
}

export const Header = (props: HeaderProps) => {
  const navigate = useNavigate();
  const auth = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userProfile, _] = useStore(userProfileStore);

  const logout = useCallback(async () => {
    try {
      await pushService.unsubscribe();
    } catch (err: any) {
      // ignored
      console.error(err);
    }
    await auth.removeUser();
    navigate('/');
  }, [auth, navigate]);

  const location = useLocation();

  const { t, i18n } = useTranslation();

  const checkedLanguages: Record<string, string[]> = useMemo(() => {
    return {
      language: [i18n.language],
    };
  }, [i18n.language]);

  const checkedThemes: Record<string, string[]> = useMemo(() => {
    return {
      theme: [props.appTheme],
    };
  }, [props.appTheme]);

  const onThemeChange: MenuProps['onCheckedValueChange'] = useCallback(
    (_: MenuCheckedValueChangeEvent, data: MenuCheckedValueChangeData) => {
      if (!data.checkedItems) {
        return;
      }
      props.onSwitchTheme(data.checkedItems[0] as AppTheme);
    },
    [props.onSwitchTheme],
  );

  const onMenuClicked = useCallback(() => {
    if (props.menuClick) {
      props.menuClick();
    }
  }, [props]);

  const onLanguageChange: MenuProps['onCheckedValueChange'] = useCallback(
    (_: MenuCheckedValueChangeEvent, data: MenuCheckedValueChangeData) => {
      if (!data.checkedItems) {
        return;
      }
      i18n.changeLanguage(data.checkedItems[0]);
    },
    [i18n],
  );

  const LanguageMenu = useCallback(() => {
    return (
      <Menu onCheckedValueChange={onLanguageChange} checkedValues={checkedLanguages}>
        <MenuTrigger>
          <MenuItem>{t('ui.header.language')}</MenuItem>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuGroup>
              <MenuGroupHeader>{t('ui.header.language')}</MenuGroupHeader>
              {environment.i18n.languages.map((l) => (
                <MenuItemRadio value={l.code} name="language" key={l.code}>
                  {l.name}
                </MenuItemRadio>
              ))}
            </MenuGroup>
          </MenuList>
        </MenuPopover>
      </Menu>
    );
  }, [t, checkedLanguages, onLanguageChange]);

  const ThemeMenu = useCallback(() => {
    return (
      <Menu onCheckedValueChange={onThemeChange} checkedValues={checkedThemes}>
        <MenuTrigger>
          <MenuItem>{t('ui.header.theme')}</MenuItem>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuGroup>
              <MenuGroupHeader>{t('ui.header.theme')}</MenuGroupHeader>
              <MenuItemRadio value="auto" name="theme">
                  {t('ui.theme.auto')}
              </MenuItemRadio>
              <MenuItemRadio value="light" name="theme">
                  {t('ui.theme.light')}
              </MenuItemRadio>
              <MenuItemRadio value="dark" name="theme">
                  {t('ui.theme.dark')}
              </MenuItemRadio>
            </MenuGroup>
          </MenuList>
        </MenuPopover>
      </Menu>
    );
  }, [t, checkedThemes, onThemeChange]);

  return (
    <>
      <Toolbar
        style={{
          justifyContent: 'space-between',
          paddingLeft: '0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button onClick={onMenuClicked} appearance="transparent" icon={<NavigationRegular />} />
          <Link to="/">
            <Image data-testid="logo" width={42} height={42} src="/images/logo.svg" />
          </Link>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Notifications />
          <Menu>
            <MenuTrigger>
              <ToolbarButton
                data-testid="usermenu"
                aria-label="More"
                icon={
                  auth.isAuthenticated ? <PersonFilled /> : <MoreVertical28Regular />
                }
              />
            </MenuTrigger>

            <MenuPopover>
              <MenuList>
                <MenuGroup>
                  <MenuGroupHeader>
                    <Text data-testid="userName" size={200}>
                      {auth.isAuthenticated
                        ? auth.user?.profile.email + (userProfile?.isAdmin ? ' (admin)' : '')
                        : t('ui.header.anonymous')}
                    </Text>
                  </MenuGroupHeader>
                </MenuGroup>
                <MenuDivider />
                <LanguageMenu />
                <ThemeMenu />
                {auth.isAuthenticated && (
                  <MenuItem data-testid="settingsButton" onClick={() => navigate('/settings')}>
                    {t('ui.header.settings')}
                  </MenuItem>
                )}
                {!auth.isAuthenticated && (
                  <MenuItem
                    data-testid="loginButton"
                    onClick={() =>
                      navigate('/login?returnTo=' + encodeURIComponent(location.pathname))
                    }
                  >
                    {t('ui.header.login')}
                  </MenuItem>
                )}
                {auth.isAuthenticated && (
                  <MenuItem data-testid="logoutButton" onClick={logout}>
                    {t('ui.header.logout')}
                  </MenuItem>
                )}
                <MenuItem data-testid="tosButton" onClick={() => navigate('/tos')}>
                  {t('ui.header.tos')}
                </MenuItem>
                <MenuItem data-testid="versionButton" disabled={true}>
                  {VERSION}
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </Toolbar>
    </>
  );
};

export default Header;
