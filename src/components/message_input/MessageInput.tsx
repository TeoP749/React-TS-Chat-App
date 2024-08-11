import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { Message } from '../message/MessageCard';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../App';

function MessageInput(props: { onMessage: (message: Message) => void, user: User }) {
    const { onMessage, user } = props;
    const [message, setMessage] = useState("");
    const handleMessage = (message: string) => {
        if (message.trim() != "") {
            onMessage({ id: uuidv4(), user: user, message: message, timestamp: Date.now() });
            setMessage("");
        }
    }

    return (
        <div>
            <label className="input input-bordered flex items-center gap-2">
                <input type="text" className="grow flex items-center justify-between" placeholder="message" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleMessage(message);
                    }
                }} />
                <FontAwesomeIcon icon={faPaperPlane} className="cursor-pointer" onClick={() => handleMessage(message)} />
            </label>
        </div>
    );
}

export default MessageInput;