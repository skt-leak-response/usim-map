'use client';

import { useState } from 'react';
import { useEmail } from '@/hooks/useEmail';
import { EMAIL_PROVIDERS } from '@/constants/email';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { Member } from '@/types/members';
import { useRouter } from 'next/navigation';
import { encodeIds } from '@/utils/encoding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isMobile } from '@/lib/utils';

interface EmailFormProps {
  selectedMembers: Member[];
}

export default function EmailForm({ selectedMembers }: EmailFormProps) {
  const [showRecipients, setShowRecipients] = useState(false);
  const {
    issue,
    setIssue,
    content,
    setContent,
    senderName,
    setSenderName,
    showCopyToast,
    currentBatch,
    setCurrentBatch,
    totalBatches,
    currentMembers,
    formatEmailContent,
    getEmailUrl,
    copyToClipboard,
  } = useEmail({ selectedMembers });

  const router = useRouter();

  const formattedContent = formatEmailContent();
  const needsBatching = selectedMembers.length > 50;

  const currentGroupRecipients = currentMembers;

  const [showGuideModal, setShowGuideModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedBcc, setCopiedBcc] = useState(false);

  const handleSendEmail = () => {
    if (selectedMembers.length === 0) return;

    const ids = selectedMembers.map((member) => member.id);
    const encodedIds = encodeIds(ids);
    router.push(`/email?ids=${encodedIds}`);
  };

  // 모바일용 mailto 링크 생성
  const getMailtoUrl = () => {
    const bccEmails = [
      ...currentMembers.map((member) => member.email),
      'response.skt.leak@gmail.com',
    ].join(',');
    return `mailto:?bcc=${encodeURIComponent(bccEmails)}&subject=${encodeURIComponent(
      issue,
    )}&body=${encodeURIComponent(formattedContent)}`;
  };

  // 복사 함수
  const handleCopy = async (text: string, type: 'bcc' | 'content') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'bcc') setCopiedBcc(true);
      else setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setCopiedBcc(false);
      }, 1500);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-black mb-6">이메일 작성</h1>

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
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setContent(e.target.value)
                    }
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="senderName">보내는 사람 이름 (선택사항)</Label>
                  <Input
                    id="senderName"
                    value={senderName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSenderName(e.target.value)
                    }
                    placeholder="이름을 입력하지 않으면 '시민'으로 표시됩니다"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>미리보기</Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(formattedContent)}
                    >
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

                <div className="flex flex-wrap gap-4">
                  {isMobile() ? (
                    // 모바일: mailto 버튼 하나만
                    <Button variant="default" className="flex-1" asChild>
                      <a href={getMailtoUrl()} target="_blank" rel="noopener noreferrer">
                        메일 앱으로 보내기
                      </a>
                    </Button>
                  ) : (
                    // PC: Gmail, 그 외 메일 가이드
                    <>
                      <Button variant="default" className="flex-1" asChild>
                        <a href={getEmailUrl('gmail')} target="_blank" rel="noopener noreferrer">
                          Gmail로 보내기
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setCopied(false);
                          setCopiedBcc(false);
                          setShowGuideModal(true);
                        }}
                      >
                        그 외 메일 이용 가이드
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* {showCopyToast && (
          <Alert className="fixed bottom-4 right-4 max-w-7">
            <AlertDescription>복사되었습니다!</AlertDescription>
          </Alert>
        )} */}

        {/* <div className="fixed bottom-8 right-8">
          <Button onClick={handleSendEmail} disabled={selectedMembers.length === 0}>
            선택 완료 ({selectedMembers.length}명)
          </Button>
        </div> */}

        {/* 모달 */}
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg p-6 max-w-md w-full text-gray-900">
              <h2 className="text-lg font-bold mb-2">다른 메일 서비스 이용 안내</h2>
              <p className="mb-2">
                Gmail 외의 메일 서비스(Outlook, 네이버 등)는 수신자 자동 입력이 지원되지 않습니다.
              </p>
              <p className="mb-2">아래 정보를 복사해 직접 붙여넣어 주세요.</p>
              <div className="mb-2">
                <span className="font-semibold">수신자:</span>
                <button
                  className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() =>
                    handleCopy(
                      [
                        ...currentMembers.map((member) => member.email),
                        'response.skt.leak@gmail.com',
                      ].join(','),
                      'bcc',
                    )
                  }
                >
                  복사
                </button>
                <span className="ml-2 text-green-600 text-xs">{copiedBcc && '복사됨!'}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">본문:</span>
                <button
                  className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => handleCopy(formattedContent, 'content')}
                >
                  복사
                </button>
                <span className="ml-2 text-green-600 text-xs">{copied && '복사됨!'}</span>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="secondary" onClick={() => setShowGuideModal(false)}>
                  닫기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
