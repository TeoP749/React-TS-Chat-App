import { useEffect, useRef, useState } from 'react';
import { User } from '../../App';
import { socket } from '../../socket';
import { Message } from '../message/MessageCard';
import MessageView from '../message/MessageView';
import MessageInput from '../message_input/MessageInput';
import './ChatView.css';

function ChatView(props: { selected_user: User, selfUser: User, setUserMessages: (userID: string, updateCallback: (prevMessages: Message[] | undefined) => Message[]) => void }) {
    const { selected_user, selfUser, setUserMessages } = props;
    const [messages, setMessages] = useState<Message[]>(selected_user?.messages || []);
    const scrollElementRef: React.ForwardedRef<HTMLDivElement> = useRef(null);
    const add_message: (message: Message) => void = (message: Message) => {
        setUserMessages(selected_user.userID, (prevMessages: Message[] | undefined): Message[] => {
            const newMessages = [...(prevMessages || []), message];
            return newMessages;
        });
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
            scrollElementRef.current?.scroll({
                top: scrollElementRef.current?.scrollHeight,
                left: 0,
                behavior: 'smooth'
            });
        }, 0);
    }, [messages]);

    return (
        <>
            {
                selected_user.userID.trim() === "" ?
                    <></>
                    :
                    <div className="bg-success-content size-full overflow-auto flex flex-col" >
                        <MessageView messages={messages} selfUser={selfUser} ref={scrollElementRef} />
                        <div className='mt-auto mx-[1vw] mb-[1vh] sticky flex items-center justify-center'>
                            <div className='w-full'>
                                <MessageInput onMessage={
                                    (message) => {
                                        add_message(message);
                                        socket.emit('message', message);
                                    }
                                }
                                    user={selfUser}
                                />
                            </div>
                        </div>
                    </div >
            }
        </>
    )
}


export default ChatView
