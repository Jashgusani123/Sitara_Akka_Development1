import React from "react";
import Footer from "../Components/Footer";
import ResourcesHeading from "../Components/ResourcesHeading";
import ResourcesMain from "../Components/ResourcesMain";

const AdminResources: React.FC = () => {

    return (
        <>
            <ResourcesHeading />
            <div className="resource_main_container h-auto">
                <ResourcesMain isAdmin={true} />
            </div>
            <div className="footer_container p-4">
                <Footer admin={true} onlyLast={true} />
            </div>
        </>
    );
};

export default AdminResources;
