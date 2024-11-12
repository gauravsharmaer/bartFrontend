import Loader from "../assets/loader.svg"

const Preload: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-[#222222] flex justify-center items-center">
            <img src={Loader} alt="Loader" className="w-20 h-20" />
        </div>
    );
};

export default Preload;

// CSS styles
