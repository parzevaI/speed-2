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
      <TextStream>
        {formatted(wordStreamList[wordIndex])}
      </TextStream>

      <ProgressBar>
        <ProgressFill style={{ width: `${progress}%` }} />
      </ProgressBar>

      <InputWrapper>
        <Button
          onClick={() => {
            setIsPlaying((prev) => !prev);
            setEditorMode("play");
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>

        <Button
          $secondary
          onClick={() => {
            setIsPlaying(false);
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
            setWpm(Number(event.target.value));
          }}
        />

        <Wpm htmlFor="wpm">{wpm} wpm</Wpm>
        <WordCount>{wordIndex + 1} / {wordStreamList.length.toLocaleString()}</WordCount>
        <Time>{formatTime(wordStreamList.length / (wpm / 60))}</Time>

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

  function formatted(word) {
    const focalIndex = findOVPIndex(word);

    return (
      <>
        <WordBoundery style={{ textAlign: 'right' }}>
          {word.slice(0, focalIndex)}
        </WordBoundery>
        <FocalLetter>{word.at(focalIndex)}</FocalLetter>
        <WordBoundery>
          {word.slice(focalIndex + 1)}
        </WordBoundery>
      </>
    );
  }

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

const TextStream = styled.div`
  background: var(--surface);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
  color: var(--text);
  font-size: 2.5rem;
  font-family: monospace;
  display: flex;
  align-items: center;
  padding: 40px 32px;
  min-height: 140px;
`;

const ProgressBar = styled.div`
  height: 3px;
  background: var(--control-bg);
  border-radius: 2px;
  margin: 12px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 150ms ease-out;
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
  padding: 1px 2px;
  transition: background-color 120ms ease-in-out;
  background-color: ${({ $active }) =>
    $active ? 'rgba(230, 57, 70, 0.15)' : 'transparent'};
  &:hover {
    background-color: ${({ $active }) =>
      $active ? 'rgba(230, 57, 70, 0.25)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const Button = styled.button`
  appearance: none;
  border: ${({ $secondary }) => $secondary ? '1.5px solid var(--accent)' : 'none'};
  background: ${({ $secondary }) => $secondary ? 'transparent' : 'var(--accent)'};
  color: ${({ $secondary }) => $secondary ? 'var(--accent)' : '#ffffff'};
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;

  &:hover {
    background: ${({ $secondary }) => $secondary ? 'var(--accent)' : 'var(--accent-hover)'};
    color: #ffffff;
  }
`;

const ModeToggle = styled.div`
  margin-left: auto;
  display: inline-flex;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
`;

const ToggleButton = styled.button`
  appearance: none;
  border: 0;
  background: ${({ $active }) => ($active ? 'var(--accent)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : 'var(--text-muted)')};
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;

  &:hover {
    background: ${({ $active }) => ($active ? 'var(--accent-hover)' : 'var(--control-bg)')};
  }
`;

const Slider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 120px;
  height: 4px;
  background: var(--control-bg);
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent);
    cursor: pointer;
    border: none;
    transition: transform 150ms ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent);
    cursor: pointer;
    border: none;
  }

  &::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
  }

  &::-moz-range-track {
    height: 4px;
    background: var(--control-bg);
    border-radius: 2px;
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

const WordBoundery = styled.div`
  flex: 1;
`;

const FocalLetter = styled.span`
  color: var(--accent);
`;

export default Home;
