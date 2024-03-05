import { Brick } from "../interfaces/brick";
import { Level } from "../interfaces/level";
import { PowerUp } from "../interfaces/power-up";

export const LEVELS: Level[] = [{
    name: 'Test',
    brickWidth: 32,
    brickHeight: 16,
    bricks: 
        [
            {x: 16, y: 16, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 16, y: 48, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 16, y: 80, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 48, y: 32, status: 1, color: 8, powerUp: {value: 0} as PowerUp},
            {x: 48, y: 64, status: 1, color: 8, powerUp: {value: 0} as PowerUp},
            {x: 80, y: 16, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 80, y: 48, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 80, y: 80, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 112, y: 32, status: 1, color: 8, powerUp: {value: 0} as PowerUp},
            {x: 112, y: 64, status: 1, color: 8, powerUp: {value: 0} as PowerUp},
            {x: 144, y: 16, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 144, y: 48, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 144, y: 80, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 176, y: 32, status: 1, color: 8, powerUp: {value: 0} as PowerUp},
            {x: 176, y: 64, status: 1, color: 8, powerUp: {value: 0} as PowerUp},
            {x: 208, y: 16, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 208, y: 48, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 208, y: 80, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 240, y: 32, status: 1, color: 8, powerUp: {value: 0} as PowerUp},
            {x: 240, y: 64, status: 1, color: 8, powerUp: {value: 0} as PowerUp},
            {x: 272, y: 16, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 272, y: 48, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 272, y: 80, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 304, y: 32, status: 1, color: 8, powerUp: {value: 0} as PowerUp},
            {x: 304, y: 64, status: 1, color: 8, powerUp: {value: 0} as PowerUp},
            {x: 336, y: 16, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 336, y: 48, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 336, y: 80, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 368, y: 32, status: 1, color: 8, powerUp: {value: 0} as PowerUp},
            {x: 368, y: 64, status: 1, color: 8, powerUp: {value: 0} as PowerUp},
            {x: 400, y: 16, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 400, y: 48, status: 1, color: 0, powerUp: {value: 0} as PowerUp},
            {x: 400, y: 80, status: 1, color: 0, powerUp: {value: 0} as PowerUp}
        ] as Brick[]
}]