import { orders } from "@/db/schema";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod"
import z from "zod";
import xss from "xss";


export const orderSelectSchema = createSelectSchema(orders, {
    type: (schema) => schema.transform((item) => xss(item)),
    description: (schema) => schema.transform((item) => xss(item)),
});

export type orderSelect = z.infer<typeof orderSelectSchema>

export const orderInsertSchema = createInsertSchema(orders, {
    type: (schema) => schema.transform((item) => xss(item)),
    description: (schema) => schema.transform((item) => xss(item)),
});

export type orderInsert = z.infer<typeof orderInsertSchema>

export const orderUpdateSchema = createUpdateSchema(orders, {
    type: (schema) => schema.transform((item) => xss(item)),
    description: (schema) => schema.transform((item) => xss(item)),
});

export type orderUpdate = z.infer<typeof orderUpdateSchema>