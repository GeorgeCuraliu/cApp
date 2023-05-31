import React from "react";
import Navbar from "./navbar";
import HomePageContent from "./HomePageContent";

const HomePage = () => {
    return(
        <div style={{ overflow:"hidden"}}>
            <Navbar />
            <HomePageContent />
        </div>
    )
}
export default HomePage;