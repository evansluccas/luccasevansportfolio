export function normalizeRichTextHtml(html: string): string {
  // Preserve intentional blank lines created in the editor.
  // Tiptap can output empty paragraphs (<p></p>), which render with no visible height.
  // Converting them to <p><br></p> ensures the spacing is reflected on the portfolio.
  return (html || '').replace(/<p>\s*<\/p>/g, '<p><br></p>');
}
