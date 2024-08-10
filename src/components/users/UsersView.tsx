import { User } from "../../App";

function UsersView(props: { users: User[], selectedUsername: string }) {
    const { users, selectedUsername } = props;
    return (
        <div className="flex flex-col size-full bg-base-100">
            {
                users.map((user, index) => {
                    return (
                        <div key={index} className={`${selectedUsername === user.username ? 'bg-primary' : ''}`}>
                            <p>{user.username}</p>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default UsersView;