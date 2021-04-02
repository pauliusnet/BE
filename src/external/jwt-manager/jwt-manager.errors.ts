export class InvalidJwt extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, InvalidJwt.prototype);
    }
}
