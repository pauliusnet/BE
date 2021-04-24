export class TrickDoesNotExist extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, TrickDoesNotExist.prototype);
    }
}
