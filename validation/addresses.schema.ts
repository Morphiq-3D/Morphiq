import { addresses } from "@/db/schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import xss from "xss";
import z from "zod";

export const addressSelectSchema = createSelectSchema(addresses, {
    country: (schema) => schema.transform((item) => xss(item)),
    governorate: (schema) => schema.transform((item) => xss(item)),
    postalCode: (schema) => schema.transform((item) => xss(item)),
    street: (schema) => schema.transform((item) => xss(item)),
    building: (schema) => schema.transform((item) => xss(item)),
    floor: (schema) => schema.transform((item) => xss(item)),
    apartment: (schema) => schema.transform((item) => xss(item)),
});

export type addressSelect = z.infer<typeof addressSelectSchema>;

export const addressInsertSchema = createInsertSchema(addresses, {
    country: (schema) => schema.transform((item) => xss(item)),
    governorate: (schema) => schema.transform((item) => xss(item)),
    postalCode: (schema) => schema.transform((item) => xss(item)),
    street: (schema) => schema.transform((item) => xss(item)),
    building: (schema) => schema.transform((item) => xss(item)),
    floor: (schema) => schema.transform((item) => xss(item)),
    apartment: (schema) => schema.transform((item) => xss(item)),
});

export type addressInsert = z.infer<typeof addressInsertSchema>;

export const addressUpdateSchema = createUpdateSchema(addresses, {
    country: (schema) => schema.transform((item) => xss(item)),
    governorate: (schema) => schema.transform((item) => xss(item)),
    postalCode: (schema) => schema.transform((item) => xss(item)),
    street: (schema) => schema.transform((item) => xss(item)),
    building: (schema) => schema.transform((item) => xss(item)),
    floor: (schema) => schema.transform((item) => xss(item)),
    apartment: (schema) => schema.transform((item) => xss(item)),
});

export type addressUpdate = z.infer<typeof addressUpdateSchema>;