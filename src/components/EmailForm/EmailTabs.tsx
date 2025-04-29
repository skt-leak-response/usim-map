import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailAIForm } from './EmailAIForm';
import { EmailFields } from './EmailFields';
import { EmailPreview } from './EmailPreview';
import { EmailSendButtons } from './EmailSendButtons';
import { EmailGuideModal } from './EmailGuideModal';
import { Member } from '@/types/members';
import { TemplateKey } from '@/hooks/useEmail';
import { useState } from 'react';
import { EMAIL_TEMPLATES } from '@/constants/email';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Label } from '@radix-ui/react-select';
import { Input } from '@/components/ui/input';

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
  copiedSubject: boolean;
  onCopyBcc: () => void;
  onCopyContent: () => void;
  onCopySubject: () => void;
  bccValue: string;
  contentValue: string;
  subjectValue: string;
  currentMembers: Member[];
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
  copiedSubject,
  onCopyBcc,
  onCopyContent,
  onCopySubject,
  bccValue,
  contentValue,
  subjectValue,
  currentMembers,
}: EmailTabsProps) {
  const [activeTab, setActiveTab] = useState('intro');
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const tabs = [
    { id: 'intro', label: '발신자 소개' },
    { id: 'request', label: '요구사항' },
    ...(template !== 'FREE_FORMAT' ? [{ id: 'content', label: '컨텐츠 추가' }] : []),
  ];

  return (
    <div className="space-y-6">
      <p className="mb-[-1rem]">템플릿 선택</p>
      <Select value={template} onValueChange={(value) => setTemplate(value as TemplateKey)}>
        <SelectTrigger>
          <SelectValue placeholder="템플릿을 선택하세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="SKT_USIM">{EMAIL_TEMPLATES.SKT_USIM.name}</SelectItem>
            <SelectItem value="FREE_FORMAT">{EMAIL_TEMPLATES.FREE_FORMAT.name}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

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
        </TabsContent>
        <TabsContent value="template" className="space-y-6">
          <EmailFields
            issue={issue}
            setIssue={setIssue}
            content={content}
            setContent={setContent}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <EmailPreview formattedContent={content} issue={issue} />
      </div>

      <EmailSendButtons
        isMobile={isMobile}
        getEmailUrl={getEmailUrl}
        getMailtoUrl={getMailtoUrl}
        onGuideClick={onGuideClick}
      />

      <EmailGuideModal
        open={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        copied={copied}
        copiedBcc={copiedBcc}
        copiedSubject={copiedSubject}
        onCopyBcc={onCopyBcc}
        onCopyContent={onCopyContent}
        onCopySubject={onCopySubject}
        bccValue={bccValue}
        contentValue={contentValue}
        subjectValue={subjectValue}
      />
    </div>
  );
}
