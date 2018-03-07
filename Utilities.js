// temporary dev tools
let svgElement = document.getElementById("Level11.Floor30");
const svgns = "http://www.w3.org/2000/svg";
export function drawCircle(x, y, stroke) {
  var circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', x);
  circle.setAttributeNS(null, 'cy', y);
  circle.setAttributeNS(null, 'r', '2');
  circle.setAttributeNS(null, 'fill', stroke)
  svgElement.appendChild(circle)
}

export function drawPath(path, stroke) {
  let pathElement = svgElement.appendChild(document.createElementNS(svgns, 'path'));
  pathElement.setAttribute('d', path);
  pathElement.setAttribute('stroke', stroke);
  pathElement.setAttribute('fill', 'none')
}

export function buildPath(path, points) {
  if (!path) {
    const start = points.shift();
    path = `M ${start.x} ${start.y} `
  }
  points.forEach(point => {
    path += `L ${point.x} ${point.y} `
  })
  return path;
}

// The following types have not yet been handled
export const ignoreList = [
  'line',
  'polyline'
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

export function generatePoints(area) {

  switch (area.nodeName) {
    case 'rect':
      return [
        {x: parseFloat(area.attributes.x.value), y: parseFloat(area.attributes.y.value)},
        {x: parseFloat(area.attributes.x.value) + parseFloat(area.attributes.width.value), y: parseFloat(area.attributes.y.value)},
        {x: parseFloat(area.attributes.x.value) + parseFloat(area.attributes.width.value), y: parseFloat(area.attributes.y.value) + parseFloat(area.attributes.height.value)},
        {x: parseFloat(area.attributes.x.value), y: parseFloat(area.attributes.y.value) + parseFloat(area.attributes.height.value)}
      ]
      break;

    case 'polygon':
      let points = []
      Object.keys(area.points).forEach(key => {
        points[key] = {
          x: parseFloat(area.points[key].x),
          y: parseFloat(area.points[key].y)
        }
      })
      return points;
      break;

    case 'path':
      const box = area.getBBox();
      return {
        0: {x: box.x, y: box.y}
      }
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
        center[key] = parseFloat(element.attributes[key].value)
      });
      break;
    case 'polygon':
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

export function isPointInPoly(vs, point) {
  
  const line = [point, {x:0,y:0}];
  const intersections = isPolyBisectPoly(vs, line);
  return intersections.length;
};

function findSlope(a, b) {
  return (a.y - b.y) / (a.x - b.x);
}

function findIntercept(point, m) {
  return point.y + m * point.x;
}

function findCross(a, aa, b, bb) {
  const x = ((((a.x * aa.y) - (a.y * aa.x)) * (b.x - bb.x)) - ((a.x - aa.x) * ((b.x * bb.y) - (b.y * bb.x))))
            / ((a.x - aa.x) * (b.y - bb.y) - (a.y - aa.y) * (b.x - bb.x));
  const y = ((a.x * aa.y - a.y * aa.x) * (b.y - bb.y) - (a.y - aa.y) * (b.x * bb.y - b.y * bb.x))
            / ((a.x - aa.x) * (b.y - bb.y) - (a.y - aa.y) * (b.x - bb.x))

  if ( x && y ) {
    var circle = document.createElementNS(svgns, 'circle');
    circle.setAttributeNS(null, 'cx',x);
    circle.setAttributeNS(null, 'cy',y);
    circle.setAttributeNS(null, 'r', '2');
    circle.setAttributeNS(null, 'fill', 'green')
    svgElement.appendChild(circle)
  }
}

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
  const intersection = calcInter(lineEquation(a.a, a.b), lineEquation(b.a, b.b));
  if (!intersection) return 0;
  return isPointOnLine(a.a, a.b, intersection) && isPointOnLine(b.a, b.b, intersection) ? intersection : 0;
}

export function isPolyBisectPoly(firstPoly, secondPoly) {
  if (!firstPoly || !secondPoly) return;
  let intersection = [];
  let stroke;
  
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

export function findAccessPoints(walkable, unwalkableAreas) {
  let crosses = [];
  let waypoints = [];
  unwalkableAreas.forEach(unwalkable => {
    unwalkable = unwalkable.points;
    isPolyBisectPoly(unwalkable, walkable).forEach(cross => {
      let above;
      let below;
      crosses.forEach((point,i) => {
        if (point.x === cross.x || point.y === cross.y) {
          const newDistance = (cross.x - point.x) + (cross.y - point.y);
          above = above && newDistance > above.distance ? above : newDistance > 0 ? {x: point.x, y: point.y, distance: newDistance} : above;
          below = below && newDistance < below.distance ? below : newDistance < 0 ? {x: point.x, y: point.y, distance: newDistance} : below;
        }
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
  return waypoints;
}
