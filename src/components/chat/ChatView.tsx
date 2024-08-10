import { useEffect, useRef, useState } from 'react';
import { Message } from '../message/MessageCard';
import MessageView from '../message/MessageView';
import MessageInput from '../message_input/MessageInput';
import { socket } from '../../socket';
import './ChatView.css';

function ChatView(props: { self_username: string }) {
    const { self_username } = props;
    const [messages, setMessages] = useState([] as Message[]);
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
        <div className="bg-success-content size-full overflow-auto flex flex-col">
            <MessageView messages={messages} current_user={self_username} ref={ref} />
            <div className='mt-auto mx-[1vw] mb-[1vh] sticky flex items-center justify-center'>
                <div className='w-full'>
                    <MessageInput onMessage={
                        (message) => {
                            if (message.message.trim() != "") {
                                add_message(message);
                                socket.emit('message', message);
                            } else {
                                console.error("[ERROR]: empty message");
                            }
                        }
                    }
                        user={self_username}
                    />
                </div>
            </div>
        </div>
    </>
    )
}


export default ChatView
