import { Link } from "react-router-dom";
import useUser from "../hooks/useUser";
import { Logo } from "../assets";
import { AnimatePresence } from "framer-motion";
import { PuffLoader } from "react-spinners";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { HiLogout } from "react-icons/hi";
import { fadeInOutWithOpacity, slideUpDownMenu } from "../animation";
import { auth } from "../config/firebase.config";
import { useQueryClient } from "react-query";
import { adminIds } from "../utils/helpers";

const Header = () => {
    const { data, isLoading, isError } = useUser();
    const [isMenu, setIsMenu] = useState(false);

    const queryClient = useQueryClient();

    // function to logout user
    const signOutUser = async () => {
        await auth.signOut().then(() => {
            queryClient.setQueryData("user", null);
        });
    };

    return (
        <header className="w-full flex items-center justify-between px-3 py-2 lg:px-5 border-b border-gray-300 bg-bgPrimary z-50 gap-1 md:gap-12 sticky top-0">
            {/* logo */}
            <Link to={"/"}>
                <img src={Logo} className="w-8 h-auto object-contain" />
            </Link>

            {/* input */}
            <div className="flex-1 border border-gray-300 px-4 py-1 rounded-md flex items-center justify-between bg-gray-200">
                <input
                    type="text"
                    placeholder="Search here..."
                    className="flex-1 h-4 sm:h-8 bg-transparent text-xs sm:text-base font-semibold outline-none border-none"
                />
            </div>

            {/* profile section */}
            <AnimatePresence>
                {isLoading ? (
                    <PuffLoader color="#498FCD" size={30} />
                ) : (
                    <React.Fragment>
                        {data ? (
                            <motion.div
                                {...fadeInOutWithOpacity}
                                className="relative"
                                onClick={() => setIsMenu(!isMenu)}
                            >
                                {/* profile image */}
                                {data?.photoURL ? (
                                    <div className="w-10 h-10 relative rounded-md flex items-center justify-center sm:border-2 border-gray-300 cursor-pointer">
                                        <img
                                            src={data?.photoURL}
                                            referrerPolicy="no-referrer"
                                            alt="User-image"
                                            className="w-7 h-7 sm:w-full sm:h-full object-cover rounded-md"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 relative rounded-md flex items-center justify-center border-2 border-gray-300 bg-blue-700 shadow-md cursor-pointer">
                                        <p className="text-md text-white">
                                            {data?.email[0].toUpperCase()}
                                        </p>
                                    </div>
                                )}

                                {/* profile dropdown menu */}
                                <AnimatePresence>
                                    {isMenu && (
                                        <motion.div
                                            {...slideUpDownMenu}
                                            className="absolute px-3 py-3 rounded-md bg-white right-0 top-12 flex flex-col items-center justify-center gap-3 w-40 pt-5"
                                            onMouseLeave={() =>
                                                setIsMenu(false)
                                            }
                                        >
                                            {/* Profile Image */}
                                            {data?.photoURL ? (
                                                <div className="w-16 h-16  flex flex-col items-center justify-center border-2 border-gray-300 rounded-full cursor-pointer">
                                                    <img
                                                        src={data?.photoURL}
                                                        referrerPolicy="no-referrer"
                                                        alt="User-image"
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-300 bg-blue-700 shadow-md cursor-pointer">
                                                    <p className="text-md text-white">
                                                        {data?.email[0].toUpperCase()}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Name */}
                                            {data?.displayName && (
                                                <p className="text-md pb-2 text-txtDark text-xs border-b-2 w-full text-center">
                                                    {data?.displayName}
                                                </p>
                                            )}

                                            {/* Menu Options */}
                                            <div className="w-full flex flex-col items-start gap-4 pt-2 text-xs">
                                                <Link
                                                    className="text-txtLight whitespace-nowrap hover:text-txtDark"
                                                    to={"/profile"}
                                                >
                                                    My Account
                                                </Link>
                                                {adminIds.includes(
                                                    data?.uid
                                                ) && (
                                                    <Link
                                                        className="text-txtLight whitespace-nowrap hover:text-txtDark"
                                                        to={"/template/create"}
                                                    >
                                                        Add New Template
                                                    </Link>
                                                )}

                                                {/* Logout */}
                                                <div
                                                    className="w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group cursor-pointer"
                                                    onClick={signOutUser}
                                                >
                                                    <p className="group-hover:text-txtDark text-txtLight">
                                                        Sign Out
                                                    </p>
                                                    <HiLogout className="group-hover:text-txtDark text-txtLight" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <Link to={"/auth"}>
                                <motion.button
                                    className="px-4 py-1 rounded-md border border-gray-300 bg-gray-300 hover:shadow-md active:scale-90 duration-150"
                                    type="button"
                                    {...fadeInOutWithOpacity}
                                >
                                    Login
                                </motion.button>
                            </Link>
                        )}
                    </React.Fragment>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
