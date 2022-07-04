import { useState } from "react";
import axios from "axios"

function Signup() {

    const [state, setState] = useState({
        username: '',
        email: "",
        password: "",
        confirmPassword: ""

    })
    const [apiProgress, setApiProgress] = useState(false)
    const [signUpSuccess, setSigUpSuccess] = useState(false)

    const enableButton = state.password.trim() === state.confirmPassword.trim() && state.password.trim().length > 0 ? true : false

    const onChange = (e) => {
        const { id, value } = e.target

        setState({
            ...state,
            [id]: value
        })
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        const requestObjs = { ...state }

        setApiProgress(true)


        axios.post("/api/1.0/users", requestObjs)
            .then(() => {
                setSigUpSuccess(true)
            })

    }

    return (
        <>
            <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
                {!signUpSuccess && 
                    <form onSubmit={handleSubmit} className="card mt-5" data-testid="form-sign-up">
                        <div className="card-header">

                            <h1 className="text-center">Signup</h1>
                        </div>

                        <div className="card-body">


                            <div className="mb-3">

                                <label htmlFor="username" className="form-label" title="Username">Username</label>
                                <input type="text" placeholder="Username" className="form-control" value={state.username} id="username" onChange={onChange} />
                            </div>
                            <div className="mb-3">

                                <label className="form-label" htmlFor="email">Email</label>
                                <input className="form-control" type="email" placeholder="Email" value={state.email} id="email" onChange={onChange} />
                            </div>
                            <div className="mb-3">

                                <label className="form-label" htmlFor="password">Password</label>
                                <input className="form-control" type="password" placeholder="Password" value={state.password} onChange={onChange} id="password" />
                            </div>
                            <div className="mb-3">

                                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                                <input className="form-control" type="password" placeholder="Confirm Password" value={state.confirmPassword} onChange={onChange} id="confirmPassword" />
                            </div>
                            <div className="text-center">

                                <button className="btn btn-primary" type="submit" disabled={!enableButton || apiProgress}>
                                    {apiProgress &&
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                    }
                                    Signup

                                </button>
                            </div>
                        </div>
                    </form>
                }
                {signUpSuccess &&
                    <div className="alert alert-success mt-3" role="alert">
                        Account activation email sent
                    </div>
                }
            </div>
        </>
    );
}

export default Signup;