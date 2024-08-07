export type Message = {
    id: string;
    user: string;
    message: string;
    timestamp?: number;
}

const format_time: (timestamp: number) => string = (timestamp: number) => {
    const date = new Date(timestamp);
    //format HH/MM AM/PM
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hours % 12}:${minutes} ${ampm}`;
}

function MessageCard(props: { message: Message }) {
    const { message } = props;
    return (
        <>
            <div className="card bg-base-300 border-0 w-[20vw] shadow-xl">
                <div className="card-body flex flex-col items-start px-[1.5vw] py-[1.5vh]">
                    <h2 className="text-primary card-title">{message.user}</h2>
                    <p className="text-base-content text-lg pl-[0.5vw]">{message.message}</p>
                    {
                        message.timestamp ?
                            <p className="text-gray-700 self-end text-sm">{format_time(message.timestamp)}</p> :
                            <></>
                    }
                </div>
            </div>
        </>
    )
}

export default MessageCard;