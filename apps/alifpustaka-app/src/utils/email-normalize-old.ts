export function normalizeGmail(raw: string) {
  const email = raw.trim().toLowerCase();
  const [local, domain = ''] = email.split('@');
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const noTag = local.split('+')[0];
    const noDots = noTag.replace(/\./g, '');
    return `${noDots}@gmail.com`; // canonicalize googlemail.com -> gmail.com
  }
  return `${local}@${domain}`;
}
