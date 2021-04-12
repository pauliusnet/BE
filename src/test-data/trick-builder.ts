import Trick from '../entities/trick-entity';

class TrickBuilder {
    private readonly trick: Trick;

    constructor() {
        this.trick = new Trick();
        this.trick.name = 'name';
        this.trick.level = 1;
        this.trick.videoURL = 'videoUrl';
    }

    build(): Trick {
        return this.trick;
    }
}

export default TrickBuilder;
