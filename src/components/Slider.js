import styled from 'styled-components';

function Slider(props) {
  return <StyledSlider type="range" {...props} />;
}

const StyledSlider = styled.input`
  --thumb-size: 16px;
  --track-height: 4px;

  -webkit-appearance: none;
  appearance: none;
  width: 120px;
  height: var(--thumb-size);
  background: transparent;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: 50%;
    background: var(--accent);
    cursor: pointer;
    border: none;
    margin-top: calc((var(--track-height) - var(--thumb-size)) / 2);
    transition: transform 150ms ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  &::-moz-range-thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: 50%;
    background: var(--accent);
    cursor: pointer;
    border: none;
  }

  &::-webkit-slider-runnable-track {
    height: var(--track-height);
    background: var(--control-bg);
    border-radius: 2px;
  }

  &::-moz-range-track {
    height: var(--track-height);
    background: var(--control-bg);
    border-radius: 2px;
  }
`;

export default Slider;
