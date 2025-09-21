// src/types/chat.tsx
// TypeScript-tyypit chat-ominaisuudelle

// Mahdolliset roolit chat-viesteissä
export type Role = "user" | "assistant";

// Chat-viestin rakenne
export interface IMessage {
  id: string | undefined; // Viestin yksilöllinen tunniste (voi olla undefined luonnissa)
  role: Role; // Viestin lähettäjä: käyttäjä tai tekoäly
  content: string; // Viestin sisältö
}

// Alias viestille (lyhenne)
export type Message = IMessage;

// Viestilista tyyppi
export type MessageList = Message[];
