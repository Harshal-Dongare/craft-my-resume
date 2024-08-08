import { ClockLoader } from "react-spinners";

const MainSpinner = () => {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <ClockLoader color="#498FCD" size={100} />
        </div>
    );
};

export default MainSpinner;
