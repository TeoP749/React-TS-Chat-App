import { useLayoutEffect, useRef, useState } from "react";
import { User } from "../../App";

export type Message = {
    id: string;
    user: User;
    message: string;
    timestamp?: number;
}

const splitMessageIntoChunks = (message: string, maxLength: number) => {
    const words = message.split(' ');
    const chunks: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
        if ((currentLine + word).length > maxLength) {
            chunks.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    });

    if (currentLine.trim()) {
        chunks.push(currentLine.trim());
    }

    return chunks;
};

const format_time: (timestamp: number) => string = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hours % 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
}

function MessageCard(props: { message: Message, show_sender?: boolean }) {
    const { message, show_sender } = props;
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const message_chunks: string[] = splitMessageIntoChunks(props.message.message, 30);

    //adjust the timestamp position
    useLayoutEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.clientHeight);
        }
    }, [contentHeight]);

    const test: boolean = false;
    const margin_top_style: string = show_sender ? 'mt-[1vh]' : 'mt-0';
    return (
        <>
            <div className={`card rounded-lg bg-base-100 border-0 max-w-[20vw] w-fit shadow-md mb-[0.1vh] ${margin_top_style}`}>
                {
                    test ?
                        <></>
                        :
                        <div className="card-body flex flex-col p-2">
                            <div className="flex w-full items-start">
                                <div ref={contentRef} className="flex flex-col items-start">
                                    {show_sender && (
                                        <h2 className="text-primary card-compact py-0 m-0">{message.user.username}</h2>
                                    )}
                                    <div className="max-w-full text-left">
                                        {message_chunks.map((message_chunk, index) => (
                                            <p key={index} className="text-base-content text-lg py-0 my-0">{message_chunk}</p>
                                        ))}
                                    </div>

                                </div>
                                {message.timestamp && (
                                    <div
                                        className="flex items-start justify-end ml-2"
                                        style={{ marginTop: contentHeight - 15 }}
                                    >
                                        <p className="text-gray-700 text-sm">{format_time(message.timestamp)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                }
            </div>
        </>
    )
}

export default MessageCard;