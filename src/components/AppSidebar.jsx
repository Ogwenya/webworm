import { useState } from "react";
import Link from "next/link";
import {
  Navbar,
  NavLink,
  ThemeIcon,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import {
  IconLayoutDashboard,
  IconArticle,
  IconCamera,
  IconPencil,
  IconList,
  IconSettings,
} from "@tabler/icons-react";

const SidebarItems = [
  { name: "Dashboard", link: "/", icon: IconLayoutDashboard },
  {
    name: "Posts",
    link: "/posts",
    icon: IconArticle,
  },
  {
    name: "Media",
    link: "/media",
    icon: IconCamera,
  },
  {
    name: "Privacy Policy",
    link: "/policy",
    icon: IconPencil,
  },
  {
    name: "Terms & Conditions",
    link: "/terms",
    icon: IconList,
  },
  {
    name: "Settings",
    link: "/settings",
    icon: IconSettings,
  },
];

const useStyles = createStyles((theme) => ({
  linkActive: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[2],
  },
}));

const AppSidebar = ({ toggleSidebar, opened }) => {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const [navLinkactive, setNavLinkActive] = useState("");

  return (
    <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200 }}>
      {SidebarItems.map((item) => (
        <Link href={item.link} key={item.name}>
          <NavLink
            className={cx(classes.link, {
              [classes.linkActive]: navLinkactive === item.name,
            })}
            label={item.name}
            active={item.name === navLinkactive}
            icon={
              <ThemeIcon>{<item.icon size="1.3rem" stroke={1.5} />}</ThemeIcon>
            }
            onClick={() => {
              toggleSidebar;
              setNavLinkActive(item.name);
            }}
          ></NavLink>
        </Link>
      ))}
    </Navbar>
  );
};

export default AppSidebar;
