'use client';
import MemberList from '@/components/MemberList';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            SKT 개인정보 유출 사건 국민행동
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            SKT 개인정보 유출 사건에 대한 국민의 목소리를 전달하기 위해 국회의원들에게 항의 메일을
            보낼 수 있습니다. 아래에서 지역구나 소속 정당 등으로 국회의원을 찾아보세요.
          </p>
        </div>

        <MemberList />
      </div>
    </main>
  );
}
