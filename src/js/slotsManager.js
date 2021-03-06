// @flow

import { enhancementSlots } from "data/levels.js";

class SlotsManager {
  slots: Array<number>;
  constructor() {
    this.reset();
  }

  get length(): number {
    return this.slots.length;
  }

  get remaining(): number {
    return this.length;
  }

  _binarySearch(target: number): void | number {
    let cursor;
    let bottom = 0;
    let top = this.slots.length - 1;

    if (!target || target > this.slots[top]) {
      return;
    }

    if (target < this.slots[bottom]) {
      return bottom;
    }

    while (top - bottom > 1) {
      cursor = Math.floor((bottom + top) / 2);
      const item = this.slots[cursor];

      if (item === target) {
        return cursor;
      }

      if (item < target) {
        bottom = cursor;
      }

      if (item > target) {
        top = cursor;
      }
    }

    return this.slots[top] === target ? top : bottom;
  }

  _findNextLargest(target: number, returnIndex: boolean | void): number | void {
    let index = this._binarySearch(target);

    if (index === undefined) {
      return;
    }

    while (this.slots[index] && this.slots[index] < target) {
      index++;
    }
    return returnIndex ? index : this.slots[index];
  }

  _removeOnce(num: number): void {
    const index = this._binarySearch(num);
    if (index !== undefined && this.slots[index] === num) {
      this.slots.splice(index, 1);
    } else {
      console.log("COULD NOT REMOVE", num, "FROM ", this.slots);
    }
  }

  getSlot(powerLevel: number): number | void {
    const slotLevel = this._findNextLargest(powerLevel);

    if (slotLevel !== undefined) {
      this._removeOnce(slotLevel);
    }

    return slotLevel;
  }

  previewSlots(
    powerLevel: number,
    count: number = 1
  ): Array<number> | number | boolean {
    const firstIndex = this._findNextLargest(powerLevel, true);

    if (firstIndex === undefined) {
      return false;
    }

    const slots = [];
    for (let i = 0; i < count; i++) {
      const index = firstIndex + i;
      const level = this.slots[index];
      if (level) {
        slots.push(level);
      } else {
        return false;
      }
    }

    return count === 1 ? slots[0] : slots;
  }

  returnSlots(slots: Array<number>): void {
    slots.forEach(this.returnSlot);
  }

  returnSlot(slotLevel: number): void | Array<number> {
    if (!slotLevel) {
      return;
    }

    let index = this._binarySearch(slotLevel);

    if (index === undefined) {
      return;
    }

    if (this.slots[index] >= slotLevel) {
      return this.slots.splice(index, 0, slotLevel);
    }

    while (this.slots[index] && this.slots[index] < slotLevel) {
      index++;
    }

    if (!this.slots[index]) {
      this.slots.push(slotLevel);
    } else {
      this.slots.splice(index, 0, slotLevel);
    }
  }

  reset(): void {
    this.slots = [...enhancementSlots];
  }
}

const instance: SlotsManager = new SlotsManager();
export default instance;
