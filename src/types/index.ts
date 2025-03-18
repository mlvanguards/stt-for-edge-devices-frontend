export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}
