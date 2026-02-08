import styled from 'styled-components';
import { findOVPIndex } from '@/utils/focal';

function WordDisplay({ word }) {
  const focalIndex = findOVPIndex(word);

  return (
    <Container>
      <WordBoundary style={{ textAlign: 'right' }}>
        {word.slice(0, focalIndex)}
      </WordBoundary>
      <FocalLetter>{word.at(focalIndex)}</FocalLetter>
      <WordBoundary>
        {word.slice(focalIndex + 1)}
      </WordBoundary>
    </Container>
  );
}

const Container = styled.div`
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

const WordBoundary = styled.div`
  flex: 1;
`;

const FocalLetter = styled.span`
  color: var(--accent);
`;

export default WordDisplay;
