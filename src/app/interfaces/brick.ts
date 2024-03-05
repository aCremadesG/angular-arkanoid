import { PowerUp } from "./power-up";

export interface Brick {
    color: number,
    status: number,
    powerUp: PowerUp,
    x: number,
    y: number
}
