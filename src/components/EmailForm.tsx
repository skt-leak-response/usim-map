'use client';

import { useState } from 'react';
import { type TemplateKey, useEmail } from '@/hooks/useEmail';
import { EMAIL_PROVIDERS, EMAIL_TEMPLATES } from '@/constants/email';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Copy, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Member } from '@/types/members';
import { useRouter } from 'next/navigation';
import { encodeIds } from '@/utils/encoding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailFormProps {
  selectedMembers: Member[];
}

export default function EmailForm({ selectedMembers }: EmailFormProps) {
  const [showRecipients, setShowRecipients] = useState(false);
  const {
    template,
    setTemplate,
    issue,
    setIssue,
    content,
    setContent,
    senderName,
    setSenderName,
    intro,
    setIntro,
    userReq,
    setUserReq,
    loadingAI,
    generateEmail,
    showCopyToast,
    currentBatch,
    setCurrentBatch,
    totalBatches,
    currentMembers,
    getEmailUrl,
    copyToClipboard,
  } = useEmail({ selectedMembers });

  const router = useRouter();

  const needsBatching = selectedMembers.length > 50;

  const currentGroupRecipients = currentMembers;

  const handleSendEmail = () => {
    if (selectedMembers.length === 0) return;

    const ids = selectedMembers.map((member) => member.id);
    const encodedIds = encodeIds(ids);
    router.push(`/email?ids=${encodedIds}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">이메일 작성</h1>

            <div className="space-y-6">
              <div>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                  onClick={() => setShowRecipients(!showRecipients)}
                >
                  <span>
                    받는 사람 ({currentGroupRecipients.length}명
                    {needsBatching && ` - ${currentBatch + 1}/${totalBatches}번째 그룹`})
                  </span>
                  {showRecipients ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
                {showRecipients && (
                  <Card className="mt-2">
                    <CardContent className="p-4 space-y-2 max-h-60 overflow-y-auto">
                      {currentGroupRecipients.map((member) => (
                        <div
                          key={member.id}
                          className="flex justify-between items-center text-gray-900 hover:text-black"
                        >
                          <span>
                            {member.name} ({member.city} {member.district}) (BCC)
                          </span>
                          <span className="text-sm text-gray-700">{member.email}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center text-gray-900 hover:text-black">
                        <span className="text-gray-900">response.skt.leak@gmail.com (BCC)</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {needsBatching && (
                <Alert variant="destructive">
                  <AlertDescription>
                    안전한 이메일 전송을 위해 50명씩 나누어 보내드립니다. 현재 {currentBatch + 1}/
                    {totalBatches}번째 그룹입니다.
                  </AlertDescription>
                </Alert>
              )}

              {needsBatching && (
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
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="issue">제목</Label>
                  <Select
                    value={template}
                    onValueChange={(value) => setTemplate(value as TemplateKey)}
                  >
                    <SelectTrigger className="w-full ">
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
                  <Label htmlFor="intro">보내는 사람 이름 (선택사항)</Label>
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

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>미리보기</Label>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(content)}>
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="p-4 whitespace-pre-wrap">
                      <div className="mb-4">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="issuePreview" className="whitespace-nowrap ">
                            제목
                          </Label>
                          <Input
                            id="issuePreview"
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            className="flex-1 border-none focus:border-none"
                            placeholder="제목을 입력하세요"
                          />
                        </div>
                      </div>
                      <Textarea
                        id="contentPreview"
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="border-none focus:border-none h-full resize-none h-[50vh]"
                        placeholder="본문을 입력하세요"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-wrap gap-4">
                  {Object.entries(EMAIL_PROVIDERS).map(([key, provider]) => (
                    <Button key={key} variant="default" className="flex-1" asChild>
                      <a
                        href={getEmailUrl(key as keyof typeof EMAIL_PROVIDERS)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {provider.name}로 보내기
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {showCopyToast && (
          <Alert className="fixed bottom-4 right-4">
            <AlertDescription>복사되었습니다!</AlertDescription>
          </Alert>
        )}

        {/* <div className="fixed bottom-8 right-8">
          <Button onClick={handleSendEmail} disabled={selectedMembers.length === 0}>
            선택 완료 ({selectedMembers.length}명)
          </Button>
        </div> */}
      </div>
    </div>
  );
}
