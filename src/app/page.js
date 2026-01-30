'use client';
import styled from 'styled-components';
import React from 'react';

import { findOVPIndex, getDuration } from '@/utils/focal';
import { formatTime } from '@/utils/utils.js';

function Home() {
  const [wordIndex, setWordIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [wpm, setWpm] = React.useState(250);

  const [wordsInput, setWordsInput] = React.useState("insert text here");
  const [wordList, setWordList] = React.useState(["insert", "text", "here"]);
  const [wordPositions, setWordPositions] = React.useState([]);

  const timeoutRef = React.useRef(null);
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    if (!isPlaying) return;

    const word = wordList[wordIndex];
    if (!word) return;

    const duration = getDuration(word, wpm);

    timeoutRef.current = setTimeout(() => {
      setWordIndex((prev) => {
        if (prev >= wordList.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, duration);

    return () => clearTimeout(timeoutRef.current);
  }, [isPlaying, wordIndex, wpm, wordList]);

  // When the active word changes during playback, select it in the textarea
  React.useEffect(() => {
    if (!isPlaying) return;
    const pos = wordPositions[wordIndex];
    const el = textareaRef.current;
    if (!el || !pos) return;
    // Focus so selection is visible but avoid jumping the page
    el.focus({ preventScroll: true });
    el.setSelectionRange(pos.start, pos.end);
  }, [wordIndex, isPlaying, wordPositions]);


  return (
    <Wrapper>
      <Text>
        {formatted(wordList[wordIndex])}
      </Text>
      <InputWrapper>
        <Button onClick={() => {
          updateWordList()
          setIsPlaying((prev) => !prev);
        }}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button
          onClick={() => {
            setIsPlaying(false)
            updateWordList()
            setWordIndex(0)
          }}
        >
          Reset
        </Button>
        <Slider
          type="range"
          min="10"
          max="900"
          step="10"
          name="wpm"
          value={wpm}
          onChange={(event) => {
            setWpm(Number(event.target.value))
          }}
        />
        <Wpm htmlFor="wpm">{wpm} wpm</Wpm>
        <Time>{formatTime(wordList.length / (wpm / 60))}</Time>
      </InputWrapper>
      <WordBox 
        ref={textareaRef}
        value={wordsInput}
        onChange={(event) => {
          setWordsInput(event.target.value)
        }}
      />
    </Wrapper>
  )


  // functions
  function formatted(word) {
    const focalIndex = findOVPIndex(word) // flower = 5

    return (
      <>
        <WordBoundery style={{textAlign: 'right'}}>
          {word.slice(0, focalIndex)}
        </WordBoundery>

        <FocalLetter>{word.at(focalIndex)}</FocalLetter>

        <WordBoundery>
          {word.slice(focalIndex+1)}
        </WordBoundery>
      </>
    )
  }

  function updateWordList() {
    const split = wordsInput.split(/\s+/); // split by space, tab, or newline
    setWordList(split);
    setWordPositions(computeWordPositions(wordsInput));
  }

  // Compute the start/end character indices of each word in the textarea value
  function computeWordPositions(source) {
    const matches = [...source.matchAll(/\S+/g)];
    return matches.map((m) => ({ start: m.index, end: m.index + m[0].length }));
  }
}


// styles

const Wrapper = styled.div`
  height: 100%; 
  display: flex;
  flex-direction: column;
`;

const Text = styled.div`
  color: black;
  font-size: 2rem;
  font-family: monospace;
  flex: 1;

  display: flex;
  align-items: center;
  padding-block: 32px;
  height: fit-content;
  flex: 1;
`

const InputWrapper = styled.div`
  padding: 32px;

  display: flex;
  align-items: center;
  gap: 16px;

  border-block: 2px solid black;
`;

const WordBox = styled.textarea`
  flex: 1;
  border: none;
`;

const Button = styled.button`
  width: 100px;
  height: 50px;;
`;

const Slider = styled.input`

`;

const Wpm = styled.label`
  font-family: Arial;
`;

const Time = styled.p`
  font-family: Arial;
`;

const WordBoundery = styled.div`
  flex: 1;
`;

const FocalLetter = styled.span`
  color: red;
`;

export default Home
