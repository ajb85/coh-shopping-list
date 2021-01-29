import React from "react";
import styled from "styled-components";

import styles from "./styles.module.scss";

export default function NavSlider(props) {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <Container
      className={styles.NavSlider}
      length={props.categories.length}
      active={activeTab}
      textLength={
        props.categories[activeTab] ? props.categories[activeTab].length : 0
      }
    >
      <div />
      {props.categories &&
        props.categories.map((name, i) => (
          <NavWrap key={name} length={props.categories.length}>
            <p onClick={setActiveTab.bind(null, i)}>{name}</p>
          </NavWrap>
        ))}
    </Container>
  );
}

const paddlePadding = 5;
const textPadding = 10;
const charWidth = 5;

const paddleStaticWidth = textPadding * 2 + paddlePadding * 2;

const NavWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ length }) => Math.round(100 / length)}%;

  p {
    padding: 0 10px;
    cursor: pointer;
  }
`;

const Container = styled.div`
  & > div:first-of-type {
    // Paddle
    left: ${({ length, active, textLength }) =>
      `calc(${getElementCenter(length)}% * (${active * 2 + 1})  - ${
        (textLength * charWidth + paddleStaticWidth) / 2
      }px)`};
    width: ${({ textLength }) => textLength * charWidth + paddleStaticWidth}px;
  }
`;

function getElementCenter(length) {
  switch (length) {
    case 3:
      return 16.5;
    case 6:
      return 8.3333333;
    default:
      return 50 / length;
  }
}
