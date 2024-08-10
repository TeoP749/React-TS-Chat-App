import { useLayoutEffect, useRef, useState } from "react";

export type Message = {
    id: string;
    user: string;
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
    //format HH/MM AM/PM
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hours % 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
}

function MessageCard(props: { message: Message, show_sender?: boolean }) {
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const message_chunks: string[] = splitMessageIntoChunks(props.message.message, 30);

    useLayoutEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.clientHeight);
        }
    }, [contentHeight]);
    const { message, show_sender } = props;
    const test: boolean = true;
    return (
        <>
            <div className="card rounded-lg bg-base-300 border-0 max-w-[20vw] w-fit shadow-md mt-0 mb-[0.1vh]">
                {
                    !test ?
                        <></>
                        :
                        <div className="card-body flex flex-col p-2">
                            <div className="flex w-full items-start">
                                <div ref={contentRef} className="flex flex-col items-start">
                                    {show_sender && (
                                        <h2 className="text-primary card-compact py-0 m-0">{message.user}</h2>
                                    )}
                                    <div className="max-w-full text-left">
                                        {message_chunks.map((message_chunk) => (
                                            <p className="text-base-content text-lg py-0 my-0">{message_chunk}</p>
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