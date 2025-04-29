import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import React from 'react';

interface EmailPreviewProps {
  issue: string;
  formattedContent: string;
  copyToClipboard: (text: string) => void;
  senderName?: string;
}

export function EmailPreview({
  issue,
  formattedContent,
  copyToClipboard,
  senderName,
}: EmailPreviewProps) {
  // 마지막 줄이 "올림"으로 끝나는 경우 보내는 사람 이름으로 업데이트
  const getFormattedContent = () => {
    if (!formattedContent) return '';

    const lines = formattedContent.split('\n');
    const lastLine = lines[lines.length - 1].trim();

    if (lastLine.endsWith('올림')) {
      const newSignature = senderName ? `${senderName} 올림` : '시민 올림';
      lines[lines.length - 1] = newSignature;
      return lines.join('\n');
    }

    return formattedContent;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Label>미리보기</Label>
        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(getFormattedContent())}>
          <Copy className="h-5 w-5" />
        </Button>
      </div>
      <Card>
        <CardContent className="p-4 whitespace-pre-wrap">
          <div className="mb-4">
            <span className="font-semibold">제목:</span> [{issue}]
          </div>
          <div className="whitespace-pre-wrap">{getFormattedContent()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
