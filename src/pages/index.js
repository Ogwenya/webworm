import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  router.push("/posts");
};

export default Home;
