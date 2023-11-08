const fs = require('fs');
const xmlserializer = require('xmlserializer');
const jsdom = require("jsdom");
const path = require('path');

const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser

const filePath = path.join(__dirname, "../", "\\Node Architecture.drawio");
const buffer = fs.readFileSync(filePath);
const fileContents = buffer.toString();

const parser = new DOMParser();
const xmlDoc = parser.parseFromString(fileContents, "application/xml");

// console.log(fileContents);

String.prototype.ensurePattern = function (pattern, replacement) {
	if (this.search(pattern) != -1) {
		return this.replace(pattern, replacement);
	}
	else {
		return this + replacement;
	}

}

const statuses = {
	"Implemented": {
		"fillColor":"#d5e8d4",
		"strokeColor":"#82b366",
		"fontColor":"#000000",
	},
	"Deprecated": {
		"fillColor":"#f8cecc",
		"strokeColor":"#b85450",
		"fontColor":"#000000"
	},
	"Not_working": {
		"fillColor":"#ffe6cc",
		"strokeColor": "#d79b00",
		"fontColor": "#000000"
	},
	"Planned": {
		"fillColor":"#dae8fc",
		"strokeColor": "#6c8ebf",
		"fontColor": "#000000"
	}
}


for (const statusKey in statuses) {
	const implementedElements = Array.from(xmlDoc.getElementsByTagName("UserObject")).filter((x) => {
		if (!x.hasAttribute("tags")) {
			return false;
		}
		return x.getAttribute("tags").includes(statusKey);
	});

	const status = statuses[statusKey];

	for (const parent of implementedElements) {
		const el = parent.children[0];
		if (el.hasAttribute("style")) {
			let style = el.getAttribute("style");
			style = style.ensurePattern(/fillColor=#\w*;/, "fillColor="+status.fillColor+";")
				.ensurePattern(/fontColor=#\w*;/, "fontColor=" + status.fontColor+";")
				.ensurePattern(/strokeColor=#\w*;/, "strokeColor=" + status.strokeColor+";");
			el.setAttribute("style", style);
		}
	}
}

const modifiedFileContents = xmlserializer.serializeToString(xmlDoc);
// console.log(modifiedFileContents);
fs.writeFileSync(filePath, modifiedFileContents);