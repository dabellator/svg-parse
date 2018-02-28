var Svg = require('svgutils').Svg;
 
Svg.fromSvgDocument(__dirname + '/file.svg', function(err, svg){
    if(err){
        throw new Error('SVG file not found or invalid');
    }

    const POIList = svg.toJSON().elements.map(element => {
      return element.id;
    })
    
    console.log(POIList);
    console.log("---------------------------");
    console.log("---------------------------");

    svg.applyMatrix(null, function(newSvg){
        console.log(newSvg.toJSON().elements[0].points);
    });
});

// const htmlparser = require("htmlparser2");
// const fs = require('fs');

// fs.readFile('file.svg', 'utf-8', function(err, data) {
//   const dom = htmlparser.parseDOM(data, {xmlMode:true});
//   const svg = dom.filter(element => {
//     return element.name === 'svg'
//   })
//   console.log(svg[0].children[svg[0].children.length - 2].children[svg[0].children[svg[0].children.length - 2].children.length -3]);
//   const areas = svg[0].children.filter(child => {
//     return child.attribs && child.attribs.id
//   }).map(filteredChild => {
//     return filteredChild.attribs;
//   })
//   const rects = areas.filter(area => {
//       return area.x && area.y;
//   }).map(rect => {
//     return {
//       id: rect.id,
//       x: rect.x,
//       y: rect.y,
//       width: rect.width,
//       height: rect.height,
//       center: {
//         x: parseInt(rect.x) + parseInt(rect.width) / 2,
//         y: parseInt(rect.y) + parseInt(rect.height) / 2
//       }
//     }
//   })
//   const polys = areas.filter(area => {
//     return area.points;
//   }).map(poly => {
//     return poly.id
//   })

//   // console.log("rects: ", rects);
//   // console.log("polys:", polys)
// })
