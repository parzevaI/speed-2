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

  const [editorMode, setEditorMode] = React.useState('edit');

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

  // Keep parsed words in sync when entering play mode so clicks map correctly
  React.useEffect(() => {
    if (editorMode === 'play') {
      updateWordList();
    }
  }, [editorMode]);

  return (
    <Wrapper>
      <TextStream>
        {formatted(wordList[wordIndex])}
      </TextStream>
      <InputWrapper>
        <Button onClick={() => {
          updateWordList();
          setIsPlaying((prev) => !prev);
          setEditorMode("play");
        }}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button
          onClick={() => {
            setIsPlaying(false);
            updateWordList();
            setWordIndex(0);
            setEditorMode("play");
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

        <ModeToggle>
          <ToggleButton
            $active={editorMode === 'edit'}
            onClick={() => setEditorMode('edit')}
          >
            Edit
          </ToggleButton>
          <ToggleButton
            $active={editorMode === 'play'}
            onClick={() => setEditorMode('play')}
          >
            Play
          </ToggleButton>
        </ModeToggle>
      </InputWrapper>

      <ScrollWrapper>
        {editorMode === 'edit' ? (
          <WordBox 
            ref={textareaRef}
            value={wordsInput}
            onChange={(event) => {
              setWordsInput(event.target.value)
            }}
          />
        ) : (
          <PlayBox>
            {renderClickableText(wordsInput, (idx) => {
              if (idx < 0 || idx >= wordList.length) return;
              setWordIndex(idx);
            })}
          </PlayBox>
        )}
      </ScrollWrapper>
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

  // Render text preserving whitespace segments, making words clickable
  function renderClickableText(source, onWordClick) {
    const tokens = source.split(/(\s+)/);
    let runningWordIdx = 0;
    return tokens.map((tok, i) => {
      if (tok.match(/^\s+$/)) {
        // whitespace: render as-is to preserve layout
        return <span key={i}>{tok}</span>;
      }
      const idxForThisWord = runningWordIdx++;
      return (
        <ClickableWord
          key={i}
          onClick={() => onWordClick(idxForThisWord)}
          $active={idxForThisWord === wordIndex}
          aria-label={`Jump to word ${idxForThisWord + 1}`}
        >
          {tok}
        </ClickableWord>
      );
    });
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

const TextStream = styled.div`
  color: black;
  font-size: 2rem;
  font-family: monospace;

  display: flex;
  align-items: center;
  padding-block: 32px;
  height: 200px;
`;

const InputWrapper = styled.div`
  padding: 32px;

  display: flex;
  align-items: center;
  gap: 16px;

  border-block: 2px solid black;
`;

const ScrollWrapper = styled.div`
  flex: 1;
  overflow: scroll;
`;

const WordBox = styled.textarea`
  height: 100%;
  width: 100%;
  border: none;
  padding: 16px 24px;
  font: 16px/1.6 monospace;
  outline: none;
`;

const PlayBox = styled.div`
  padding: 16px 24px;
  font: 16px/1.6 monospace;
  white-space: pre-wrap;
  user-select: text;
`;

const ClickableWord = styled.span`
  cursor: pointer;
  border-radius: 4px;
  padding: 0; /* avoid altering spacing compared to raw text */
  transition: background-color 120ms ease-in-out;
  background-color: ${({ $active }) => ($active ? 'rgba(255,0,0,0.12)' : 'transparent')};
  &:hover {
    background-color: rgba(0,0,0,0.06);
  }
`;

const Button = styled.button`
  width: 100px;
  height: 50px;
`;

const ModeToggle = styled.div`
  margin-left: auto;
  display: inline-flex;
  border: 1px solid black;
  border-radius: 6px;
  overflow: hidden;
`;

const ToggleButton = styled.button`
  appearance: none;
  border: 0;
  background: ${({ $active }) => ($active ? 'black' : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : 'black')};
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
`;

const Slider = styled.input``;

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
