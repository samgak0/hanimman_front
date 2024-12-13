import React, { useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import API_CONFIG from './ChatApiConfig';
import { useNavigate } from 'react-router-dom';
import Footer from "../../components/Footer";
import './ChatCommon.css';
import './ChatsDetails.css';
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

function ChatsDetails() {
    const { user: sender } = useContext(DataContext);
    const { userId } = useParams();
    const receiverId = Number(userId);
    const [messages, setMessages] = useState([]);
    const [receiverName, setReceiverName] = useState(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
    const inputRef = useRef(null);
    const chatInputContainer = useRef(null);
    const chatContainerRef = useRef(null);
    const navigate = useNavigate();
    const fetchReceiver = useCallback(async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.USERS}/${receiverId}`);
            if (response.ok) {
                const data = await response.json();
                setReceiverName(data.username);
            } else {
                console.error('상대방 사용자 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
        }
    }, [receiverId]);

    const fetchMessages = useCallback(async () => {
        try {
            if (!(sender.userId && receiverId)) return;

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.MESSAGES}?senderId=${sender.userId}&receiverId=${receiverId}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                console.error('메시지 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
        }
    }, [receiverId, sender]);

    const markMessagesAsRead = useCallback(async () => {
        const unreadMessages = messages.filter(message => !message.isRead && message.sender.id === receiverId);
        const unreadMessageIds = unreadMessages.map(message => message.id);

        if (unreadMessageIds.length === 0) return;

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.MESSAGES}/mark-read`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messageIds: unreadMessageIds }),
            });

            if (response.ok) {
                setMessages(prevMessages =>
                    prevMessages.map(m =>
                        unreadMessageIds.includes(m.id) ? { ...m, isRead: true } : m
                    )
                );
            } else {
                console.error('메시지 읽음 처리하는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('읽음 처리 중 오류 발생:', error);
        }
    }, [messages, receiverId]);

    const sendMessage = async () => {
        const messageContent = inputRef.current.value.trim();
        if (messageContent) {
            const newMessage = {
                content: messageContent,
                sender: sender.userId,
                receiver: receiverId,
                read: false,
            };

            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.MESSAGES}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newMessage),
                });

                if (response.ok) {
                    const savedMessage = await response.json();

                    setMessages((prevMessages) => [...prevMessages, savedMessage["message"]]);
                    scrollToBottom();
                } else {
                    console.error('메시지를 보내는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('메시지 전송 중 오류 발생:', error);
            }

            inputRef.current.value = '';
            inputRef.current.focus();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const scrollToBottomSmooth = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight
        });
    };

    const checkScrollPosition = useCallback(() => {
        const scrollTop = window.scrollY;

        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const isBottom = ((scrollHeight - scrollTop - clientHeight) <= 30);
        setIsScrolledToBottom(isBottom);
    }, []);

    window.NativeInterface = {
        receiveMessage: (id, content, username, createdAt) => {
            const newMessage = {
                "id": id,
                "content": content,
                "sender": { "id": receiverId, "username": receiverName },
                "receiver": { "id": sender.userId, "username": username },
                "createdAt": createdAt,
                "read": false,
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            scrollToBottom();
        },
        getReceiveId: () => {
            return receiverId;
        },
        setReadMessages: (ids) => {
            setMessages((prevMessages) =>
                prevMessages.map((message) =>
                    ids.includes(message.id) ? { ...message, isRead: true } : message
                )
            );
        }
    };

    useEffect(() => {
        const handleViewportChange = () => {
            if (window.visualViewport) {
                const viewport = window.visualViewport;
                const onResize = () => {
                    if (chatContainerRef.current) {
                        chatContainerRef.current.style.height = `${viewport.height}px`;
                    }
                    scrollToBottom();
                };

                viewport.addEventListener('resize', onResize);
                return () => {
                    viewport.removeEventListener('resize', onResize);
                };
            }
        };
        handleViewportChange();
    }, []);

    useEffect(() => {
        if (window.Android !== undefined) {
            window.Android.setReceiverId(receiverId);
        }
    }, [receiverId]);

    useEffect(() => {
        fetchReceiver();
    }, [fetchReceiver]);

    useEffect(() => {
        if (receiverName) {
            fetchMessages();
        }
    }, [receiverName, fetchMessages]);

    useEffect(() => {
        if (messages.length > 0) {
            markMessagesAsRead();
        }
    }, [messages, markMessagesAsRead]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        window.addEventListener('scroll', checkScrollPosition);

        return () => {
            window.removeEventListener('scroll', checkScrollPosition);
        };
    }, [checkScrollPosition]);

    const groupedMessages = useMemo(() => {
        return messages.reduce((dateGroups, message, index, array) => {
            const date = dayjs(message.createdAt).format('YYYY-MM-DD');
            if (!dateGroups[date]) {
                dateGroups[date] = [];
            }

            const dayGroup = dateGroups[date];

            const prevMessage = array[index - 1];
            const isNewGroup =
                !prevMessage ||
                dayjs(prevMessage.createdAt).format('YYYY-MM-DD') !== date ||
                prevMessage.sender.id !== message.sender.id ||
                dayjs(prevMessage.createdAt).format('A hh:mm') !== dayjs(message.createdAt).format('A hh:mm'); // 시간대가 다르면

            if (isNewGroup) {
                dayGroup.push([message]);
            } else {
                dayGroup[dayGroup.length - 1].push(message);
            }

            return dateGroups;
        }, {});
    }, [messages]);

    const lastSentMessageId = useMemo(() => {
        const lastMessage = messages
            .filter(msg => msg.sender.id === sender.userId)
            .pop();
        return lastMessage ? lastMessage.id : null;
    }, [messages, sender.userId]);

    return (
        <div className="chat-container" ref={chatContainerRef}>
            <div className="chat-header">
                <button className="back-button" onClick={() => navigate(-1)}>&lt;</button>
                <h1 className="chat-header-title">{receiverName} 님과 대화</h1>
            </div>
            <div className="chat-message-container">
                {Object.entries(groupedMessages).map(([date, dayGroups]) => (
                    <div key={date} className="chat-date-group">
                        <div className="chat-date">
                            {dayjs(date).format('YYYY년 MM월 DD일')}
                        </div>
                        {dayGroups.map((timeGroup, groupIndex) => (
                            <div key={groupIndex} className="time-group">
                                {timeGroup.map((message, index) => (
                                    <div
                                        key={message.id}
                                        className={`chat-message ${message.sender.id === sender.userId
                                            ? 'chat-message-received'
                                            : 'chat-message-sent'
                                            }`}
                                    >
                                        {message.sender.id === sender.userId && index === timeGroup.length - 1 && (
                                            <div className="status left">
                                                <div className="receive-time">
                                                    {dayjs(message.createdAt).format('A hh:mm')}
                                                </div>
                                                {message.id === lastSentMessageId && (

                                                    <div className="read-status">
                                                        {message.isRead ? '읽음' : '전송됨'}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="chat-bubble">{message.content}</div>
                                        {message.sender.id !== sender.userId && index === timeGroup.length - 1 && (
                                            <div className="status right">
                                                <div className="receive-time">
                                                    {dayjs(message.createdAt).format('A hh:mm')}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <button
                className={`scroll-to-bottom-button ${isScrolledToBottom ? 'hidden' : ''
                    }`}
                onClick={scrollToBottomSmooth}
            >
                <img src="/button.svg" alt="아이콘" className="icon" />
            </button>

            <div className="chat-input-container" ref={chatInputContainer}>
                <input
                    type="text"
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요..."
                    className="chat-input"
                />
                <button onClick={sendMessage} className="chat-send-button">전송</button>
            </div>
            <Footer />
        </div>
    );

}

export default ChatsDetails;
