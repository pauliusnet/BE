export class UserDoesNotExist extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, UserDoesNotExist.prototype);
    }
}
