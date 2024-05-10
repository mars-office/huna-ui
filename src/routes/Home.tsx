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
      hehehe<br /> asdasdasd
    </div>
  );
};

export default Home;
