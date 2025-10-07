import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users, orders, addresses } from "./schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Order = InferSelectModel<typeof orders>;
export type NewOrder = InferInsertModel<typeof orders>;

export type Address = InferSelectModel<typeof addresses>;
export type NewAddress = InferInsertModel<typeof addresses>;