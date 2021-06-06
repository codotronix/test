import {
    FLOW_ST_WIDTH,
    FLOW_ST_HEIGHT,
    FLOW_WIRE_SHIFT_X,
    FLOW_WIRE_SHIFT_FROM_Y,
    FLOW_WIRE_SHIFT_TO_Y,
    FLOW_H_GAP,
    FLOW_V_GAP,
    FLOW_H_SHIFT,
    FLOW_V_SHIFT
} from '../../../utils/constants'

export {
    createFlowboard, 
    getTransformStyle,
    createFlowConnectors
}

function createFlowboard (storylets, choices) {
    let levelsSTMap = createLevelSTMap(storylets, choices)
    let stxy = setStoryletXY(levelsSTMap, true)

    return stxy
}   

/**
 * Create a Level Map, to help paint Storylet Boxes on screen
 * {
 *      1: [stID1, stID9],
 *      2: [stID3, stID5, stID7, stID11]
 *      3: [stID23, stID77, stID89, stID99, stID100]
 * }
 */
function createLevelSTMap (storylets, choices) {
    let levelsSTMap = {}

    // get the Entry Storylets
    // This entry-storylets each will start a new tree
    // and then following next of each one we can draw their trees
    let allStIDs = Object.keys(storylets)
    let entryStIDs = getEntryStIDs(allStIDs, choices)

    // Let's declare a helper function to put Storylets into Levels, recurssively
    const putStIntoLevels = (st, level) => {
        levelsSTMap[level] = levelsSTMap[level] || []
        levelsSTMap[level].push(st.id)

        for (let cid of st.choices) {
            let c = choices[cid]
            putStIntoLevels(storylets[c.next], level + 1)
        }
    }

    // Now go thru each entry points and seek out their tree
    // and put them in levelMaps
    for (let id of entryStIDs) {
        //Increase level by 1
        let currentLevel = Object.keys(levelsSTMap).length + 1

        putStIntoLevels(storylets[id], currentLevel)
    }

    // Now there can be cases where 2 different levels are containing same IDs
    // In these case we will keep them only in the highest level
    let alreadyFoundStIDs = []
    let levelsDecending = Object.keys(levelsSTMap).sort().reverse()

    for (let l of levelsDecending) {
        //cleanup duplicate in each level
        levelsSTMap[l] = Array.from(new Set(levelsSTMap[l]))

        // go thru each stIDs of this level
        // if it was already found in higher levels, delete it from this level
        // else mark it as found
        for (let stID of levelsSTMap[l]) {
            if (alreadyFoundStIDs.indexOf(stID) > -1) {
                levelsSTMap[l].splice(levelsSTMap[l].indexOf(stID), 1)
            }
            else {
                alreadyFoundStIDs.push(stID)
            }
        }
    }

    return levelsSTMap
}

// Storylets are Not pointed by any choice
// returns array of STIDs
function getEntryStIDs(allStIDs, choices) {
    let entryStIDs = [...allStIDs]
    // now loop thru all the choices
    // remove the choice.next IDs from allStIDs
    // the rests are EntrySTID
    for (let i in choices) {
        let idx = entryStIDs.indexOf(choices[i].next)
        if (idx > -1) {
            entryStIDs.splice(idx, 1)
        }
    }

    return entryStIDs
}

/*
* Set X, Y for the storylets VERSION 2
* This v2 function will try position them better
* with proper middle alignments for the row which have lesser number of rectangles
*/
function setStoryletXY (levelsSTMap, isAutoFormatting) {
    //go level by level
    let level = 0
    const stWidth = FLOW_ST_WIDTH
    const stHeight = FLOW_ST_HEIGHT
    const horizontalGap = FLOW_H_GAP
    const verticalGap = FLOW_V_GAP
    const verticalShift = FLOW_V_SHIFT
    const horizontalShift = FLOW_H_SHIFT
    const stxy = {}              // { id1: {x1,y1}, id2: {x2,y2} }

    let maxRecInALevel = Object.values(levelsSTMap).reduce(
        (maxLength, l) => maxLength > l.length ? maxLength : l.length
    , 0)

    //first we need to find the longest possible row
    // for (let i in levelsSTMap) {
    //     maxRecInALevel = (levelsSTMap[i].length > maxRecInALevel) ? levelsSTMap[i].length : maxRecInALevel
    // }

    const longestRowWidth = (maxRecInALevel * stWidth) + (horizontalGap * (maxRecInALevel - 1));

    while (true) {
        ++level
        //since there cannot be a jump in level
        //if any number is missing, that means there are
        //no more higher levels
        if (!levelsSTMap[level]) {
            break;
        }

        let recsInThisLevel = levelsSTMap[level].length;

        // if less than max, then 
        // 1st rec of that row (or level) will have a spacing at its left
        // And last rec will have a spacing at its right
        // so total spacing will be recsInThisLevel+1
        if (recsInThisLevel < maxRecInALevel) {
            let hGap = (longestRowWidth - (recsInThisLevel * stWidth)) / (recsInThisLevel + 1);
            for (let i = 0; i < levelsSTMap[level].length; i++) {
                let stID = levelsSTMap[level][i]
                stxy[stID] = { id: stID }

                // if autoformatting, then override the x, y values set by user dragging
                if (!isAutoFormatting && stxy[stID].x && stxy[stID].y) { continue; }
                stxy[stID].x = (i * stWidth) + ((i + 1) * hGap) + horizontalShift
                stxy[stID].y = (level - 1) * (stHeight + verticalGap) + verticalShift
                //setTransformStyle(stID)
            }
        }
        // else for the longest row, there will be no gap with on left of 1st or right of last
        else {
            for (let i = 0; i < levelsSTMap[level].length; i++) {
                let stID = levelsSTMap[level][i]
                stxy[stID] = { id: stID }

                if (!isAutoFormatting && stxy[stID].x && stxy[stID].y) { continue; }
                stxy[stID].x = (i * stWidth) + (i * horizontalGap) + horizontalShift;
                stxy[stID].y = (level - 1) * (stHeight + verticalGap) + verticalShift;
                //setTransformStyle(stID);
            }
        }
    }

    setTransformStyle(stxy)

    //this.flowboard = objToArray(this.stObj);
    // console.log("this.storylets = ");
    // console.log(this.storylets);
    
    //this.recreateConnectorsObj();
    return stxy
}

// provided it has x,y
// this function sets the transformStyle
function setTransformStyle(stxy) {
    for (let i in stxy) {
        stxy[i].transformStyle =  getTransformStyle(stxy[i])
    }
}

// fbi = Flowboard Item
function getTransformStyle (fbi) {
    return { transform: "matrix(1, 0, 0, 1, " + fbi.x + ", " + fbi.y + ")" }
}

/**
 * 
 * @param {*} storylets 
 * @param {*} choices 
 * @param {*} fb => flowboard, a json onject containing stID, x,y, transformStyle
 */
function createFlowConnectors (storylets, choices, fb) {
    const connectorsObj = {}
    const wireShiftFTX = FLOW_WIRE_SHIFT_X
	const wireShiftFY = FLOW_WIRE_SHIFT_FROM_Y
    const wireShiftTY = FLOW_WIRE_SHIFT_TO_Y

    for(let i in storylets) {
        let st = storylets[i]
        for(let cID of st.choices) {
            let ch = choices[cID]

            let fromX = fb[st.id].x + wireShiftFTX
            let fromY = fb[st.id].y + wireShiftFY
            let toX = fb[ch.next].x + wireShiftFTX
            let toY = fb[ch.next].y + wireShiftTY

            let ftid = st.id + '---' + ch.next

            connectorsObj[ftid] = {
                id: ftid,
                cid: cID,
                x1: fromX,
                y1: fromY,
                x2: toX,
                y2: toY
            }
        }
    }

    return connectorsObj
}