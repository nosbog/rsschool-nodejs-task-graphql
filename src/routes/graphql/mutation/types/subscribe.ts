import {UUID} from "node:crypto";

export type Subscription = {
    userId: UUID,
    authorId: UUID
}
