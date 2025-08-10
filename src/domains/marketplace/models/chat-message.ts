// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const ChatMessage = model.define("chat_message", {
  id: model.id().primaryKey(),
  chat_session_id: model.text(),
  
  // Message Details
  message_type: model.enum(["text", "image", "file", "system", "bot"]).default("text"),
  content: model.text(),
  sender_type: model.enum(["customer", "agent", "system", "bot"]),
  sender_id: model.text().nullable(),
  
  // Message Metadata
  sender_name: model.text().nullable(),
  is_read: model.boolean().default(false),
  read_at: model.dateTime().nullable(),
  
  // File Attachments
  attachment_url: model.text().nullable(),
  attachment_type: model.text().nullable(),
  attachment_size: model.number().nullable(),
  attachment_name: model.text().nullable(),
  
  // Bot/System Messages
  bot_intent: model.text().nullable(),
  system_action: model.text().nullable(),
  
  // Message Threading
  reply_to_message_id: model.text().nullable(),
  
  // Timestamps
  sent_at: model.dateTime().default(new Date()),
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

// Relationships
ChatMessage.belongsTo(() => import("./chat-session").then(m => m.default), {
  foreignKey: "chat_session_id"
})

ChatMessage.belongsTo(() => import("./chat-message").then(m => m.default), {
  foreignKey: "reply_to_message_id"
})

export default ChatMessage





