import React, { useEffect, useState } from 'react';

function PrivacyPolicy() {
  let [htmlFileString, setHtmlFileString] = useState<string>();

  async function fetchHtml() {
    setHtmlFileString(await (await fetch('/templates/privacyPolicy.html')).text());
  }
  useEffect(() => {
    fetchHtml();
  }, []);

  return (
    <div className="terms-iframe-container">
      <div dangerouslySetInnerHTML={{ __html: htmlFileString }}></div>
    </div>
  );
}

export default PrivacyPolicy;
