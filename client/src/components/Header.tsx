import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";

export const Header = () => {

    const {currentUser}=useSelector((state:RootState)=>state.user)

    return (
        <div className={'bg-slate-200'}>
            <div className={'flex justify-between items-center max-w-6xl mx-auto p-3'}>
                <Link to={'/'}>
                    <h1 className={'font-bold'}>Header</h1>
                </Link>
                <ul className={'flex gap-4'}>
                    <Link to={'/'}>
                        <li>Home</li>
                    </Link>
                    <Link to={'/about'}>
                        <li>About</li>
                    </Link>
                    <Link to={'/profile'}>
                        {currentUser ?<img className={'h-7 w-7 rounded-full object-cover'} src={currentUser.profilePicture} alt={"profile"}/> : <li>Sing In</li>}

                    </Link>
                </ul>
            </div>

        </div>
    );
};

