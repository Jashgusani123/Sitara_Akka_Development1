import Footer from '../Components/Footer';
import Header from '../Components/Header';
import ResourcesMain from '../Components/ResourcesMain';

const Resources = () => {
    return (
        <>
            <Header />
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