# Example files

A fictional country, **Terrafirma**: four Admin 1 regions on a 2×2 grid, each
split into two Admin 2 districts. Small enough to read by eye, complete enough
to exercise every layer.

| File | What it is |
| --- | --- |
| `terrafirma-admin1.geojson` | 4 Admin 1 polygons — `ADM1_PCODE`, `ADM1_EN` |
| `terrafirma-admin1.topojson` | the same layer as a TopoJSON topology |
| `terrafirma-admin2.geojson` | 8 Admin 2 polygons — `ADM2_PCODE`, `ADM2_EN`, `ADM1_PCODE` |
| `terrafirma-admin1.csv` | one row per region: population, incidents, severity, and three counts for glyphs |
| `terrafirma-admin2.csv` | one row per district: population, incidents, severity |

The outer rings are written counter-clockwise, as RFC 7946 specifies, so loading
them exercises the winding rewind — the toast after each upload reports how many
rings were flipped to d3-geo's clockwise-outer convention.

## Try it

1. Upload `terrafirma-admin1.geojson` as Admin 1 and `terrafirma-admin2.geojson`
   as Admin 2.
2. Upload `terrafirma-admin2.csv`. It should report *"All 8 rows matched the
   geometry."*
3. Bind *Bubble size* → `incidents` and switch on the bubble layer.
4. Swap to `terrafirma-admin1.csv`, bind *Glyph values* →
   `clinics, schools, water_points`, and switch on the Pie / Column overlay.
5. Set *Classification* to `Categorical` with *Choropleth value* → `severity`.

To test a name-based join, point *Map setup → Admin 1 link field* at `ADM1_EN`
and bind the join column to `region_name` instead of `adm1_pcode`.
