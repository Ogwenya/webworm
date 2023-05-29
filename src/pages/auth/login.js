import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Title,
  Button,
  TextInput,
  PasswordInput,
  Alert,
  Center,
  Stack,
} from "@mantine/core";
import { IconLock, IconUser, IconAlertCircle } from "@tabler/icons-react";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    const loginResponse = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (loginResponse.error === null) {
      router.push("/");
    } else {
      setLoading(false);
      setLoginError(loginResponse.error);
    }
  };

  return (
    <Center>
      <Stack style={{ width: 400 }}>
        <Title order={2} fw={800} mb={8} tt="uppercase">
          Login
        </Title>

        <form onSubmit={handleSubmit}>
          {loginError && (
            <Alert title="Error" color="red" radius="md">
              {loginError}
            </Alert>
          )}
          <TextInput
            mt={22}
            placeholder="Your username"
            label="Username"
            radius="md"
            icon={<IconUser size="1.3rem" />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <PasswordInput
            mt={28}
            placeholder="Password"
            label="Password"
            radius="md"
            icon={<IconLock size="1.3rem" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" radius="md" uppercase mt={15} loading={loading}>
            Submit
          </Button>
        </form>
      </Stack>
    </Center>
  );
};

export default Login;
