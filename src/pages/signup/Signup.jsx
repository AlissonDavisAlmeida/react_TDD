import { useState } from "react";
import Input from "../../components/Input";
import { useTranslation } from "react-i18next";
import { signup } from "../../api/apiCalls";
import Alert from "../../components/Alert";
import Spinner from "../../components/Spinner";

function Signup() {

    const [state, setState] = useState({
        username: '',
        email: "",
        password: "",
        confirmPassword: "",
        errors: {}
    })
    const [apiProgress, setApiProgress] = useState(false)
    const [signUpSuccess, setSigUpSuccess] = useState(false)
    const { i18n, t } = useTranslation()

    let passwordMissmatch = state.password !== state.confirmPassword ? t("passwodMismatchValidation") : ""

    const enableButton = state.password.trim() === state.confirmPassword.trim() && state.password.trim().length > 0 ? true : false

    const onChange = (e) => {
        const { id, value } = e.target

        const copyErrors = { ...state.errors }
        delete copyErrors[id]
        setState({
            ...state,
            errors: copyErrors,
            [id]: value
        })
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        const requestObjs = { ...state }

        setApiProgress(true)

        try {

            await signup(requestObjs)
            setSigUpSuccess(true)
        } catch (err) {
            if (err.response.status === 400) {
                setState(prevState => {
                    return {
                        ...prevState,
                        errors: err.response.data.validationErrors
                    }
                })
            }
        } finally {
            setApiProgress(false)
        }

    }

    return (
        <>
            <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="signup-page">
                {!signUpSuccess &&
                    <form onSubmit={handleSubmit} className="card mt-5" data-testid="form-sign-up">
                        <div className="card-header">

                            <h1 className="text-center">{t("signup")}</h1>
                        </div>

                        <div className="card-body">


                            <Input
                                label={t("username")}
                                type="text"
                                value={state.username}
                                id="username"
                                onChange={onChange}
                                error={state.errors.username}
                            />

                            <Input
                                label={t("email")}
                                type={"email"}
                                value={state.email}
                                id="email"
                                onChange={onChange}
                                error={state.errors.email}
                            />
                            <Input
                                label={t("password")}
                                type="password"
                                value={state.password}
                                id="password"
                                onChange={onChange}
                                error={state.errors.password}
                            />
                            <Input
                                label={t("confirmPassword")}
                                type="password"
                                value={state.confirmPassword}
                                id="confirmPassword"
                                onChange={onChange}
                                error={passwordMissmatch}
                            />

                            <div className="text-center">

                                <button className="btn btn-primary" type="submit" disabled={!enableButton || apiProgress}>
                                    {apiProgress &&
                                        <Spinner />
                                    }
                                    {t("signup")}

                                </button>
                            </div>
                        </div>
                    </form>
                }
                {signUpSuccess &&
                    <Alert type="success" message="Account activation email sent" />

                }
            </div>
        </>
    );
}

export default Signup;