import Signup from "./pages/signup/Signup";
import LanguageSelector from "./components/LanguageSelector";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Link, Route } from "react-router-dom";
import AccountActivatePage from "./pages/activate/AccountActivatePage";
import UserList from "./components/UserList";

function App() {

  const { t } = useTranslation()



  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
        <div className="container">

          <Link className="navbar-brand" to="/" >{t('home')}</Link>
          <ul className="navbar-nav">

            <Link className="nav-link" to="/signup" >{t('signup')}</Link>
            <Link className="nav-link" to="/login" >{t('login')}</Link>
          </ul>
        </div>
      </nav>
      <div className="container">
        <Route exact path={"/"} component={HomePage} />
        <Route path={"/signup"} component={Signup} />
        <Route path={"/login"} component={LoginPage} />
        <Route path={"/activate/:token"} component={AccountActivatePage} />
        <Route path={"/users"} component={UserList}/>
        <LanguageSelector />

      </div>
    </BrowserRouter>
  );
}

export default App;
