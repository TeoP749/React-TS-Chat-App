import { forwardRef } from 'react';
import { Message } from './MessageCard';
import MessageCard from './MessageCard';
import './MessageView.css';
import { v4 as uuidv4 } from 'uuid';
export const test_messages: Message[] = [
    {
        id: uuidv4(),
        user: "John",
        message: "Hello, how are you?",
        timestamp: 1635730000000
    },
    {
        id: uuidv4(),
        user: "Jane",
        message: "I'm good, thank you.",
        timestamp: 1635730600000
    },
    {
        id: uuidv4(),
        user: "John",
        message: "That's great to hear.",
        timestamp: 1635731200000
    }
];

export const get_test_message: () => Message = () => {
    const users = ["John", "Jane", "Alice", "Bob"];
    const messages = ["Hello", "How are you?", "I'm good, thank you.", "That's great to hear."]
    const id: string = uuidv4();
    const user: string = users[Math.floor(Math.random() * users.length)];
    const message: string = messages[Math.floor(Math.random() * messages.length)] + " (this is a test message)";
    const timestamp: number = Date.now();
    return { id, user, message, timestamp };
}


const MessageView = forwardRef(function MessageView(props: { messages: Message[], current_user: string }, ref: React.ForwardedRef<HTMLDivElement>) {
    const { messages, current_user } = props;
    let prev_message_sender: string = "";
    return (
        <div className="no-scrollbar size-full relative max-h-full overflow-y-auto pt-[1vh] pb-[1.5vh]" ref={ref}>
            <div className="message-view flex flex-col items-center justify-center">
                {messages.map((message: Message) => {

                    const component = (
                        <div key={message.id} className={message.user === current_user ? "self-end mr-[1vw]" : "self-start ml-[1vw]"}>
                            <MessageCard message={message} show_sender={message.user !== current_user && message.user !== prev_message_sender} />
                        </div>
                    );

                    prev_message_sender = message.user;
                    return component;
                })}
            </div>
        </div >
    );
});


export default MessageView;