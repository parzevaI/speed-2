'use client';
import styled from 'styled-components';
import React from 'react';

import { getDuration } from '@/utils/focal';
import { formatTime } from '@/utils/utils.js';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import ToggleGroup from '@/components/ToggleGroup';
import Slider from '@/components/Slider';
import WordDisplay from '@/components/WordDisplay';

const modeOptions = [
  { label: 'Edit', value: 'edit' },
  { label: 'Play', value: 'play' },
];

function Home() {
  const [wordIndex, setWordIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [wpm, setWpm] = React.useState(250);

  const [wordsInput, setWordsInput] = React.useState("insert text here");
  const [wordStreamList, setWordStreamList] = React.useState(["insert", "text", "here"]);
  const [wordPositions, setWordPositions] = React.useState([]);

  const [editorMode, setEditorMode] = React.useState('edit');

  const timeoutRef = React.useRef(null);
  const textareaRef = React.useRef(null);

  // Keep derived data in sync with text input
  React.useEffect(() => {
    const split = wordsInput.split(/\s+/);
    setWordStreamList(split);
    setWordPositions(computeWordPositions(wordsInput));
  }, [wordsInput]);

  // Playback timing
  React.useEffect(() => {
    if (!isPlaying) return;

    const word = wordStreamList[wordIndex];
    if (!word) return;

    const duration = getDuration(word, wpm);

    timeoutRef.current = setTimeout(() => {
      setWordIndex((prev) => {
        if (prev >= wordStreamList.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, duration);

    return () => clearTimeout(timeoutRef.current);
  }, [isPlaying, wordIndex, wpm, wordStreamList]);

  // Select active word in textarea during playback
  React.useEffect(() => {
    if (!isPlaying) return;
    const pos = wordPositions[wordIndex];
    const el = textareaRef.current;
    if (!el || !pos) return;

    el.focus({ preventScroll: true });
    el.setSelectionRange(pos.start, pos.end);
  }, [wordIndex, isPlaying, wordPositions]);

  // Spacebar play/pause
  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space' && editorMode === "play") {
        event.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [editorMode]);

  const progress = wordStreamList.length > 1
    ? (wordIndex / (wordStreamList.length - 1)) * 100
    : 0;

  return (
    <Wrapper>
      <WordDisplay word={wordStreamList[wordIndex]} />

      <ProgressBar value={progress} />

      <InputWrapper>
        <Button
          variant="primary"
          onClick={() => {
            setIsPlaying((prev) => !prev);
            setEditorMode("play");
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            setIsPlaying(false);
            setWordIndex(0);
            setEditorMode("play");
          }}
        >
          Reset
        </Button>

        <Slider
          min="10"
          max="900"
          step="10"
          name="wpm"
          value={wpm}
          onChange={(event) => {
            setWpm(Number(event.target.value));
          }}
        />

        <Wpm htmlFor="wpm">{wpm} wpm</Wpm>
        <Time>{formatTime(wordStreamList.length / (wpm / 60))}</Time>

        <ToggleGroup
          options={modeOptions}
          value={editorMode}
          onChange={setEditorMode}
        />
      </InputWrapper>

      <ScrollWrapper>
        {editorMode === 'edit' ? (
          <WordBox
            ref={textareaRef}
            value={wordsInput}
            onChange={(event) => {
              setWordsInput(event.target.value);
            }}
          />
        ) : (
          <PlayBox>
            {renderClickableText(wordsInput, (idx) => {
              if (idx < 0 || idx >= wordStreamList.length) return;
              setWordIndex(idx);
            })}
          </PlayBox>
        )}
      </ScrollWrapper>
    </Wrapper>
  );

  // ---------- helpers ----------

  function renderClickableText(source, onWordClick) {
    const tokens = source.split(/(\s+)/);
    let runningWordIdx = 0;

    return tokens.map((tok, i) => {
      if (tok.match(/^\s+$/)) {
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

  function computeWordPositions(source) {
    const matches = [...source.matchAll(/\S+/g)];
    return matches.map((m) => ({
      start: m.index,
      end: m.index + m[0].length,
    }));
  }
}

// ---------- styles ----------

const Wrapper = styled.div`
  height: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 24px 16px 0;
`;

const InputWrapper = styled.div`
  background: var(--surface);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const ScrollWrapper = styled.div`
  flex: 1;
  overflow: auto;
  margin-top: 12px;
  background: var(--surface);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
`;

const WordBox = styled.textarea`
  height: 100%;
  width: 100%;
  border: none;
  padding: 20px 24px;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.8;
  color: var(--text);
  background: transparent;
  outline: none;
  resize: none;
`;

const PlayBox = styled.div`
  padding: 20px 24px;
  font-size: 16px;
  line-height: 1.8;
  color: var(--text);
  white-space: pre-wrap;
  user-select: text;
`;

const ClickableWord = styled.span`
  cursor: pointer;
  border-radius: 4px;
  padding: 1px 0;
  transition: background-color 120ms ease-in-out;
  background-color: ${({ $active }) =>
    $active ? 'rgba(230, 57, 70, 0.15)' : 'transparent'};
  &:hover {
    background-color: ${({ $active }) =>
      $active ? 'rgba(230, 57, 70, 0.25)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const Wpm = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
`;

const WordCount = styled.span`
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
`;

const Time = styled.p`
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
`;

export default Home;
