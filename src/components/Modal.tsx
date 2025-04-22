import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string; 
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={onClose}
      ></div>
      <div className="relative flex items-center justify-center h-full -mt-4">
        <div className={`p-6 rounded shadow-lg z-10 ${className || ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
};