import React from 'react';

const AgreementsSection: React.FC = () => (
  <div className="mt-4 text-xs text-[#7a7a82]">
    <label>
      <input type="checkbox" required />{' '}
      <span>
        <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline">이용약관</a> 및{' '}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline">개인정보 처리방침</a>에 동의합니다.
      </span>
    </label>
  </div>
);

export default AgreementsSection;