import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

export function verifyRelease(approval, commit, reviewedCommit) {
  assert(approval?.contentReviewed === true && approval.legalReviewed === true && approval.liveLinksVerified === true,
    'Recorded content, legal and link review is required.');
  if (commit !== undefined || reviewedCommit !== undefined) {
    assert(typeof commit === 'string' && /^[a-f0-9]{40}$/i.test(commit),
      'A full build commit SHA is required.');
    assert(typeof reviewedCommit === 'string' && /^[a-f0-9]{40}$/i.test(reviewedCommit) &&
      reviewedCommit.toLowerCase() === commit.toLowerCase(),
      'Explicit approval must name the exact main commit being published.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    for (const file of ['src/pages/impressum.astro', 'src/pages/privacy.astro']) {
      assert(fs.existsSync(file), `Missing release page: ${file}`);
    }
    const approval = JSON.parse(fs.readFileSync('release-approval.json', 'utf8'));
    const { RELEASE_COMMIT, REVIEWED_COMMIT } = process.env;
    verifyRelease(approval, RELEASE_COMMIT, REVIEWED_COMMIT);
    console.log(RELEASE_COMMIT ? 'Release approval matches the build commit.' : 'Recorded review checks passed.');
  } catch (error) {
    console.error(`BLOCKED: ${error.message}`);
    process.exitCode = 1;
  }
}
