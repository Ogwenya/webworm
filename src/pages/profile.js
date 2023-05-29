import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Center,
  Flex,
  Box,
  Group,
  Loader,
  Title,
  Text,
  Paper,
  Grid,
  Alert,
  PasswordInput,
  TextInput,
  Button,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const Profile = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 50em)");
  const { status, data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const password = useRef("");
  const confirmPassword = useRef("");

  useEffect(() => {
    if (status === "authenticated") {
      setFirstName(session.user.firstname);
      setLastName(session.user.lastname);
      setUserName(session.user.username);
      setEmail(session.user.email);
    }
  }, [status]);

  //   send data to API
  const submitData = async (update, data) => {
    const apiUrl = `/api/users/${session.user.id}?update=${update}`;

    const res = await fetch(apiUrl, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (result.success) {
      setLoading(false);
      setAlertMessage({
        type: "success",
        category: update,
        message: result.success,
      });

      if (result.user) {
        updateSession(result.user);
      }
    }
    if (result.error) {
      setLoading(false);
      setAlertMessage({
        type: "error",
        category: update,
        message: result.error,
      });
    }
  };

  // #########################################
  // ########## CHANGE USER DETAILS ##########
  // #########################################
  const handleChangeDetails = async (e) => {
    e.preventDefault();

    // reset alert messages
    setAlertMessage(null);

    if (
      firstname === "" ||
      lastname === "" ||
      username === "" ||
      email === ""
    ) {
      setAlertMessage({
        type: "error",
        category: "details",
        message: "Please fill all the details",
      });
    } else {
      setLoading(true);
      setAlertMessage({
        type: "info",
        category: "details",
        message: "saving user info.",
      });
      const userDetails = {
        firstname,
        lastname,
        username,
        email,
      };

      submitData("details", userDetails);
    }
  };

  // #####################################
  // ########## CHANGE PASSWORD ##########
  // #####################################
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // reset alert messages
    setAlertMessage(null);

    if (password.current === "" || confirmPassword.current === "") {
      setAlertMessage({
        type: "error",
        category: "password",
        message: "Please fill all the details",
      });
    } else if (password.current.length < 6) {
      setAlertMessage({
        type: "error",
        category: "password",
        message: "Password must be at least 6 characters long",
      });
    } else if (password.current !== confirmPassword.current) {
      setAlertMessage({
        type: "error",
        category: "password",
        message: "Passwords do not match",
      });
    } else {
      setLoading(true);
      setAlertMessage({
        type: "info",
        category: "password",
        message: "Changing password.",
      });

      submitData("password", {
        password: password.current,
        confirmPassword: confirmPassword.current,
      });
    }
  };

  // alert component
  const RenderAlert = ({ alertObj }) => {
    return (
      <Alert
        color={
          alertObj.type === "info"
            ? "cyan"
            : alertObj.type === "error"
            ? "red"
            : "green"
        }
        radius="md"
      >
        {alertObj.message}
      </Alert>
    );
  };

  // header component
  const header = (
    <Paper shadow="xs" p="md" mb={30}>
      <Title order={2}>User Profile</Title>
    </Paper>
  );

  //   page loaders
  if (router.isFallback) {
    return (
      <>
        {header}
        <Center>
          <Loader variant="bars" />
        </Center>
      </>
    );
  }

  if (status === "loading") {
    return (
      <>
        {header}
        <Center>
          <Loader variant="bars" />
        </Center>
      </>
    );
  }

  return (
    <>
      {status === "authenticated" && (
        <>
          {header}
          <Grid columns={5}>
            {/* 
                COLUMN 1: - Avatar picture and Name
                          - change password form 
            */}
            <Grid.Col xs={2}>
              {/* ##################################### */}
              {/* ########## PROFILE PICTURE ########## */}
              {/* ##################################### */}
              <Paper shadow="xs" p="md">
                <Flex justify="center" align="center" gap="md" wrap="wrap">
                  <Box>
                    <svg
                      id="Layer_1"
                      data-name="Layer 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 122.88 110.92"
                      width="10rem"
                      height="10rem"
                      fill="currentColor"
                    >
                      <title>name</title>
                      <path d="M37.9,57C35.84,53.76,32,49.31,32,45.46a6.2,6.2,0,0,1,4.16-5.63c-.19-3.24-.32-6.54-.32-9.81,0-1.93,0-3.88.11-5.79a18.91,18.91,0,0,1,.65-3.59,20.64,20.64,0,0,1,9.21-11.7,27,27,0,0,1,5-2.39C54,5.4,52.42.07,55.89,0,64-.21,77.33,7.21,82.53,12.84a20.58,20.58,0,0,1,5.31,13.34l-.33,14.2a4.66,4.66,0,0,1,3.41,2.91c1.11,4.49-3.54,10.06-5.7,13.63-2,3.29-9.62,13.93-9.62,14a2.81,2.81,0,0,0,.68,1.65c11.83,16.26,46.6,6,46.6,38.34H0C0,78.56,34.78,88.84,46.6,72.58c.58-.85.85-1.32.84-1.69,0-.21-8.76-12.6-9.54-13.85Z" />
                    </svg>
                  </Box>
                  <Box>
                    <Title order={5}>
                      {session.user.firstname} {session.user.lastname}
                    </Title>
                    <Text className="font-normal text-gray-500">
                      WebWorm Admin
                    </Text>
                  </Box>
                </Flex>
              </Paper>

              {/************************************************************/}
              {/******************* CHANGE USER PASSWORD *******************/}
              {/************************************************************/}
              <Paper shadow="xs" p="md" mt={30} mb={30}>
                <Title order={3} mb={20} fz="md">
                  Change Password
                </Title>

                <form onSubmit={handleChangePassword}>
                  {/*alerts*/}
                  {alertMessage && alertMessage.category === "password" && (
                    <RenderAlert alertObj={alertMessage} />
                  )}

                  <PasswordInput
                    mt={22}
                    placeholder="Password"
                    label="Password"
                    radius="md"
                    onChange={(e) => (password.current = e.target.value)}
                    required
                  />

                  <PasswordInput
                    mt={22}
                    placeholder="Confirm New Password"
                    label="Confirm New Password"
                    radius="md"
                    onChange={(e) => (confirmPassword.current = e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    radius="md"
                    uppercase
                    mt={22}
                    loading={loading}
                  >
                    Change Password
                  </Button>
                </form>
              </Paper>
            </Grid.Col>

            {/* 
                COLUMN 2: - CHANGE USER DETAILS
            */}

            <Grid.Col xs={3}>
              <Paper shadow="xs" p="md" mb={30}>
                <Title order={3} mb={20} fz="md">
                  User Details
                </Title>

                {alertMessage && alertMessage.category === "details" && (
                  <RenderAlert alertObj={alertMessage} />
                )}

                <Group grow={!isMobile}>
                  <TextInput
                    mt={22}
                    placeholder="First Name"
                    label="First Name"
                    radius="md"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{ width: isMobile ? "100%" : "auto" }}
                  />

                  <TextInput
                    mt={22}
                    placeholder="Last Name"
                    label="Last Name"
                    radius="md"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{ width: isMobile ? "100%" : "auto" }}
                  />
                </Group>

                <Group grow={!isMobile}>
                  <TextInput
                    mt={22}
                    type="email"
                    placeholder="User Email"
                    label="Email"
                    radius="md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: isMobile ? "100%" : "auto" }}
                  />

                  <TextInput
                    mt={22}
                    placeholder="Username"
                    label="Username"
                    radius="md"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    style={{
                      width: isMobile ? "100%" : "auto",
                      fontWeight: "Bold",
                    }}
                  />
                </Group>

                <Button
                  type="submit"
                  radius="md"
                  uppercase
                  mt={22}
                  loading={loading}
                  onClick={handleChangeDetails}
                >
                  Save Changes
                </Button>
              </Paper>
            </Grid.Col>
          </Grid>
        </>
      )}
    </>
  );
};

export default Profile;
