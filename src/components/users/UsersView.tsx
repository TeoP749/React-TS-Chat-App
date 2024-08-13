import { useEffect } from "react";
import { User } from "../../App";

function sortByUnreadMessages(a: User, b: User): number {
    if (a.unread_messages && b.unread_messages) return b.unread_messages - a.unread_messages;
    if (a.unread_messages) return -1;
    if (b.unread_messages) return 1;
    return 0;
}

function UsersView(props: { users: User[], selfUser: User, selectedUser: User, setSelectedUser: (username: User) => void }) {
    const { users, selfUser, selectedUser, setSelectedUser } = props;
    console.log("RENDERING USERS VIEW - ", users);
    console.log(users.filter((user) => (user.userID !== selfUser.userID) && user.connected).map((u) => u.username).join(','));
    useEffect(() => {
        console.log("selected user changed to: ", selectedUser.username);
    }, [selectedUser]);

    return (
        <div className="size-full">
            <ul className="menu size-full bg-base-300">
                {
                    users.sort(sortByUnreadMessages)
                        .filter((user) => (user.userID !== selfUser.userID) && user.connected).map((user, index) => {
                            return (
                                <li key={index} onClick={() => { setSelectedUser(user) }}>
                                    <div className={`flex flex-row justify-between w-full hover:cursor-pointer ${selectedUser.userID == user.userID ? 'active' : ''}`}>
                                        <a>{user.username}</a>
                                        {
                                            (user.unread_messages && user.unread_messages > 0)
                                                ? <span className="badge badge-primary">{user.unread_messages}</span>
                                                : <></>
                                        }
                                    </div>
                                </li>
                            );
                        })
                }
            </ul>
        </div >

    );
};

export default UsersView;