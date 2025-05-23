import React, { forwardRef } from "react";

interface InputFieldProps {
  value: string;
  index: number;
  onChange: (value: string, index: number) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  isBinaryInput?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onClick?: () => void;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ value, index, onChange, onKeyDown, isBinaryInput = false, disabled = false, readOnly = false, onClick }, ref) => {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value, index)}
        onKeyDown={onKeyDown ? (e) => onKeyDown(e, index) : undefined}
        onClick={onClick}
        className={"p-2 border rounded w-16 text-center"}
        ref={ref}
        maxLength={isBinaryInput ? 4 : undefined}
        disabled={disabled}
        readOnly={readOnly} 
      />
    );
  }
);

InputField.displayName = "InputField";