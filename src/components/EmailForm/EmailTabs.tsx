import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailAIForm } from './EmailAIForm';
import { EmailFields } from './EmailFields';
import { EmailPreview } from './EmailPreview';
import { EmailSendButtons } from './EmailSendButtons';
import { EmailGuideModal } from './EmailGuideModal';
import { Member } from '@/types/members';
import { TemplateKey } from '@/hooks/useEmail';

interface EmailTabsProps {
  // AI Form props
  template: TemplateKey;
  setTemplate: (template: TemplateKey) => void;
  intro: string;
  setIntro: (intro: string) => void;
  userReq: string;
  setUserReq: (userReq: string) => void;
  loadingAI: boolean;
  generateEmail: () => Promise<void>;

  // Email Fields props
  issue: string;
  setIssue: (issue: string) => void;
  content: string;
  setContent: (content: string) => void;
  senderName: string;
  setSenderName: (senderName: string) => void;

  // Common props
  isMobile: boolean;
  getEmailUrl: (provider: string) => string;
  getMailtoUrl: () => string;
  onGuideClick: () => void;
  copyToClipboard: (text: string) => void;
  showGuideModal: boolean;
  setShowGuideModal: (show: boolean) => void;
  copied: boolean;
  copiedBcc: boolean;
  onCopyBcc: () => void;
  onCopyContent: () => void;
  bccValue: string;
  contentValue: string;
}

export function EmailTabs({
  // AI Form props
  template,
  setTemplate,
  intro,
  setIntro,
  userReq,
  setUserReq,
  loadingAI,
  generateEmail,

  // Email Fields props
  issue,
  setIssue,
  content,
  setContent,
  senderName,
  setSenderName,

  // Common props
  isMobile,
  getEmailUrl,
  getMailtoUrl,
  onGuideClick,
  copyToClipboard,
  showGuideModal,
  setShowGuideModal,
  copied,
  copiedBcc,
  onCopyBcc,
  onCopyContent,
  bccValue,
  contentValue,
}: EmailTabsProps) {
  return (
    <Tabs defaultValue="ai" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ai">AI로 생성하기</TabsTrigger>
        <TabsTrigger value="template">직접 메일 컨텐츠 수정하기</TabsTrigger>
      </TabsList>
      <TabsContent value="ai" className="space-y-6">
        <EmailAIForm
          template={template}
          setTemplate={setTemplate}
          intro={intro}
          setIntro={setIntro}
          userReq={userReq}
          setUserReq={setUserReq}
          loadingAI={loadingAI}
          generateEmail={generateEmail}
        />
        <EmailPreview
          issue={issue}
          formattedContent={content}
          copyToClipboard={copyToClipboard}
          senderName={senderName}
        />
        <EmailSendButtons
          isMobile={isMobile}
          getEmailUrl={getEmailUrl}
          getMailtoUrl={getMailtoUrl}
          onGuideClick={onGuideClick}
        />
      </TabsContent>
      <TabsContent value="template" className="space-y-6">
        <EmailFields
          issue={issue}
          setIssue={setIssue}
          content={content}
          setContent={setContent}
          senderName={senderName}
          setSenderName={setSenderName}
        />
        <EmailPreview
          issue={issue}
          formattedContent={content}
          copyToClipboard={copyToClipboard}
          senderName={senderName}
        />
        <EmailSendButtons
          isMobile={isMobile}
          getEmailUrl={getEmailUrl}
          getMailtoUrl={getMailtoUrl}
          onGuideClick={onGuideClick}
        />
      </TabsContent>
      <EmailGuideModal
        open={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        copied={copied}
        copiedBcc={copiedBcc}
        onCopyBcc={onCopyBcc}
        onCopyContent={onCopyContent}
        bccValue={bccValue}
        contentValue={contentValue}
      />
    </Tabs>
  );
}
