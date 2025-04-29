import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { EMAIL_TEMPLATES } from '@/constants/email';
import { type TemplateKey } from '@/hooks/useEmail';
import React from 'react';

interface EmailAIFormProps {
  template: TemplateKey;
  setTemplate: (template: TemplateKey) => void;
  intro: string;
  setIntro: (intro: string) => void;
  userReq: string;
  setUserReq: (userReq: string) => void;
  loadingAI: boolean;
  generateEmail: () => Promise<void>;
}

export function EmailAIForm({
  template,
  setTemplate,
  intro,
  setIntro,
  userReq,
  setUserReq,
  loadingAI,
  generateEmail,
}: EmailAIFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="template">템플릿 선택</Label>
        <Select value={template} onValueChange={(value) => setTemplate(value as TemplateKey)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="템플릿을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(EMAIL_TEMPLATES).map(([key, { title }]) => (
              <SelectItem key={key} value={key}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="intro">보내는 사람 소개 (선택사항)</Label>
        <Input
          id="intro"
          placeholder="예) 의원님 소속구에 거주하는 20대 여성 000입니다."
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="userReq">요청사항</Label>
        <Textarea
          id="userReq"
          rows={3}
          placeholder="예) 빠른 조사 및 대응을 요청드립니다."
          value={userReq}
          onChange={(e) => setUserReq(e.target.value)}
        />
      </div>

      <Button
        onClick={generateEmail}
        disabled={loadingAI}
        className="w-full flex justify-center items-center"
      >
        {loadingAI ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            생성 중…
          </>
        ) : (
          'AI로 메일 생성'
        )}
      </Button>
    </div>
  );
}
