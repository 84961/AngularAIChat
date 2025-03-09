import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export class MarkdownUtils {
    static parseMarkdown(content: string, sanitizer: DomSanitizer): SafeHtml {
        const html = marked.parse(content) as string;
        return sanitizer.bypassSecurityTrustHtml(html);
    }
}