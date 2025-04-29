import { Button } from '@/components/ui/button';
import React from 'react';

interface EmailGuideModalProps {
  open: boolean;
  onClose: () => void;
  copied: boolean;
  copiedBcc: boolean;
  onCopyBcc: () => void;
  onCopyContent: () => void;
  bccValue: string;
  contentValue: string;
}

export function EmailGuideModal({
  open,
  onClose,
  copied,
  copiedBcc,
  onCopyBcc,
  onCopyContent,
  bccValue,
  contentValue,
}: EmailGuideModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-gray-900">
        <h2 className="text-lg font-bold mb-2">다른 메일 서비스 이용 안내</h2>
        <p className="mb-2">
          Gmail 외의 메일 서비스(Outlook, 네이버 등)는 수신자 자동 입력이 지원되지 않습니다.
        </p>
        <p className="mb-2 text-red-600">
          일부 메일 서비스의 보안 정책으로 인해 자동 링크가 차단될 수 있습니다. 이 경우 아래 복사
          버튼을 이용해 직접 붙여넣어 주세요.
        </p>
        <p className="mb-2">아래 정보를 복사해 직접 붙여넣어 주세요.</p>
        <div className="mb-2">
          <span className="font-semibold">수신자:</span>
          <button
            className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
            onClick={onCopyBcc}
          >
            복사
          </button>
          <span className="ml-2 text-green-600 text-xs">{copiedBcc && '복사됨!'}</span>
          <p className="mt-1 text-sm text-gray-600">
            ※ 수신자 정보는 '숨은 참조(BCC)' 필드에 붙여넣어 주세요.
          </p>
        </div>
        <div className="mb-2">
          <span className="font-semibold">본문:</span>
          <button
            className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
            onClick={onCopyContent}
          >
            복사
          </button>
          <span className="ml-2 text-green-600 text-xs">{copied && '복사됨!'}</span>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
