# SVG Waypoint Generator

The goal of this project was to explore the possiblity of automatically generating a Waypoint tree from an SVG that follows a specific structure. The structure requires two main sections:

* A group with an ID of `Walkable`
* A group with an ID of `Unwalkable`

Each section can contain different groups, but the final children must be shapes with ID's that designate a Point of Interest (POI).

## Viewing the sample

The codebase was written in vanilla JS to make accessibility simple. It also makes use of global browser functions, so it needs to be run in the browser.

Assuming `npm` is installed on your machine, run the following commands:
```
npm install
npm run build
```

Then, just open the `index.html` file.

## How it works

The basic goal of this test was to prove the possibility of locating two areas:

* The center of a POI
* The access points (doorways) of a POI

When the html file is opened, it runs an analysis that compares the walkable area of a POI to all the unwalkable areas. It finds the edges where two polygons overlap, finds the closest adjacent overlap (think two sides of a doorway) and then attempts to make a Waypoint between those points. If that center point is still inside an unwalkable area, no Waypoint is created.

All the Waypoints are then tested against each other to see if there is an unobstructed path between them. If so, a Connection is recorded.

In the sample, the green points represent Waypoints and the yellow lines show Connections.

## Next steps

A few edge cases still need to be handled

- Several values are hardcoded (like the SVG itself)
- If the center of a POI is in an unwalkable area, it needs to be relocated
- Additional Waypoints should be added to a space to navigate around unwalkable areas. This could also help with relocating the center point
- Test the A* algorithm in JS to see if routing can be done on the front end
- Optimizations. There are _many_ optimizations that can be applied to the current algorithms