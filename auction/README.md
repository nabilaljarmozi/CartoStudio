# World Cup 2026 Auction ⚽ · مزاد كأس العالم 2026

A two-player football auction game that runs in the browser. Both managers start
with **$100M**, the computer puts World Cup 2026 stars up for sale one at a time,
and you bid against a countdown clock until every position in your squad is filled.

Bilingual: English and Arabic (RTL), switchable at any time from the top-right button.

## Open it

Double-click `index.html`, or serve the folder:

```
python3 -m http.server 8000     # then open http://localhost:8000/auction/
```

No build step, no dependencies, no server, nothing stored anywhere.

## Two players, one code

Every game gets a code such as `WC26-7QK4`. Pick how you want to play:

| Mode | What it does |
| --- | --- |
| **One screen (hot seat)** | Both managers on the same device. Each has their own bid panel and their own keyboard shortcuts. Works on a phone. |
| **Two windows — create code** | You are Manager 1. The game waits, showing the code; the auction starts the moment Manager 2 joins. |
| **Two windows — join with code** | You are Manager 2. Type the code your rival created. |

Two-window play uses `BroadcastChannel`, so both windows must be **the same browser
on the same computer** (two tabs, or two windows side by side). There is no server,
so it does not sync across the internet. Serving the folder over `http://` is the
reliable way to run it — opening the file directly works in Chrome but some browsers
isolate `file://` pages from each other.

The code also seeds the shuffle: the same code always auctions players in the same
order, so you can replay an identical auction.

## Rules

- Each manager starts with the same budget (default **$100M**, adjustable at setup).
- One player is auctioned at a time. The lot ends when the clock hits zero; **every
  bid puts time back on the clock** (default 10s).
- You can only bid on a position you still have an open slot for. Default squad is
  1 goalkeeper, 2 defenders, 2 midfielders, 1 forward — 8-player and full-XI shapes
  are also available.
- You must keep **$1M in reserve for every slot you still have to fill**, so nobody
  can spend themselves into an incomplete squad.
- **Pass** drops you out of the current lot. When neither manager can bid any more,
  the lot resolves immediately instead of running the clock down.
- Base price comes from the player's rating, so Mbappé opens far higher than a
  squad-filler goalkeeper.

## Photos

Player portraits are looked up from Wikipedia **by your browser, while you play** —
five requests for the whole pool, cached in `localStorage` so later games are
instant. Roughly 170 of the 182 players have one.

Nothing is bundled with the game and nothing is stored on a server. If you are
offline, the request is blocked, or a player simply has no picture in their article,
that player falls back to a generated badge — initials on a colour derived from their
country, ringed in their position colour. The game never waits on the network.

The **📷 button** in the top bar turns photos off entirely; the setting sticks.

When an article title differs from the player's name — ambiguous ones like *Gavi*
or *Ederson* — `players.js` carries a fifth field with the exact title to look up.

## Formation

Each squad is drawn on a pitch rather than listed: forwards along the top, the
keeper at the back, one slot per position the formation asks for. Filled slots show
the portrait, rating, name and fee; empty slots stay as dashed outlines, so what you
still have to buy is obvious at a glance. The same pitch appears full-size on the
results screen for both managers.

## Scoring

```
score = sum of squad ratings + chemistry
chemistry = +3 for every extra player from the same country
```

Highest score wins. A tie goes to the manager with more money left over. The results
screen shows both squads side by side with what each player cost, and **Copy result**
puts the whole thing on your clipboard as text.

## Keyboard (hot seat)

| | Bid | Bid +5 | Bid +10 | Pass |
| --- | --- | --- | --- | --- |
| Manager 1 | `Q` | `W` | `E` | `R` |
| Manager 2 | `I` | `O` | `P` | `[` |

## The player pool

`players.js` holds a curated pool of ~180 well-known players from nations at the
2026 World Cup, with country, position and an overall rating. **The ratings are
gameplay values, not official statistics**, and the pool is a selection rather than
any official squad list.

Editing it is the point — it is a plain array, one line per player:

```js
['Kylian Mbappé', 'FRA', 'FWD', 93],
['Gavi', 'ESP', 'MID', 85, 'Gavi (footballer)'],
```

`[name, nation code, position, rating]`, plus an optional Wikipedia article title
when it differs from the name. Positions are `GK`, `DEF`, `MID`, `FWD`. Add a nation
to the `NATIONS` map at the top of the file (flag emoji + English and Arabic names)
and it shows up everywhere automatically. Base prices are derived from the rating,
so a new player needs no price of its own.

## Files

```
index.html   markup and screens
styles.css   theme, layout, responsive rules
players.js   nations + player pool (edit this)
app.js       game state, auction clock, scoring, two-window sync, translations
```
