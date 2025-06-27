import { useState } from 'react';
import Footer from '../Components/Footer'
import ResourcesHeading from '../Components/ResourcesHeading'
import ResourcesMain from '../Components/ResourcesMain'

const Resources = () => {
     const [search, setSearch] = useState("");
    return (
        <>
            <ResourcesHeading search={search} setSearch={setSearch}/>
            <div className="resource_main_container h-auto">
                <ResourcesMain search={search}/>
            </div>
            <div className="footer_container p-4">
                <Footer onlyLast={true} />
            </div>
        </>
    )
}

export default Resources