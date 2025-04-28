'use client';

import { useState } from 'react';
import { useEmail } from '@/hooks/useEmail';
import { EMAIL_TEMPLATES, EMAIL_PROVIDERS } from '@/constants/email';
import { Copy } from 'lucide-react';

interface EmailFormProps {
  selectedMembers: Array<{
    name: string;
    email: string;
    city: string;
    district: string;
  }>;
}

export default function EmailForm({ selectedMembers }: EmailFormProps) {
  const {
    template,
    setTemplate,
    issue,
    setIssue,
    content,
    setContent,
    senderName,
    setSenderName,
    showCopyToast,
    formatEmailContent,
    getEmailUrl,
    copyToClipboard,
  } = useEmail({ selectedMembers });

  const formattedContent = formatEmailContent();

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">이메일 작성</h1>

          <div className="space-y-6">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">템플릿 선택</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value as keyof typeof EMAIL_TEMPLATES)}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {Object.entries(EMAIL_TEMPLATES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">주제</label>
              <input
                type="text"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="예: 환경 오염, 교육 정책 등"
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
                placeholder="상세 내용을 입력하세요"
              />
            </div>

            {/* Sender Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                보내는 사람 이름
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="이름을 입력하세요"
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
                {formattedContent}
              </div>
            </div>

            {/* Email Provider Buttons */}
            <div className="flex space-x-4">
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
    </div>
  );
}
