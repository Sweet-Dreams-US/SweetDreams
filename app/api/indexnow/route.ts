import { NextResponse } from 'next/server';

// IndexNow submission endpoint.
// Calls https://api.indexnow.org/indexnow with the site's key URLs so
// Bing, Yandex, Naver, Seznam, and Yep re-crawl immediately. Google
// hasn't adopted IndexNow — use Search Console's URL Inspection tool
// for Google reindexing.
//
// Trigger: fetch /api/indexnow after a deploy (GET request, no auth).
// The key file must be accessible at /{KEY}.txt on the same domain.

const INDEXNOW_KEY = 'a3f9d2e8b7c14065a2f8b1c5d3e7f9a4';
const HOST = 'sweetdreams.us';

// All primary URLs we want search engines to (re)index.
// Keep this list in sync with the sitemap's high-priority pages.
const URLS_TO_SUBMIT = [
  `https://${HOST}/`,
  `https://${HOST}/work`,
  `https://${HOST}/work?filter=business`,
  `https://${HOST}/work?filter=aerial`,
  `https://${HOST}/work?filter=recap`,
  `https://${HOST}/work?filter=social`,
  `https://${HOST}/work?filter=hyperlapse`,
  `https://${HOST}/solutions`,
  `https://${HOST}/book`,
  `https://${HOST}/partnerships`,
  `https://${HOST}/about`,
  `https://${HOST}/blog`,
  // Recent project additions
  `https://${HOST}/work/fort-wayne-courthouse-4k`,
  `https://${HOST}/work/fort-wayne-state-of-the-city`,
  `https://${HOST}/work/mom-nonprofit-brand-film`,
];

export async function GET() {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: URLS_TO_SUBMIT,
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      submittedCount: URLS_TO_SUBMIT.length,
      submittedUrls: URLS_TO_SUBMIT,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
