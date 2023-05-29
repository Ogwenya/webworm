import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  useMantineColorScheme,
  useMantineTheme,
  Header,
  Flex,
  Burger,
  MediaQuery,
  Image,
  Title,
  Menu,
  Avatar,
  Group,
  ActionIcon,
} from "@mantine/core";
import {
  IconUser,
  IconLogout,
  IconSun,
  IconMoonStars,
} from "@tabler/icons-react";

const AppHeader = ({ opened, session, toggleSidebar }) => {
  const theme = useMantineTheme();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <Flex
        justify="space-between"
        align="center"
        direction="row"
        wrap="nowrap"
      >
        {/* #################################################*/}
        {/* ######### hamburger MENU AND LOGO/TITLE #########*/}
        {/* #################################################*/}
        <Flex gap="md" align="center" direction="row">
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={toggleSidebar}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
          <Link href="/">
            <Flex gap="md" align="center" direction="row">
              <Image width={35} src="/logo.png" alt="WebWorm Logo" />
              <Title order={2}>WebWorm</Title>
            </Flex>
          </Link>
        </Flex>

        {/* ##############################################*/}
        {/* ######### MENU ITEM AND THEME TOGGLE #########*/}
        {/* ##############################################*/}
        <Flex align="center" direction="row" gap="sm">
          {/* MENU ITEM */}
          <>
            {session && (
              <Menu>
                <Menu.Target>
                  <Avatar radius="xl" style={{ cursor: "pointer" }} />
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item>
                    {session.user.firstname} {session.user.lastname}
                  </Menu.Item>
                  <Menu.Item icon={<IconUser size={15} />}>
                    <Link href="/profile">Profile</Link>
                  </Menu.Item>
                  <Menu.Item
                    icon={<IconLogout size={15} />}
                    onClick={() => signOut()}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </>

          {/* ######################################### */}
          {/* ############### THEME TOGGLE ############ */}
          {/* ######################################### */}

          <Group position="center">
            <ActionIcon
              onClick={() => toggleColorScheme()}
              size="lg"
              sx={(theme) => ({
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.yellow[4]
                    : theme.colors.blue[6],
              })}
            >
              {colorScheme === "dark" ? (
                <IconSun size="1.2rem" />
              ) : (
                <IconMoonStars size="1.2rem" />
              )}
            </ActionIcon>
          </Group>
        </Flex>
      </Flex>
    </Header>
  );
};

export default AppHeader;
