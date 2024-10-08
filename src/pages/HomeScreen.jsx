import React, { Suspense } from "react";
import { Header, MainSpinner } from "../components";
import { Route, Routes } from "react-router-dom";
import { HomeContainer } from "../containers";

import {
    CreateTemplate,
    UserProfile,
    CreateResume,
    TemplateDesignPinDetails,
} from "../pages";

const HomeScreen = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center">
            {/* header */}
            <Header />

            {/* Main */}
            <main className="w-full">
                {/* Custom Routes */}
                <Suspense fallback={<MainSpinner />}>
                    <Routes>
                        {/* Admin Route only */}
                        <Route
                            path="/template/create"
                            element={<CreateTemplate />}
                        />

                        <Route path="/" element={<HomeContainer />} />
                        <Route path="/profile/:uid" element={<UserProfile />} />
                        <Route path="/resume/*" element={<CreateResume />} />
                        <Route
                            path="/resumeDetail/:templateID"
                            element={<TemplateDesignPinDetails />}
                        />
                    </Routes>
                </Suspense>
            </main>
        </div>
    );
};

export default HomeScreen;
