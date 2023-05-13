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
import { Link, useNavigate } from "react-router-dom";

export interface HeaderProps {
  auth: AuthContextProps;
}

export const Header = (props: HeaderProps) => {
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    await props.auth.signOut();
    navigate("/");
  }, [props.auth, navigate]);

  return (
    <Toolbar
      style={{
        justifyContent: "space-between",
      }}
      aria-label="Default"
    >
      <Link to="/">
        <Image width={42} height={42} src="/images/logo.png" />
      </Link>

      <Menu>
        <MenuTrigger>
          <ToolbarButton aria-label="More" icon={props.auth.userData?.profile ? <InprivateAccount28Regular/> : <MoreVertical28Regular />} />
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuGroup>
              <MenuGroupHeader>
                <Text size={200}>{props.auth.userData?.profile ? props.auth.userData.profile.name : 'Anonymous'}</Text>
              </MenuGroupHeader>
            </MenuGroup>
            <MenuDivider />
            {!props.auth.userData?.profile && (
              <MenuItem onClick={() => navigate("/login")}> Login </MenuItem>
            )}
            {props.auth.userData?.profile && (
              <MenuItem onClick={logout}> Logout </MenuItem>
            )}
          </MenuList>
        </MenuPopover>
      </Menu>
    </Toolbar>
  );
};

export default Header;
