import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import Footer from "../../components/Footer";
import API_CONFIG from './ChatApiConfig';
import './ChatCommon.css';
import './ChatUserList.css';

function ChatUserList() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentUserDetails, setCurrentUserDetails] = useState(null);
    const { user: currentUser, setUser } = useContext(DataContext);;
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch users data from API
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.USERS}`)
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            // Find current user details
            const currentUserInfo = users.find((user) => user.id === currentUser.userId);
            setCurrentUserDetails(currentUserInfo);

            // Filter out the current user from the users list
            const otherUsers = users.filter((user) => user.id !== currentUser.userId);
            setFilteredUsers(otherUsers);
        }
    }, [currentUser.userId, users]);

    const changeCurrentUser = (user) => {
        setUser({
            userId: user.id,
            username: user.username,
        });
    };

    const goToPage = (userId) => {
        navigate(`/chats/${userId}`);
    };

    return (
        <div className="users-list-container">

            <div className="current-user-info card">
                <h2 className="current-user-info-title">👤 프로필</h2>
                {currentUserDetails ? (
                    <p>
                        <strong>사용자이름: </strong> {currentUser.username} <br />
                        {/*<strong>User ID:</strong> {currentUser.userId} <br />*/}
                        {/*<strong>Android ID:</strong> {currentUserDetails.androidId} <br />*/}
                    </p>
                ) : (
                    <p>
                        <strong>Username:</strong> Loading...  <br />
                        <strong>User ID:</strong> Loading... <br />
                        <strong>Android ID:</strong> Loading...  <br />
                    </p>
                )}
            </div>

            <div className="users-grid">
                <h2 className="users-grid-title">💬 사용자 목록</h2>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="user-card card">
                            <h4>{user.username}</h4>
                            {/*<h5>{user.androidId}</h5>*/}
                            <div className="user-buttons">
                                <button className="button-chat" onClick={() => goToPage(user.id)}>
                                    대화 시작
                                </button>
                                <button
                                    className="button-change"
                                    onClick={() => changeCurrentUser(user)}
                                >
                                    사용자 전환
                                </button>
                            </div>
                        </div>
                    ))
                ) : (

                    <div className="user-card card">
                        <h4>Loading...</h4>
                        <h5>Loading...</h5>
                        <div className="user-buttons">
                            <button className="button-chat">
                                대화 시작
                            </button>
                            <button
                                className="button-change"
                            >
                                사용자 전환
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default ChatUserList;
