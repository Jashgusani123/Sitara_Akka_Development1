import Banner from "../Components/Banner";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

const Home = () => {
    return (
        <>
            <Header />
            <Banner />
            <Footer admin={false}/>
        </>
    );
};

export default Home;

