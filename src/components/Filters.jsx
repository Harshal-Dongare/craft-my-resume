import React, { useState } from "react";
import { MdLayersClear } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { slideUpDownWithToolTip } from "../animation";
import { FiltersData } from "../utils/helpers";
import useFilters from "../hooks/useFilters";
import { useQueryClient } from "react-query";

const Filters = () => {
    // state to show tooltip
    const [isClearHovered, setIsClearHovered] = useState(false);

    const { data: filterData } = useFilters();

    // query client to update data
    const queryClient = useQueryClient();

    // function to filter data
    const handleFilterValue = (value) => {
        // Old Method
        //  /* gets the previous state from query client */
        // const previousState = queryClient.getQueryData("globalFilter");
        // const updatedState = {
        //     ...previousState,
        //     searchTerm: value,
        // };
        // /* Updates the data in query client*/
        // queryClient.setQueryData("globalFilter", updatedState);

        //? You can do above functionality in one line as below
        queryClient.setQueryData("globalFilter", {
            ...queryClient.getQueryData("globalFilter"),
            searchTerm: value,
        });
    };

    // function to clear filter
    const clearFilter = () => {
        queryClient.setQueryData("globalFilter", {
            ...queryClient.getQueryData("globalFilter"),
            searchTerm: "",
        });
    };

    return (
        <div className="w-full flex items-center justify-start py-4">
            {/* Clear Filter Button */}
            <div
                onClick={clearFilter}
                onMouseEnter={() => setIsClearHovered(true)}
                onMouseLeave={() => setIsClearHovered(false)}
                className="relative border border-gray-300 rounded-md px-3 py-2 mr-2 cursor-pointer group hover:shadow-md bg-gray-100"
            >
                {/* Clear Filter Icon */}
                <MdLayersClear className="text-lg" />

                {/* Tooltip */}
                <AnimatePresence>
                    {isClearHovered && (
                        <motion.div
                            {...slideUpDownWithToolTip}
                            className="absolute -top-8 -left-2 bg-white shadow-md rounded-md px-1 py-1"
                        >
                            <p className="whitespace-nowrap text-xs">
                                Clear All
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Filter List */}
            <div className="w-full flex items-center justify-start overflow-x-scroll gap-6 scrollbar-none">
                {FiltersData &&
                    FiltersData.map((item) => (
                        <div
                            onClick={() => handleFilterValue(item.value)}
                            key={item.id}
                            className={`border border-gray-300 rounded-md px-3 py-2 cursor-pointer group hover:shadow-md ${
                                item.value === filterData?.searchTerm &&
                                "bg-blue-500"
                            }`}
                        >
                            <p
                                className={`text-sm ${
                                    item.value === filterData?.searchTerm
                                        ? "text-white"
                                        : "text-txtPrimary"
                                }  group-hover:text-txtDark whitespace-nowrap`}
                            >
                                {item.label}
                            </p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Filters;
