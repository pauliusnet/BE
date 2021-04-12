import User from '../entities/user-entity';

class UserBuilder {
    private readonly user: User;

    constructor() {
        this.user = new User();
        this.user.name = 'Paulius';
        this.user.email = 'test@test.com';
        this.user.pictureURL = 'picture';
    }

    withEmail(email: string): UserBuilder {
        this.user.email = email;
        return this;
    }

    build(): User {
        return this.user;
    }
}

export default UserBuilder;
