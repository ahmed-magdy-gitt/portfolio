"use client";

/**
 * Copies text to the clipboard.
 *
 * `navigator.clipboard` only exists in a secure context, so a portfolio opened
 * over plain http (a LAN preview, a staging box without TLS) would otherwise
 * throw on every copy. The hidden-textarea path is deprecated but still the
 * only thing that works there, so it stays as a fallback.
 *
 * Throws if neither path succeeds, so callers can show a failure toast rather
 * than claiming a copy that never happened.
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const ok = document.execCommand("copy");
    if (!ok) throw new Error("Copy command was rejected");
  } finally {
    document.body.removeChild(textarea);
  }
}
