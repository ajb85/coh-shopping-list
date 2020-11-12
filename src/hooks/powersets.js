import poolPowers from "data/poolPowers.js";

import useActiveSets from "providers/builder/useActiveSets.js";
import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import usePoolPowers from "providers/builder/usePoolPowers.js";

import {
  getPowersets,
  togglePower,
  canPowersetBeAdded,
  powerSelectionColor,
  getNextActiveLevel,
  getSlotIndexFromActiveLevel,
} from "helpers/powersets.js";

import { useGetBonusesForSet } from "hooks/enhancements.js";

import analyzeBuild from "helpers/analyzeBuild.js";

/******************************************
 ******************************************
 ***********  DATA RETRIEVAL  *************
 ******************************************
 *****************************************/
export function usePowersets(archetypeOrder) {
  const { character } = useCharacterDetails();
  const { archetype } = character;
  return getPowersets(archetype, archetypeOrder);
}

export function useActivePowerset(archetypeOrder) {
  const { tracking } = useActiveSets();
  const activeIndex = tracking[archetypeOrder];
  return usePowersets(archetypeOrder)[activeIndex];
}

export function useBuildHasPower(power) {
  const { lookup } = useBuildAnalysis();
  return lookup.powers[power.fullName] !== undefined;
}

export const useBuildAnalysis = () => {
  const { character } = useCharacterDetails();
  const { powerSlots } = usePowerSlots();
  const activePowersets = {
    primary: useActivePowerset("primary"),
    secondary: useActivePowerset("secondary"),
    pools: useSelectedPools(),
  };
  const getBonusesForSet = useGetBonusesForSet();

  return analyzeBuild(
    powerSlots,
    character.archetype,
    activePowersets,
    getBonusesForSet
  );
};

/******************************************
 ******************************************
 *********  FUNCTION RETRIEVERS  **********
 ******************************************
 *****************************************/
export const useTogglePowerSlot = (index) => {
  const { tracking, setTrackingManually } = useActiveSets();
  const toggled = tracking.toggledSlot;
  const value = index === toggled ? null : index;
  return setTrackingManually.bind(this, "toggledSlot", value);
};

export const useRemoveSlotToggles = () => {
  const { setTrackingManually } = useActiveSets();
  return setTrackingManually.bind(this, "toggledSlot", null);
};

export const useResetBuild = () => {
  const { resetPowerSlots } = usePowerSlots();
  const { resetPools } = usePoolPowers();

  return () => {
    resetPowerSlots();
    resetPools();
  };
};

export const useSwitchArchetype = () => {
  const { setCharacterDetail } = useCharacterDetails();
  const resetBuild = useResetBuild();
  return (e) => {
    setCharacterDetail(e);
    resetBuild();
  };
};

export const useChangePowerset = () => {
  const { powerSlots, removePowerFromSlot, addPowerToSlot } = usePowerSlots();
  const { setActiveTracking } = useActiveSets();
  const secondaries = usePowersets("secondaries");
  return (e) => {
    powerSlots.forEach(
      ({ power }, i) =>
        power &&
        e.target.name === power.archetypeOrder &&
        removePowerFromSlot(i)
    );
    setActiveTracking(e);
    if (e.target.name === "secondary" && !!powerSlots[0].power) {
      // Replace first power if it's been selected
      addPowerToSlot(secondaries[e.target.value].powers[0], 0);
    }
  };
};

export const useTogglePower = () => {
  const trackingState = useActiveSets();
  const details = useBuildAnalysis();
  const psFuncs = usePowerSlots();
  const { character } = useCharacterDetails();
  return togglePower.bind(
    this,
    trackingState,
    character.archetype,
    details,
    psFuncs
  );
};

export const usePowerSelectionColor = () => {
  const { tracking } = useActiveSets();
  const details = useBuildAnalysis();
  const { powerSlots } = usePowerSlots();
  const getSlotIndex = getSlotIndexFromActiveLevel.bind(this, tracking);
  const getSlotFromPower = (power) => powerSlots[getSlotIndex(power)];
  return powerSelectionColor.bind(this, details, getSlotFromPower);
};

export function useCanPowersetBeAdded() {
  const details = useBuildAnalysis();
  return canPowersetBeAdded.bind(this, details);
}

export const useNextActiveLevel = () => {
  const { powerSlots } = usePowerSlots();
  const { setTrackingManually } = useActiveSets();
  return getNextActiveLevel.bind(this, setTrackingManually, powerSlots);
};

/******************************************
 ******************************************
 ***********  STATE UPDATERS  *************
 ******************************************
 *****************************************/

/******************************************
 ******************************************
 *************  POOL POWERS  **************
 ******************************************
 *****************************************/
export function useBuildHasPool(poolIndex) {
  const { pools } = usePoolPowers();
  return !!pools.find((p) => p.poolIndex === poolIndex);
}

export function useSelectedPoolNames() {
  const { pools } = usePoolPowers();
  const poolData = [];

  for (let i = 0; i < pools.length; i++) {
    poolData.push(poolPowers[i].displayName);
  }

  return poolData;
}

export const useSelectedPools = () => {
  const { pools } = usePoolPowers();
  const poolData = [];

  for (let i = 0; i < pools.length; i++) {
    poolData.push(poolPowers[pools[i]]);
  }

  return poolData;
};

export function useCanPoolBeAdded() {
  const canPoolBeAdded = useCanPowersetBeAdded();
  const selectedPools = useSelectedPoolNames();

  return (pool) => canPoolBeAdded(pool) && selectedPools.length < 4;
}

export function useAddPowerFromNewPool() {
  const pool = useActivePowerset("poolPower");
  const canBeAdded = useCanPoolBeAdded()(pool);
  const togglePower = useTogglePower();
  const updateTracking = useFirstUnusedPool();
  const { addPool } = usePoolPowers();

  return (power) => {
    if (canBeAdded) {
      const { poolIndex } = pool;
      addPool(poolIndex);
      togglePower(power);
      updateTracking();
    }
  };
}

export function useFirstUnusedPool() {
  const { setTrackingManually } = useActiveSets();
  const activePool = useActivePowerset("poolPower");
  const canPoolBeAdded = useCanPoolBeAdded();
  const firstPool = poolPowers.find(evaluatePool) || {};
  return setTrackingManually.bind(this, "poolPower", firstPool.poolIndex || 0);

  function evaluatePool(pool) {
    const isNotActivePool = pool.poolIndex !== activePool.poolIndex;
    const isExcludedByActivePool =
      activePool.prevents &&
      activePool.prevents.find((p) => p === pool.fullName);

    return canPoolBeAdded(pool) && isNotActivePool && !isExcludedByActivePool; // n^2, but tiny n
  }
}

export function useRemovePool() {
  const { powerSlots, removePowerFromSlot } = usePowerSlots();
  const { removePool } = usePoolPowers();
  return (poolIndex) => {
    powerSlots.forEach(({ power }, i) => {
      if (power && power.poolIndex === poolIndex) {
        removePowerFromSlot(i);
      }
    });
    removePool(poolIndex);
  };
}
