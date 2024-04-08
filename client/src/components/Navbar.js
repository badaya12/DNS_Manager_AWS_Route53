import { Link } from "react-router-dom";
import Logout from "./logout";
export const Navbar = ()=>{
    return(
        <div>
            <div className="navbar">
                <div className="navbar-title">
                    <h1>Merch-shop</h1>
                </div>
                <div className="navbar-links">
                    <Link to = "/logout">shop</Link>
                    
                    </div>
    
            </div>
        </div>
    )
}