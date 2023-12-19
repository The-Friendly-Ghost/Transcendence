import EventEmitter from './eventEmitter';

export default class Sizes extends EventEmitter {
    public width: number;
    public height: number;
    public pixelRatio: number;

    constructor() {
        super();
        // Setup
        this.width = window.innerWidth;
        this.height = (window.innerHeight / 3) * 2;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
        // Resize event
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = (window.innerHeight / 3) * 2;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);

            this.emit('resize');
        });
    };
};
