# Hypocube

Composable, responsive React-based graphs

Read the docs. TODO: create docs.

## Motivation

At a high level, React and data visualization are natural companions. React manages SVG elements just as easily as HTML, as well as attaching event handlers to those elements for interactivity. There are many great React data-vis libraries out there: ADD THEM

At the same time, data visualization occupies a problem space that web authors have yet to fully contend with in the responsive design era. Graphs are not mere images that can be shrunk or expanded to fit the viewport with no loss of meaning. At the same time, they are not text that can be easily restyled by media queries. They are a different beast.

The responsive design mindset forces us to separate content from presentation. Content, in this case, is your data, usually represented by "space" on a Cartesian plane, but also sometimes by colors, line styles, etc. Presentation (or what Edward Tufte calls "non-data ink") is everything else, including some things not usually thought of as stylistic (e.g. the width and spacing of bars on a bar graph is stylistic, even though it ).

By clearly delineating different types of space, we can create graphs that are responsive to device capabilities. We can also, by enabling interactions such as panning or pinch-zoom, give users with small screens the ability to access content beyond what the basic screen real-estate might seemingly allow.

## Quick start

TODO: add a quick start
