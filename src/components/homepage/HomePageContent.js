import React from "react";
import { useRef } from "react";
import "../styles/homePageContent.css"
const HomePageContent = () => {
    let toggle = useRef(true);
    const text = ["This project was created with the color template of visual studio, so the colors are very comfortable, in special for programmers",
                 "The entire project use React and scss",
                 "The entire site uses huge amounts of data from json, so this project it`s just a huge template for this data",
                 "User authentification use restAPI method"]
    return(
        <div className="container">
            {text.map((element, index) => {
                toggle = !toggle;
                if(toggle){
                    return( <section
                            key={index}
                            className="card" 
                            style={{ justifySelf: "flex-end", placeSelf: "flex-end" }}>
                                <p>{element}</p>
                            </section>)
                }else{
                    return( <section 
                            className="card"
                            key={index}>
                                <p>{element}</p>
                            </section>)
                }
            })}
        </div>
    )
}

export default HomePageContent