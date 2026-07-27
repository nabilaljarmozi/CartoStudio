# CartoStudio

**by Nabil ALJARMOZI** · [nabilmg@gmail.com](mailto:nabilmg@gmail.com)

A design-time cartography tool in a single HTML file. Upload your own boundaries,
upload your own table, join the two, style the result through a Power BI–style
formatting pane, drill between admin levels, and export print-ready SVG / PNG / PDF.

CartoStudio ships **no** geometry. Every polygon on the map comes from a file you
upload.

## Open it

Double-click `cartostudio.html`, or host it anywhere static — GitHub Pages,
Netlify, S3, a shared drive. There is no build step, no server, no account.

The page pulls five small libraries from a CDN on first load — `d3-geo`,
`d3-polygon`, `topojson-client`, `polylabel` and `papaparse` — plus `xlsx` and
`jspdf` only if you use those features. Everything else is inline. A machine with
no internet access will show a "could not load the map libraries" message instead
of the map.

## 30-second tour

1. Open the file. Drop `examples/terrafirma-admin1.geojson` onto the canvas.
   Four polygons appear, fitted to the viewport in a Mercator projection.
2. In the **Data** panel, upload `examples/terrafirma-admin2.geojson` as Admin 2.
3. Upload `examples/terrafirma-admin2.csv`. The columns are detected, the join
   key is bound, and the map colours in. The status line reads
   *"All 8 rows matched the geometry."*
4. Click any polygon to drill into its parent Admin 1. `Esc`, or the home button
   in the top-left of the canvas, takes you back.
5. Open the **Format** tab and work down the sixteen numbered cards. Every
   control updates the map as you drag it; a whole drag is one undo step.
6. **Export → Download PDF** with "Add legend page" ticked.

`examples/terrafirma-admin1.topojson` is the same Admin 1 layer as a TopoJSON
topology, if you want to check that path.

## The join model

Three things have to line up: a **key on the geometry**, a **key column in your
table**, and the **link field** that says which geometry property the two are
compared on.

### 1. Geometry side — field mapping

Every upload is scanned for its property names and you pick which one is the
join key and which is the display name. Common conventions (`ADM1_PCODE`,
`pcode_1`, `GID_1`, `state_id`, `shapeName`, …) are preselected; you can always
override. Those choices are copied onto canonical `ADM1_PCODE` / `ADM1_EN` /
`ADM2_PCODE` / `ADM2_EN` properties internally — the original properties are
left intact, so any of them can still be used as a link field.

An Admin 2 upload also needs a **parent Admin 1 key**. Without it the children
cannot be attributed to a state and drill-down will skip them.

### 2. Data side — field bindings

Each column is assigned a role:

| Role | Meaning |
| --- | --- |
| Admin 1 / Admin 2 join column | what gets matched against the geometry |
| Choropleth value | numeric for quantile / equal / manual, any value for categorical |
| Bubble size | numeric, drives the √-scaled bubble radius |
| Glyph values | 2+ numerics — one pie slice, column or ring each |
| Label value 2 | an extra numeric line on labels |
| Label text 1 | overrides the geometry's name on labels |
| Tooltip fields | anything else you want on hover |

When both Admin 1 and Admin 2 columns are bound, rows key on Admin 2 and roll up
to Admin 1 (sums for measures, modal category for categorical, first non-empty
for text) whenever the Admin 1 view needs a value.

### 3. Link field — join by code or by name

*Map setup → Admin 1 link field* picks the geometry property your data column is
compared against. Leave it on the code column for a normal P-code join; switch it
to the name column to join a table that only has names.

Matching is deliberately tolerant on both sides: values are uppercased and
stripped of spaces, dashes and underscores, so `Khartoum`, `khartoum` and
`KHARTOUM` collide, as do `SD-01`, `sd_01` and `SD01`.

### Worked example

`terrafirma-admin1.geojson` (abridged — note the counter-clockwise outer ring,
which is what RFC 7946 asks for):

```json
{ "type": "FeatureCollection", "features": [
  { "type": "Feature",
    "properties": { "ADM1_PCODE": "TF01", "ADM1_EN": "Norvale" },
    "geometry": { "type": "Polygon",
      "coordinates": [[[30,14],[32,14],[32,16],[30,16],[30,14]]] } }
] }
```

`terrafirma-admin1.csv`:

```csv
adm1_pcode,region_name,population,incidents,severity,clinics,schools,water_points
TF01,Norvale,418000,132,High,40,25,15
TF02,Estmarch,265000,47,Medium,18,30,9
```

Bind *Admin 1 join column* → `adm1_pcode`, *Choropleth value* → `population`,
*Bubble size* → `incidents`, *Glyph values* → `clinics, schools, water_points`.
Set *Classification* to `Categorical` and *Choropleth value* to `severity` to
colour by category instead.

## Winding

Uploaded polygons are rewound on every load. d3-geo follows the spherical
right-hand rule — outer rings clockwise, holes counter-clockwise — which is the
opposite of RFC 7946. A counter-clockwise outer ring handed to `d3.geoPath` is
read as the *complement* of the region, and the map renders as one solid fill
with a pinhole. The toast after each upload reports how many rings were flipped.

## What renders, bottom to top

1. **Choropleth fill** — quantile, equal interval, manual breaks or categorical;
   no-data colour, transparent-for-no-data, treat-0-as-no-data. Categorical
   values are sorted naturally, so `Severity 10` follows `Severity 9`.
   *Classify on* chooses whether breaks are recomputed for what is on screen or
   held fixed across drill levels.
2. **Outer glow** — an optional soft halo behind everything.
3. **Borders** — Admin 1 and Admin 2 styled independently.
4. **Bubbles** — √-scaled between a min and max radius, largest painted first.
5. **Glyphs** — pie, donut, column or concentric circles, sized by total. A
   single positive measure draws a full circle rather than a degenerate arc.
6. **Labels** — three cards (Admin 1, Admin 2 default view, Admin 2 drill view),
   each with name/value composition, halo, fit-to-shape (stack → abbreviate →
   shrink → hide), spread characters, and anchors from the area-weighted
   centroid with a polylabel fallback for concave shapes.

Legends: choropleth (with an auto-appended *No data* swatch), bubble, glyph
categories, admin levels and values. Legends that share a corner stack inside one
rounded frame; the frame stacks vertically or horizontally. A latitude-aware
scale bar snaps to round distances and dodges whichever legend shares its corner.

## Export

- **SVG** — the live SVG, cloned, with the blur filter removed, halos thinned to
  a hairline, the font stack inlined and the background painted.
- **PNG** — the same SVG rasterised through an offscreen canvas at 1×, 2× or 4×.
- **PDF** — via jsPDF, at A5 / A4 / A3 / Letter / Legal / Tabloid in either
  orientation, optionally with a second page carrying the legend as a vector
  table.

## Saving your work

- Settings, bindings and (when they fit the browser's quota) the uploaded files
  are written to `localStorage` on every change and restored on reload.
- **Project → Save project** writes one `.json` containing geometry, data and
  formatting. **Open project** restores it anywhere.
- **Project → Copy shareable link** puts the formatting, bindings and field
  mapping in the URL hash. It does **not** carry geometry or data — the
  recipient needs their own copy of the files, or the project `.json`.

## Known limits

- **Projection is Mercator only**, fitted to the visible extent. Good for
  country and sub-national maps; wrong for polar or whole-world work.
- **Uploads are not simplified.** A 40 MB boundary file will render, slowly.
  Simplify at [mapshaper.org](https://mapshaper.org) first; 1–3 MB is a
  comfortable working size. Files over 90 MB are rejected outright.
- **Two levels only** — Admin 1 and Admin 2. There is no Admin 3.
- **Labels are measured by approximation** (`0.55 × font-size` per character),
  not by real text metrics, so fit-to-shape is close rather than exact for
  condensed or wide fonts.
- **Enclave detection** (a label dodging a state fully inside another) is skipped
  above 400 features per level, where the pairwise test gets expensive.
- **`localStorage` holds about 5 MB.** Past roughly 3.5 MB of geometry plus data
  only the design is auto-saved; use *Save project* for the rest.
- **Point and line geometry is ignored** — only `Polygon` and `MultiPolygon`
  features are kept.
- **No cross-filtering.** This is one map, not a dashboard.

## Author

**Nabil ALJARMOZI** — [nabilmg@gmail.com](mailto:nabilmg@gmail.com)

Card 17 of the formatting pane carries the same details in-app. Exports are
attributed too: the SVG gets a `<title>` and `<desc>`, and the PDF gets document
properties plus a footer line on the legend page.

## Provenance

The algorithms are ported from [AdminCartograph](https://github.com/nabilaljarmozi/AdminCartograph)
(branch `base`), a Power BI custom visual: classification and ramps from
`src/render/classification.ts`, winding from `src/geo/winding.ts`, anchors from
`src/render/labelPlacement.ts`, the label engine from `src/render/labels.ts`,
glyph geometry from `src/render/glyphs.ts`, the legend container from
`src/render/legend.ts`, the scale bar from `src/render/scaleBar.ts`, and the join
model from `src/data/dataConverter.ts`. Ported as plain functions rather than
copied as classes; the Power BI host bindings and cross-filter logic are dropped.
