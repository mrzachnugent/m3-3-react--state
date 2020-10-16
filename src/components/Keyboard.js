import React from "react";
import styled from "styled-components";
import LetterKey from "./LetterKey";

import letters from "../data/letters.json";

import { colors, contentWidth } from "./GlobalStyles";

const Keyboard = ({ handler }) => (
  <Wrapper>
    {letters.map((letter) => {
      return <LetterKey value={letter} handler={handler} />;
    })}
  </Wrapper>
);

const Wrapper = styled.div`
  background: ${colors.yellow};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 auto;
  padding: 20px 12px;
  max-width: ${contentWidth};
  min-width: 320px;
`;

export default Keyboard;
