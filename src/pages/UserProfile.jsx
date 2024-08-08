import React, { useState } from "react";
import useUser from "../hooks/useUser";
import { AnimatePresence } from "framer-motion";
import useTemplate from "../hooks/useTemplate";
import { MainSpinner, TemplateDesignPin } from "../components";
import { NoData } from "../assets";
import { useQuery } from "react-query";
import { getSavedResumes } from "../api";

const UserProfile = () => {
    const { data: user } = useUser();
    const [activeTab, setActiveTab] = useState("collections");

    const { data: templates, isLoading: temp_isLoading } = useTemplate();

    const { data: savedResumes } = useQuery(["savedResumes"], () =>
        getSavedResumes(user?.uid)
    );

    // useEffect(() => {
    //     if (!user) {
    //         navigate("/auth", { replace: true });
    //     }
    // }, []);

    if (temp_isLoading) {
        return <MainSpinner />;
    }

    return (
        <div className="w-full flex flex-col items-center justify-start">
            <div className="w-full h-72 bg-blue-700">
                <img
                    src="https://cdn.pixabay.com/photo/2016/11/29/11/33/architecture-1869211_1280.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                />

                {/* PROFILE PHOTO AND NAME */}
                <div className="flex justify-center items-center flex-col gap-4">
                    {user?.photoURL ? (
                        <React.Fragment>
                            <img
                                src={user?.photoURL}
                                className="w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
                                alt=""
                                referrerPolicy="no-referrer"
                                loading="lazy"
                            />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <img
                                src="https://img.freepik.com/free-photo/3d-illustration-teenager-with-funny-face-glasses_1142-50955.jpg?t=st=1723143268~exp=1723146868~hmac=0ed5656a02a6f9dc77ac329230bd0a54bd2ac58eef23a24296d3ae033a2ed458&w=740"
                                className="w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
                                alt=""
                                referrerPolicy="no-referrer"
                                loading="lazy"
                            />
                        </React.Fragment>
                    )}

                    <p className="text-2xl text-txtDark">{user?.displayName}</p>
                </div>

                {/* tabs */}
                <div className="flex items-center justify-center mt-12">
                    {/* Collections Tab */}
                    <div
                        onClick={() => setActiveTab("collections")}
                        className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
                    >
                        <p
                            className={`${
                                activeTab === "collections" &&
                                "bg-white shadow-md text-blue-600"
                            }  text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full`}
                        >
                            Collections
                        </p>
                    </div>

                    {/* My Resume Tab */}
                    <div
                        onClick={() => setActiveTab("resumes")}
                        className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
                    >
                        <p
                            className={`${
                                activeTab === "resumes" &&
                                "bg-white shadow-md text-blue-600"
                            }  text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full`}
                        >
                            My Resumes
                        </p>
                    </div>
                </div>

                {/* tab content */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 px-4 py-6">
                    <AnimatePresence>
                        {/* Collections data */}
                        {activeTab === "collections" && (
                            <React.Fragment>
                                {user?.collections.length > 0 &&
                                user?.collections ? (
                                    <RenderTemplate
                                        templates={templates?.filter((temp) =>
                                            user?.collections.includes(
                                                temp?._id
                                            )
                                        )}
                                    />
                                ) : (
                                    // if user has no collections
                                    <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                                        <img
                                            src={NoData}
                                            alt=""
                                            className="w-32 h-auto object-contain"
                                        />
                                        <p>No collections found</p>
                                    </div>
                                )}
                            </React.Fragment>
                        )}

                        {/* Resumes data */}
                        {activeTab === "resumes" && (
                            <React.Fragment>
                                {savedResumes?.length > 0 && savedResumes ? (
                                    <RenderTemplate templates={savedResumes} />
                                ) : (
                                    // if user has no collections
                                    <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                                        <img
                                            src={NoData}
                                            alt=""
                                            className="w-32 h-auto object-contain"
                                        />
                                        <p>No collections found</p>
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const RenderTemplate = ({ templates }) => {
    return (
        <React.Fragment>
            {templates && templates.length > 0 && (
                <React.Fragment>
                    <AnimatePresence>
                        {templates &&
                            templates.map((template, index) => (
                                <TemplateDesignPin
                                    key={template?._id}
                                    data={template}
                                    index={index}
                                />
                            ))}
                    </AnimatePresence>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default UserProfile;
