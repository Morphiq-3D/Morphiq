import { users } from "@/db/schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import xss from "xss";
import z from "zod";

export const userSelectSchema = createSelectSchema(users, {
    fname: (schema) => schema.transform((item) => xss(item)),
    lname: (schema) => schema.transform((item) => xss(item)),
    email: (schema) => schema.transform((item) => xss(item)),
    phone: (schema) => schema.transform((item) => xss(item)),
    password: (schema) => schema.transform((item) => xss(item)),
});

export type userSelect = z.infer<typeof userSelectSchema>

export const userInsertSchema = createInsertSchema(users, {
    fname: (schema) => schema.transform((item) => xss(item)),
    lname: (schema) => schema.transform((item) => xss(item)),
    email: (schema) => schema.transform((item) => xss(item)),
    phone: (schema) => schema.transform((item) => xss(item)),
    password: (schema) => schema.transform((item) => xss(item)),
});

export type userInsert = z.infer<typeof userInsertSchema>;

export const userUpdateSchema = createUpdateSchema(users, {
    fname: (schema) => schema.transform((item) => xss(item)),
    lname: (schema) => schema.transform((item) => xss(item)),
    email: (schema) => schema.transform((item) => xss(item)),
    phone: (schema) => schema.transform((item) => xss(item)),
    password: (schema) => schema.transform((item) => xss(item)),
});

export type userUpdate = z.infer<typeof userUpdateSchema>;