import { Machine, assign } from 'xstate';

/* owner -> playerId, side -> home/away, how to calculate for 10 cups/team games */
export function createInitialCups(owner, side) {
  return [
    {
      side: side,
      name: `${side}x6-y2`,
      x: '6',
      y: '2',
      owner: `${owner}`,
      hit: null,
    },
    {
      side: side,
      name: `${side}x4-y6`,
      x: '4',
      y: '6',
      owner: `${owner}`,
      hit: null,
    },
    {
      side: side,
      name: `${side}x8-y6`,
      x: '8',
      y: '6',
      owner: `${owner}`,
      hit: null,
    },
    {
      side: side,
      name: `${side}x2-y10`,
      x: '2',
      y: '10',
      owner: `${owner}`,
      hit: null,
    },
    {
      side: side,
      name: `${side}x6-y10`,
      x: '6',
      y: '10',
      owner: `${owner}`,
      hit: null,
    },
    {
      side: side,
      name: `${side}x10-y10`,
      x: '10',
      y: '10',
      owner: `${owner}`,
      hit: null,
    },
  ];
}
// hitcup = null || {timestamp: 'datetime', type: 'sink' || 'catch' || 'spill' || 'other'}

export const createTableMachine = (homeCups, awayCups, firstThrow) => {
  return Machine(
    {
      id: 'pong',
      initial: 'playing',
      context: {
        homeCups,
        preRackHomeCups: null, //store prerack incase we click cancel
        awayCups,
        preRackAwayCups: null,
        firstThrow,
        homeCupsLeft: 6,
        homeCupRerackComplete: false,
        homeCupRimCount: 0,
        awayCupsLeft: 6,
        awayCupRerackComplete: false,
        awayCupRimCount: 0,
        winner: undefined,
        turns: 0,
        selectedCup: null,
        isHovering: false,
        lastHover: { x: null, y: null },
        cupNewPos: { x: null, y: null },
        // how easy to store history for undo buttons?
        stack: [],
      },
      states: {
        playing: {
          /* always: [{ cond: 'checkWin', target: 'finish' }], */
          on: {
            PICKCUP: { actions: 'selectCup', target: 'modal' },
            FORFEIT_HOME: { actions: 'commitSudoku', target: 'finish' },
            FORFEIT_AWAY: { actions: 'commitSudoku', target: 'finish' },
            RERACK: {
              actions: ['storeHomeCups', 'storeAwayCups'],
              target: 'rerack',
            },
          },
        },
        modal: {
          on: {
            SINK: {
              actions: 'updateCups',
              target: 'playing',
            },
            CATCH: {
              actions: 'updateCups',
              target: 'playing',
              cond: 'checkLastCup',
            },
            SPILL: {
              actions: 'updateCups',
              target: 'playing',
            },
            OTHER: {
              actions: 'updateCups',
              target: 'playing',
            },
            RIM: {
              actions: 'rimCup',
              target: 'playing',
            },
            CANCEL: { actions: 'clearSelected', target: 'playing' },
          },
        },
        rerack: {
          on: {
            CANCEL: {
              actions: ['restoreCups', 'clearPreRack', 'clearSelected'],
              target: 'playing',
            },
            SAVE: { actions: 'saveCups', target: 'playing' },
          },
          initial: 'idle',
          states: {
            idle: {
              on: {
                PICKCUP: {
                  target: 'moving',
                  actions: 'selectCup',
                },
              },
            },
            moving: {
              on: {
                MOUSEMOVE: {
                  //target: "hovering",
                  actions: assign({
                    isHovering: true,
                    lastHover: (ctx, evt) => {
                      return { x: evt.position.x, y: evt.position.y };
                    },
                  }),
                },
                NEWPOS: {
                  actions: assign({
                    cupsNewPos: (ctx, evt) => {
                      /*     console.log(
                        "newNewPos: ",
                        evt.position.x,
                        evt.position.y
                      ); */
                      return { x: evt.position.x, y: evt.position.y };
                    },
                    // awayCups: //
                    homeCups: (ctx, evt) => {
                      /* we are clicking the  svg not the cup, 
                      
                      there for get attribte for name is not getting the cup
                      we should use the context for selected cup
                      */
                      if (ctx.selectedCup.side === 'home') {
                        //get this cup
                        const cupName = ctx.selectedCup.name;

                        const restOfCups = ctx.homeCups.filter(
                          (cup) => cup.name !== cupName
                        );
                        const newPosition = {
                          ...ctx.selectedCup,
                          x: evt.position.x + 2,
                          y: evt.position.y + 2,
                        };
                        // calculate new position using evt.position.x/y
                        return [...restOfCups, newPosition]; // ctx.homeCups
                      } else {
                        return ctx.homeCups;
                      }
                    },
                    awayCups: (ctx, evt) => {
                      if (ctx.selectedCup.side === 'away') {
                        const cupName = ctx.selectedCup.name;
                        const restOfCups = ctx.awayCups.filter(
                          (cup) => cup.name !== cupName
                        );
                        const newPosition = {
                          ...ctx.selectedCup,
                          x: evt.position.x + 2,
                          y: evt.position.y + 2,
                        };
                        // calculate new position using evt.position.x/y
                        return [...restOfCups, newPosition];
                      } else {
                        return ctx.awayCups;
                      }
                    },
                    selectedCup: () => null,
                    lastHover: () => ({ x: null, y: null }),
                  }),
                  target: 'idle',
                },
                EXIT: {
                  actions: assign({
                    isHovering: () => false,
                    lastHover: () => ({ x: null, y: null }),
                  }),
                },
              },
            },
          },
        },
        finish: {
          type: 'final',
        },
      },
    },
    {
      actions: {
        selectCup: assign({
          selectedCup: (ctx, evt) => {
            const cupName = evt.details.target.getAttribute('data-name');
            const selCup = [...ctx.homeCups, ...ctx.awayCups].filter(
              (cup) => cup.name === cupName
            );
            return selCup[0];
          },
        }),
        updateCups: assign({
          homeCups: handleHomeCups,
          homeCupsLeft: handleHomeCupsLeft,
          awayCups: handleAwayCups,
          awayCupsLeft: handleAwayCupsLeft,
          selectedCup: null,
        }),
        rimCup: assign({
          homeCups: handleHomeCups,
          homeCupRimCount: (ctx, evt) =>
            ctx.selectedCup.side === 'home'
              ? ctx.homeCupRimCount + 1
              : ctx.homeCupRimCount,
          awayCups: handleAwayCups,
          awayCupRimCount: (ctx, evt) =>
            ctx.selectedCup.side === 'away'
              ? ctx.awayCupRimCount + 1
              : ctx.awayCupRimCount,
          selectedCup: null,
        }),
        clearSelected: assign({ selectedCup: null }),
        commitSudoku: assign({
          homeCups: handleHomeCupsForfeit,
          homeCupsLeft: handleHomeCupsLeftForfeit,
          awayCups: handleAwayCupsForfeit,
          awayCupsLeft: handleAwayCupsLeftForfeit,
          selectedCup: null,
        }),

        storeHomeCups: assign({
          preRackHomeCups: (ctx, evt) => {
            return ctx.homeCups;
          },
        }),
        storeAwayCups: assign({
          preRackAwayCups: (ctx, evt) => {
            return ctx.awayCups;
          },
        }),
        restoreCups: assign({
          homeCups: (ctx) => ctx.preRackHomeCups,
          awayCups: (ctx) => ctx.preRackAwayCups,
        }),
        clearPreRack: assign({
          preRackHomeCups: () => null,
          preRackAwayCups: () => null,
        }),
        saveCups: assign({
          // if anything has moved then we want to set rerack to true
          // how to tell what side we are?
          preRackHomeCups: () => null,
          homeCupRerackComplete: (ctx) => {
            return ctx.homeCups === ctx.preRackHomeCups ? false : true;
          },
          preRackAwayCups: () => null,
          awayCupRerackComplete: (ctx) => {
            return ctx.awayCups === ctx.preRackAwayCups ? false : true;
          },
        }),
      },
      guards: {
        checkWin,
        checkLastCup,
        isHovering,
        hoverMoved,
        homeReracked,
        awayReracked,
      },
    }
  );
};

/* instead of doing all actions 
i should use a cond and only run the right action? */

// actions

const handleHomeCups = (ctx, evt) => {
  if (ctx.selectedCup.side === 'home') {
    const time = new Date().toISOString();
    const newHome = ctx.homeCups.filter(
      (cup) => cup.name !== ctx.selectedCup.name
    );
    if (evt.type === 'RIM') {
      let rimCup;
      if (ctx.selectedCup?.rim != null) {
        rimCup = {
          ...ctx.selectedCup,
          rim: [...ctx.selectedCup?.rim, { timestamp: time, type: evt.type }],
        };
      } else {
        rimCup = {
          ...ctx.selectedCup,
          rim: [{ timestamp: time, type: evt.type }],
        };
      }
      return [...newHome, rimCup];
    } else {
      const hitCup = {
        ...ctx.selectedCup,
        hit: { timestamp: time, type: evt.type },
      };
      return [...newHome, hitCup];
    }
  } else {
    return ctx.homeCups;
  }
};

const handleHomeCupsLeft = (ctx, evt) => {
  if (ctx.selectedCup.side === 'home') {
    return ctx.homeCupsLeft - 1;
  } else {
    return ctx.homeCupsLeft;
  }
};

const handleHomeCupsForfeit = (ctx, evt) => {
  if (evt.type === 'FORFEIT_HOME') {
    const time = new Date().toISOString();
    /* change every cup that isnt hit to hit it now */
    const alreadyHit = ctx.homeCups.filter((cup) => cup.hit !== null);
    const hit = { hit: { timestamp: time, type: 'FORFEIT' } };
    const forfeitCups = ctx.homeCups
      .filter((cup) => cup.hit === null)
      .map((cup) => ({ ...cup, ...hit }));
    return [...alreadyHit, ...forfeitCups];
  } else {
    return ctx.homeCups;
  }
};

const handleHomeCupsLeftForfeit = (ctx, evt) => {
  if (evt.type === 'FORFEIT_HOME') {
    return 0;
  } else {
    return ctx.homeCupsLeft;
  }
};

const handleAwayCups = (ctx, evt) => {
  if (ctx.selectedCup.side === 'away') {
    const time = new Date().toISOString();
    const newAway = ctx.awayCups.filter(
      (cup) => cup.name !== ctx.selectedCup.name
    );
    if (evt.type === 'RIM') {
      let rimCup;
      if (ctx.selectedCup?.rim != null) {
        rimCup = {
          ...ctx.selectedCup,
          rim: [...ctx.selectedCup?.rim, { timestamp: time, type: evt.type }],
        };
        //...ctx.selectedCup.rim,
      } else {
        rimCup = {
          ...ctx.selectedCup,
          rim: [{ timestamp: time, type: evt.type }],
        };
      }
      return [...newAway, rimCup];
    } else {
      const hitCup = {
        ...ctx.selectedCup,
        hit: { timestamp: time, type: evt.type },
      };
      return [...newAway, hitCup];
    }
  } else {
    return ctx.awayCups;
  }
};

const handleAwayCupsLeft = (ctx, evt) => {
  if (ctx.selectedCup.side === 'away') {
    return ctx.awayCupsLeft - 1;
  } else {
    return ctx.awayCupsLeft;
  }
};

const handleAwayCupsForfeit = (ctx, evt) => {
  if (evt.type === 'FORFEIT_AWAY') {
    const time = new Date().toISOString();
    /* change every cup that isnt hit to hit it now */
    const alreadyHit = ctx.awayCups.filter((cup) => cup.hit !== null);
    const hit = { hit: { timestamp: time, type: 'FORFEIT' } };
    const forfeitCups = ctx.awayCups
      .filter((cup) => cup.hit === null)
      .map((cup) => ({ ...cup, ...hit }));
    return [...alreadyHit, ...forfeitCups];
  } else {
    return ctx.awayCups;
  }
};

const handleAwayCupsLeftForfeit = (ctx, evt) => {
  if (evt.type === 'FORFEIT_AWAY') {
    return 0;
  } else {
    return ctx.awayCupsLeft;
  }
};

// guards

const checkLastCup = (context, event) => {
  // cannot catch to knock last cup noCatchGuard
  if (context.selectedCup.side === 'home') {
    // console.log(context.homeCupsLeft);
    return context.homeCupsLeft > 1;
  } else {
    return context.awayCupsLeft > 1;
  }
};

const checkWin = (context, event) => {
  if (context.homeCupsLeft === 0 || context.awayCupsLeft === 0) {
    return false;
  }
  return true;
};

const isHovering = (ctx) => ctx.isHovering;

const hoverMoved = (ctx, evt) => {
  //console.log('hoverGuard', evt)
  //last hover
  const centreAdjustment = 1.5;
  const clampedX = floorBound(evt.position.x - centreAdjustment, 0, 8);
  const clampedY = floorBound(evt.position.y - centreAdjustment, 0, 8);
  if (clampedX !== ctx.lastHover.x || clampedY !== ctx.lastHover.y) {
    return true;
  }
  return false;
};

const homeReracked = (ctx) => ctx.homeCupRerackComplete;
const awayReracked = (ctx) => ctx.awayCupRerackComplete;

/* helpers*/
function floorBound(num, lower, upper) {
  /* get lower/upper from ctx? */
  if (num > upper) {
    return upper;
  }
  if (num < lower) {
    return lower;
  }
  return Math.floor(num);
}

/* check if tournament game, if so then do not allow draw */

/* 
undo function
https://dev.to/robertbroersma/undo-redo-in-react-using-xstate-23j8 
https://codesandbox.io/s/xstate-react-back-example-4q2vh
*/

/* 
on click assign context the current

when clicked look at context for current and update context to be hit
*/
