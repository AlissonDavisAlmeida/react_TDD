import { useState } from "react";
import Input from "../../components/Input"
import Spinner from "../../components/Spinner"
import Alert from "../../components/Alert"
import { login } from "../../api/apiCalls";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

function LoginPage(props) {

    const [state, setState] = useState({
        email: "",
        password: "",

    })
    const [apiProgress, setApiProgress] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const history = useHistory()

    const { i18n, t } = useTranslation()

    useEffect(() => {
        setErrorMessage("")
    }, [state.email, state.password])

    const disableButton = state.email.length === 0 || state.password.length === 0 || apiProgress

    const onChange = (e) => {
        setState({
            ...state,
            [e.target.id]: e.target.value
        })
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setApiProgress(true)

        try {
            console.log(state)
            const { email, password } = state;
            const response = await login(email, password)
            setApiProgress(false)
            props.setAuth({
                isLoggedIn: true,
                id: response.data.id
            })
            history.push("/")
        } catch (err) {
            setApiProgress(false)
            setErrorMessage(err.messageqq)
        }


    }

    return (

        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
            <form onSubmit={handleSubmit} className="card mt-5" data-testid="login-page">
                <div className="card-header">

                    <h1 className="text-center">{t("login")}</h1>
                </div>

                <div className="card-body">


                    <Input
                        label={t("email")}
                        type={"email"}
                        id="email"
                        onChange={onChange}
                    />
                    <Input
                        label={t("password")}
                        type="password"
                        id="password"
                        onChange={onChange}
                    />


                    <div className="text-center">

                        <button className="btn btn-primary" type="submit" disabled={disableButton}>
                            {apiProgress && <Spinner />}
                            {t("login")}
                        </button>
                        {
                            errorMessage && <Alert type="danger mt-3" message={errorMessage} />
                        }
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;