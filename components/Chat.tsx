import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    TextField,
    List,
    ListItem,
    CircularProgress,
    Badge,
    Drawer,
    Fab,
    Tooltip,
    Alert,
    Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { useErrorNotification } from '@/contexts/ErrorNotificationContext';
import { getChatMessages, sendMessage, getUnreadMessageCount, ChatMessage } from '@/lib/chatApi';
import { getApiBaseUrl } from '@/lib/apiBaseUrl';

interface ChatProps {
    chatId: string;
    chatType: "MATCH" | "TEAM" | "LEAGUE" | "DIRECT";
    title?: string;
}

function getSocketChatUrl(): string {
    const gql = process.env.NEXT_PUBLIC_GRAPHQL_URL?.trim();
    if (gql?.startsWith('http')) {
        try {
            return `${new URL(gql).origin.replace(/\/$/, '')}/chat`;
        } catch { /* fall through */ }
    }
    const base = getApiBaseUrl();
    return `${base.replace(/\/$/, '')}/chat`;
}

function getAuthToken(): string | null {
    try {
        return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    } catch {
        return null;
    }
}

export default function Chat({ chatId, chatType, title = "Chat" }: ChatProps) {
    const { user } = useAuth();
    const { showError } = useErrorNotification();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [socketConnected, setSocketConnected] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [sendError, setSendError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    const roomId = chatType === 'DIRECT' ? chatId : `${chatType.toLowerCase()}:${chatId}`;

    useEffect(() => {
        const token = getAuthToken();
        if (!token) return;

        const socketUrl = getSocketChatUrl();
        socketRef.current = io(socketUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to chat socket');
            setSocketConnected(true);
            socketRef.current?.emit('joinRoom', roomId);
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('Chat socket connect_error:', err.message);
            setSocketConnected(false);
        });

        socketRef.current.on('joinError', (data: { message?: string }) => {
            console.warn('Join room error:', data?.message);
        });

        socketRef.current.on('newMessage', (message: any) => {
            const newMsg: ChatMessage = {
                id: message.id,
                chatId: message.chatId,
                senderId: typeof message.senderId === 'string' ? message.senderId : String(message.senderId),
                message: message.message,
                createdAt: message.createdAt,
                readBy: message.readBy || [],
                isDeleted: false,
                isEdited: false,
                chatType: chatType,
                messageType: 'TEXT'
            };

            setMessages((prev: ChatMessage[]) => {
                if (prev.some(m => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
            });

            if (!isOpen) {
                setUnreadCount((prev: number) => prev + 1);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leaveRoom', roomId);
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setSocketConnected(false);
        };
    }, [chatId, chatType, roomId]);

    // Initial load and unread count
    useEffect(() => {
        if (isOpen) {
            loadMessages();
            setUnreadCount(0);
        } else {
            updateUnreadCount();
        }
    }, [isOpen, chatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const updateUnreadCount = async () => {
        try {
            const count = await getUnreadMessageCount(chatId, chatType);
            setUnreadCount(count);
        } catch (error) {
            console.error(error);
        }
    };

    const loadMessages = async () => {
        try {
            setLoadError(null);
            if (messages.length === 0) setLoading(true);
            const data = await getChatMessages(chatId, chatType);
            setMessages(data);
        } catch (error: any) {
            console.error('Chat load error:', error);
            setLoadError(error?.message || 'Failed to load messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const text = newMessage.trim();
        setNewMessage("");
        setSendError(null);

        try {
            setSending(true);
            const sentMessage = await sendMessage({
                chatType,
                message: text,
            }, chatId);

            if (sentMessage) {
                setMessages((prev) => {
                    if (prev.some((m) => m.id === sentMessage.id)) return prev;
                    return [...prev, sentMessage];
                });
            } else {
                setNewMessage(text);
                setSendError('Failed to send message.');
            }
        } catch (error: any) {
            console.error('Chat send error:', error);
            setNewMessage(text);
            const msg = error?.message || 'Failed to send message. Please try again.';
            setSendError(msg);
            showError(msg);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <Tooltip title={title}>
                <Fab
                    color="primary"
                    aria-label="chat"
                    sx={{
                        position: 'fixed',
                        bottom: { xs: 80, md: 20 },
                        right: 20,
                        zIndex: 1000,
                        background: 'linear-gradient(135deg, #00E377 0%, #00B85C 100%)',
                        '&:hover': { background: 'linear-gradient(135deg, #00C466 0%, #009E4F 100%)' },
                    }}
                    onClick={() => setIsOpen(true)}
                >
                    <Badge badgeContent={unreadCount} color="error">
                        <ChatBubbleIcon />
                    </Badge>
                </Fab>
            </Tooltip>

            <Drawer
                anchor="right"
                open={isOpen}
                onClose={() => setIsOpen(false)}
                sx={{
                    zIndex: 1200,
                    '& .MuiDrawer-paper': {
                        width: { xs: '100%', sm: 400 },
                        borderRadius: { xs: 0, sm: '20px 0 0 20px' },
                        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                    },
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ p: 2, background: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ChatBubbleIcon />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
                        </Box>
                        <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#F8F9FA' }}>
                        {sendError && (
                            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSendError(null)}>
                                {sendError}
                            </Alert>
                        )}
                        {loadError && (
                            <Alert severity="warning" sx={{ mb: 2 }} action={
                                <Button color="inherit" size="small" onClick={loadMessages}>Retry</Button>
                            }>
                                {loadError}
                            </Alert>
                        )}
                        {loading && messages.length === 0 ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {messages.map((msg) => {
                                    const isMe = msg.senderId === user?.id || msg.senderId === "currentUser";
                                    return (
                                        <ListItem key={msg.id} disablePadding sx={{
                                            flexDirection: isMe ? 'row-reverse' : 'row',
                                            mb: 1,
                                        }}>
                                            <Paper sx={{
                                                p: 1.5,
                                                bgcolor: isMe ? '#00E377' : 'white',
                                                color: isMe ? 'black' : 'text.primary',
                                                borderRadius: isMe ? '15px 15px 0 15px' : '15px 15px 15px 0',
                                                maxWidth: '85%',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                            }}>
                                                {!isMe && (
                                                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'block', mb: 0.5 }}>
                                                        {msg.senderId === user?.id ? 'Me' : msg.senderId.slice(-5)}
                                                    </Typography>
                                                )}
                                                <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.5 }}>
                                                    {msg.message}
                                                </Typography>
                                                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: 'right', opacity: 0.7, fontSize: '0.7rem' }}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </Paper>
                                        </ListItem>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </List>
                        )}
                    </Box>

                    <Box sx={{ p: 2, bgcolor: 'white', borderTop: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                placeholder="Type a message..."
                                variant="outlined"
                                size="small"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                multiline
                                maxRows={3}
                                disabled={sending}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleSend}
                                disabled={!newMessage.trim() || sending}
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                    width: 40,
                                    height: 40,
                                }}
                            >
                                {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon fontSize="small" />}
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}
