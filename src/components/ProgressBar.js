import styled from 'styled-components';
import { motion } from 'motion/react';

function ProgressBar({ value }) {
  return (
    <Track>
      <Fill
        animate={{ width: `${value}%` }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      />
    </Track>
  );
}

const Track = styled.div`
  height: 3px;
  background: var(--control-bg);
  border-radius: 2px;
  margin: 12px 0;
  overflow: hidden;
`;

const Fill = styled(motion.div)`
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
`;

export default ProgressBar;
