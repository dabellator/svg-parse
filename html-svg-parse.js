let svgElement = document.getElementById("Level11.Floor20");
const svgns = "http://www.w3.org/2000/svg";

const areas = Array.prototype.filter.call(svgElement.children, child => {
  return child.id;
}).map(filteredChild => {
  return filteredChild;
})

console.log(areas)

const pointList = areas.filter(area => {
  return area.nodeName !== 'g'
}).map(generateList);

function generateList(area) {
  if (area.nodeName === 'rect') return [
    {x: parseFloat(area.attributes.x.value), y: parseFloat(area.attributes.y.value)},
    {x: parseFloat(area.attributes.x.value) + parseFloat(area.attributes.width.value), y: parseFloat(area.attributes.y.value)},
    {x: parseFloat(area.attributes.x.value) + parseFloat(area.attributes.width.value), y: parseFloat(area.attributes.y.value) + parseFloat(area.attributes.height.value)},
    {x: parseFloat(area.attributes.x.value), y: parseFloat(area.attributes.y.value) + parseFloat(area.attributes.height.value)}
  ]
  if (area.nodeName === 'polygon') return area.points;
  if (area.nodeName === 'g') return undefined;
}
  
const rects = areas.filter(area => {
  return area.x && area.y;
})

const polys = areas.filter(area => {
  return area.points;
}).map(poly => {
  const box = poly.getBBox();
  return {
    id: poly.id,
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
}});

const groups = areas.filter(area => {
  return area.nodeName === 'g'
}).map(group => {
  const box = group.getBBox();
  return {
    id: group.id,
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height
  }
})

const pointA = {x: parseFloat(areas[9].attributes.x.value) + parseFloat(areas[9].attributes.width.value) / 2, y: parseFloat(areas[9].attributes.y.value) + parseFloat(areas[9].attributes.height.value) / 2};
const pointB = {x: parseFloat(areas[10].attributes.x.value) + parseFloat(areas[10].attributes.width.value) / 2, y: parseFloat(areas[10].attributes.y.value)+ parseFloat(areas[10].attributes.width.value) / 2};
const pointC = {x: 1041.9449462890625, y: 74.69681418814311};
const pointD = {x: 1041.9449462890625, y: 21.543699264526367};
console.log(pointA, pointB)

const structureList = Array.prototype.map.call(areas[16].children, generateList);

let POIList = svgElement.appendChild(document.createElementNS(svgns, 'g'));
POIList.setAttribute('id', 'POIList');
function createPOI(rect) {
  let labelGroup = POIList.appendChild(document.createElementNS(svgns, 'g'));
  labelGroup.setAttribute('opacity', '0');
  labelGroup.setAttribute("onmouseover", "evt.currentTarget.setAttribute('opacity', '1')")
  labelGroup.setAttribute("onmouseout", "evt.currentTarget.setAttribute('opacity', '0')")
  let labelBorder = labelGroup.appendChild(document.createElementNS(svgns, 'rect'));
  labelBorder.setAttribute('id', `${rect.id}-label`);
  labelBorder.setAttribute('x', rect.x);
  labelBorder.setAttribute('y', rect.y);
  labelBorder.setAttribute('width', rect.width);
  labelBorder.setAttribute('height', rect.height);
  labelBorder.setAttribute('stroke', 'blue');
  labelBorder.setAttribute('fill-opacity', '0');
  let label = labelGroup.appendChild(document.createElementNS(svgns, 'text'));
  label.appendChild(document.createTextNode(`${rect.id}`))
  label.setAttribute('x', -100 + parseFloat(rect.x) + parseFloat(rect.width) / 2);
  label.setAttribute('y', -10 + parseFloat(rect.y) + parseFloat(rect.height) / 2);
  var circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', parseFloat(rect.x) + parseFloat(rect.width) / 2);
  circle.setAttributeNS(null, 'cy', parseFloat(rect.y) + parseFloat(rect.height) / 2);
  circle.setAttributeNS(null, 'r', '5');

  labelGroup.appendChild(circle);


  // labelGroup.addEventListener('mouseover', () => {
  //   alert('eep')
  // })
  // labelGroup.addEventListener('mouseout', () => {
  //   labelGroup.setAttribute('visibility', 'hidden');
  // })
};

const rectBoxes = rects.map(rect => {
  return {
    x: rect.attributes.x.value,
    y: rect.attributes.y.value,
    width: rect.attributes.width.value,
    height: rect.attributes.height.value,
    id: rect.id
  }
}).forEach(createPOI);

polys.forEach(createPOI);

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
  
  console.log(x, y)
  console.log(a, aa, b, bb)

  if ( x && y ) {
    var circle = document.createElementNS(svgns, 'circle');
    circle.setAttributeNS(null, 'cx',x);
    circle.setAttributeNS(null, 'cy',y);
    circle.setAttributeNS(null, 'r', '2');
    circle.setAttributeNS(null, 'fill', 'green')
    svgElement.appendChild(circle)
  }
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
  return Math.min(a.x, b.x) <= point.x && Math.max(a.x, b.x) >= point.x && Math.min(a.y, b.y) <= point.y && Math.max(a.y, b.y) >= point.y ? point : 0;
}

function findIntersectionFromPoints(a,b) {
  const intersection = calcInter(lineEquation(a.a, a.b), lineEquation(b.a, b.b));
  if (!intersection) return 0;
  a.b.x = parseFloat(a.b.x.toPrecision(4));
  b.a.x = parseFloat(b.a.x.toPrecision(4));
  a.a.x = parseFloat(a.a.x.toPrecision(4));
  b.b.x = parseFloat(b.b.x.toPrecision(4));
  intersection.x = parseFloat(intersection.x.toPrecision(4));
  a.a.y = parseFloat(a.a.y.toPrecision(4));
  a.b.y = parseFloat(a.b.y.toPrecision(4));
  b.a.y = parseFloat(b.a.y.toPrecision(4));
  b.b.y = parseFloat(b.b.y.toPrecision(4));
  intersection.y = parseFloat(intersection.y.toPrecision(4));
  return isPointOnLine(a.a, a.b, intersection) && isPointOnLine(b.a, b.b, intersection) ? intersection : 0;
}

function buildPath(path, points) {
  if (!path) {
    const start = points.shift();
    path = `M ${start.x} ${start.y} `
  }
  points.forEach(point => {
    path += `L ${point.x} ${point.y} `
  })
  console.log(path)
  return path;
}

function drawPath(path, stroke) {
  let pathElement = svgElement.appendChild(document.createElementNS(svgns, 'path'));
  pathElement.setAttribute('d', path);
  pathElement.setAttribute('stroke', stroke);
  pathElement.setAttribute('fill', 'none')
}

function isPointInPoly(poly, pt){
  if (!poly) return false;
  for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
      && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
      && (c = !c);
  return c;
}

function isPolyBisectPoly(firstPoly, secondPoly) {
  if (!firstPoly || !secondPoly) return;
  let intersection = [];
  let stroke;
  
  for(i = -1, l = firstPoly.length, j = l - 1; ++i < l; j = i) {
    for(ii = -1, ll = secondPoly.length, jj = ll - 1; ++ii < ll; jj = ii) {
      cross = findIntersectionFromPoints(
        {
          a:{x: firstPoly[i].x, y:firstPoly[i].y},
          b:{x: firstPoly[j].x, y:firstPoly[j].y}
        }, 
          {a:{x: secondPoly[ii].x, y:secondPoly[ii].y}, 
          b:{x: secondPoly[jj].x, y:secondPoly[jj].y}
        }
      );

      if (cross) intersection.push(cross);
        // determine nearest intersection
        // intersection = intersection && (
        //   (secondPoly[ii].y - cross.y) / (secondPoly[ii].x - cross.x) > 
        //   (secondPoly[ii].y - intersection.y) / (secondPoly[ii].x - intersection.x)) ? intersection : {intersect: cross, end: firstPoly[i]};
    };
  }

  return intersection;

}

function drawCircle(x, y, stroke) {
  var circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', x);
  circle.setAttributeNS(null, 'cy', y);
  circle.setAttributeNS(null, 'r', '2');
  circle.setAttributeNS(null, 'fill', stroke)
  svgElement.appendChild(circle)
}

function createGridPoint(element, x, y, size) {
  
  const center = {x, y}
  let collide = false;
  let fill = null;
  let i = 0;
  let j = 0;
  while (!collide && i < pointList.length) {
    collide = isPointInPoly(pointList[i++], center);
    if (collide) fill = 'green';
    while (collide && j < structureList.length) {
      collide = !isPointInPoly(structureList[j++], center)
      if (!collide) fill = 'red'
    }
  }

  if (fill) {
    let gridSquare = element.appendChild(document.createElementNS(svgns, 'circle'));
    gridSquare.setAttribute('cx', x);
    gridSquare.setAttribute('cy', y);
    gridSquare.setAttribute('r', 1);
    gridSquare.setAttribute('fill', fill);
  }
}

function createGrid() {
  const box = svgElement.getBBox();
  let x = box.x;
  let y = box.y;
  let size = 5;
  while(x < box.x + box.width) {
    while(y < box.y + box.height) {
      createGridPoint(svgElement, x, y, size);
      y += size;
    }
    x += size;
    y = box.y;
  }
  console.log("DONE!")
}

function findIntersection() {
  for(i=6; i < pointList.length; i++) {
    for(j=0; j < pointList.length; j++) {
      if (i === j && i < pointList.length -1) j++;
      if (isPolyBisectPoly(pointList[i], pointList[j])) {
        console.log("area 1 and poly 1", areas[i], pointList[i])
        console.log("area 2 and poly 2", areas[j], pointList[j]);
      }
    }
  }
}

function makeWaypoints() {
  // take pointList and identify lines that are navigable
  let crosses = [];
  structureList.forEach(structure => {
    isPolyBisectPoly(structure, pointList[9]).forEach(cross => {
      let above;
      let below;
      crosses.forEach(point => {
        // need to handle both sides
        if (point.x === cross.x || point.y === cross.y) {
          // console.log("Data: ", point, cross)
          const newDistance = (cross.x - point.x) + (cross.y - point.y);
          // console.log("dist: ", newDistance);
          above = above && newDistance > above.distance ? above : newDistance > 0 ? {x: point.x, y: point.y, distance: newDistance} : above;
          below = below && newDistance < below.distance ? below : newDistance < 0 ? {x: point.x, y: point.y, distance: newDistance} : below;
          // console.log("result: ", above, below)
        }
      })
      console.log(above, below, cross)
      above = above || cross;
      below = below || cross;
      if (above.x !== below.x || above.y !== below.y) {
        const x = (above.x - below.x) / 2 + below.x;
        const y = (above.y - below.y) / 2 + below.y;
        drawCircle(x, y, 'green');
      }
      crosses.push(cross);
      console.log(crosses)
    })
  })
}

makeWaypoints()

const firstPoly = [{x: 943, y: 417},
  {x: 1066, y: 417},
  {x: 1066, y: 821},
  {x: 943, y: 821}];
const secondPoly = [
  {x: 949, y: 300},
  {x: 1236, y: 300},
  {x: 1236, y: 417},
  {x: 949, y: 417}];

const poly2a = []
console.log(structureList);
// console.log(pointList[9]);
// structureList.forEach((structure, i) => {
//   if(isPolyBisectPoly(structure, secondPoly)) console.log(i)
// })
// console.log(secondPoly)
// console.log(isPolyBisectPoly(structureList[38], [pointA, pointB]));
// console.log(isPolyBisectPoly(structureList[38], [pointD, pointB]));
// console.log(isPolyBisectPoly(pointList[9], structureList[39]));
// console.log(isPolyBisectPoly(pointList[9], structureList[38]));
// createGrid();