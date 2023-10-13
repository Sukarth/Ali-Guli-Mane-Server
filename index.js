const http = require('http');
const sockets = require('socket.io')

const server = http.createServer();
const io = sockets(server, {
  cors: {
    origin: "https://v9djdb27-3000.euw.devtunnels.ms/",
    methods: ["GET", "POST"]
  }
});


const Statuses = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  DRAW: 'draw',
  WIN: 'win'
}

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

let gameState = {
  board: new Array(14).fill(null),
  currentPlayer: null,
  players: [],
  result: {
    status: Statuses.WAITING
  }
}

// let contt;

var rooms = {};
var roomCount = 0;

var thisGameId = (Math.random() * 100000) | 0;
var roomId;

var slotsValues = {
  "1": "5",
  "2": "5",
  "3": "5",
  "4": "5",
  "5": "5",
  "6": "5",
  "7": "5",
  "8": "5",
  "9": "5",
  "10": "5",
  "11": "5",
  "12": "5",
  "13": "5",
  "14": "5"
};

var FlippedSlotsValues = {}

function createRoom() {
  const room = {
    id: roomCount++,
    gameState: {
      board: new Array(14).fill(null),
      slotBoard: {
        "1": "5",
        "2": "5",
        "3": "5",
        "4": "5",
        "5": "5",
        "6": "5",
        "7": "5",
        "8": "5",
        "9": "5",
        "10": "5",
        "11": "5",
        "12": "5",
        "13": "5",
        "14": "5",
      },
      currentPlayer: null,
      players: [],
      flippedPlayer: null,
      result: {
        status: Statuses.WAITING
      }
    }
  };
  rooms[room.id] = room;
  // console.log(rooms)
  return room;
}


io.on('connection', function(connection) {




  connection.on('addPlayer', addPlayer(connection));
  connection.on('action', action(connection.id));
  connection.on('rematch', rematch(connection.id));
  // connection.on('disconnect', disconnect(connection.id));
  // connection.on('updateBoard', update(connection.id));
  // contt = connection

});


// function update(sockettt) {
//   return (data)=>{


//     console.log("---------------------------------------------------------------------")
//     console.log("---------------------------------------------------------------------")
//     console.log("---------------------------------------------------------------------")
//     console.log(sockettt)
//     console.log("--------------------------v-------------------------------------------")
//     roomid = getPlayerRoomId(sockettt)
//     console.log(rooms[roomid].gameState.board)
//     console.log("------------------------------d---------------------------------------")
//     console.log(data.board)
//     console.log("-----------------------e----------------------------------------------")
//     rooms[roomid].gameState.board = data.board
//     console.log(rooms[roomid].gameState.board)
//     console.log("-------------------------------w--------------------------------------")
//     let playerNum = getPlayer(sockettt)
//     console.log(playerNum)
//     console.log("--------------------------y-------------------------------------------")
//     rooms[roomid].gameState.players[playerNum].numberOfGems = rooms[roomid].gameState.players[playerNum].numberOfGems + data.gemsEarned
//   }
// }


function addPlayer(sockett) {
  return (data) => {
    // const numberOfPlayers = gameState.players.length;
    //  if (numberOfPlayers >= 2){
    //  return;
    //}



    let room = null;

    for (const roomId in rooms) {
      if (rooms[roomId].gameState.players.length <= 2) {
        room = rooms[roomId];
        break;
      }
    }

    if (!room) {
      room = createRoom();
      // console.log('hi')
    }

    console.log('=====================================================================')
    console.log('rooms:')
    console.log('=====================================================================')
    // console.dir(rooms, { depth: null });
    console.log(rooms)
    // console.log('=====================================================================')
    let nextSymbol = 'X';


    const newPlayer = {
      playerName: data.playerName,
      id: sockett.id,
      symbol: nextSymbol,
      numberOfGems: 0
    };

    // for (const roomId in rooms) {
    //   if (roomId !== contt.id && rooms[roomId].includes(socketId)) {
    //     gameState.players = gameState.players.filter(player => !rooms[roomId].includes(player.id));
    //   }
    // }



    // Clear names of players in other rooms
    // for (const roomId in rooms) {
    //   if (roomId !== contt.id) {
    //     gameState.players = gameState.players.filter(player => !rooms[roomId].includes(player.id));
    //   }
    // }



    // console.log(gameState.players)
    // console.log('=====================++++++++++++++++===============================')
    room.gameState.players.push(newPlayer);
    // console.log(gameState.players.id)
    console.log('=====================================================================')
    console.log('number of players in current room:')
    console.log('=====================================================================')
    console.log(room.gameState.players.length)
    if (room.gameState.players.length === 2) {
      room.gameState.result.status = Statuses.PLAYING;
      room.gameState.currentPlayer = newPlayer;
      room.gameState.flippedPlayer = newPlayer;
    }
    console.log('=====================================================================')
    console.log('Rooms and gameState:')
    console.log('=====================================================================')
    // console.log(room.gameState)
    // console.log('=====================================================================')
    console.dir(rooms, { depth: null });
    // console.log('=====================================================================')
    // console.log(rooms)
    sockett.join(room.id);
    io.to(room.id).emit('gameState', room.gameState);
  }
}

// Helper function to get the room ID of a player
function getPlayerRoomId(socketId) {
  for (const roomId in rooms) {
    // console.log(roomId)
    // console.log(rooms[roomId].gameState.players)
    for (const player in rooms[roomId].gameState.players) {
      // console.log("---------------------------------------------------------------------")
      // console.log(player)
      // console.log("---------------------------------------------------------------------")
      if (rooms[roomId].gameState.players[player].id == socketId) {
        return roomId
      }
    }

  }
  return null; // Return null if player is not in any room
}


function getPlayer(socketId) {
  roomid = getPlayerRoomId(socketId)
  for (const player in rooms[roomid].gameState.players) {
    if (rooms[roomid].gameState.players[player].id == socketId) {
      return player
    }
  }
}








function calculateBoard(slot, value) {
  // var NewSlotsValues = slotsValues
  // var NextSlot = key + NewSlotsValues[key] + 1
  // while (NextSlot>14){
  //   Nextslot = Nextslot-14
  // }

  // gems_earned = NewSlotsValues[NextSlot]
  // NewSlotsValues[key] = 0
  // while (gems_earned != 0) {

  // }

  var new_slots_values = {
    "1": "5",
    "2": "5",
    "3": "5",
    "4": "5",
    "5": "5",
    "6": "5",
    "7": "5",
    "8": "5",
    "9": "5",
    "10": "5",
    "11": "5",
    "12": "5",
    "13": "5",
    "14": "5"
  };

  // console.log('hi')

  new_slots_values[slot] = "0";
  console.log(slot)
  var pre_slot = Number(slot)
  // console.log(pre_slot)
  var slot_emptied = Number(slot) + Number(value) + 1
  // console.log(slot_emptied)
  for (const [slott, valued] of Object.entries(new_slots_values)) {

    if (pre_slot < parseInt(slott) && parseInt(slott) < slot_emptied) {
      // console.log('dddddddddddddddddddddddddddddddddddddd')
      // console.log(slott)
      // console.log(valued)
      var thtg = parseInt(valued) + 1
      new_slots_values[slott] = thtg.toString()
    }

    else {

      // console.log('ggggggggg')
      continue
    }
  }
  // console.log('bi')
  if (slot_emptied > 14) {
    slot_emptied = slot_emptied - 14
  }
  // console.log('ai')
  // slot_emptied = slot_emptied.toString()
  var gems_earned = parseInt(slotsValues[slot_emptied.toString()])
  // var slot_emptiedd = slot_emptied.toString()

  new_slots_values[slot_emptied.toString()] = "0"

  // console.log('ti')
  while (gems_earned != 0) {
    pre_slot = slot_emptied
    slot_emptied = slot_emptied + gems_earned + 1

    // console.log('fi')
    for (const [slobt, valuet] of Object.entries(new_slots_values)) {
      // console.log('aaaa')
      if (pre_slot < parseInt(slobt) && parseInt(slobt) < slot_emptied) {
        var thttg = parseInt(valuet) + 1
        // console.log(thttg)
        // console.log(slobt)
        // console.log(valuet)
        // console.log(new_slots_values[slot])
        // console.log(new_slots_values.slot)
        // console.log("--------------")
        new_slots_values[slobt] = thttg.toString()
        // console.log(new_slots_values[slobt])
      }

    }

    while (slot_emptied > 14) {
      slot_emptied = slot_emptied - 14
      // console.log('TTTTTi')
    }

    // console.log('DDDi')
    // slot_emptied = slot_emptied.toString()
    gems_earned = parseInt(new_slots_values[slot_emptied.toString()])
    // above line???????????????????????????????????????????????????????????
    // slot_emptied = slot_emptied.toString()
    new_slots_values[slot_emptied.toString()] = "0"

  }

  if (gems_earned == 0) {

    var slot_taken = slot_emptied + 1
    if (slot_taken > 14) {
      slot_taken = slot_taken - 14
    }
    // slot_taken = slot_taken.toString()
    gems_earned = new_slots_values[slot_taken.toString()]
    new_slots_values[slot_taken.toString()] = "0"
    return [new_slots_values, gems_earned]

  }

}

function updateBoard(slots, gemsEarned, room) {
  room.gameState.slotBoard = slots;
  let playerNum = getPlayer(room.gameState.currentPlayer.id)
  room.gameState.players[playerNum].numberOfGems = Number(room.gameState.players[playerNum].numberOfGems) + Number(gemsEarned)
}


function action(socketId) {
  return (data) => {
    // console.log(socketId)
    const room = rooms[getPlayerRoomId(socketId)];

    // if (room.gameState.flippedPlayer == socketId) {
    //   data.gridIndex=Number(data.gridIndex)+7
    // }
    // console.log(room)
    // console.log(rooms)
    if (room.gameState.result.status == Statuses.PLAYING && room.gameState.currentPlayer.id == socketId) {
      const player = room.gameState.players.find(p => p.id == socketId);
      console.log(player)
      // if (player == room.gameState.flippedPlayer) {
      //   var fshkjdfh = data.gridIndex[1]
      // }
      // if (player != room.gameState.flippedPlayer) {
      //   var fshkjdfh = data.gridIndex[0]
      // }
      if (room.gameState.board[data.gridIndex] == null) {
        room.gameState.board[ data.gridIndex] = player;
        console.log(room.gameState.board);
        for (const key in room.gameState.board) {
          if (room.gameState.board[key] == player) {
            console.log('=====================================================================')
            console.log('=====================================================================')
            let [slts, gemsE] = calculateBoard(Number(key) + 1, "5")

            updateBoard(slts, gemsE, room)
          }
          console.log('=============dasssssssss========================================================')
          console.log('===============adsasdasdasd======================================================')
        }
        room.gameState.currentPlayer = room.gameState.players.find(p => p !== player);

        // // // // // / ////// / / / / / /// checkForEndOfGame(room);
      }

      console.log('=====================================================================')
      console.log('current room:')
      console.log('=====================================================================')
      console.dir(room, { depth: null });
      console.log("---------------------------------------------------------------------")

    }

    // io.to(roomId).emit('gameState', gameState);
    // gameState.board[data.gridIndex] == null
    // io.to(roomId).emit('gameState', gameState);
    console.log('=====================================================================')
    console.dir(rooms, { depth: null });
    console.log('=====================================================================')
    checkForEndOfGame(room);
    // io.to(socketId).emit(/* ... */);
    io.to(room.id).emit('gameState', room.gameState);
  }
}


function rematch(socketId) {
  return (data) => {
    if (gameState.players.findIndex(p => p.id === socketId) < 0) return; // Don't let spectators rematch
    if (gameState.result.status === Statuses.WIN || gameState.result.status === Statuses.DRAW) {
      resetGame();
      io.emit('gameState', gameState);
    }
  }
}


function resetGame() {
  gameState.board = new Array(14).fill(null);

  if (gameState.players.length === 2) {
    gameState.result.status = Statuses.PLAYING;
    const randPlayer = Math.floor(Math.random() * gameState.players.length);
    gameState.currentPlayer = gameState.players[randPlayer];
  } else {
    gameState.result.status = Statuses.WAITING;
    gameState.currentPlayer = null;
  }
}


function disconnect(socketId) {
  return
  ///////////////////////////////////////////TODO
  // return (reason) => {
  //   console.log('=====================================================================')
  //   console.log('Disconnected. Socket Id, gameState:')
  //   console.log('=====================================================================')
  //   console.log(socketId)
  //   console.dir(room.gameState, { depth: null });
  //   room.gameState.players = room.gameState.players.filter(p => p.id != socketId);
  //   if (gameState.players !== 2){
  //     gameState.players = null
  //     resetGame();
  //     io.emit('gameState', gameState);
  //   }
  // }
}


function checkForEndOfGame(room) {

  if (Object.values(room.gameState.slotBoard).every(value => value === "0")) {
    if (room.gameState.players[0].numberOfGems > room.gameState.players[1].numberOfGems) {
      room.gameState.result.status = Statuses.WIN;
      room.gameState.result.winner = room.gameState.players[0];
    }
    else if (room.gameState.players[0].numberOfGems < room.gameState.players[1].numberOfGems) {
      room.gameState.result.status = Statuses.WIN;
      room.gameState.result.winner = room.gameState.players[1];
    }
    else if (room.gameState.players[0].numberOfGems == room.gameState.players[1].numberOfGems) {
      room.gameState.result.status = Statuses.DRAW;
    }
  }

}

server.listen(3000, function() {
  console.log('listening on 3000');
});