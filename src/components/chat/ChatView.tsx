import { useEffect, useRef } from 'react';
import { User } from '../../App';
import { Message } from '../message/MessageCard';
import MessageView from '../message/MessageView';
import MessageInput from '../message_input/MessageInput';
import './ChatView.css';

export default function ChatView(props: { selected_user: User, messages: Message[], selfUser: User, onSelfMessage: (message: Message) => void }) {
    console.log("RENDERING CHAT VIEW");
    const { selected_user, messages, selfUser, onSelfMessage } = props;
    console.log(messages.map((message) => message.message).join(','));
    const scrollElementRef: React.ForwardedRef<HTMLDivElement> = useRef(null);

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
                    <div className="bg-base-300 size-full overflow-auto flex flex-col" >
                        <MessageView messages={messages} selfUser={selfUser} ref={scrollElementRef} />
                        <div className='mt-auto mx-[1vw] mb-[1vh] sticky flex items-center justify-center'>
                            <div className='w-full'>
                                <MessageInput onMessage={message => onSelfMessage(message)} selfUser={selfUser} />
                            </div>
                        </div>
                    </div >
            }
        </>
    )
}
