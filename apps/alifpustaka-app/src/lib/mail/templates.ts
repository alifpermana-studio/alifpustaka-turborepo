// lib/mail/templates.ts

type VerifyProps = {
  url: string;
  host: string;
  appName?: string;
  accent?: string; // hex or css color
  logoUrl?: string; // absolute URL to your logo (PNG/SVG)
  footer?: string;
};

export function verificationText({ url, host, appName = 'Your App' }: VerifyProps) {
  return `Sign in to ${appName}

Click the link below to verify your email and continue signing in to ${host}:

${url}

If you did not request this, you can safely ignore this email.`;
}

export function verificationHtml({
  url,
  host,
  appName = 'Your App',
  accent = '#4f46e5',
  logoUrl,
  footer = `© ${new Date().getFullYear()} ${appName}. All rights reserved.`,
}: VerifyProps) {
  // Keep email-safe (no external CSS); tables render best across clients.
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Verify your email</title>
<style>
  @media (prefers-color-scheme: dark) {
    .bg { background:#0b0b0c !important; }
    .card { background:#111114 !important; color:#f3f4f6 !important; }
    .muted { color:#a1a1aa !important; }
  }
  a { text-decoration:none; }
  .btn:hover { filter:brightness(0.95); }
</style>
</head>
<body class="bg" style="margin:0;padding:0;background:#f4f6f8">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" class="card" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(16,24,40,.06);">
          <tr>
            <td style="padding:24px 24px 0 24px">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  ${logoUrl ? `<td style="padding-right:12px"><img src="${logoUrl}" width="36" height="36" alt="${appName}" style="display:block;border-radius:8px"></td>` : ``}
                  <td style="font:600 16px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#111827">${appName}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 24px 0 24px">
              <h1 style="margin:0 0 8px 0;font:700 22px/1.25 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#111827">
                Verify your email
              </h1>
              <p class="muted" style="margin:0;font:400 14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#4b5563">
                Click the button below to verify your email and continue signing in to <strong>${host}</strong>.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:28px 24px;">
              <a class="btn" href="${url}" target="_blank"
                 style="display:inline-block;padding:12px 20px;border-radius:10px;background:${accent};color:#ffffff;font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
                Verify email
              </a>
              <div class="muted" style="margin-top:14px;font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#6b7280">
                If the button doesn't work, copy and paste this URL:
              </div>
              <div style="word-break:break-all;margin-top:6px;font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#374151">
                <a href="${url}" style="color:#374151">${url}</a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 24px 24px 24px">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 16px 0" />
              <p class="muted" style="margin:0;font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#6b7280">
                If you didn’t request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 24px 24px 24px">
              <p class="muted" style="margin:0;font:400 11px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#9ca3af">
                ${footer}
              </p>
            </td>
          </tr>
        </table>
        <div style="height:24px"></div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
