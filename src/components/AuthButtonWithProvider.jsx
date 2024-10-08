import { FaChevronRight } from "react-icons/fa6";
import {
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "../config/firebase.config";
import { toast } from "react-toastify";

const AuthButtonWithProvider = ({ Icon, label, provider }) => {
    const googleAuthProvider = new GoogleAuthProvider();
    const githubAuthProvider = new GithubAuthProvider();

    // function to handle authentication
    const handleClick = async () => {
        switch (provider) {
            case "GoogleAuthProvider":
                await signInWithPopup(auth, googleAuthProvider)
                    // console.log(result);
                    .then((result) => {
                        toast.success(
                            "Successfully Logged In, refresh the page..."
                        );
                    })
                    .catch((error) => {
                        toast.error(`Error: ${error.message}`);
                    });
                break;

            case "GithubAuthProvider":
                await signInWithPopup(auth, githubAuthProvider)
                    .then((result) => {
                        // console.log(result);
                        toast.success(
                            "Successfully Logged In, refresh the page..."
                        );
                    })
                    .catch((error) => {
                        console.log(`Error: ${error.message}`);
                    });
                break;

            default:
                await signInWithPopup(auth, googleAuthProvider)
                    .then((result) => {
                        // console.log(result);
                        toast.success(
                            "Successfully Logged In, Refresh the page..."
                        );
                    })
                    .catch((error) => {
                        console.log(`Error: ${error.message}`);
                    });
                break;
        }
    };
    return (
        <div
            onClick={handleClick}
            className="w-full px-4 py-3 rounded-md border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md"
        >
            <Icon className="text-txtPrimary text-xl group-hover:text-white" />
            <p className="text-txtPrimary text-lg group-hover:text-white">
                {label}
            </p>
            <FaChevronRight className="text-txtPrimary text-base group-hover:text-white" />
        </div>
    );
};

export default AuthButtonWithProvider;
