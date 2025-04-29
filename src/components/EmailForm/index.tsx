'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { EmailRecipientsToggle } from './EmailRecipientsToggle';
import { EmailBatchAlert } from './EmailBatchAlert';
import { EmailBatchSelector } from './EmailBatchSelector';
import { EmailTabs } from './EmailTabs';
import { Card, CardContent } from '@/components/ui/card';
import { useEmailForm } from '@/hooks/useEmailForm';
import { Member } from '@/types/members';

interface EmailFormProps {
  selectedMembers: Member[];
}

export default function EmailForm({ selectedMembers }: EmailFormProps) {
  const form = useEmailForm(selectedMembers);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-black mb-6">이메일 작성</h1>
            <div className="space-y-6">
              <ErrorBoundary>
                <Suspense fallback={<div>받는 사람 로딩 중...</div>}>
                  <EmailRecipientsToggle
                    showRecipients={form.showRecipients}
                    setShowRecipients={form.setShowRecipients}
                    currentGroupRecipients={form.currentGroupRecipients}
                    needsBatching={form.needsBatching}
                    currentBatch={form.currentBatch}
                    totalBatches={form.totalBatches}
                  />
                </Suspense>
              </ErrorBoundary>
              <EmailBatchAlert
                needsBatching={form.needsBatching}
                currentBatch={form.currentBatch}
                totalBatches={form.totalBatches}
              />
              <EmailBatchSelector
                needsBatching={form.needsBatching}
                totalBatches={form.totalBatches}
                currentBatch={form.currentBatch}
                setCurrentBatch={form.setCurrentBatch}
              />
              <ErrorBoundary>
                <Suspense fallback={<div>이메일 폼 로딩 중...</div>}>
                  <EmailTabs
                    // AI Form props
                    template={form.template}
                    setTemplate={form.setTemplate}
                    intro={form.intro}
                    setIntro={form.setIntro}
                    userReq={form.userReq}
                    setUserReq={form.setUserReq}
                    loadingAI={form.loadingAI}
                    generateEmail={form.generateEmail}
                    // Email Fields props
                    issue={form.issue}
                    setIssue={form.setIssue}
                    content={form.content}
                    setContent={form.setContent}
                    senderName={form.senderName}
                    setSenderName={form.setSenderName}
                    // Common props
                    isMobile={form.isMobile}
                    getEmailUrl={form.getEmailUrl}
                    getMailtoUrl={form.getMailtoUrl}
                    onGuideClick={() => {
                      form.setCopied(false);
                      form.setCopiedBcc(false);
                      form.setCopiedSubject(false);
                      form.setShowGuideModal(true);
                    }}
                    copyToClipboard={form.copyToClipboard}
                    showGuideModal={form.showGuideModal}
                    setShowGuideModal={form.setShowGuideModal}
                    copied={form.copied}
                    copiedBcc={form.copiedBcc}
                    copiedSubject={form.copiedSubject}
                    onCopyBcc={() =>
                      form.handleCopy(
                        [
                          ...form.currentMembers.map((member) => member.email),
                          'response.skt.leak@gmail.com',
                        ].join(','),
                        'bcc',
                      )
                    }
                    onCopyContent={() => form.handleCopy(form.content, 'content')}
                    onCopySubject={() => form.handleCopy(form.issue, 'subject')}
                    bccValue={[
                      ...form.currentMembers.map((member) => member.email),
                      'response.skt.leak@gmail.com',
                    ].join(',')}
                    contentValue={form.content}
                    subjectValue={form.issue}
                    currentMembers={form.currentMembers}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
