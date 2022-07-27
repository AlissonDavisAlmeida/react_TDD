import { useState } from "react";
import { useEffect } from "react";
import { activate } from "../../api/apiCalls";
import Alert from "../../components/Alert";
import Spinner from "../../components/Spinner";

function AccountActivatePage({ match }) {

    const [result, setresult] = useState();

    useEffect(() => {
        setresult()
        activate(match.params.token)
            .then(() => {
                setresult("Account activated");

            })
            .catch(() => {
                setresult("Account activation failed");
            });
    }, [match.params.token]);

    return (
        <div data-testid="activate-page">

            <h1>Account Activation</h1>
            {
                result === "Account activated" ?
                <Alert type="success" message="Your account has been activated"/>
                :
                <Alert type="danger" message={result}/>
            }
            {!result && <Spinner size="big"/>}
        </div>
    );
}

export default AccountActivatePage;