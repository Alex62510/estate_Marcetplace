import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";
import {Outlet,Navigate} from "react-router-dom";

export const PrivateRoute = () => {

    const {currentUser}=useSelector((state:RootState)=>state.user)

    return currentUser? <Outlet/>:<Navigate to={'/sign-in'}/>

};

