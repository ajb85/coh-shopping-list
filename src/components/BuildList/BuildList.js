import React, { useState, useEffect, useContext } from 'react';

import { BuildContext } from 'Providers/Builds.js';
import FilterOptions from './FilterOptions.js';

import categoryName from 'js/categories.js';
import doesSetMatchKeyword from 'js/doesSetMatchKeyword.js';

import styles from './styles.module.scss';

function ListBuild(props) {
  const [filters, setFilters] = useState({
    order: 'asc',
    tags: { length: 0 },
    options: [],
    search: ''
  });

  const { build, saveBuild } = useContext(BuildContext);

  const toggleTag = tag => {
    if (filters.tags[tag]) {
      const newTags = { ...filters.tags };
      delete newTags[tag];
      newTags.length--;
      setFilters({ ...filters, tags: newTags });
    } else {
      setFilters({
        ...filters,
        tags: { ...filters.tags, length: filters.tags.length + 1, [tag]: true }
      });
    }
  };

  const setSearch = e => {
    setFilters({ ...filters, search: e.target.value });
  };

  const enhancementList = Object.entries(build)
    .filter(([setName, enhancements]) => {
      if (!filters.tags.length) {
        return doesSetMatchKeyword(filters.search, setName, enhancements);
      }
      for (let e in enhancements) {
        const stats = e.split('/');
        for (let i = 0; i < stats.length; i++) {
          const s = stats[i];
          const category = categoryName[s.toLowerCase()];
          if (category && filters.tags[category.name]) {
            return doesSetMatchKeyword(filters.search, setName, enhancements);
          }
        }
      }
      return false;
    })
    .sort((a, b) => {
      const countA = Object.keys(a[1]).length;
      const countB = Object.keys(b[1]).length;
      return countA === countB ? 0 : countA > countB ? -1 : 1;
    })
    .map(([setName, enhancements]) => {
      const allEnhancements = [];
      for (let e in enhancements) {
        const count = enhancements[e];
        allEnhancements.push({ name: e, count });
      }
      return (
        <div key={setName} className={styles.set}>
          <h2>{setName}</h2>
          <div className={styles.enhancements}>
            {allEnhancements.map(({ name, count }) => (
              <p key={name}>
                {count}: {name}
              </p>
            ))}
          </div>
        </div>
      );
    });

  useEffect(() => {
    const categoryList = new Set();
    for (let setName in build) {
      for (let eName in build[setName]) {
        eName.split('/').forEach(n => {
          const category = categoryName[n.toLowerCase()];
          if (category) {
            categoryList.add(category);
          }
        });
      }
    }

    const options = [...categoryList].sort((a, b) =>
      a.name === b.name ? 0 : a.name > b.name ? 1 : -1
    );

    setFilters({ ...filters, options });
    // eslint-disable-next-line
  }, [build]);

  return (
    <div className={styles.BuildList}>
      <FilterOptions
        filters={filters}
        toggleTag={toggleTag}
        setSearch={setSearch}
      />
      {/* <div className={styles.block} /> */}
      <div className={styles.list}>
        {enhancementList.length ? (
          enhancementList
        ) : (
          <p>
            Whoops, you don't have any enhancements that match that criteria!
          </p>
        )}
      </div>
      {/* <div className={styles.newBuild}>
        <button type="button" onClick={saveBuild}>
          New Build
        </button>
      </div> */}
    </div>
  );
}

export default ListBuild;
