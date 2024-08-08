import React from "react";
import { Filters, TemplateDesignPin } from "../components";
import useTemplate from "../hooks/useTemplate";
import { ClockLoader } from "react-spinners";
import { AnimatePresence } from "framer-motion";
const HomeContainer = () => {
    // state to bring templates data
    const {
        data: templates,
        isLoading: temp_isLoading,
        isError: temp_error,
    } = useTemplate();

    // show loader while templates are being fetched
    if (temp_isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <ClockLoader color="#498FCD" size={100} />
            </div>
        );
    }

    return (
        <div className="w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start">
            {/* Filter section */}
            <Filters />

            {/*Render all the templates */}
            {temp_error ? (
                // Error Handling
                <React.Fragment>
                    <p className="text-lg text-txtDark">
                        Something went wrong...Please try again later
                    </p>
                </React.Fragment>
            ) : (
                // If no error, render templates
                <React.Fragment>
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  gap-2">
                        <RenderTemplate templates={templates} />
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

const RenderTemplate = ({ templates }) => {
    return (
        <React.Fragment>
            {templates && templates.length > 0 ? (
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
            ) : (
                <React.Fragment>
                    <p>No templates found</p>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default HomeContainer;
