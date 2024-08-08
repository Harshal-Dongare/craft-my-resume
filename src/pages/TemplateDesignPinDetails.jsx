import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getTemplateDetails, saveToCollection, saveToFavourites } from "../api";
import { MainSpinner, TemplateDesignPin } from "../components";
import { FaHouse } from "react-icons/fa6";
import {
    BiHeart,
    BiSolidFolder,
    BiSolidFolderPlus,
    BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import useTemplate from "../hooks/useTemplate";
import { AnimatePresence } from "framer-motion";

const TemplateDesignPinDetails = () => {
    //? Get template ID from URL
    const { templateID } = useParams();

    const { data: user, refetch: userRefetch } = useUser();
    const { data: templates, refetch: tempRefetch } = useTemplate();

    //? Internal hook to fetch template details
    const { data, isError, isLoading, refetch } = useQuery(
        ["template", templateID],
        () => getTemplateDetails(templateID)
    );

    //? function to add/remove template to user collection
    const addToCollection = async (e) => {
        e.stopPropagation();

        // method
        await saveToCollection(user, data);
        userRefetch();
    };

    //? function to add/remove user to template favorites
    const addToFavorites = async (e) => {
        e.stopPropagation();

        // method
        await saveToFavourites(user, data);
        tempRefetch();
        refetch();
    };

    //? Show loader while template is being fetched
    if (isLoading) {
        return <MainSpinner />;
    }

    //? Error Handling
    if (isError) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center">
                <p className="text-lg text-txtPrimary font-semibold">
                    Error while fetching the data...please try again later
                </p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center justify-start px-4 py-12 ">
            {/* BreadCrumb Trail section */}
            <div className="w-full flex items-center pb-8 gap-2">
                <Link
                    to={"/"}
                    className="flex items-center justify-center gap-2 text-txtPrimary"
                >
                    <FaHouse />
                    Home
                </Link>
                <p>/</p>
                <p>{data?.name}</p>
            </div>

            {/* Main Section Layout: Template Details */}
            <div className="w-full xs:px-14 lg:px-44 grid grid-cols-1 sm:grid-cols-12 md:grid-cols-12 gap-4">
                {/* Left Section */}
                <div className="col-span-1 sm:col-span-8 md:col-span-8 flex flex-col items-start justify-start gap-4">
                    {/* Load Template Image */}
                    <img
                        className="w-full h-auto object-contain rounded-md"
                        src={data?.imgURL}
                        alt=""
                    />

                    {/* Load Template Details */}
                    <div className="w-full flex flex-col items-start justify-start gap-2">
                        {/* Template Title and Likes Count */}
                        <div className="w-full flex items-center justify-between gap-2">
                            {/* title */}
                            <p className="text-sm text-txtPrimary font-semibold">
                                {data?.title}
                            </p>

                            {/* Likes Count */}
                            {data?.favourites?.length > 0 && (
                                <div className="flex items-center justify-center gap-1">
                                    <BiSolidHeart className="text-red-500" />
                                    <p className="text-sm text-txtPrimary font-semibold whitespace-nowrap">
                                        {data?.favourites?.length} Likes
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Collection and Favourites Options */}

                        {/* if the user is logged in only then show the Collection  and Favourites option */}
                        {user && (
                            <div className="flex items-center justify-center gap-3 flex-wrap">
                                {/* For Collection */}
                                {user?.collections.includes(data?._id) ? (
                                    <React.Fragment>
                                        <div
                                            onClick={addToCollection}
                                            className="flex items-center justify-center px-2 py-1 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                                        >
                                            <BiSolidFolderPlus className="text-sm text-txtPrimary" />
                                            <p className="text-xs text-txtPrimary whitespace-nowrap">
                                                Remove From Collections
                                            </p>
                                        </div>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <div
                                            onClick={addToCollection}
                                            className="flex items-center justify-center px-2 py-1 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                                        >
                                            <BiSolidFolder className="text-sm text-txtPrimary" />
                                            <p className="text-xs text-txtPrimary whitespace-nowrap">
                                                Add To Collections
                                            </p>
                                        </div>
                                    </React.Fragment>
                                )}

                                {/* For Favourites */}
                                {data?.favourites.includes(user?.uid) ? (
                                    <React.Fragment>
                                        <div
                                            onClick={addToFavorites}
                                            className="flex items-center justify-center px-2 py-1 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                                        >
                                            <BiSolidHeart className="text-sm text-txtPrimary" />
                                            <p className="text-xs text-txtPrimary whitespace-nowrap">
                                                Remove From Favourites
                                            </p>
                                        </div>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <div
                                            onClick={addToFavorites}
                                            className="flex items-center justify-center px-2 py-1 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                                        >
                                            <BiHeart className="text-sm text-txtPrimary" />
                                            <p className="text-xs text-txtPrimary whitespace-nowrap">
                                                Add To Favourites
                                            </p>
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section*/}
                <div className="col-span-1 sm:col-span-4 md:col-span-4 w-full flex flex-col items-center justify-start px-3 gap-6">
                    {/* Discover more section */}
                    <div
                        className="w-full h-72 bg-blue-300 rounded-md overflow-hidden relative"
                        style={{
                            backgroundImage:
                                "url(https://images.pexels.com/photos/46216/sunflower-flowers-bright-yellow-46216.jpeg?auto=compress&cs=tinysrgb&w=600)",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    >
                        {/* Image overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                            <Link
                                to={"/"}
                                className="px-3 py-1 rounded-md border-2 border-gray-50 text-white"
                            >
                                Discover More
                            </Link>
                        </div>
                    </div>

                    {/* Edit the template option if the user is logged in */}
                    <Link
                        className="w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer"
                        to={`/resume/${data?.name}?templateID=${templateID}`}
                    >
                        <p className="text-white font-semibold text-md">
                            Edit this template
                        </p>
                    </Link>

                    {/* Tags */}
                    <div className="w-full flex items-center justify-start flex-wrap gap-2">
                        {data?.tags?.map((tag, index) => (
                            <p
                                className="text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap"
                                key={index}
                            >
                                {tag}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Similar Templates Section */}
            {templates?.filter((temp) => temp._id !== data?._id).length > 0 && (
                <div className="w-full py-8 px-28 flex flex-col items-start justify-start gap-4">
                    <p className="text-lg font-semibold text-txtDark">
                        You might also like
                    </p>
                    <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <React.Fragment>
                            <AnimatePresence>
                                {templates
                                    ?.filter((temp) => temp._id !== data?._id)
                                    .map((template, index) => (
                                        <TemplateDesignPin
                                            key={template?._id}
                                            data={template}
                                            index={index}
                                        />
                                    ))}
                            </AnimatePresence>
                        </React.Fragment>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateDesignPinDetails;
