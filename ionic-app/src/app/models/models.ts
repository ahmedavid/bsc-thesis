/**Represents user data for UI consumption */
export interface User {
  socketId?:string;
    id?: number;
    username?: string;
    fullname?: string;
    photos?: any [];
}

/**Represents Authenticated user data that is encoded in JWT Bearer Token */
export interface AuthUser {
    exp: number;
    given_name: string;
    iat: number;
    nameid: string;
    nbf: number;
    role: string;
    unique_name: string;
    socketId?: string;
}

/**Reporesents Users connection status */
export enum ConnectionStatus{
    Online,
    Offline
}
  /**
   * Represents a chat text message
   */
  export interface Message {
    sender: User;
    receiver: User;
    text: string;
    timestamp: Date;
  }
  /**
   * Represents Chat room or conversation thread
   */
  export interface Conversation {
    roomId: number;
    local: User;
    remote: User;
    messages: Message[];
    unread: Message[];
    active: boolean;
  }
