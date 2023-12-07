import { document } from "./utils";

import MarkdownIt from "markdown-it";

import { GlossParser } from "./gloss-parser";
import { errorPrinter, glossPrinter } from "./gloss-printer";

const processGlossMarkdown = (source: string, nlevel: boolean): string => {
	const parser = new GlossParser({ nlevel });
	const gloss = parser.parse(source);

	const el = document.createElement("div");

	glossPrinter(gloss, el);
	errorPrinter(parser.errors(), el);

	console.info("HTML: ", el.innerHTML);
	return el.innerHTML;
};

export default function glossMarkdownPlugin(md: MarkdownIt): void {
	const origFenceRule =
		md.renderer.rules.fence ||
		function (tokens, idx, options, _env, self) {
			return self.renderToken(tokens, idx, options);
		};

	md.renderer.rules.fence = (tokens, idx, options, _env, self) => {
		const token = tokens[idx];
		const info = token.info.trim();
		const source = token.content;

		if (info === "gloss") {
			return processGlossMarkdown(source, false);
		}
		if (info === "ngloss") {
			return processGlossMarkdown(source, true);
		}
		return origFenceRule(tokens, idx, options, _env, self);
	};
}
