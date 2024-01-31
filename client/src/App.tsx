import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home.tsx";
import {About} from "./pages/About.tsx";
import {Profile} from "./pages/Profile.tsx";
import {Header} from "./components/Header.tsx";
import {SignIn} from "./pages/SingIn.tsx";
import {SignUp} from "./pages/SingUp.tsx";
import {PrivateRoute} from "./components/PrivateRoute.tsx";


function App() {
    return (

        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path={'/'} element={<Home/>}/>
                <Route path={'/about'} element={<About/>}/>
                <Route path={'/sign-in'} element={<SignIn/>}/>
                <Route path={'/sign-up'} element={<SignUp/>}/>
                <Route element={<PrivateRoute/>}>
                    <Route path={'/profile'} element={<Profile/>}/>
                </Route>
            </Routes>
        </BrowserRouter>

    )
}

export default App