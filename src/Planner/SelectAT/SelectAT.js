import React from 'react';

import powersets from 'data/powersets.js';
import origins from 'data/origins.js';

function SelectAT({ build, updateBuild, setBuild }) {
  const setAlignment = (alignment) => {
    setBuild({ ...build, alignment });
  };
  return (
    <form>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={build.name}
          name="name"
          onChange={(e) => updateBuild(e)}
        />
      </div>
      <div>
        <label>Archetype</label>
        <select
          value={build.archetype}
          name="archetype"
          onChange={(e) => updateBuild(e)}
        >
          {Object.keys(powersets).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Origin</label>
        <select
          value={build.origin}
          name="origin"
          onChange={(e) => updateBuild(e)}
        >
          {origins.map((o) => (
            <option key={o.name} value={o.name}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button
          type="text"
          disabled={build.alignment === 'Hero'}
          style={{ opacity: build.alignment === 'Hero' ? 0.5 : 1 }}
          onClick={setAlignment.bind(this, 'Hero')}
        >
          Hero
        </button>
        <button
          type="text"
          disabled={build.alignment === 'Villain'}
          style={{ opacity: build.alignment === 'Villain' ? 0.5 : 1 }}
          onClick={setAlignment.bind(this, 'Villain')}
        >
          Villain
        </button>
      </div>
    </form>
  );
}

export default SelectAT;
