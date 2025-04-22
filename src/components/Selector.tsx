import React from "react";

interface SelectorProps<T> {
  title: string;
  gridCols: number;
  items: T[];
  selectedItem: T;
  onSelectItem: (item: T) => void;
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
}

export function Selector<T>({ 
  title, 
  gridCols, 
  items, 
  selectedItem, 
  onSelectItem, 
  renderItem 
}: SelectorProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-center">{title}</p>
      <div className={`grid grid-cols-${gridCols} gap-4`}>
        {items.map((item, index) => (
          <button
            key={index}
            className={`p-2 border rounded ${selectedItem === item ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => onSelectItem(item)}
          >
            {renderItem(item, selectedItem === item)}
          </button>
        ))}
      </div>
    </div>
  );
}