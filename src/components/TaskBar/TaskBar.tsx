
import React from "react";
import WindowsLogo from '../../assets/windowslogo.png';
import "./TaskBar.css";


export default function TaskBar() {
    return (
        <div className="TaskBar-Container ">
            <div className ='TaskBar Logo'>
                 <img src={WindowsLogo} alt="Windows-Logo" className="Windows-Logo" />
            </div>
            <div className="TaskBar-Search-Container">
            <input className="texttaskbar" 
            placeholder="Search..."
            type="text"
                />
            </div>
        </div>
    );
}