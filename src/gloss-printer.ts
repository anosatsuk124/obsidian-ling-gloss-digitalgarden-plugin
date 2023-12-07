import { GlossData, GlossLineStyle } from "./models/gloss-data";
import { addClasses, createDiv } from "./utils";

const withNbsp = (text: string) => text.replace(/\s+/g, "\u00A0");

const textOrNbsp = (text: string, style?: GlossLineStyle) => {
	if (text.length < 1) return "\u00A0";

	if (style?.altSpaces) {
		text = text.replace(/[_]+/g, "\u00A0");
	}

	return withNbsp(text);
};

const styleClasses = (style?: GlossLineStyle) =>
	style?.classes.filter((x) => x.length > 0).map((x) => `ling-style-${x}`) ??
	[];

export const glossPrinter = (gloss: GlossData, dest: HTMLElement) => {
	const container = createDiv(dest, { cls: "ling-gloss" });

	const label = createDiv(container, { cls: "ling-gloss-label" });
	label.append(withNbsp(gloss.label));

	const body = createDiv(container, { cls: "ling-gloss-body" });
	addClasses(body, styleClasses(gloss.options.global));

	if (gloss.preamble?.length > 0) {
		const preamble = createDiv(body, { cls: "ling-gloss-preamble" });
		preamble.append(gloss.preamble);
		addClasses(preamble, styleClasses(gloss.options.preamble));
	}

	if (gloss.elements.length > 0) {
		const elements = createDiv(body, { cls: "ling-gloss-elements" });

		const hasLevelB = gloss.elements.some((el) => el.levelB?.length > 0);
		const hasLevelC = gloss.elements.some((el) => el.levelC?.length > 0);
		const maxNlevel = gloss.elements.reduce(
			(acc, el) => Math.max(acc, el.nlevels.length),
			0,
		);

		for (const glelem of gloss.elements) {
			const element = createDiv(elements, { cls: "ling-gloss-element" });

			const levelA = createDiv(element, { cls: "ling-gloss-level-a" });
			levelA.append(textOrNbsp(glelem.levelA, gloss.options.levelA));
			addClasses(levelA, styleClasses(gloss.options.levelA));

			if (hasLevelB) {
				const levelB = createDiv(element, {
					cls: "ling-gloss-level-b",
				});
				levelB.append(textOrNbsp(glelem.levelB));
				addClasses(levelB, styleClasses(gloss.options.levelB));
			}

			if (hasLevelC) {
				const levelC = createDiv(element, {
					cls: "ling-gloss-level-c",
				});
				levelC.append(textOrNbsp(glelem.levelC));
				addClasses(levelC, styleClasses(gloss.options.levelC));
			}

			for (let index = 0; index < maxNlevel; index += 1) {
				const levelX = createDiv(element, {
					cls: "ling-gloss-level-x",
				});
				levelX.append(textOrNbsp(glelem.nlevels[index] ?? ""));
				addClasses(levelX, styleClasses(gloss.options.nlevels));
			}
		}
	}

	if (gloss.translation?.length > 0) {
		const translation = createDiv(body, { cls: "ling-gloss-translation" });
		translation.append(gloss.translation);
		addClasses(translation, styleClasses(gloss.options.translation));
	}

	if (!body.hasChildNodes()) {
		errorPrinter(["the gloss is empty, there's nothing to display"], dest);
	}
};

export const errorPrinter = (messages: string[], dest: HTMLElement) => {
	for (const msg of messages) {
		const error = createDiv(dest, { cls: "ling-gloss-error" });
		error.append(msg);
	}
};
