import styled from 'styled-components';

function Button({ variant = 'primary', children, ...props }) {
  return (
    <StyledButton $variant={variant} {...props}>
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  appearance: none;
  border: 1.5px solid var(--accent);
  background: ${({ $variant }) =>
    $variant === 'secondary' ? 'transparent' : 'var(--accent)'};
  color: ${({ $variant }) =>
    $variant === 'secondary' ? 'var(--accent)' : '#ffffff'};
  width: 80px;
  height: 40px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'secondary' ? 'var(--accent)' : 'var(--accent-hover)'};
    border-color: ${({ $variant }) =>
      $variant === 'secondary' ? 'var(--accent)' : 'var(--accent-hover)'};
    color: #ffffff;
  }

  &:active {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
    color: #ffffff;
  }
`;

export default Button;
