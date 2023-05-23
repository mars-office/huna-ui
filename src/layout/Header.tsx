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
} from "@fluentui/react-components";
import { MoreVertical28Regular, InprivateAccount28Regular } from "@fluentui/react-icons";
import { AuthContextProps } from "oidc-react";
import { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export interface HeaderProps {
  auth: AuthContextProps;
}

export const Header = (props: HeaderProps) => {
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    await props.auth.signOut();
    navigate("/");
  }, [props.auth, navigate]);

  const location = useLocation();

  return (
    <Toolbar
      style={{
        justifyContent: "space-between",
        paddingLeft: '0'
      }}
    >
      <Link to="/">
        <Image data-testid="logo" width={42} height={42} src="/images/logo.svg" />
      </Link>

      <Menu>
        <MenuTrigger>
          <ToolbarButton data-testid="usermenu" aria-label="More" icon={props.auth.userData?.profile ? <InprivateAccount28Regular/> : <MoreVertical28Regular />} />
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuGroup>
              <MenuGroupHeader>
                <Text data-testid="userName" size={200}>{props.auth.userData?.profile ? props.auth.userData.profile.name : 'Anonymous'}</Text>
              </MenuGroupHeader>
            </MenuGroup>
            <MenuDivider />
            {!props.auth.userData?.profile && (
              <MenuItem data-testid="loginButton" onClick={() => navigate("/login?returnTo=" + encodeURIComponent(location.pathname))}> Login </MenuItem>
            )}
            {props.auth.userData?.profile && (
              <MenuItem data-testid="logoutButton" onClick={logout}> Logout </MenuItem>
            )}
          </MenuList>
        </MenuPopover>
      </Menu>
    </Toolbar>
  );
};

export default Header;
