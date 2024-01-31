import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";
import {FaSearch} from "react-icons/fa";

export const Header = () => {

    const {currentUser} = useSelector((state: RootState) => state.user)

    return (
        <header className={'bg-slate-200 shadow-md'}>
            <div className={'flex justify-between items-center max-w-6xl mx-auto p-3'}>
                <Link to={'/'}>
                    <h1 className={'font-bold text-sm:text-xl flex flex-wrap'}>
                        <span className={'text-slate-500'}>Alex</span>
                        <span className={'text-slate-500'}>Estate</span>
                    </h1>
                </Link>
                <form className={'bg-slate-100 p-3 rounded-lg flex items-center'}>
                    <input type={"text"} placeholder={"Search..."}
                           className={'bg-transparent focus:outline-none w-24 sm:w-64'}/>
                    <FaSearch className={'text-slate-600'}/>
                </form>
                <ul className={'flex gap-4'}>
                    <Link to={'/'}>
                        <li className={'hidden sm:inline text-slate-700 hover:text-white'}>Home</li>
                    </Link>
                    <Link to={'/about'}>
                        <li className={'hidden sm:inline text-slate-700 hover:text-white'}>About</li>
                    </Link>
                    <Link to={'/profile'}>
                        {currentUser ?
                            <img className={'h-7 w-7 rounded-full object-cover'}
                                 src={currentUser.profilePicture} alt={"profile"}/> :
                            <li className={'hidden sm:inline text-slate-700 hover:text-white'}>Sing
                                In</li>}

                    </Link>
                </ul>
            </div>

        </header>
    );
};
