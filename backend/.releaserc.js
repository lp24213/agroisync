module.exports = {
  branches: ['main', 'develop'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github'
  ],
  preset: 'angular',
  releaseRules: [
    { type: 'feat', release: 'minor' },
    { type: 'fix', release: 'patch' },
    { type: 'docs', release: 'patch' },
    { type: 'style', release: 'patch' },
    { type: 'refactor', release: 'patch' },
    { type: 'perf', release: 'patch' },
    { type: 'test', release: 'patch' },
    { type: 'chore', release: 'patch' },
    { type: 'ci', release: 'patch' },
    { type: 'build', release: 'patch' },
    { type: 'security', release: 'patch' },
    { type: 'deps', release: 'patch' },
    { type: 'wip', release: false },
    { scope: 'no-release', release: false }
  ],
  parserOpts: {
    noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES']
  },
  writerOpts: {
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: 'header'
  },
  changelogFile: 'CHANGELOG.md',
  changelogTitle: '# Changelog\n\nAll notable changes to this project will be documented in this file.',
  changelogGenerate: true,
  npmPublish: false,
  gitAssets: [
    'CHANGELOG.md',
    'package.json',
    'package-lock.json'
  ],
  githubAssets: [
    'dist/**/*',
    'CHANGELOG.md'
  ],
  successComment: 'This issue has been resolved in version ${nextRelease.version}',
  failTitle: 'The automated release is failing 🚨',
  labels: ['automatic-release'],
  releasedLabels: ['released on ${nextRelease.gitTag}'],
  failComment: 'The automated release is failing 🚨\n\nPlease check the [workflow run](${runUrl}) for more details.',
  successComment: 'This issue has been resolved in version ${nextRelease.version} 🎉\n\nThe release is available on [GitHub release](${nextRelease.url})',
  releasedLabels: ['released on ${nextRelease.gitTag}'],
  assignees: ['@agroisync-team'],
  reviewers: ['@agroisync-team']
};
