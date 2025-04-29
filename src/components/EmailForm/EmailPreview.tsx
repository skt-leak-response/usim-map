import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import React from 'react';

interface EmailPreviewProps {
  formattedContent: string;

  issue: string;
}

export function EmailPreview({ formattedContent, issue }: EmailPreviewProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">미리보기</h3>
      <p className="text-md">제목</p>
      <div className="rounded-lg border p-4">
        <div className="whitespace-pre-wrap text-sm">{issue}</div>
      </div>
      <p className="text-md">본문</p>
      <div className="rounded-lg border p-4">
        <div className="whitespace-pre-wrap text-sm">{formattedContent}</div>
      </div>
    </div>
  );
}
