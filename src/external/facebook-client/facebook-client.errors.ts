export class InvalidFacebookAccessToken extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, InvalidFacebookAccessToken.prototype);
    }
}
