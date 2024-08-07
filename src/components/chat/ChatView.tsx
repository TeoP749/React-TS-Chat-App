import { useEffect, useRef, useState } from 'react';
import { Message } from '../message/MessageCard';
import MessageView from '../message/MessageView';
import MessageInput from '../message_input/MessageInput';
import { socket } from '../../socket';
import './ChatView.css';

function ChatView() {
    const [messages, setMessages] = useState([] as Message[]);
    const [current_user, _] = useState("Test User " + Math.floor(Math.random() * 100));
    const ref: React.ForwardedRef<HTMLDivElement> = useRef(null);
    const add_message: (message: Message) => void = (message: Message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    }

    useEffect(() => {
        const onMessage = (message: Message) => add_message(message);
        socket.on('message', onMessage);
        return () => {
            socket.off('message', onMessage);
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            ref.current?.scroll({
                top: ref.current?.scrollHeight,
                left: 0,
                behavior: 'smooth'
            });
        }, 0);
    }, [messages]);

    return (<>
        <div className="bg-base-200 size-full overflow-auto flex flex-col">
            <MessageView messages={messages} current_user={current_user} ref={ref} />
            <div className='mt-auto mx-[1vw] mb-[1vh] sticky flex items-center justify-center'>
                <div className='w-full'>
                    <MessageInput onMessage={
                        (message) => {
                            if (message.message != "") {
                                add_message(message);
                                socket.emit('message', message);
                            } else {
                                console.error("[ERROR]: empty message");
                            }
                        }
                    }
                        user={current_user}
                    />
                </div>
            </div>
        </div>
    </>
    )
}


export default ChatView
