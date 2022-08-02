import { useState } from "react";
import { useEffect } from "react";
import { loadUsers } from "../api/apiCalls";

function UserList() {

    const [page, setPage] = useState({});
    const [users, setUsers] = useState([]);

    const { page: currentPage, totalPages } = page

    useEffect(() => {
        async function fetchData() {
            const pageUsers = await loadUsers(0, 3)

            setPage(pageUsers.data);
            setUsers(pageUsers.data.content);
        }

        fetchData();
    }, []);


    const loadNextPage = () => {
        async function fetchData() {
            const pageUsers = await loadUsers(Math.min(currentPage + 1, totalPages - 1), 3)
            setPage(pageUsers.data);
            setUsers(pageUsers.data.content);
        }

        fetchData();
    }

    const loadPreviousPage = () => {
        async function fetchData() {
            const pageUsers = await loadUsers(Math.max(currentPage - 1, 0), 3)
            setPage(pageUsers.data);
            setUsers(pageUsers.data.content);
        }

        fetchData();
    }

    return (
        <div className="card">
            <div className="card-header text-center">
                <h3>Users</h3>
                {totalPages > 1 && (
                    users.map((user, index) => {
                        return (
                            <div key={index}>
                                <h4>{user.username}</h4>
                            </div>
                        );
                    })
                )}
            </div>
            <div className="card-footer">

            {currentPage > 0 && <button className="btn btn-outline-secondary btn-sm" onClick={loadPreviousPage}>prev</button>}
            {totalPages > currentPage + 1 && <button className="btn btn-outline-secondary btn-sm" onClick={loadNextPage}>next</button>}
            </div>
        </div>
    );
}

export default UserList;