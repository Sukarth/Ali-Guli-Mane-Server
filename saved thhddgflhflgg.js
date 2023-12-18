
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
  var counterrrr = 1
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
    else if (pre_slot == parseInt(slott) && parseInt(slott) < slot_emptied) {
      
    }

    else {

      // console.log('ggggggggg')
      continue
    }

    counterrrr = counterrrr + 1
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