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


const wikiPages = {
	"/moa_controllers/ack_to_can" : "https://github.com/UOA-FSAE/autonomous/wiki/moa_controllers#ack_to_can-node",
	"/moa_controllers/as_status" : "https://github.com/UOA-FSAE/autonomous/wiki/moa_controllers#as_status-node",
	"/moa_drivers/can_interface_jnano": "https://github.com/UOA-FSAE/autonomous/wiki/moa_drivers#can_interface_jnano-node",
	"/moa_drivers/can_decoder_jnano": "https://github.com/UOA-FSAE/autonomous/wiki/moa_drivers#can_decoder_jnano-node",
}

const elementsWithoutChildren = Array.from(xmlDoc.getElementsByTagName("UserObject")).filter((x) => {
	if (wikiPages.includes(x.getAttribute("label")) && !x.hasAttribute("link")) {
		return true;
	}
	return false;
});

for (const parent of elementsWithoutChildren) {
	var parentId = parent.getAttribute("id");
	var childId = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
	var grandChild1Id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
	var grandChild2Id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))

	parent.setAttribute("link", "data:action/json,{&quot;actions&quot;:[{&quot;toggle&quot;: {&quot;cells&quot;: [&quot;" + childId + "&quot;]}}]}");
	// let latestSectionIdSuffix = getLatestSectionIdSuffix(sectionId);

	var domToParse = " <UserObject xmlns=\"null\" label=\"\" id=\""+ childId + "\">\
		<mxCell xmlns=\"\" style=\"strokeColor=none;fillColor=none;rotatable=0;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;hidden=1;portConstraintRotation=0;part=1;\" vertex=\"1\" parent=\""+ parentId + "\">\
			<mxGeometry width=\"70\" height=\"40\" as=\"geometry\"/>\
		</mxCell>\
		</UserObject>\
		\
		<UserObject xmlns=\"null\" label=\"\" link=\"" + wikiPages[parent.getAttribute("label")] + "\" linkTarget=\"_blank\" id=\""+ grandChild1Id + "\">\
		<mxCell xmlns=\"\" style=\"html=1;verticalLabelPosition=bottom;align=center;labelBackgroundColor=#ffffff;verticalAlign=top;strokeWidth=2;strokeColor=#0080F0;shadow=0;dashed=0;shape=mxgraph.ios7.icons.globe;part=1;movable=1;autosize=1;\" vertex=\"1\" parent=\""+ childId + "\">\
			<mxGeometry x=\"10\" y=\"10\" width=\"20\" height=\"20\" as=\"geometry\"/>\
		</mxCell>\
		</UserObject>\
		\
		<UserObject xmlns=\"null\" label=\"\" link=\"data:action/json,{&quot;actions&quot;:[{&quot;highlight&quot;: {&quot;cells&quot;: [&quot;x9WfGJWvBoZ43jZ9yiub-71&quot;]}}]}\" id=\""+ grandChild2Id + "\">\
		<mxCell xmlns=\"\" style=\"html=1;verticalLabelPosition=bottom;align=center;labelBackgroundColor=#ffffff;verticalAlign=top;strokeWidth=2;strokeColor=#0080F0;shadow=0;dashed=0;shape=mxgraph.ios7.icons.up;part=1;\" vertex=\"1\" parent=\""+ childId + "\">\
			<mxGeometry x=\"40\" y=\"10\" width=\"20\" height=\"22.5\" as=\"geometry\"/>\
		</mxCell>\
		</UserObject>";
	// \
	// <object xmlns=\"null\" label=\"/moa_controller/ack_to_can_node\" link=\"data:action/json,{&quot;actions&quot;:[{&quot;toggle&quot;: {&quot;cells&quot;: [&quot;x9WfGJWvBoZ43jZ9yiub-67&quot;]}}]}\" id=\"x9WfGJWvBoZ43jZ9yiub-66\">\
	// <mxCell xmlns=\"\" style=\"rounded=1;whiteSpace=wrap;html=1;part=1;\" vertex=\"1\" parent=\"x9WfGJWvBoZ43jZ9yiub-63\">\
	// 	<mxGeometry x=\"70\" width=\"210\" height=\"40\" as=\"geometry\"/>\
	// </mxCell>\
	// </object>";

	parent.insertAdjacentHTML("afterend", domToParse);

}


const modifiedFileContents = xmlserializer.serializeToString(xmlDoc);
// console.log(modifiedFileContents);
fs.writeFileSync(filePath, modifiedFileContents);

function getLatestSectionIdSuffix(sectionName) {
	var sectionIdSuffix = 0;

	var sectionName = sectionName;
	var sectionId = sectionId + 1;
	return sectionId;
}