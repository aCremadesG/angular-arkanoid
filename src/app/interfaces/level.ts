import { Brick } from "./brick";

export interface Level {
    name: string,
    bricks: Brick[],
    brickWidth: number,
    brickHeight: number
}
