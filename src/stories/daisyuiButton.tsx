import React from 'react';

interface ButtonProps {
  label: string;
}

export const Button = ({ label }: ButtonProps) => {
  return (
    <button type="button" className="btn btn-primary">
      {label}
    </button>
  );
};
