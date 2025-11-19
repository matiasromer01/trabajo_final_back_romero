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
                name: "Matias",
                status: "en línea",
                lastMessage: "Hola tocayo, que tal?",
                time: "11:50",
                unreadCount: 0,
                messages: [
                    {
                        id: 1,
                        sender: "Matias",
                        content: "Hola tocayo, que tal?",
                        timestamp: "11:50 AM",
                        isOwn: false,
                    },
                ],
            },
            {
                id: 2,
                name: "Riquelme",
                status: "hace 5 min",
                lastMessage: "Que hiciste Chanchi?😱 ",
                time: "18:20",
                unreadCount: 0,
                messages: [
                    {
                        id: 2,
                        sender: "Riquelme",
                        content: "Que hiciste Chanchi?😱",
                        timestamp: "18:20 PM",
                        isOwn: false,
                    },
                ],
            },
            {
                id: 3,
                name: "Franco Colapinto",
                avatar: "/Franco_Colapinto.jpg",
                status: "hace 3 horas",
                lastMessage: "El viernes te quiero ver en la práctica",
                time: "08:20",
                unreadCount: 1,
                messages: [
                    {
                        id: 3,
                        sender: "Franco Colapinto",
                        content: "Hola amigooooo",
                        timestamp: "12:03 PM",
                        isOwn: false,
                    },
                    {
                        id: 4,
                        sender: "Franco Colapinto",
                        content: "Que haces el viernes, tengo un plan",
                        timestamp: "12:04PM",
                        isOwn: false,
                    },
                    {
                        id: 5,
                        sender: "You",
                        content: "Que onda Franquitoooo, lo tengo libre",
                        timestamp: "13:30 PM",
                        isOwn: true,
                    },
                    {
                        id: 6,
                        sender: "Franco Colapinto",
                        content: "El viernes te quiero ver en la práctica",
                        timestamp: "14:47 PM",
                        isOwn: false,
                    },
                ],
            },
            {
                id: 4,
                name: "Marcelo Moretti",
                avatar: "/Marcelo_Moretti.jpg",
                status: "hace 1 hora",
                lastMessage: "Como anda el nene?",
                time: "11:00",
                unreadCount: 0,
                messages: [
                    {
                        id: 4,
                        sender: "Marcelo Moretti",
                        content: "Como anda el nene?",
                        timestamp: "11:00 PM",
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