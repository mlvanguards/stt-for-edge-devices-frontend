export interface Message {
  id: number;
  audioUrl: string;
  transcript: string;
  isUser: boolean;
}

export interface Chat {
  id: string;
  messages: Message[];
  createdAt: Date;
}
