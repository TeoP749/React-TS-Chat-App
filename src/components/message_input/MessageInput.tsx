import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { Message } from '../message/MessageCard';
import { v4 as uuidv4 } from 'uuid';

function MessageInput(props: { onMessage: (message: Message) => void, user: string }) {
    const { onMessage, user } = props;
    const [message, setMessage] = useState("");
    return (
        <div>
            <label className="input input-bordered flex items-center gap-2">
                <input type="text" className="grow flex items-center justify-between" placeholder="message" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onMessage({ id: uuidv4(), user: user, message: message, timestamp: Date.now() });
                        setMessage("");
                    }
                }} />
                <FontAwesomeIcon icon={faPaperPlane} className="cursor-pointer" onClick={() => { onMessage({ id: uuidv4(), user: user, message: message }); setMessage("") }} />
            </label>
        </div>
    );
}

export default MessageInput;