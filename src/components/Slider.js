import styled from 'styled-components';

function Slider(props) {
  return <StyledSlider type="range" {...props} />;
}

const StyledSlider = styled.input`
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

export default Slider;
