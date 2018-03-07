/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Classes.js":
/*!********************!*\
  !*** ./Classes.js ***!
  \********************/
/*! exports provided: Waypoint, POI, POIs, Structure, Structures, Waypoints */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Waypoint\", function() { return Waypoint; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"POI\", function() { return POI; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"POIs\", function() { return POIs; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Structure\", function() { return Structure; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Structures\", function() { return Structures; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Waypoints\", function() { return Waypoints; });\n/* harmony import */ var _Utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utilities */ \"./Utilities.js\");\n\n\nfunction Waypoint(location) {\n  this.location = location;\n  this.connections = [];\n  this.id = Object(_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"uniqueID\"])();\n}\n\nWaypoint.prototype.addConnection = function(waypoint) {\n  this.connections.push(waypoint);\n}\n\nWaypoint.prototype.drawWaypoint = function() {\n  Object(_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"drawCircle\"])(this.location.x, this.location.y, 'green');\n}\n\nWaypoint.prototype.drawConnections = function() {\n  this.connections.forEach(connection => {\n    Object(_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"drawPath\"])(Object(_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"buildPath\"])('', [this.location, connection.location]), 'yellow')\n  })\n}\n\nfunction POI(element) {\n\n  this.element = element;\n  this.center = Object(_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"findCenter\"])(element);\n  this.perimeter = Object(_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"generatePoints\"])(element);\n  this.id = element.id;\n}\n\nPOI.prototype.findAccessPoints = function(structureList) {\n  return (waypoints) => {\n    Object(_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"findAccessPoints\"])(this.perimeter, structureList).forEach(point => {\n      waypoints.addWaypoint(point);\n    });\n  }\n};\n\nPOI.prototype.addWalkable;\n\nfunction POIs() {\n  this.pois = [];\n}\n\nPOIs.prototype.addPOIs = function(POIList) {\n    return (waypoints) => {\n    POIList.forEach(POIElement => {\n      if (_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"ignoreList\"].indexOf(POIElement.nodeName) !== -1) return;\n\n      const poi = new POI(POIElement);\n      \n      this.pois.push(poi)\n      waypoints.addWaypoint(poi.center);\n    })\n  }\n}\n\nconst Structure = function(element) {\n  this.element = element\n  this.points = Object(_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"generatePoints\"])(element);\n}\n\nfunction Structures() {\n  this.structures = [];\n}\n\nStructures.prototype.addStructures = function(structureList) {\n  structureList.forEach(structure => {\n    if (_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"ignoreList\"].indexOf(structure.nodeName) !== -1) return;\n    const newStructure = new Structure(structure);\n    this.structures.push(newStructure)\n  });\n}\n\nfunction Waypoints(unwalkableAreas) {\n  this.waypoints = [];\n  this.unwalkableAreas = unwalkableAreas;\n}\n\nWaypoints.prototype.addWaypoint = function(vertice) {\n  let currentWaypoint = new Waypoint(vertice);\n  this.waypoints.forEach(waypoint => {\n    const line = [currentWaypoint.location, waypoint.location];\n    let walkable = true;\n    let count = 0;\n    while(walkable && count < this.unwalkableAreas.structures.length) {\n      const test = Object(_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"isPolyBisectPoly\"])(this.unwalkableAreas.structures[count++].points, line)\n      walkable = test.length === 0;\n    }\n\n    if(walkable) {\n      currentWaypoint.addConnection(waypoint);\n      waypoint.addConnection(currentWaypoint);\n    }\n  })\n  this.waypoints.push(currentWaypoint);\n}\n\n\n//# sourceURL=webpack:///./Classes.js?");

/***/ }),

/***/ "./Utilities.js":
/*!**********************!*\
  !*** ./Utilities.js ***!
  \**********************/
/*! exports provided: drawCircle, drawPath, buildPath, ignoreList, uniqueID, extractPolyElement, generatePoints, findCenter, isPointInPoly, isPolyBisectPoly, findAccessPoints */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"drawCircle\", function() { return drawCircle; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"drawPath\", function() { return drawPath; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"buildPath\", function() { return buildPath; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ignoreList\", function() { return ignoreList; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"uniqueID\", function() { return uniqueID; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"extractPolyElement\", function() { return extractPolyElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"generatePoints\", function() { return generatePoints; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"findCenter\", function() { return findCenter; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isPointInPoly\", function() { return isPointInPoly; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isPolyBisectPoly\", function() { return isPolyBisectPoly; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"findAccessPoints\", function() { return findAccessPoints; });\n// temporary dev tools\nlet svgElement = document.getElementById(\"Level11.Floor30\");\nconst svgns = \"http://www.w3.org/2000/svg\";\nfunction drawCircle(x, y, stroke) {\n  var circle = document.createElementNS(svgns, 'circle');\n  circle.setAttributeNS(null, 'cx', x);\n  circle.setAttributeNS(null, 'cy', y);\n  circle.setAttributeNS(null, 'r', '2');\n  circle.setAttributeNS(null, 'fill', stroke)\n  svgElement.appendChild(circle)\n}\n\nfunction drawPath(path, stroke) {\n  let pathElement = svgElement.appendChild(document.createElementNS(svgns, 'path'));\n  pathElement.setAttribute('d', path);\n  pathElement.setAttribute('stroke', stroke);\n  pathElement.setAttribute('fill', 'none')\n}\n\nfunction buildPath(path, points) {\n  if (!path) {\n    const start = points.shift();\n    path = `M ${start.x} ${start.y} `\n  }\n  points.forEach(point => {\n    path += `L ${point.x} ${point.y} `\n  })\n  return path;\n}\n\n// The following types have not yet been handled\nconst ignoreList = [\n  'line',\n  'polyline'\n]\n\n// stored value for handling js rounding\nconst offset = 6;\nconst smallOffset = .5;\n\nfunction uniqueID() {\n  return ['a', 'b', 'c'][Math.round(Math.random() * 2)] + Math.round((Math.random() * 1000000))\n}\n\nfunction extractPolyElement(element, children) {\n  children = children || [];\n\n  if (element.childNodes && element.childNodes[0]) {\n    Object.keys(element.childNodes).forEach(childKey => {\n      return childKey !== 'length' && extractPolyElement(element.childNodes[childKey], children);\n    })\n  } else if (element.nodeName !== '#text') children.push(element);\n\n  return children;\n}\n\nfunction generatePoints(area) {\n\n  switch (area.nodeName) {\n    case 'rect':\n      return [\n        {x: parseFloat(area.attributes.x.value), y: parseFloat(area.attributes.y.value)},\n        {x: parseFloat(area.attributes.x.value) + parseFloat(area.attributes.width.value), y: parseFloat(area.attributes.y.value)},\n        {x: parseFloat(area.attributes.x.value) + parseFloat(area.attributes.width.value), y: parseFloat(area.attributes.y.value) + parseFloat(area.attributes.height.value)},\n        {x: parseFloat(area.attributes.x.value), y: parseFloat(area.attributes.y.value) + parseFloat(area.attributes.height.value)}\n      ]\n      break;\n\n    case 'polygon':\n      let points = []\n      Object.keys(area.points).forEach(key => {\n        points[key] = {\n          x: parseFloat(area.points[key].x),\n          y: parseFloat(area.points[key].y)\n        }\n      })\n      return points;\n      break;\n\n    case 'path':\n      const box = area.getBBox();\n      return {\n        0: {x: box.x, y: box.y}\n      }\n      break;\n\n    default:\n      return undefined;\n  }\n}\n\nfunction findCenter(element) {\n  let center = {\n    x: null,\n    y: null,\n    width: null,\n    height: null\n  };\n\n  switch (element.nodeName) {\n    case 'rect':\n      Object.keys(center).forEach(key => {\n        center[key] = parseFloat(element.attributes[key].value)\n      });\n      break;\n    case 'polygon':\n    case 'path':\n      const box = element.getBBox();\n      Object.keys(center).forEach(key => {\n        center[key] = box[key];\n      })\n      break;\n    default:\n      center = null;\n      break;\n  }\n\n  return {x: center.x + center.width / 2, y: center.y + center.height / 2};\n}\n\nfunction isPointInPoly(vs, point) {\n  \n  const line = [point, {x:0,y:0}];\n  const intersections = isPolyBisectPoly(vs, line);\n  return intersections.length;\n};\n\nfunction findSlope(a, b) {\n  return (a.y - b.y) / (a.x - b.x);\n}\n\nfunction findIntercept(point, m) {\n  return point.y + m * point.x;\n}\n\nfunction findCross(a, aa, b, bb) {\n  const x = ((((a.x * aa.y) - (a.y * aa.x)) * (b.x - bb.x)) - ((a.x - aa.x) * ((b.x * bb.y) - (b.y * bb.x))))\n            / ((a.x - aa.x) * (b.y - bb.y) - (a.y - aa.y) * (b.x - bb.x));\n  const y = ((a.x * aa.y - a.y * aa.x) * (b.y - bb.y) - (a.y - aa.y) * (b.x * bb.y - b.y * bb.x))\n            / ((a.x - aa.x) * (b.y - bb.y) - (a.y - aa.y) * (b.x - bb.x))\n\n  if ( x && y ) {\n    var circle = document.createElementNS(svgns, 'circle');\n    circle.setAttributeNS(null, 'cx',x);\n    circle.setAttributeNS(null, 'cy',y);\n    circle.setAttributeNS(null, 'r', '2');\n    circle.setAttributeNS(null, 'fill', 'green')\n    svgElement.appendChild(circle)\n  }\n}\n\nfunction findMiddlePoly(above, below) {\n  if (!above || !below) return null;\n\n  const x = (above.x - below.x) / 2 + below.x;\n  const y = (above.y - below.y) / 2 + below.y;\n  const poly = [\n    {x: x - offset, y: y - offset},\n    {x: x + offset, y: y - offset},\n    {x: x - offset, y: y + offset},\n    {x: x + offset, y: y + offset}\n  ]\n\n  return {x, y, poly}\n}\n\nfunction lineEquation(a,b) {\n  const A = b.y - a.y;\n  const B = a.x - b.x;\n  const C = A * a.x + B * a.y;\n  return {A, B, C}\n}\n\nfunction calcInter(a,b) {\n  const det = a.A*b.B - b.A*a.B;\n  if (!det) return 0;\n  const x = (b.B*a.C - a.B*b.C)/det;\n  const y = (a.A*b.C - b.A*a.C)/det;\n  return {x, y};\n}\n\nfunction isPointOnLine(a,b, point) {\n  return Math.min(a.x, b.x) <= point.x + smallOffset\n    && Math.max(a.x, b.x) >= point.x - smallOffset\n    && Math.min(a.y, b.y) <= point.y + smallOffset\n    && Math.max(a.y, b.y) >= point.y - smallOffset\n    ? point : 0;\n}\n\nfunction findIntersectionFromPoints(a,b) {\n  const intersection = calcInter(lineEquation(a.a, a.b), lineEquation(b.a, b.b));\n  if (!intersection) return 0;\n  return isPointOnLine(a.a, a.b, intersection) && isPointOnLine(b.a, b.b, intersection) ? intersection : 0;\n}\n\nfunction isPolyBisectPoly(firstPoly, secondPoly) {\n  if (!firstPoly || !secondPoly) return;\n  let intersection = [];\n  let stroke;\n  \n  for(let i = -1, l = firstPoly.length, j = l - 1; ++i < l; j = i) {\n    \n    for(let ii = -1, ll = secondPoly.length, jj = ll - 1; ++ii < ll; jj = ii) {\n      const cross = findIntersectionFromPoints(\n        {\n          a:{x: firstPoly[i].x, y:firstPoly[i].y},\n          b:{x: firstPoly[j].x, y:firstPoly[j].y}\n        }, \n        {\n          a:{x: secondPoly[ii].x, y:secondPoly[ii].y}, \n          b:{x: secondPoly[jj].x, y:secondPoly[jj].y}\n        }\n      );\n\n      if (cross) {\n        intersection.push(cross);\n      }\n    };\n  }\n  \n  return intersection;\n}\n\nfunction findAccessPoints(walkable, unwalkableAreas) {\n  let crosses = [];\n  let waypoints = [];\n  unwalkableAreas.forEach(unwalkable => {\n    unwalkable = unwalkable.points;\n    isPolyBisectPoly(unwalkable, walkable).forEach(cross => {\n      let above;\n      let below;\n      crosses.forEach((point,i) => {\n        if (point.x === cross.x || point.y === cross.y) {\n          const newDistance = (cross.x - point.x) + (cross.y - point.y);\n          above = above && newDistance > above.distance ? above : newDistance > 0 ? {x: point.x, y: point.y, distance: newDistance} : above;\n          below = below && newDistance < below.distance ? below : newDistance < 0 ? {x: point.x, y: point.y, distance: newDistance} : below;\n        }\n      })\n      let middles = []\n      if (above) middles.push(findMiddlePoly(above, cross));\n      if (below) middles.push(findMiddlePoly(cross, below));\n\n      middles.forEach(middle => {\n        let draw = true;\n        let count = 0;\n\n        while(draw && count < unwalkableAreas.length) {\n          const crossCount = isPolyBisectPoly(unwalkableAreas[count].points, middle.poly);\n          draw = !crossCount.length && isPointInPoly(unwalkableAreas[count].points, {x:middle.x,y:middle.y}) !== 2;\n          count++\n        }\n        if(draw) {\n          waypoints.push({x:middle.x,y:middle.y})\n        }\n      })\n\n      crosses.push(cross);\n    })\n  })\n  return waypoints;\n}\n\n\n//# sourceURL=webpack:///./Utilities.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Classes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Classes */ \"./Classes.js\");\n/* harmony import */ var _Utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utilities */ \"./Utilities.js\");\n\n\n\nconst structures = Object(_Utilities__WEBPACK_IMPORTED_MODULE_1__[\"extractPolyElement\"])(document.getElementById(\"NotWalkable\"));\nconst newAreas = Object(_Utilities__WEBPACK_IMPORTED_MODULE_1__[\"extractPolyElement\"])(document.getElementById(\"Walkable\"));\n\nlet StructureCollection = new _Classes__WEBPACK_IMPORTED_MODULE_0__[\"Structures\"]();\nlet WaypointCollection = new _Classes__WEBPACK_IMPORTED_MODULE_0__[\"Waypoints\"](StructureCollection);\nlet POICollection = new _Classes__WEBPACK_IMPORTED_MODULE_0__[\"POIs\"]();\n\nStructureCollection.addStructures(structures);\nPOICollection.addPOIs(newAreas)(WaypointCollection);\nPOICollection.pois.forEach(poi => poi.findAccessPoints(StructureCollection.structures)(WaypointCollection));\nWaypointCollection.waypoints.forEach(waypoint => {\n  waypoint.drawWaypoint();\n  waypoint.drawConnections();\n});\n\nconsole.log(StructureCollection);\nconsole.log(POICollection);\nconsole.log(WaypointCollection);\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });