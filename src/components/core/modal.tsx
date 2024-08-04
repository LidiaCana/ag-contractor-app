import React from 'react';
import { css, Modal, styled } from '@mui/material';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: string;
}
export default function ModalComponent({ open, onClose, children, height = '100%' }: ModalProps): React.JSX.Element {
  return (
    <BaseModal keepMounted open={open} onClose={onClose}>
      <ModalContent sx={{ width: 600, height }} style={{ overflowY: 'scroll' }}>
        {children}
      </ModalContent>
    </BaseModal>
  );
}
const ModalContent = styled('div')(
  () => css`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    flex-direction: column;
  `
);
const BaseModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
