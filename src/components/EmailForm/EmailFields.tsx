import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import React from 'react';

interface EmailFieldsProps {
  issue: string;
  setIssue: (issue: string) => void;
  content: string;
  setContent: (content: string) => void;
}

export function EmailFields({ issue, setIssue, content, setContent }: EmailFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="issue">제목</Label>
        <Input
          id="issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="이메일 제목을 입력하세요"
        />
      </div>
      <div>
        <Label htmlFor="content">본문</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="이메일 본문을 입력하세요"
          className="min-h-[200px]"
        />
      </div>
    </div>
  );
}
