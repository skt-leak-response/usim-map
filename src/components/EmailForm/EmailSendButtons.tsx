import { Button } from '@/components/ui/button';
import React from 'react';

interface EmailSendButtonsProps {
  isMobile: boolean;
  getEmailUrl: (provider: string) => string;
  getMailtoUrl: () => string;
  onGuideClick: () => void;
}

export function EmailSendButtons({
  isMobile,
  getEmailUrl,
  getMailtoUrl,
  onGuideClick,
}: EmailSendButtonsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {isMobile ? (
        <>
          <Button variant="default" className="flex-1" asChild>
            <a href={getMailtoUrl()} target="_blank" rel="noopener noreferrer">
              메일 앱으로 보내기
            </a>
          </Button>
          <Button variant="outline" className="flex-1" onClick={onGuideClick}>
            복붙해서 메일 보내기
          </Button>
        </>
      ) : (
        <>
          <Button variant="default" className="flex-1" asChild>
            <a href={getEmailUrl('gmail')} target="_blank" rel="noopener noreferrer">
              Gmail로 보내기
            </a>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <a href={getMailtoUrl()} target="_blank" rel="noopener noreferrer">
              메일 앱으로 보내기
            </a>
          </Button>
          <Button variant="outline" className="flex-1" onClick={onGuideClick}>
            복붙해서 메일 보내기
          </Button>
        </>
      )}
    </div>
  );
}
