import { Button } from '@/components/ui/button';
import React from 'react';

interface EmailBatchSelectorProps {
  needsBatching: boolean;
  totalBatches: number;
  currentBatch: number;
  setCurrentBatch: (idx: number) => void;
}

export function EmailBatchSelector({
  needsBatching,
  totalBatches,
  currentBatch,
  setCurrentBatch,
}: EmailBatchSelectorProps) {
  if (!needsBatching) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: totalBatches }).map((_, index) => (
        <Button
          key={index}
          variant={currentBatch === index ? 'default' : 'outline'}
          onClick={() => setCurrentBatch(index)}
        >
          {index + 1}번째 그룹
        </Button>
      ))}
    </div>
  );
}
