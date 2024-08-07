import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getUserDetail } from "../api";

const useUser = () => {
    // hook that helps you fetch and manage data
    const { data, isLoading, isError, refetch } = useQuery(
        "user",
        async () => {
            try {
                const userDetails = await getUserDetail();
                return userDetails;
            } catch (error) {
                if (!error.message.includes("not authenticated")) {
                    toast.error("Something Went Wrong...");
                }
            }
        },
        { refetchOnWindowFocus: false }
    );

    return { data, isLoading, isError, refetch };
};

export default useUser;
