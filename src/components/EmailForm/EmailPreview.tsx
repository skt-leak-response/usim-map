import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import React from 'react';

interface EmailPreviewProps {
  issue: string;
  formattedContent: string;
  copyToClipboard: (text: string) => void;
}

export function EmailPreview({ issue, formattedContent, copyToClipboard }: EmailPreviewProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Label>미리보기</Label>
        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(formattedContent)}>
          <Copy className="h-5 w-5" />
        </Button>
      </div>
      <Card>
        <CardContent className="p-4 whitespace-pre-wrap">
          <div className="mb-4">
            <span className="font-semibold">제목:</span> [{issue}]
          </div>
          <div className="whitespace-pre-wrap">{formattedContent}</div>
        </CardContent>
      </Card>
    </div>
  );
}
