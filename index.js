import { Structures, POIs, Waypoints } from './Classes';
import { extractPolyElement } from './Utilities';

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
