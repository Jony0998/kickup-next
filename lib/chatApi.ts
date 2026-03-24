import { graphqlRequest } from "./graphqlClient";

export interface ChatMessage {
    id: string;
    chatId: string;
    chatType: "MATCH" | "TEAM" | "LEAGUE" | "DIRECT";
    senderId: string;
    message: string;
    messageType: "TEXT" | "IMAGE" | "SYSTEM";
    mediaUrl?: string;
    replyTo?: string;
    isEdited: boolean;
    isDeleted: boolean;
    readBy: string[];
    createdAt: string;
}

export interface SendMessageInput {
    chatType: "MATCH" | "TEAM" | "LEAGUE" | "DIRECT";
    message: string;
    messageType?: "TEXT" | "IMAGE";
    mediaUrl?: string;
    replyTo?: string;
}

// Use same URL logic as graphqlClient so chat works even when env is not set
function hasGraphqlBackend(): boolean {
    try {
        const url = process.env.NEXT_PUBLIC_GRAPHQL_URL?.trim() || "/api/graphql";
        return !!url;
    } catch {
        return false;
    }
}

// Get chat messages
export async function getChatMessages(
    chatId: string,
    chatType: ChatMessage["chatType"],
    limit: number = 50,
    skip: number = 0
): Promise<ChatMessage[]> {
    if (hasGraphqlBackend()) {
        try {
            type ChatMessagesQuery = {
                chatMessages: Array<{
                    _id: string;
                    chatId: string;
                    chatType: string;
                    senderId: string;
                    message: string;
                    messageType: string;
                    mediaUrl?: string;
                    replyTo?: string;
                    isEdited: boolean;
                    isDeleted: boolean;
                    readBy: string[];
                    createdAt: string;
                }>;
            };

            const data = await graphqlRequest<ChatMessagesQuery>(
                `
          query GetChatMessages($chatId: String!, $chatType: ChatType!, $limit: Int, $skip: Int) {
            chatMessages(chatId: $chatId, chatType: $chatType, limit: $limit, skip: $skip) {
              _id
              chatId
              chatType
              senderId
              message
              messageType
              mediaUrl
              replyTo
              isEdited
              isDeleted
              readBy
              createdAt
            }
          }
        `,
                {
                    variables: { chatId, chatType, limit, skip },
                    auth: true,
                }
            );

            return data.chatMessages.map((m) => ({
                id: m._id,
                chatId: m.chatId,
                chatType: m.chatType as ChatMessage["chatType"],
                senderId: m.senderId,
                message: m.message,
                messageType: m.messageType as ChatMessage["messageType"],
                mediaUrl: m.mediaUrl,
                replyTo: m.replyTo,
                isEdited: m.isEdited,
                isDeleted: m.isDeleted,
                readBy: m.readBy,
                createdAt: m.createdAt,
            }));
        } catch (error) {
            console.error("Error fetching chat messages:", error);
            throw error;
        }
    }

    throw new Error("GraphQL backend url is not configured");
}

// Send message
export async function sendMessage(input: SendMessageInput, relatedId: string): Promise<ChatMessage | null> {
    if (hasGraphqlBackend()) {
        try {
            type SendMessageMutation = {
                sendMessage: {
                    _id: string;
                    chatId: string;
                    chatType: string;
                    senderId: string;
                    message: string;
                    messageType: string;
                    mediaUrl?: string;
                    replyTo?: string;
                    isEdited: boolean;
                    isDeleted: boolean;
                    readBy: string[];
                    createdAt: string;
                };
            };

            // Build input with only fields the backend expects (avoids ValidationPipe/forbidNonWhitelisted issues)
            const sendInput = {
                chatId: relatedId,
                chatType: input.chatType,
                message: input.message.trim(),
                ...(input.messageType != null && { messageType: input.messageType }),
                ...(input.mediaUrl != null && input.mediaUrl !== '' && { mediaUrl: input.mediaUrl }),
                ...(input.replyTo != null && input.replyTo !== '' && { replyTo: input.replyTo }),
            };

            const data = await graphqlRequest<SendMessageMutation>(
                `
          mutation SendMessage($input: SendMessageInput!, $relatedId: String!) {
            sendMessage(input: $input, relatedId: $relatedId) {
              _id
              chatId
              chatType
              senderId
              message
              messageType
              mediaUrl
              replyTo
              isEdited
              isDeleted
              readBy
              createdAt
            }
          }
        `,
                {
                    variables: {
                        input: sendInput,
                        relatedId,
                    },
                    auth: true,
                }
            );

            const m = data.sendMessage;
            return {
                id: m._id,
                chatId: m.chatId,
                chatType: m.chatType as ChatMessage["chatType"],
                senderId: m.senderId,
                message: m.message,
                messageType: m.messageType as ChatMessage["messageType"],
                mediaUrl: m.mediaUrl,
                replyTo: m.replyTo,
                isEdited: m.isEdited,
                isDeleted: m.isDeleted,
                readBy: m.readBy,
                createdAt: m.createdAt,
            };
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }

    throw new Error("GraphQL backend url is not configured");
}

export async function getUnreadMessageCount(chatId: string, chatType: ChatMessage["chatType"]): Promise<number> {
    if (hasGraphqlBackend()) {
        try {
            const data = await graphqlRequest<{ unreadMessageCount: number }>(
                `
          query GetUnreadMessageCount($chatId: String!, $chatType: ChatType!) {
            unreadMessageCount(chatId: $chatId, chatType: $chatType)
          }
        `,
                {
                    variables: { chatId, chatType },
                    auth: true,
                }
            );

            return data.unreadMessageCount;
        } catch (error) {
            console.error("Error fetching unread message count:", error);
            return 0;
        }
    }

    return 0;
}
