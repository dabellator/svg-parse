// temporary dev tools
export const svgns = "http://www.w3.org/2000/svg";
export function drawCircle(x, y, stroke) {
  let svgElement = document.getElementById("Level11.Floor30");
  var circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', x);
  circle.setAttributeNS(null, 'cy', y);
  circle.setAttributeNS(null, 'r', '2');
  circle.setAttributeNS(null, 'fill', stroke)
  svgElement.appendChild(circle)
}

export function drawPath(path, stroke) {
  let svgElement = document.getElementById("Level11.Floor30");
  let pathElement = svgElement.appendChild(document.createElementNS(svgns, 'path'));
  pathElement.setAttribute('d', path);
  pathElement.setAttribute('stroke', stroke);
  pathElement.setAttribute('fill', 'none')
}

export function buildPath(path, points) {
  let pointsCopy = points.slice();
  if (!path) {
    const start = pointsCopy.shift();
    path = `M ${start.x} ${start.y} `
  }
  pointsCopy.forEach(point => {
    path += `L ${point.x} ${point.y} `
  })
  return path;
}

// end temp dev tools

// The following types have not yet been handled
export const ignoreList = [
  'line'
]

// stored value for handling js rounding
const offset = 6;
const smallOffset = .5;

export function uniqueID() {
  return ['a', 'b', 'c'][Math.round(Math.random() * 2)] + Math.round((Math.random() * 1000000))
}

export function extractPolyElement(element, children) {
  children = children || [];

  if (element.childNodes && element.childNodes[0]) {
    Object.keys(element.childNodes).forEach(childKey => {
      return childKey !== 'length' && extractPolyElement(element.childNodes[childKey], children);
    })
  } else if (element.nodeName !== '#text') children.push(element);

  return children;
}

function parseDecimal(float) {

  return parseFloat(parseFloat(float).toFixed(4));
}

export function generatePoints(area) {

  switch (area.nodeName) {
    case 'rect':
      return [
        {x: parseDecimal(area.attributes.x.value), y: parseDecimal(area.attributes.y.value)},
        {x: parseDecimal(area.attributes.x.value) + parseDecimal(area.attributes.width.value), y: parseDecimal(area.attributes.y.value)},
        {x: parseDecimal(area.attributes.x.value) + parseDecimal(area.attributes.width.value), y: parseDecimal(area.attributes.y.value) + parseDecimal(area.attributes.height.value)},
        {x: parseDecimal(area.attributes.x.value), y: parseDecimal(area.attributes.y.value) + parseDecimal(area.attributes.height.value)}
      ]
      break;

    case 'polygon':
    case 'polyline':
      let points = []
      Object.keys(area.points).forEach(key => {
        points[key] = {
          x: parseDecimal(area.points[key].x),
          y: parseDecimal(area.points[key].y)
        }
      })
      return points;
      break;

    case 'path':
      const box = area.getBBox();
      return [
        {x: box.x, y: box.y},
        {x: box.x + box.width, y: box.y},
        {x: box.x + box.width, y: box.y + box.height},
        {x: box.x, y: box.y + box.height},
        {x: box.x, y: box.y}
      ]
      break;

    default:
      return undefined;
  }
}

export function findCenter(element) {
  let center = {
    x: null,
    y: null,
    width: null,
    height: null
  };

  switch (element.nodeName) {
    case 'rect':
      Object.keys(center).forEach(key => {
        center[key] = parseDecimal(element.attributes[key].value)
      });
      break;

    case 'polygon':
    case 'polyline':
    case 'path':
      const box = element.getBBox();
      Object.keys(center).forEach(key => {
        center[key] = box[key];
      })
      break;
    default:
      center = null;
      break;
  }

  return {x: center.x + center.width / 2, y: center.y + center.height / 2};
}

function isPointInPoly(vs, point) {
  
  const line = [point, {x:0,y:0}];
  const intersections = isPolyBisectPoly(vs, line);
  return intersections.length;
};

function findMiddlePoly(above, below) {
  if (!above || !below) return null;

  const x = (above.x - below.x) / 2 + below.x;
  const y = (above.y - below.y) / 2 + below.y;
  const poly = [
    {x: x - offset, y: y - offset},
    {x: x + offset, y: y - offset},
    {x: x - offset, y: y + offset},
    {x: x + offset, y: y + offset}
  ]

  return {x, y, poly}
}

function lineEquation(a,b) {
  const A = b.y - a.y;
  const B = a.x - b.x;
  const C = A * a.x + B * a.y;
  return {A, B, C}
}

function calcInter(a,b) {
  const det = a.A*b.B - b.A*a.B;
  if (!det) return 0;
  const x = (b.B*a.C - a.B*b.C)/det;
  const y = (a.A*b.C - b.A*a.C)/det;
  return {x, y};
}

function isPointOnLine(a,b, point) {
  return Math.min(a.x, b.x) <= point.x + smallOffset
    && Math.max(a.x, b.x) >= point.x - smallOffset
    && Math.min(a.y, b.y) <= point.y + smallOffset
    && Math.max(a.y, b.y) >= point.y - smallOffset
    ? point : 0;
}

function findIntersectionFromPoints(a,b) {
  let intersection = calcInter(lineEquation(a.a, a.b), lineEquation(b.a, b.b));
  if (!intersection) return 0;
  intersection = {x:parseDecimal(intersection.x),y:parseDecimal(intersection.y)};
  return isPointOnLine(a.a, a.b, intersection) && isPointOnLine(b.a, b.b, intersection) ? intersection : 0;
}

function isSegmentBisectPoly(segment, poly) {
  if (!segment || !poly) return;
  let intersections = [];
  for(let i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
    const cross = findIntersectionFromPoints(
      {
        a:segment[0],
        b:segment[1]
      }, 
      {
        a:{x: poly[i].x, y:poly[i].y}, 
        b:{x: poly[j].x, y:poly[j].y}
      }
    );

    if (cross) {
      intersections.push(cross);
    }
  }
  return intersections;
}

export function isPolyBisectPoly(firstPoly, secondPoly) {
  if (!firstPoly || !secondPoly) return;
  let intersection = [];
  
  for(let i = -1, l = firstPoly.length, j = l - 1; ++i < l; j = i) {
    for(let ii = -1, ll = secondPoly.length, jj = ll - 1; ++ii < ll; jj = ii) {
      const cross = findIntersectionFromPoints(
        {
          a:{x: firstPoly[i].x, y:firstPoly[i].y},
          b:{x: firstPoly[j].x, y:firstPoly[j].y}
        }, 
        {
          a:{x: secondPoly[ii].x, y:secondPoly[ii].y}, 
          b:{x: secondPoly[jj].x, y:secondPoly[jj].y}
        }
      );

      if (cross) {
        intersection.push(cross);
      }
    };
  }
  
  return intersection;
}

// update polybisect poly to search for line intersections instead. keep track of the "walkable" line, gather the
// crosses, and then continue

export function findAccessPoints(walkable, unwalkableAreas) {
  let waypoints = [];
  for(let i = -1, l = walkable.length, j = l - 1; ++i < l; j = i) {
    const segment = [
      {x: walkable[i].x, y: walkable[i].y},
      {x: walkable[j].x, y: walkable[j].y}
    ];
    
    let crosses = [];
    unwalkableAreas.forEach(unwalkable => {
      unwalkable = unwalkable.points;
      isSegmentBisectPoly(segment, unwalkable).forEach(cross => {
        let above;
        let below;
        crosses.forEach(point => {
          const newDistance = (cross.x - point.x) + (cross.y - point.y);
          above = above && newDistance > above.distance ? above : newDistance > 0 ? {x: point.x, y: point.y, distance: newDistance} : above;
          below = below && newDistance < below.distance ? below : newDistance < 0 ? {x: point.x, y: point.y, distance: newDistance} : below;
        })
        
        let middles = []
        if (above) middles.push(findMiddlePoly(above, cross));
        if (below) middles.push(findMiddlePoly(cross, below));

        middles.forEach(middle => {
          let draw = true;
          let count = 0;
          
          while(draw && count < unwalkableAreas.length) {
            const crossCount = isPolyBisectPoly(unwalkableAreas[count].points, middle.poly);
            draw = !crossCount.length && isPointInPoly(unwalkableAreas[count].points, {x:middle.x,y:middle.y}) !== 2;
            count++
          }
          if(draw) {
            waypoints.push({x:middle.x,y:middle.y})
          }
        })

        crosses.push(cross);
      })
    })
  }
  
  return waypoints;
}

export function createAdditionalWaypoints(center, perimeter, structures) {
  let waypoints = [];
  perimeter.forEach(perimeterPoint => {
    const segment = [center, perimeterPoint];
    waypoints = waypoints.concat(findAccessPoints(segment, structures));
  })
  return waypoints;
}
