import { HomeFilled } from "@fluentui/react-icons";
import ConfirmationButton from "../components/ConfirmationButton";

export const Home = () => {

  return (
    <div test-id="hello">
      hello aolo home !!!!!!!!!!!!!!!<br /> <ConfirmationButton onClick={() => alert(1)} icon={<HomeFilled />}></ConfirmationButton>
    </div>
  );
};

export default Home;
