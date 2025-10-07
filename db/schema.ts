import { pgTable } from "drizzle-orm/pg-core";
import { serial, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const timestamps = {
    createdAt: timestamp("created_at").defaultNow().notNull()
}

// settling for integer ids instead of uuids for storage constraints
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    fname: varchar("first_name", {length: 255}).notNull(),
    lname: varchar("last_name", {length: 255}).notNull(),
    email: varchar({length: 255}).notNull().unique(), //! unique email is very important
    phone: varchar({length: 255}),
    password: varchar({length: 255}),
    ...timestamps
});

/**
 ** uses jsonb (binary json) for storage efficiency and fast retrievals
 * 
 ** will not be using ENUM for order type, will be validating in backend,
 ** decrease the possibility of failing requests (network transfers) and improving maintainability
 */
export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
    type: varchar({ length: 50 }).notNull(),
    cart: jsonb(),
    priceCents: integer("price_cents"),
    description: varchar({ length: 500 }),
    ...timestamps
});    

export const addresses = pgTable("addresses", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
    country: varchar({length: 255}),
    governorate: varchar({length: 255}),
    postalCode: varchar("postal_code", {length: 50 }),
    street: varchar({length: 255}),
    building: varchar({length: 255}),
    floor: integer(),
    apartment: integer(),
    ...timestamps
});

export const usersRelations = relations(users, ({ many }) => ({
    addresses: many(addresses),
    orders: many(orders)
}));

export const ordersRelations = relations(orders, ({ one }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
    user: one(users, {
        fields: [addresses.userId],
        references: [users.id]
    }),
}));