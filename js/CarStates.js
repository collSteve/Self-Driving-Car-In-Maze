/*
dataStructure:
data =
{
  previousState:
  nextState:
  vision:

}
*/


class CarState {
  stateName = "Abstract State";
  previousState = null;
  dataIn = null;

  gameObject = null;

  constructor(gameObject) {
    this.gameObject = gameObject;
  }

  async run() {
    // do sth
    console.log("Running "+ this.stateName);

    // output construct
    let dataOut = JSON.parse(JSON.stringify(this.dataIn)); // deep copy

    dataOut["previousState"] = this.stateName;
    dataOut["nextSate"] = "Abstract State"; // loop back: change later
    //return dataOut;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dataOut);
      }, 5000);
    });
  }

  setInput = function(dataIn) {
    this.dataIn = JSON.parse(JSON.stringify(dataIn)); // deep copy
    this.previousState = dataIn["previousState"];
  }
}
