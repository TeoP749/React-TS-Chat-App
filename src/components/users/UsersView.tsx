import { User } from "../../App";

function UsersView(props: { users: User[], selfUser: User, selectedUser: User, setSelectedUser: (username: User) => void }) {
    const { users, selfUser, selectedUser, setSelectedUser } = props;
    return (
        <div className="flex flex-col size-full bg-base-100">
            {
                users.map((user, index) => {
                    return user.userID !== selfUser.userID
                        ?
                        (
                            <div key={index} className={`hover:cursor-pointer ${selectedUser.userID == user.userID ? 'bg-primary' : ''}`} onClick={() => { setSelectedUser(user) }}>
                                <p>{user.username}</p>
                            </div>
                        )
                        : <></>
                })
            }
        </div>
    );
};

export default UsersView;