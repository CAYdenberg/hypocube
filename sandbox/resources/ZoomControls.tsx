import React from 'react';

export const ZoomControlsContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="zoom-controls-wrapper">
      <div className="drag-direction">Drag or swipe to move the x-axis</div>
      <ul className="zoom-list">{children}</ul>
    </div>
  );
};

interface Props {
  icon: React.ReactNode;
  text: string;
  isDisabled?: boolean;
  onClick: () => void;
}

export const ZoomControl: React.FC<Props> = ({
  icon,
  text,
  isDisabled,
  onClick,
}) => {
  return (
    <li className="zoom-list-item">
      <button
        type="button"
        className="zoom-btn"
        disabled={isDisabled}
        onClick={onClick}
      >
        {icon}
        <span className="zoom-text">{text}</span>
      </button>
    </li>
  );
};
