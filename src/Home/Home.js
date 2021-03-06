import React from "react";

import styles from "./styles.module.scss";

export default function Home() {
  document.title = "Stinkfoot CoH Companion";
  return (
    <div className={styles.Home}>
      This is currently just a barebones version of the app that is meant to act
      as a proof-of-concept. If you're using this, please understand things will
      break, your data will be removed at some points, and you'll generally just
      encounter frustrations. It's a work in progress but it will get better.
      Even this awful-looking landing page is meant to clearly state right away
      that this webapp is in an early state! Feel free to offer feedback on
      <a href="https://discord.gg/XdXK7Vwnvz">Discord</a>
    </div>
  );
}
