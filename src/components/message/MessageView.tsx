import { forwardRef } from 'react';
import { User } from '../../App';
import MessageCard, { Message } from './MessageCard';
import './MessageView.css';

const MessageView = forwardRef(function MessageView(props: { messages: Message[], selfUser: User }, ref: React.ForwardedRef<HTMLDivElement>) {
    const { messages, selfUser } = props;
    let prev_message_sender: string = "";
    return (
        <div className="no-scrollbar size-full relative max-h-full overflow-y-auto pt-[1vh] pb-[1.5vh]" ref={ref}>
            <div className="message-view flex flex-col items-center justify-center">
                {messages.map((message: Message) => {

                    const component = (
                        <div key={message.id} className={message.user.userID === selfUser.userID ? "self-end mr-[1vw]" : "self-start ml-[1vw]"}>
                            <MessageCard message={message} show_sender={message.user.userID !== selfUser.userID && message.user.userID !== prev_message_sender} />
                        </div>
                    );

                    prev_message_sender = message.user.userID;
                    return component;
                })}
            </div>
        </div >
    );
});


export default MessageView;
