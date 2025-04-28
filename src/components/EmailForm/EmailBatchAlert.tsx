import { Alert, AlertDescription } from '@/components/ui/alert';
import React from 'react';

interface EmailBatchAlertProps {
  needsBatching: boolean;
  currentBatch: number;
  totalBatches: number;
}

export function EmailBatchAlert({
  needsBatching,
  currentBatch,
  totalBatches,
}: EmailBatchAlertProps) {
  if (!needsBatching) return null;
  return (
    <Alert variant="destructive">
      <AlertDescription>
        안전한 이메일 전송을 위해 50명씩 나누어 보내드립니다. 현재 {currentBatch + 1}/{totalBatches}
        번째 그룹입니다.
      </AlertDescription>
    </Alert>
  );
}
