// @flow

// Effects
type EnhancementEffect = Array<any>;
type PowerEffect = Array<any>;

export type Enhancement = {|
  boostUsePlayerLevel: boolean,
  description:
    | string
    | {
        long: string,
        short: string,
      },
  displayName: string,
  //   effects: EnhancementEffect,
  fullName: "Boosts.Attuned_Unbreakable_Guard_A.Attuned_Unbreakable_Guard_A",
  image: string,
  imageName?: string,
  isUnique: boolean,
  setIndex?: number,
  setType?: number,
  tier: string,
  type: string,
  aliases?: Array<string>,
|};

export type IOSet = {|
  displayName: string,
  enhancements: Array<Enhancement>,
  fullName: string,
  imageName: string,
  imageNameSuperior: string,
  isAttuned: true,
  levels: { min: number, max: number },
  setIndex: number,
  setType: number,
  setTypeName: string,
|};

export type ShopperEnhancement = {|
  name: string,
  powerList: { [key: string]: { count: number } },
|};

export type EnhancementSlot = {|
  slotLevel: null | number,
  enhancement: Enhancement,
|};

export type Power = {|
  accuracy: number,
  accuracyMult: number,
  allowedEnhancements: Array<string>,
  aoeModifier: number,
  archetypeOrder: string,
  attackTypes: number,
  baseRechargeTime: number,
  castTime: number,
  castTimeReal: number,
  description: {
    short: string,
    long: string,
  },
  displayName: string,
  effectArea: number,
  effects: PowerEffect,
  endCost: number,
  enhancementCount: number,
  fullName: string,
  hasGrantPowerEffect: true,
  ignoreEnh: Array<number>,
  ignore_Buff: Array<number>,
  level: number,
  neverAutoUpdate: true,
  numAllowed: number,
  ogFullName: string,
  powerIndex: number,
  range: number,
  rechargeTime: number,
  requires: {
    count: number,
    powers: {
      [key: string]: boolean,
    },
  },
  setTypes: Array<number>,
  slottable: boolean,
  target: number,
  targetLoS: boolean,
  toggleCost: number,
|};

export type PowerSlot = {|
  level: number,
  power: Power,
  enhSlots: Array<EnhancementSlot>,
  type: string,
|};
