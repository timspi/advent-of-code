import { terminal as term, ScreenBuffer } from 'terminal-kit'

export type Points = { [coord: string]: string };
export class FieldAnimation {
    frames: any[] = [];
    screen: ScreenBuffer;

    animationPlayState = -1;
    concludeAnimation?: Function = undefined;
    bounds = {
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
    };

    constructor() {
        this.screen = new ScreenBuffer({ dst: term });
    }

    addFrame(frame: Points) {
        this.frames.push(frame);
    }

    play(fps = 10) {
        if (this.frames.length === 0) {
            console.log('No frames added. Cannot play animation!');
            return;
        }
        const bounds = {
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity,
        };
        for (let frame of this.frames) {
            for (let coordStr of Object.keys(frame)) {
                const [x, y] = coordStr.split(',').map(val => Number(val));
                if (x < bounds.minX) bounds.minX = x;
                if (x > bounds.maxX) bounds.maxX = x;
                if (y < bounds.minY) bounds.minY = y;
                if (y > bounds.maxY) bounds.maxY = y;
            }
        }
        console.log(bounds);
        this.bounds = bounds;
        this.screen = new ScreenBuffer({ dst: term, width: bounds.maxX - bounds.minX, height: bounds.maxY - bounds.minY });

        this.animationPlayState = -1;
        this.nextFrame(1000 / fps);

        return new Promise(resolve => this.concludeAnimation = resolve);
    }

    private nextFrame(delayMs: number) {
        this.animationPlayState++;
        if (this.animationPlayState < this.frames.length) {

            this.screen.fill({ attr: { bgDefaultColor: true } });
            const frame = this.frames[this.animationPlayState];
            for (let coords in frame) {
                const [x, y] = coords.split(',').map(val => Number(val));
                this.screen.put({
                    x: x - this.bounds.minX,
                    y: y - this.bounds.minY,
                    dx: 0, dy: 0,
                    attr: { bgColor: 'white', color: 'black' },
                    wrap: false
                }, frame[coords]);
            }
            this.screen.draw();

            setTimeout(() => this.nextFrame(delayMs), delayMs);
        } else {
            if (this.concludeAnimation) {
                this.concludeAnimation();
            }
        }
    }
}
