import Navbar from "../components/Navbar";
import Scard from "../components/Scard";

const Events = () => {
    const events=[]
    return (
        <div className="bg-blk h-screen">
            <Navbar page="Events" />
            <div className="content h-[85vh] flex flex-wrap py-12 px-2 gap-8 justify-center overflow-auto">
                <Scard/>
                <Scard/>
                <Scard/><Scard/><Scard/><Scard/><Scard/><Scard/><Scard/><Scard/><Scard/>
            </div>
        </div>
    );
};

export default Events;
