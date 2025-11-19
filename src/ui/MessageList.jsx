import React, { useRef } from 'react';
import styles from './MessageList.module.css';

const MessageList = ({ messages = [], onDeleteMessage }) => {
    const messageRefs = useRef({});
    const containerRef = useRef(null);

    // Eliminación de mensaje
    const handleDeleteMessage = (messageId) => {
        if (onDeleteMessage) {
            onDeleteMessage(messageId);
        }
    };

    return (
        <div className={styles.messageList} ref={containerRef}>
            {messages.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No hay mensajes aún</p>
                </div>
            ) : (
                messages.map((message, index) => (
                    <div
                        key={message.id}
                        ref={el => messageRefs.current[index] = el}
                        className={`${styles.messageContainer} ${message.isOwn ? styles.ownMessage : styles.otherMessage}`}
                    >
                        <div className={styles.messageBubble}>
                            <div className={styles.messageContent}>
                                {message.content}
                            </div>
                            <div className={styles.messageTime}>
                                {message.timestamp}
                                {message.isOwn && (
                                    <span className={styles.checkmarks}>✓✓</span>
                                )}
                            </div>
                        </div>

                        {/* Eliminar */}
                        <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteMessage(message.id)}
                            title="Eliminar"
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default MessageList;