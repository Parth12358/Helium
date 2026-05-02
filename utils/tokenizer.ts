import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import { createLowlight } from "lowlight";
import { Language, Token, TokenType } from "../types/editor";

const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("css", css);
lowlight.register("html", xml);
lowlight.register("json", json);
lowlight.register("markdown", markdown);

export function detectLanguage(filename: string): Language {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
        case "ts":
            return "typescript";
        case "tsx":
            return "typescript";
        case "js":
            return "javascript";
        case "jsx":
            return "javascript";
        case "css":
            return "css";
        case "html":
            return "html";
        case "md":
            return "markdown";
        case "json":
            return "json";
        default:
            return "plaintext";
    }
}

function mapScope(scope: string | undefined): TokenType {
    switch (scope) {
        case "keyword":
        case "built_in":
        case "literal":
            return "keyword";
        case "string":
        case "template-string":
            return "string";
        case "comment":
            return "comment";
        case "number":
            return "number";
        case "operator":
            return "operator";
        case "punctuation":
            return "punctuation";
        case "tag":
        case "name":
            return "tag";
        case "attr":
            return "attribute";
        case "variable":
        case "title":
        case "params":
            return "identifier";
        default:
            return "plain";
    }
}

function flattenTree(nodes: any[], parentScope?: string): Token[] {
    const result: Token[] = [];
    for (const node of nodes) {
        if (node.type === "text") {
            result.push({ type: mapScope(parentScope), value: node.value });
        } else if (node.type === "element" && Array.isArray(node.children)) {
            const scope: string | undefined =
                node.properties?.className?.[0] ?? parentScope;
            result.push(...flattenTree(node.children, scope));
        }
    }
    return result;
}

export function tokenize(code: string, language: Language): Token[][] {
    try {
        const tree = lowlight.highlight(language, code, { prefix: "" });
        const flat = flattenTree(tree.children);

        const lines: Token[][] = [[]];
        let lineIndex = 0;

        for (const token of flat) {
            const parts = token.value.split("\n");
            for (let i = 0; i < parts.length; i++) {
                if (i > 0) {
                    lineIndex++;
                    lines[lineIndex] = [];
                }
                if (parts[i].length > 0) {
                    lines[lineIndex].push({ type: token.type, value: parts[i] });
                }
            }
        }

        return lines;
    } catch {
        return code.split("\n").map((line) => [{ type: "plain", value: line }]);
    }
}
