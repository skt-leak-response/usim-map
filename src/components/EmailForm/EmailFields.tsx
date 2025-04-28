import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import React from 'react';

interface EmailFieldsProps {
  issue: string;
  setIssue: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  senderName: string;
  setSenderName: (v: string) => void;
}

export function EmailFields({
  issue,
  setIssue,
  content,
  setContent,
  senderName,
  setSenderName,
}: EmailFieldsProps) {
  return (
    <>
      <div>
        <Label htmlFor="issue">제목</Label>
        <Input
          id="issue"
          value={issue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIssue(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          rows={6}
        />
      </div>
      <div>
        <Label htmlFor="senderName">보내는 사람 이름 (선택사항)</Label>
        <Input
          id="senderName"
          value={senderName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenderName(e.target.value)}
          placeholder="이름을 입력하지 않으면 '시민'으로 표시됩니다"
        />
      </div>
    </>
  );
}
