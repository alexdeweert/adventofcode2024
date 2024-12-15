import { getCallSite } from "util";

export enum Direction {
  LEFT,
  RIGHT,
  UP,
  DOWN,
}

export class Entity {
  x: number;
  y: number;
  moveable: boolean;
  icon: string;
  constructor(y: number, x: number, moveable: boolean, icon: string) {
    this.x = x;
    this.y = y;
    this.moveable = moveable;
    this.icon = icon;
  }
}

export class StaticEntity extends Entity {
  constructor(y: number, x: number, icon: string) {
    super(x, y, false, icon);
  }
}

export class MoveableEntity extends Entity {
  positions: Map<string, Entity[]>;
  constructor(
    y: number,
    x: number,
    icon: string,
    positions: Map<string, Entity[]>
  ) {
    super(x, y, true, icon);
    this.positions = positions;
  }

  // Check positions directly beside current position (depending on loc)
  /**
   * A space can only be occupied by one entity at a time in this scenario.
   * whether another entity is moveable does not matter.
   */
  canMove(dir: Direction): boolean {
    if (dir == Direction.LEFT) {
      const dirkey = `${this.y}#${this.x - 1}`;
      const ents = this.positions.get(dirkey);
      if (ents) return ents.length == 0;
    }
    if (dir == Direction.RIGHT) {
      const dirkey = `${this.y}#${this.x + 1}`;
      const ents = this.positions.get(dirkey);
      if (ents) return ents.length == 0;
    }
    if (dir == Direction.UP) {
      const dirkey = `${this.y - 1}#${this.x}`;
      const ents = this.positions.get(dirkey);
      if (ents) return ents.length == 0;
    }
    if (dir == Direction.DOWN) {
      const dirkey = `${this.y + 1}#${this.x}`;
      const ents = this.positions.get(dirkey);
      if (ents) return ents.length == 0;
    }
    return false;
  }

  moveLeft() {
    //If can move, return true or false?
    if (this.canMove(Direction.LEFT) && this.remove()) {
      this.x--;
      this.update();
      return true;
    }
    return false;
  }
  moveRight() {
    if (this.canMove(Direction.RIGHT) && this.remove()) {
      this.x++;
      this.update();
      return true;
    }
    return false;
  }
  moveUp() {
    if (this.canMove(Direction.UP) && this.remove()) {
      this.y--;
      this.update();
      console.log(`can move UP - returning true`);
      return true;
    }
    console.log(`cant move UP - returning false`);
    return false;
  }
  moveDown() {
    if (this.canMove(Direction.DOWN) && this.remove()) {
      this.y++;
      this.update();
      console.log(`can move DOWN - returning true`);
      return true;
    }
    console.log(`can move DOWN - returning false`);
    return false;
  }

  remove() {
    let position = this.positions.get(`${this.y}#${this.x}`);
    if (position?.includes(this)) {
      let i = position?.indexOf(this);
      position?.splice(i, 1);
      return true;
    }
    return false;
  }
  update() {
    this.positions.get(`${this.y}#${this.x}`)?.push(this);
  }
}

export class Wall extends StaticEntity {
  constructor(y: number, x: number, icon: string) {
    super(x, y, icon);
  }
}

export class Bot extends MoveableEntity {
  constructor(
    y: number,
    x: number,
    icon: string,
    positions: Map<string, Entity[]>
  ) {
    super(x, y, icon, positions);
  }
}

export class Box extends MoveableEntity {
  constructor(
    y: number,
    x: number,
    icon: string,
    positions: Map<string, Entity[]>
  ) {
    super(x, y, icon, positions);
  }
}
