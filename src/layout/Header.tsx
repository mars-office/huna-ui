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
} from '@fluentui/react-components';
import { MoreVertical28Regular, InprivateAccount28Regular } from '@fluentui/react-icons';
import { useAuth } from 'react-oidc-context';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import environment from '../environment';
import VersionDetails from './VersionDetails';

export const Header = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const logout = useCallback(async () => {
    await auth.signoutRedirect();
    navigate('/');
  }, [auth, navigate]);

  const location = useLocation();

  const { t, i18n } = useTranslation();

  const [versionDetailsOpen, setVersionDetailsOpen] = useState(false);

  const checkedLanguages: Record<string, string[]> = useMemo(() => {
    return {
      language: [i18n.language],
    };
  }, [i18n.language]);

  const onLanguageChange: MenuProps['onCheckedValueChange'] = useCallback(
    (_: MenuCheckedValueChangeEvent, data: MenuCheckedValueChangeData) => {
      if (!data.checkedItems) {
        return;
      }
      if (data.checkedItems[0] === i18n.language) {
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
            gap: '1rem',
          }}
        >
          <Link to="/">
            <Image data-testid="logo" width={42} height={42} src="/images/logo.svg" />
          </Link>
          {environment.hunaEnv !== 'prod' && <small>{environment.hunaEnv}</small>}
        </div>

        <Menu>
          <MenuTrigger>
            <ToolbarButton
              data-testid="usermenu"
              aria-label="More"
              icon={
                auth.isAuthenticated ? (
                  <InprivateAccount28Regular />
                ) : (
                  <MoreVertical28Regular />
                )
              }
            />
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuGroup>
                <MenuGroupHeader>
                  <Text data-testid="userName" size={200}>
                    {auth.isAuthenticated
                      ? auth.user?.profile.email
                      : t('ui.header.anonymous')}
                  </Text>
                </MenuGroupHeader>
              </MenuGroup>
              <MenuDivider />
              <LanguageMenu />
              {auth.isAuthenticated && (
                <MenuItem data-testid="settingsButton" onClick={() => navigate('/settings')}>
                  {t('ui.header.settings')}
                </MenuItem>
              )}
              <MenuItem data-testid="versionButton" onClick={() => setVersionDetailsOpen(true)}>
                {t('ui.header.version')}
              </MenuItem>
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
            </MenuList>
          </MenuPopover>
        </Menu>
      </Toolbar>

      <VersionDetails open={versionDetailsOpen} setOpen={setVersionDetailsOpen}></VersionDetails>
    </>
  );
};

export default Header;
