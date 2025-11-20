import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();


export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext debe ser usado dentro de AppProvider");
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [activeConversation, setActiveConversation] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [showChatList, setShowChatList] = useState(true);

    // Detectar mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setShowChatList(true);
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Conversaciones
    useEffect(() => {
        const initialContacts = [
            {
                id: 1,
                name: "Canchas Romero",
                status: "en línea",
                lastMessage: "Bienvenido a Canchas Romero",
                time: "10:00",
                unreadCount: 0,
                messages: [
                    {
                        id: 1,
                        sender: "Canchas Romero",
                        content: "Bienvenido a Canchas Romero",
                        timestamp: "10:00 AM",
                        isOwn: false,
                    },
                ],
            },
        ];

        setConversations(initialContacts);
    }, []);

    const handleSelectContact = (contact) => {
        setActiveConversation(contact);
        if (isMobile) {
            setShowChatList(false);
        }
    };

    const handleDeselectContact = () => {
        setActiveConversation(null);
        if (isMobile) {
            setShowChatList(true);
        }
    };

    const handleSendMessage = (message) => {
        if (!activeConversation) return;

        const updatedConversations = conversations.map((conv) => {
            if (conv.id === activeConversation.id) {
                const newMessage = {
                    id: Date.now(),
                    sender: "You",
                    content: message.content,
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    isOwn: true,
                };

                const updatedConv = {
                    ...conv,
                    messages: [...(conv.messages || []), newMessage],
                    lastMessage: message.content,
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                };

                setActiveConversation(updatedConv);
                return updatedConv;
            }
            return conv;
        });

        setConversations(updatedConversations);
    };

    const handleDeleteMessage = (messageId) => {
        if (!activeConversation) return;

        const updatedConversations = conversations.map((conv) => {
            if (conv.id === activeConversation.id) {
                const filteredMessages = conv.messages.filter(
                    (msg) => msg.id !== messageId
                );

                const lastMessage =
                    filteredMessages.length > 0
                        ? filteredMessages[filteredMessages.length - 1].content
                        : "Sin mensajes";

                const lastTime =
                    filteredMessages.length > 0
                        ? filteredMessages[filteredMessages.length - 1].timestamp
                        : "";

                const updatedConv = {
                    ...conv,
                    messages: filteredMessages,
                    lastMessage: lastMessage,
                    time: lastTime,
                };

                setActiveConversation(updatedConv);
                return updatedConv;
            }
            return conv;
        });

        setConversations(updatedConversations);
    };

    const value = {
        activeConversation,
        setActiveConversation,
        conversations,
        setConversations,
        isMobile,
        showChatList,
        setShowChatList,
        handleSelectContact,
        handleSendMessage,
        handleDeleteMessage,
        handleDeselectContact,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};