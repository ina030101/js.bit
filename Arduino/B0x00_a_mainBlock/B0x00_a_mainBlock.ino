/*------------------------------------------------*/
/*                                                */
/*    Master Block.                               */
/*    Jose Maria Campa√±a Rojas                    */
/*                                                */
/*------------------------------------------------*/

#include <Wire.h>

//-------------------------------------------------
//              COMUNICATION PROTOCOL
//-------------------------------------------------
int baketsuRelayDelay = 900; //microseconds

//-------------------------------------------------
//              SERIAL COMUNICATION
//-------------------------------------------------
int conectionSpeed = 9600;
int serialBufferSize;
char serialBuffer[16];

//-------------------------------------------------
//                    BLOCKS
//-------------------------------------------------
int maxBlocks = 16;
int variableBlocks [3] = {0,0,0};
int order[16] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
int tempLastOrderAddr;

//-------------------------------------------------
//                    I/O PINS
//-------------------------------------------------
int seekPin = 7;

void setup() {

  Serial.begin(9600);
  Wire.begin();

  pinMode(seekPin, OUTPUT);
  digitalWrite(seekPin, LOW); 
  
  getOrder();
}

void loop() {

  if (Serial.available() > 0) {
    int command = Serial.read();

    if (command == '0' || command == 0) {
      getOrder();
    }

  }  
  
  //getOrder();
  //delay(200);  
}

void getOrder() {

  boolean stoploop = false;
  for (int i = 0; i < maxBlocks; i++) {
    order[i] = 0;
    transmit((byte) i, (byte) 2, true);
  }
  
  delayMicroseconds(2000);
  
  tempLastOrderAddr = 0;

  for (int i = 0; i < maxBlocks; i++) {     

    if (i == 0) digitalWrite(seekPin, HIGH);
    else transmit(order[i-1], (byte) 1, true);

    int highAddr = lookForHigh();

    if (highAddr != 0 && highAddr != tempLastOrderAddr) {
      
      tempLastOrderAddr = highAddr;
      order[i] = highAddr;
      getBlockData(highAddr);
    } else {
      stoploop = true;
    }

    if (i == 0) digitalWrite(seekPin, LOW);
    else transmit(order[i-1], (byte) 2, true);
    
    if (stoploop) break;
  }
  
  sendStatus ();

}

//Search for the cube which has the seek flag on
int lookForHigh () {
  for (int i = 0; i < maxBlocks; i++) {
    int index = i+1;
    transmit(index, (byte) 0, true);
    Wire.requestFrom(index,1);
    int bt = Wire.read();
    if (bt == 1) return(index);
  }
  return 0;
}

//Get the information of a block
void getBlockData (byte addr) {
  transmit(addr, (byte) 9, true);  
  Wire.requestFrom( (int) addr,1);
  int bt = -1;
  bt = Wire.read();
  if (bt >= 0) {
    //Check for type of block
    if(addr <= 3 && addr > 0) { //Variable blocks
      variableBlocks[addr - 1] = bt;
    }
  }
}

//Transmit a byte to a block
void transmit (byte to, byte bt, boolean dl) {
  Wire.beginTransmission(to);
  Wire.write(bt);
  Wire.endTransmission();
  if (dl) delayMicroseconds(baketsuRelayDelay);

}

//Send the status data over serial connection
void sendStatus () {

  int count = 0;
  String stat = "<[";

  for (int i = 0; i < maxBlocks; i++) if (order[i] != 0) count ++;

  for (int i = 0; i < count; i++) {

    if (order[i] != 0) {
      stat += "[";
      stat.concat(order[i]);
     
      if (order[i] > 0 && order[i] <= 3) {
        stat += ",";
        stat.concat(variableBlocks[order[i]-1]);
      }
      stat += "]";

    } 
    else {
      break;
    }

    if (i+1 < count) stat += ",";
  }
  stat += "]>";
  Serial.println(stat);
}


