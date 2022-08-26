import { useParams } from "react-router-dom";

function UserPage() {

    const params = useParams()
    return ( 
        <>
            <h1>User Page</h1>
            <h2>user{params.id}</h2>
        </>
     );
}

export default UserPage;