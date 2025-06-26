import Footer from '../Components/Footer'
import ResourcesHeading from '../Components/ResourcesHeading'
import ResourcesMain from '../Components/ResourcesMain'

const Resources = () => {
    return (
        <>
            <ResourcesHeading />
            <div className="resource_main_container h-auto">
                <ResourcesMain />
            </div>
            <div className="footer_container p-4">
                <Footer onlyLast={true} />
            </div>
        </>
    )
}

export default Resources