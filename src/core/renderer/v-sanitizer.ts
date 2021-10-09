const TAG_BODY = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
const TAG_OR_COMMENT = new RegExp(
  `${'<(?:'
	// Comment body.
	+ '!--(?:(?:-*[^->])*--+|-?)'
	// Special "raw text" elements whose content should be elided.
	+ '|script\\b'}${TAG_BODY}>[\\s\\S]*?</script\\s*`
	+ `|style\\b${TAG_BODY}>[\\s\\S]*?</style\\s*`
	// Regular name
	+ `|/?[a-z]${
	 TAG_BODY
	 })>`,
  'gi',
);

export class VSanitizer {
  public static sanitizeHtml(html: string): string {
    // Reference: https://stackoverflow.com/questions/295566/sanitize-rewrite-html-on-the-client-side
    let oldHtml;
    do {
      oldHtml = html;
      html = html.replace(TAG_OR_COMMENT, '');
    } while (html !== oldHtml);
    return html.replace(/</g, '&lt;');
  }

  private constructor() {
    // Util class
  }
}
