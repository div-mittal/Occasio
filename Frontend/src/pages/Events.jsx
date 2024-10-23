import Navbar from "../components/Navbar";

const Events = () => {
    return (
        <div className="bg-blk h-screen">
            <Navbar page="Events" />
            <div className="content h-[85vh] flex flex-col justify-center items-center">
                <div className="flex flex-col gap-6 items-center">
                    <h1 className="text-wht text-xl">Events will be shown here</h1>
                    <img src='OCCASIO.png'/>
                </div>
            </div>
        </div>
    );
};

export default Events;
