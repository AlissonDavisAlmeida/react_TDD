import { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../components/Input"
import Spinner from "../../components/Spinner"
import Alert from "../../components/Alert"

function LoginPage() {

    const [state, setState] = useState({
        email: "",
        password: "",

    })
    const [apiProgress, setApiProgress] = useState(false)
    const [signUpSuccess, setSigUpSuccess] = useState(false)
    const { t } = useTranslation()


    const disableButton = state.email.length === 0 || state.password.length === 0

    const onChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

    }

    return (

        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
            <form onSubmit={handleSubmit} className="card mt-5" data-testid="form-sign-up">
                <div className="card-header">

                    <h1 className="text-center">Login</h1>
                </div>

                <div className="card-body">


                    <Input
                        label={"Email"}
                        type={"email"}
                        id="email"
                        onChange={onChange}
                    />
                    <Input
                        label={"password"}
                        type="password"
                        id="password"
                        onChange={onChange}
                    />


                    <div className="text-center">

                        <button className="btn btn-primary" type="submit" disabled={disableButton}>
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;