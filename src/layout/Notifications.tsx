import { Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, ToolbarButton } from "@fluentui/react-components";
import { AlertRegular } from "@fluentui/react-icons";

export const Notifications = () => {
  return <Menu>
    <MenuTrigger>
      <ToolbarButton icon={<AlertRegular />} />
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem>notifications</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
}

export default Notifications;