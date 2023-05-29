import { useState } from "react";
import { useSession } from "next-auth/react";
import {
	useMantineTheme,
	AppShell,
	useMantineColorScheme,
} from "@mantine/core";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

const Layout = ({ children, ...pageProps }) => {
	const { status, data: session } = useSession();
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const theme = useMantineTheme();
	const [opened, setOpened] = useState(false);
	const toggleSidebar = () => {
		setOpened((o) => !o);
	};

	return (
		<AppShell
			padding="md"
			navbar={
				<>
					{status === "authenticated" && (
						<AppSidebar
							opened={opened}
							toggleSidebar={toggleSidebar}
						/>
					)}
				</>
			}
			header={
				<AppHeader
					opened={opened}
					toggleSidebar={toggleSidebar}
					session={session}
				/>
			}
			styles={(theme) => ({
				main: {
					backgroundColor:
						theme.colorScheme === "dark"
							? theme.colors.dark[8]
							: theme.colors.gray[0],
				},
			})}
		>
			{children}
		</AppShell>
	);
};

export default Layout;
