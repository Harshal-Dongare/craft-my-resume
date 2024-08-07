import { Logo } from "../assets";
import { Footer } from "../containers";
import { AuthButtonWithProvider, MainSpinner } from "../components";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Authentication = () => {
    const { data, isLoading, isError } = useUser();

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && data) {
            navigate("/", { replace: true });
        }
    }, [isLoading, data]);

    if (isLoading) {
        return <MainSpinner />;
    }

    return (
        <div className="auth-section">
            {/* Header section of Authentication */}
            <img src={Logo} className="w-12 h-auto object-contain" />

            {/* Main Section of Authentication */}
            <div className="w-full flex flex-1 flex-col items-center justify-center gap-6">
                <h1 className="text-3xl lg:text-4xl text-blue-700">
                    Welcome to Craft My Resume
                </h1>
                <p className="text-base text-gray-600">
                    Your Ultimate Resume Destination
                </p>
                <h2 className="text-2xl text-gray-600">Authenticate</h2>

                {/* Authentication Links */}
                <div className="w-full lg:w-96 rounded-md p-2 flex flex-col items-center justify-center gap-6">
                    <AuthButtonWithProvider
                        Icon={FaGoogle}
                        label={"Sign in with Google"}
                        provider={"GoogleAuthProvider"}
                    />
                    <AuthButtonWithProvider
                        Icon={FaGithub}
                        label={"Sign in with GitHub"}
                        provider={"GithubAuthProvider"}
                    />
                </div>
            </div>

            {/* Footer section of Authentication */}
            <Footer />
        </div>
    );
};

export default Authentication;
