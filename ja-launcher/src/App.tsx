import "./css/App.css";
import "./css/text.css";
import Button from "./ui/base/Button/Button";
import LeftBar from "./ui/modules/LeftBar/LeftBar";
import NewsBlock from "./ui/modules/NewsBlock/NewsBlock";
import ProgressBar from "./ui/modules/ProgressBar/ProgressBar";
import TopBar from "./ui/modules/TopBar/TopBar";
import { CgMenu } from "react-icons/cg";

const App = () => {
    return (
        <div className="h-screen w-full bg-[url(/src/assets/base_bg.jpg)] bg-center bg-no-repeat bg-cover ">
            <TopBar />
            <LeftBar />
            <div className="absolute bottom-0 right-0 my-10 z-10 flex flex-nowrap justify-end place-items-center gap-20 w-[90%]">
                <ProgressBar progress={66} style=""/>
                <div className="bg-transparent rounded-full overflow-hidden w-fit h-fit mr-10">
                    <div className="rounded-full shadow-inner border border-gray-500 flex">
                        <Button color="yellow" style="hover:bg-[#cccc00] cursor-pointer transition duration-150">Install game blob lbob</Button>
                        <Button color="yellow" style="hover:bg-[#cccc00] cursor-pointer transition duration-150">
                            <CgMenu className="w-[24px] h-[24px]"/>
                        </Button>
                    </div>
                </div>
            </div>
            <NewsBlock />

            <div className="absolute w-full h-[512px] bottom-0 right-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] from-25%" />
                <div
                    className="absolute inset-0 bg-[url('/src/assets/heights.png')] bg-no-repeat bg-cover bg-bottom"
                    style={{
                        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
                        maskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))"
                    }}
                />
            </div>
        </div>
    );
}

export default App;
