import { GlossParser } from "src/gloss-parser";
import { errorPrinter, glossPrinter } from "src/gloss-printer";

const processGlossMarkdown = (source: string, nlevel: boolean): string => {
	const parser = new GlossParser({ nlevel });
	const gloss = parser.parse(source);
	const el = document.createElement("div");

	glossPrinter(gloss, el);
	errorPrinter(parser.errors(), el);

	return el.innerHTML;
};

export default processGlossMarkdown;
