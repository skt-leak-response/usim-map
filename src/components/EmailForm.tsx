'use client';

import { useState } from 'react';
import { useEmail } from '@/hooks/useEmail';
import { EMAIL_PROVIDERS } from '@/constants/email';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { Member } from '@/types/members';
import { useRouter } from 'next/navigation';
import { encodeIds } from '@/utils/encoding';

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

  const handleSendEmail = () => {
    if (selectedMembers.length === 0) return;

    const ids = selectedMembers.map((member) => member.id);
    const encodedIds = encodeIds(ids);
    router.push(`/email?ids=${encodedIds}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">이메일 작성</h1>

          {/* Recipients Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowRecipients(!showRecipients)}
              className="w-full flex justify-between items-center p-4 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
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
            </button>
            {showRecipients && (
              <div className="mt-2 p-4 bg-gray-700 rounded-lg space-y-2 max-h-60 overflow-y-auto">
                {currentGroupRecipients.map((member) => (
                  <div
                    key={member.id}
                    className="flex justify-between items-center text-gray-300 hover:text-white"
                  >
                    <span>
                      {member.name} ({member.city} {member.district}) (BCC)
                    </span>
                    <span className="text-sm text-gray-400">{member.email}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-gray-300 hover:text-white">
                  <span>response.skt.leak@gmail.com (BCC)</span>
                </div>
              </div>
            )}
          </div>

          {needsBatching && (
            <div className="mb-6 p-4 bg-yellow-900/50 rounded-lg">
              <p className="text-yellow-200">
                안전한 이메일 전송을 위해 50명씩 나누어 보내드립니다. 현재 {currentBatch + 1}/
                {totalBatches}번째 그룹입니다.
              </p>
            </div>
          )}

          {needsBatching && (
            <div className="mb-6 flex flex-wrap gap-2">
              {Array.from({ length: totalBatches }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBatch(index)}
                  className={`px-4 py-2 rounded-md ${
                    currentBatch === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {index + 1}번째 그룹
                </button>
              ))}
            </div>
          )}

          <div className="space-y-6">
            {/* Issue Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">제목</label>
              <input
                type="text"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Sender Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                보내는 사람 이름 (선택사항)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="이름을 입력하지 않으면 '시민'으로 표시됩니다"
              />
            </div>

            {/* Preview */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">미리보기</label>
                <button
                  onClick={() => copyToClipboard(formattedContent)}
                  className="text-gray-400 hover:text-white"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white p-4 whitespace-pre-wrap">
                <div className="mb-4">
                  <span className="font-semibold">제목:</span> [{issue}]
                </div>
                <div className="whitespace-pre-wrap">{formattedContent}</div>
              </div>
            </div>

            {/* Email Provider Buttons */}
            <div className="flex flex-wrap gap-4">
              {Object.entries(EMAIL_PROVIDERS).map(([key, provider]) => (
                <a
                  key={key}
                  href={getEmailUrl(key as keyof typeof EMAIL_PROVIDERS)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center"
                >
                  {provider.name}로 보내기
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copy Toast */}
      {showCopyToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          복사되었습니다!
        </div>
      )}

      <div className="fixed bottom-8 right-8">
        <button
          onClick={handleSendEmail}
          disabled={selectedMembers.length === 0}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedMembers.length === 0
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          선택 완료 ({selectedMembers.length}명)
        </button>
      </div>
    </div>
  );
}
