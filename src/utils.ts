import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html>");
export const document = dom.window.document;

export const createDiv = (
	element: HTMLElement,
	attr: { cls: string },
	innerText?: string,
): HTMLDivElement => {
	const div = document.createElement("div");
	div.classList.add(attr.cls);
	if (innerText != null) div.innerText = innerText;

	return element.appendChild(div);
};

export const addClasses = (
	element: HTMLElement,
	classes: string[],
): HTMLElement => {
	element.classList.add(...classes);
	return element;
};
