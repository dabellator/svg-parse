import { Structures, POIs, Waypoints } from "./Classes";
import { extractPolyElement } from "./Utilities";

let uploadElement = document.getElementById("svg-upload");

function analyze() {
  const structures = extractPolyElement(document.getElementById("NotWalkable"));
  const newAreas = extractPolyElement(document.getElementById("Walkable"));

  let StructureCollection = new Structures();
  let WaypointCollection = new Waypoints(StructureCollection);
  let POICollection = new POIs();

  StructureCollection.addStructures(structures);
  POICollection.addPOIs(newAreas)(WaypointCollection);
  POICollection.pois.forEach(poi => poi.findAccessPoints(StructureCollection.structures)(WaypointCollection));
  WaypointCollection.waypoints.forEach(waypoint => {
    waypoint.drawWaypoint();
    waypoint.drawConnections();
  });

  console.log(StructureCollection);
  console.log(POICollection);
  console.log(WaypointCollection);
}

function handleSVG(input) {
  let reader = new FileReader();

  reader.addEventListener("load", () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(reader.result, "image/svg+xml");
    const docElement = document.importNode(doc.children[0], true)
    document.getElementById("svg-wrapper").appendChild(docElement);
    analyze();
  }, false);

  reader.readAsText(input.target.files[0])
}

uploadElement.addEventListener("change", handleSVG);
