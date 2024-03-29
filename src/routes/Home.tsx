import { HomeFilled } from "@fluentui/react-icons";
import ConfirmationButton from "../components/ConfirmationButton";
import { useSignalrData } from "../hooks/use-signalr-data";
import { useToast } from "../hooks/use-toast";

export const Home = () => {
  const {toast} = useToast();
  useSignalrData(async (d: any) => {
    console.log(d);
    toast("info", d.message);
  }, [toast]);
  return (
    <div test-id="hello">
      hello aolo home ????<br /> <ConfirmationButton onClick={() => alert(1)} icon={<HomeFilled />}></ConfirmationButton>
    </div>
  );
};

export default Home;
