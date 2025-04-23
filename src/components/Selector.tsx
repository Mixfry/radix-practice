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
  const getGridColsClass = (cols: number) => {
    switch (cols) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-3";
      case 4: return "grid-cols-4";
      default: return "grid-cols-1";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-center">{title}</p>
      <div className={`grid ${getGridColsClass(gridCols)} gap-4`}>
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