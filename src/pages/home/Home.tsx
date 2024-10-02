import { HomeBackground } from "../../components/ui/homeBackground";
import Card from "../../components/ui/card";
import laptopIcon from "../../assets/laptop.svg";
import passwordIcon from "../../assets/password.svg";
import compuerIcon from "../../assets/computer-settings.svg";
import wifiIcon from "../../assets/wifi.svg";
import lightningIcon from "../../assets/lightning.svg";
const Home = () => {
  return (
    <HomeBackground>
      <div className="flex flex-col gap-12">
        <div className="flex items-center gap-2 opacity-40 justify-center">
          <img src={lightningIcon} alt="icon" className="w-4 h-4" />
          <h1 className="text-[#FFF] font-normal text-[16px]">
            Suggested templates
          </h1>
        </div>

        <div className="flex flex-col gap-3 w-[750px] h-[400px] flex-wrap mx-auto">
          <Card
            title="Seamlessly request and track new equipment approvals"
            icon={laptopIcon}
          />
          <Card
            title="Seamlessly request and track new equipment approvals"
            icon={passwordIcon}
          />
          <Card
            title="Seamlessly request and track new equipment approvals"
            icon={laptopIcon}
          />
          <Card
            title="Seamlessly request and track new equipment approvals"
            icon={compuerIcon}
          />
          <Card
            title="Seamlessly request and track new equipment approvals"
            icon={wifiIcon}
          />
          <Card
            title="Seamlessly request and track new equipment approvals"
            icon={laptopIcon}
          />
        </div>
      </div>
    </HomeBackground>
  );
};

export default Home;
