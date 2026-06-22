import { AppError } from "../structures/apperror.js";

export enum LockType {
    TicketCreation = 0,
}

type LockSet = Record<number, Set<string>>;

// This will need to be replaced if we ever make this multipale processes, but
// for now this is the easiest way to implement this.
class LockManager {
    private locks: LockSet = {};

    public lock(type: LockType, element: string) {
        if (!this.locks[type]) this.locks[type] = new Set();

        if (this.locks[type].has(element)) {
            throw new AppError("BEING_EDITED");
        }

        this.locks[type].add(element);
    }

    public release(type: LockType, element: string) {
        if (!this.locks[type]) return;
        this.locks[type].delete(element);
    }
}

export const lockManager = new LockManager();