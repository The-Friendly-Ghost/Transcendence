import EventEmitter from './eventEmitter';

export default class Time extends EventEmitter {
    public start: number;
    public current: number;
    public elapsed: number;
    public delta: number;
    public timeout: NodeJS.Timeout;

    constructor() {
        super();

        // Setup
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 10;
    };

    tick(): void {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        this.emit('tick');

        // console.log('tick');

        this.timeout = setTimeout(() => { this.tick() }, 10);
    }

    stop(): void {
        clearTimeout(this.timeout);
    }
}
