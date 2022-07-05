import React, { useState, useEffect } from 'react';
import CheckIcon from '@heroicons/react/solid/CheckIcon';
import { classNames } from '../../common/helpers/tailwind.helper';
import { ChipItem } from '../../common/interfaces/chip-item.interface';

interface ChipSelectionProps {
  title: string;
  helperText: string;
  values: ChipItem[];
  readonly?: boolean;
  error?: string;
  defaultItems?: number[];
  onItemsChange: (items: number[]) => void;
}

interface ChipProps {
  item: ChipItem;
  selected?: boolean;
  readonly?: boolean;
  onClick: (itemId: number) => void;
}

const Chip = ({ item, selected, readonly, onClick }: ChipProps) => (
  <span
    className={classNames(
      selected ? 'font-semibold bg-green-50' : 'font-normal bg-gray-100',
      'h-9 inline-flex items-center px-5 py-2.5 rounded-full  text-sm  text-gray-800 cursor-pointer',
    )}
    onClick={() => !readonly && onClick(item.id)}
  >
    {item.name}
    {selected && <CheckIcon className="w-5 h-5 ml-2.5 text-green" />}
  </span>
);

const ChipSelection = ({
  title,
  helperText,
  defaultItems,
  onItemsChange,
  values,
  error,
  readonly,
}: ChipSelectionProps) => {
  const [selectedItems, setSelectedItems] = useState<number[]>(defaultItems || []);

  useEffect(() => {
    onItemsChange(selectedItems);
  }, [selectedItems]);

  const isSelected = (itemId: number): boolean => {
    return selectedItems.findIndex((id) => id === itemId) >= 0;
  };

  const onChipItemClick = (itemId: number) => {
    if (selectedItems.findIndex((id) => id === itemId) >= 0) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  return (
    <div>
      <div className="form-item-label">{title}</div>
      <div className="py-2 flex gap-x-2 gap-y-2 flex-wrap">
        {values.map((item) => (
          <Chip
            key={item.id}
            item={item}
            readonly={readonly}
            selected={isSelected(item.id)}
            onClick={onChipItemClick}
          />
        ))}
      </div>
      <div
        className={classNames(error ? 'text-red-500' : 'text-gray-500', 'form-item-helper-text')}
      >
        {error || helperText}
      </div>
    </div>
  );
};

export default ChipSelection;