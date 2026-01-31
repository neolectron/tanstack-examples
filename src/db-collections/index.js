import { createCollection, localOnlyCollectionOptions, } from "@tanstack/react-db";
import { z } from "zod";
const MessageSchema = z.object({
    id: z.number(),
    text: z.string(),
    user: z.string(),
});
export const messagesCollection = createCollection(localOnlyCollectionOptions({
    getKey: (message) => message.id,
    schema: MessageSchema,
}));
