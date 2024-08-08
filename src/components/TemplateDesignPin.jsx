import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInOutWithOpacity, scaleInOut } from "../animation";
import {
    BiFolderPlus,
    BiHeart,
    BiSolidFolder,
    BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import { saveToCollection, saveToFavourites } from "../api";
import useTemplate from "../hooks/useTemplate";
import { useNavigate } from "react-router-dom";

const TemplateDesignPin = ({ data, index }) => {
    const navigate = useNavigate();
    const { data: user, refetch: userRefetch } = useUser();
    const { refetch: tempRefetch } = useTemplate();

    //? state to show overlay menu
    const [isHoverred, setIsHoverred] = useState(false);

    //? function to add/remove template to user collection
    const addToCollection = async (e) => {
        e.stopPropagation();

        // method
        await saveToCollection(user, data);
        userRefetch();
    };

    //? function to add/remove template to template favorites
    const addToFavorites = async (e) => {
        e.stopPropagation();

        // method
        await saveToFavourites(user, data);
        tempRefetch();
    };

    //? function to route to the specific template page
    const handleRouteNavigation = () => {
        navigate(`/resumeDetail/${data?._id}`, { replace: true });
    };

    return (
        <motion.div key={data?._id} {...scaleInOut(index)}>
            <div
                onMouseEnter={() => setIsHoverred(true)}
                onMouseLeave={() => setIsHoverred(false)}
                className="relative w-full h-full xs:w-[180px] xs:h-[250px] sm:w-[200px] sm:h-[280px] md:w-[230px] md:h-[320px] lg:w-[250px] lg:h-[300px] 2xl:w-[300px] 2xl:h-[350px] rounded-md bg-gray-200 overflow-hidden "
            >
                <img
                    src={data?.imgURL}
                    alt="template"
                    className="w-full h-full object-cover"
                />

                {/* Overlay Section */}
                <AnimatePresence>
                    {isHoverred && (
                        <motion.div
                            {...fadeInOutWithOpacity}
                            onClick={handleRouteNavigation}
                            className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer"
                        >
                            <div className="flex flex-col items-end justify-start w-full gap-8">
                                {/* Collection Option */}
                                <InnerOverlayCardMenu
                                    label={
                                        user?.collections?.includes(data?._id)
                                            ? "Added To Collection"
                                            : "Add To Collection"
                                    }
                                    Icon={
                                        user?.collections?.includes(data?._id)
                                            ? BiSolidFolder
                                            : BiFolderPlus
                                    }
                                    onHandle={addToCollection}
                                />

                                {/* Favourites Option */}
                                <InnerOverlayCardMenu
                                    label={
                                        data?.favourites?.includes(user?.uid)
                                            ? "Added To Favourites"
                                            : "Add To Favourites"
                                    }
                                    Icon={
                                        data?.favourites?.includes(user?.uid)
                                            ? BiSolidHeart
                                            : BiHeart
                                    }
                                    onHandle={addToFavorites}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// overlay Card menu Component
const InnerOverlayCardMenu = ({ label, Icon, onHandle }) => {
    const [isHoverred, setIsHoverred] = useState(false);
    return (
        <div
            onMouseEnter={() => setIsHoverred(true)}
            onMouseLeave={() => setIsHoverred(false)}
            onClick={onHandle}
            className="relative w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md"
        >
            {/* Icon */}
            <Icon className="text-txtPrimary text-base" />

            {/* Tooltip */}
            <AnimatePresence>
                {isHoverred && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.6, x: 50 }}
                        className="absolute -left-32 px-3 py-2 rounded-md bg-gray-200 after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[13px] after:rotate-45"
                    >
                        <p className="text-[10px] text-txtPrimary whitespace-nowrap">
                            {label}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TemplateDesignPin;
