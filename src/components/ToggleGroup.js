import styled from 'styled-components';

function ToggleGroup({ options, value, onChange }) {
  return (
    <Wrapper>
      {options.map((opt) => (
        <ToggleButton
          key={opt.value}
          $active={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </ToggleButton>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
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

export default ToggleGroup;
