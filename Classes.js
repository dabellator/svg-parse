import { 
  generatePoints,
  uniqueID,
  ignoreList,
  findCenter,
  findAccessPoints,
  isPolyBisectPoly,
  drawCircle,
  buildPath,
  drawPath, 
  createAdditionalWaypoints} from './Utilities';

export function Waypoint(location) {
  this.location = location;
  this.connections = [];
  this.id = uniqueID();
}

Waypoint.prototype.addConnection = function(waypoint) {
  this.connections.push(waypoint);
}

Waypoint.prototype.drawWaypoint = function() {
  drawCircle(this.location.x, this.location.y, 'green');
}

Waypoint.prototype.drawConnections = function() {
  this.connections.forEach(connection => {
    drawPath(buildPath('', [this.location, connection.location]), 'yellow')
  })
}

export function POI(element) {

  this.element = element;
  this.center = findCenter(element);
  this.perimeter = generatePoints(element);
  this.id = element.id;
}

POI.prototype.findAccessPoints = function(structureList) {
  return (waypoints) => {
    findAccessPoints(this.perimeter, structureList).forEach(point => {
      waypoints.addWaypoint(point);
    });
    createAdditionalWaypoints(this.center, this.perimeter, structureList).forEach(point => {
      waypoints.addWaypoint(point)
    })
  }
};

export function POIs() {
  this.pois = [];
}

POIs.prototype.addPOIs = function(POIList) {
    return (waypoints) => {
    POIList.forEach(POIElement => {
      if (ignoreList.indexOf(POIElement.nodeName) !== -1) return;

      const poi = new POI(POIElement);
      
      this.pois.push(poi)
      waypoints.addWaypoint(poi.center);
    })
  }
}

export const Structure = function(element) {
  this.element = element
  this.points = generatePoints(element);
}

export function Structures() {
  this.structures = [];
}

Structures.prototype.addStructures = function(structureList) {
  structureList.forEach(structure => {
    if (ignoreList.indexOf(structure.nodeName) !== -1) return;
    const newStructure = new Structure(structure);
    this.structures.push(newStructure)
  });
}

export function Waypoints(unwalkableAreas) {
  this.waypoints = [];
  this.unwalkableAreas = unwalkableAreas;
}

Waypoints.prototype.addWaypoint = function(vertice) {
  let currentWaypoint = new Waypoint(vertice);
  this.waypoints.forEach(waypoint => {
    const line = [currentWaypoint.location, waypoint.location];
    let walkable = true;
    let count = 0;
    while(walkable && count < this.unwalkableAreas.structures.length) {
      const test = isPolyBisectPoly(this.unwalkableAreas.structures[count++].points, line)
      walkable = test.length === 0;
    }

    if(walkable) {
      currentWaypoint.addConnection(waypoint);
      waypoint.addConnection(currentWaypoint);
    }
  })
  this.waypoints.push(currentWaypoint);
}
