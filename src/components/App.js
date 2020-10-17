import React, { useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import Button from "./Button";
import Deadman from "./DeadMan";
import DeadLetters from "./DeadLetters";
import TheWord from "./TheWord";
import Keyboard from "./Keyboard";
import GameOverModal from "./GameOverModal";
import words from "../data/words.json";
import bodyParts from "../data/body-parts.json";

import { colors, contentWidth } from "./GlobalStyles";

const initializeGameState = {
  started: false,
  over: false,
  win: false,
  paused: false,
};

const App = () => {
  const [game, setGame] = useState(initializeGameState);
  const [word, setWord] = useState({ str: "", revealed: [] });
  const [buttonText, setButtonText] = useState({ str: "Start" });
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);

  const showBodyPart = (part, color) => {
    document.querySelector(`.${part}`).style.stroke = color;
  };

  const getNewWord = () => {
    setWord({
      str: (word.str = words[Math.floor(Math.random() * words.length)]),
      revealed: (word.revealed = word.str
        .split("")
        .map((letter) => (letter = ""))),
    });
  };
  const handleStart = () => {
    if (buttonText.str === "Start") {
      setButtonText({ str: (buttonText.str = "Pause") });
      setGame({ ...game, paused: !game.paused });
    } else if (buttonText.str === "Pause") {
      setButtonText({ str: (buttonText.str = "Start") });
      setGame({ ...game, paused: !game.paused });
    }
    if (!word.str) {
      setGame({ ...game, started: !game.started });
      getNewWord();
    }
  };

  const handleGuess = (ltr) => {
    setUsedLetters([...usedLetters, ltr]);
    if (word.str.indexOf(ltr) === -1) {
      setWrongGuesses([...wrongGuesses, ltr]);
      showBodyPart(bodyParts[wrongGuesses.length], colors.yellow);
    } else {
      for (let i = 0; i < word.str.length; i++) {
        if (word.str[i] === ltr) {
          word.revealed.splice(i, 1, ltr);
        }
      }
    }
    if (wrongGuesses.length >= 9) {
      handleEndGame(false);
    }
    if (
      word.revealed.every((letter) => {
        if (letter !== "") {
          return true;
        }
      })
    ) {
      handleEndGame(true);
    }
  };

  const handleReset = () => {
    setGame({ ...initializeGameState, started: true });
    setWord({ str: "", revealed: [] });
    getNewWord();
    setWrongGuesses([]);
    setUsedLetters([]);
    bodyParts.forEach((part) => showBodyPart(part, "transparent"));
  };

  const handleEndGame = (win) => {
    setGame({ ...game, over: !game.over });
    if (win === true) {
      setGame({ ...game, over: !game.over, win: !game.win });
    }
  };

  return (
    <Wrapper>
      {game.over && (
        <GameOverModal word={word.str} game={game} newGame={handleReset} />
      )}
      <Header />
      <Nav>
        <Button onClickFunc={handleStart}>{buttonText.str}</Button>
        <Button onClickFunc={handleReset}>Reset</Button>
      </Nav>
      {game.started && (
        <>
          <Container>
            <Deadman />
            <RightColumn>
              <DeadLetters wrongLetters={wrongGuesses} />
              <TheWord revealed={word.revealed} />
            </RightColumn>
          </Container>
          <Keyboard usedLetters={usedLetters} handler={handleGuess} />
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${colors.blue};
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  height: 100vh;
  padding: 0 0 64px 0;
`;
const Nav = styled.div`
  max-width: ${contentWidth};
  display: flex;
  height: 80px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${contentWidth};
  min-width: 320px;
  position: relative;
  padding: 20px 0;

  @media (min-width: 600px) {
    flex-direction: row;
  }
`;
const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

export default App;
