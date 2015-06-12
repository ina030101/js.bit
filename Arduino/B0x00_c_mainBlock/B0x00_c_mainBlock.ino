/*------------------------------------------------*/
/*                                                */
/*    JS.BIT                                      */
/*    Main Block                                  */
/*    2014 Jose Maria Campana Rojas               */
/*                                                */
/*------------------------------------------------*/

#include <Wire.h>

//-------------------------------------------------
//              COMUNICATION PROTOCOL
//-------------------------------------------------
int baketsuRelayDelay = 1000; //microseconds
boolean okToSend = true;

//-------------------------------------------------
//              SERIAL COMUNICATION
//-------------------------------------------------
int conectionSpeed = 9600;

//-------------------------------------------------
//                    BLOCKS
//-------------------------------------------------
int maxBlocks = 32;
int tempLastOrderAddr;
byte order[32] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
int block[2][32] = {{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0},{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}};

  /*
      Variable Blocks
      
      myVarA: 0x01
      myVarB: 0x02
      myVarC: 0x03 
      
  */
  int variableBlocks[2][3] = {{0,0,0},{0,0,0}};
  
  /*
      Conditional Blocks
      
      if: 0x05 & 0x08
      else: 0x06 & 0x09
      endif: 0x07 & 0x0A
      
  */
  
    int ifValues[2][2][3] = {{{0,0,0},{0,0,0}},{{0,0,0},{0,0,0}}};
    int if2Values[2][2][3] = {{{0,0,0},{0,0,0}},{{0,0,0},{0,0,0}}};
  
  /*
      lightbox
      
      lightbox: 0x0B
      extension: 0x0C
      
  */
  
  int lightboxValues[2][2][3] = {{{0,0,0},{0,0,0}},{{0,0,0},{0,0,0}}};
  int lightboxEValues[2][2][3] = {{{0,0,0},{0,0,0}},{{0,0,0},{0,0,0}}};
  
  /*
      Log
      
      log: 0x0D
      log esxtension: 0x0E
      
  */
  
  int log_connectedVar[2] = {0,0};
  int loge_connectedVar[2] = {0,0};
  
  /*
      Motorbox
      
      motorbox: 0x0F
      motorbox extension: 0x10
      
  */
  
    int motorboxVals[2] = {0,0};
    int motorboxeVals[2] = {0,0};
  
  /*
      Loop
      
      loop: 0x11
      loop end: 0x12
      
  */
  
  int loopTimes[2] = {0,0};
  
  /*
      Operators
      
      operator 1: 0x13 (+value)
      operator 2: 0x14 (+value)
      operatror 3: 0x15 (+value)
      operator 4: 0x16 (+ variable)
      
  */
  
  int operator1[2][2][3] = {{{0,0,0},{0,0,0}},{{0,0,0},{0,0,0}}};
  int operator2[2][2][3] = {{{0,0,0},{0,0,0}},{{0,0,0},{0,0,0}}};
  int operator3[2][2][3] = {{{0,0,0},{0,0,0}},{{0,0,0},{0,0,0}}};
  int operator4[2][2][3] = {{{0,0,0},{0,0,0}},{{0,0,0},{0,0,0}}};  

//-------------------------------------------------
//                      I/O
//-------------------------------------------------
int seekPin = 7;

boolean cmdMode = true;

//-------------------------------------------------

void setup() {

  Serial.begin(9600);
  Wire.begin();

  pinMode(seekPin, OUTPUT);
  digitalWrite(seekPin, LOW); 
  
  Serial.write("<Hello!>");
}

void loop() {
  checkSerialBuffer();
  getOrder();
  delay(100);
}


void checkSerialBuffer () {
  if (cmdMode) {
    if (Serial.available() > 0) {
      
        byte command = Serial.read();
        
        switch (command) {
          case "9":
           reset();
           break;
          case 1:
           cmdMode = false;
           break; 
        } 
    }
  } else {
    
    if (Serial.available() > 3) {
      
      byte who = Serial.read();
      byte v1 = Serial.read();
      byte v2 = Serial.read();
      byte v3 = Serial.read();
      cmdMode = true;
      parseData(who, v1, v2, v3);
    }
  }
}

void parseData (byte who, byte v1, byte v2, byte v3) {

  if (blockPresent(who)) {
    
    //Lightbox
    if (who == 0x0B) {
      Wire.beginTransmission(who);
      Wire.write((byte) who);
      Wire.write((byte) v1);
      Wire.write((byte) v2);
      Wire.write((byte) v3);
      Wire.endTransmission();
    }
    
    
    //Log
    if (who == 0x0D) {      
      Wire.beginTransmission(who);
      Wire.write((byte) who);
      Wire.write((byte) v1);
      Wire.endTransmission();
    }
    
    //Motorbox
    if (who == 0x0F) {      
      Wire.beginTransmission(who);
      Wire.write((byte) who);
      Wire.write((byte) v1);
      Wire.endTransmission();
    }
    
    
  } else {
    Serial.write("<NB>");
  }
}

void getOrder() {
  
  boolean stoploop = false;
  for (int i = 0; i < maxBlocks; i++) {
    order[i] = 0;
    transmit((byte) i, (byte) 2, true);
  }
  
  //delayMicroseconds(2000);  <-- Revisar esto!!
  
  tempLastOrderAddr = 0;

  for (int i = 0; i < maxBlocks; i++) {     

    if (i == 0) digitalWrite(seekPin, HIGH);
    else transmit(order[i-1], (byte) 1, true);

    int highAddr = lookForHigh();

    if (highAddr != 0 && highAddr != tempLastOrderAddr) {
      tempLastOrderAddr = highAddr;
      order[i] = highAddr;
    } else {
      stoploop = true;
    }
    if (i == 0) digitalWrite(seekPin, LOW);
    else transmit(order[i-1], (byte) 2, true);
    
    if (stoploop) break;
  }
  comparateResults(); 
}

void comparateResults () {
  for (int i = 0; i < maxBlocks; i++) block[1][i] = blockPresent(i+1);
  for (int i = 0; i < maxBlocks; i++) {
    if (block[0][i] != block[1][i]) {
      for (int i = 0; i < maxBlocks; i++) block[0][i] = block[1][i];
      sendOrder();
    }
  }
  getBlockData();
}

boolean blockPresent (int address) {
  for (int i = 0; i < maxBlocks; i++) {
    if (order[i] == address) return true;
  }
  return false;
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
void getBlockData () {
  for (int i = 0; i < maxBlocks; i++) {
    if (order[i] == 0) break;    
    
    int address = order[i];
    
    // For variable blocks
    if (address > 0 && address <= 3) {
      int addr = address-1;
      variableBlocks[1][addr] = getBlockValue(address);
      if (variableBlocks[1][addr] != variableBlocks[0][addr] && variableBlocks[1][addr] != -1) {
        variableBlocks[0][addr] = variableBlocks[1][addr];
        sendVarUpdate(address, variableBlocks[0][addr]);
      }
    }
    
    //IF1
    if (address == 0x05) {
      ifValues[0][1][0] = getBlockValue(address);
      ifValues[0][1][1] = getBlockValue(address,8);
      ifValues[0][1][2] = getBlockValue(address,7);
      
      boolean update = false;
      
      if (ifValues[0][1][0] != ifValues[0][0][0] && ifValues[0][1][0] != -1) {
        ifValues[0][0][0] = ifValues[0][1][0];
        update = true;
      }
      
      if (ifValues[0][1][1] != ifValues[0][0][1] && ifValues[0][1][1] != -1) {
        ifValues[0][0][1] = ifValues[0][1][1];
        update = true;
      }
      
      if (ifValues[0][1][2] != ifValues[0][0][2] && ifValues[0][1][2] != -1) {
        ifValues[0][0][2] = ifValues[0][1][2];
        update = true;
      }
      
      if (update)
        sendVarUpdate(address, ifValues[0][0][0], ifValues[0][0][1], ifValues[0][0][2], 3);
    }
    
    //IF2
    if (address == 0x08) {
      if2Values[0][1][0] = getBlockValue(address);
      if2Values[0][1][1] = getBlockValue(address,8);
      if2Values[0][1][2] = getBlockValue(address,7);
      
      boolean update = false;
      
      if (if2Values[0][1][0] != if2Values[0][0][0] && if2Values[0][1][0] != -1) {
        if2Values[0][0][0] = if2Values[0][1][0];
        update = true;
      }
      
      if (if2Values[0][1][1] != if2Values[0][0][1] && if2Values[0][1][1] != -1) {
        if2Values[0][0][1] = if2Values[0][1][1];
        update = true;
      }
      
      if (if2Values[0][1][2] != if2Values[0][0][2] && if2Values[0][1][2] != -1) {
        if2Values[0][0][2] = if2Values[0][1][2];
        update = true;
      }
      
      if (update)
        sendVarUpdate(address, if2Values[0][0][0], if2Values[0][0][1], if2Values[0][0][2], 3);
    }
    
    //Lightbox
    if (address == 0x0B) {
      
      lightboxValues[0][1][0] = getBlockValue(address);
      lightboxValues[0][1][1] = getBlockValue(address,8);
      lightboxValues[0][1][2] = getBlockValue(address,7);
      
      boolean update = false;
      
      if (lightboxValues[0][1][0] != lightboxValues[0][0][0] && lightboxValues[0][1][0] != -1) {
        lightboxValues[0][0][0] = lightboxValues[0][1][0];
        update = true;
      }
      
      if (lightboxValues[0][1][1] != lightboxValues[0][0][1] && lightboxValues[0][1][1] != -1) {
        lightboxValues[0][0][1] = lightboxValues[0][1][1];
        update = true;
      }
      
      if (lightboxValues[0][1][2] != lightboxValues[0][0][2] && lightboxValues[0][1][2] != -1) {
        lightboxValues[0][0][2] = lightboxValues[0][1][2];
        update = true;
      }
      
      if (update)
        sendVarUpdate(address, lightboxValues[0][0][0], lightboxValues[0][0][1], lightboxValues[0][0][2], 3);
    }
    
    //Lightbox Extension
    if (address == 0x0C) {
      lightboxEValues[0][1][0] = getBlockValue(address);
      lightboxEValues[0][1][1] = getBlockValue(address,8);
      lightboxEValues[0][1][2] = getBlockValue(address,7);
      
      boolean update = false;
      
      if (lightboxEValues[0][1][0] != lightboxEValues[0][0][0] && lightboxEValues[0][1][0] != -1) {
        lightboxEValues[0][0][0] = lightboxEValues[0][1][0];
        update = true;
      }
      
      if (lightboxEValues[0][1][1] != lightboxEValues[0][0][1] && lightboxEValues[0][1][1] != -1) {
        lightboxEValues[0][0][1] = lightboxEValues[0][1][1];
        update = true;
      }
      
      if (lightboxEValues[0][1][2] != lightboxEValues[0][0][2] && lightboxEValues[0][1][2] != -1) {
        lightboxEValues[0][0][2] = lightboxEValues[0][1][2];
        update = true;
      }
      
      if (update)
        sendVarUpdate(address, lightboxEValues[0][0][0], lightboxEValues[0][0][1], lightboxEValues[0][0][2], 3);
    }
    
    //Log
    if (address == 0x0D) {
      int addr = 0;
      log_connectedVar[1] = getBlockValue(address);
      if (log_connectedVar[1] != log_connectedVar[0] && log_connectedVar[1] != -1) {
        log_connectedVar[0] = log_connectedVar[1];
        sendVarUpdate(address, log_connectedVar[0]);
      }
    }
    
    //Log Extension
    if (address == 0x0E) {
      int addr = 0;
      loge_connectedVar[1] = getBlockValue(address);
      if (loge_connectedVar[1] != loge_connectedVar[0] && loge_connectedVar[1] != -1) {
        loge_connectedVar[0] = loge_connectedVar[1];
        sendVarUpdate(address, loge_connectedVar[0]);
      }
    }
    
     //Motorbox
    if (address == 0x0F) {
      int addr = 0;
      motorboxVals[1] = getBlockValue(address);
      if (motorboxVals[1] != motorboxVals[0] && motorboxVals[1] != -1) {
        motorboxVals[0] = motorboxVals[1];
        sendVarUpdate(address, motorboxVals[0]);
      }
    }
    
    //Motorbox Extension
    if (address == 0x10) {
      int addr = 0;
      motorboxeVals[1] = getBlockValue(address);
      if (motorboxeVals[1] != motorboxeVals[0] && motorboxeVals[1] != -1) {
        motorboxeVals[0] = motorboxeVals[1];
        sendVarUpdate(address, motorboxeVals[0]);
      }
    }
    
    
    //Loop
    if (address == 0x11) {
      int addr = 0;
      loopTimes[1] = getBlockValue(address);
      if (loopTimes[1] != loopTimes[0] && loopTimes[1] != -1) {
        loopTimes[0] = loopTimes[1];
        sendVarUpdate(address, loopTimes[0]);
      }
    }
    
    
    // Operator 1
    if (address == 0x13) {
      operator1[0][1][0] = getBlockValue(address);
      operator1[0][1][1] = getBlockValue(address,8);
      operator1[0][1][2] = getBlockValue(address,7);
      
      boolean update = false;
      
      if (operator1[0][1][0] != operator1[0][0][0] && operator1[0][1][0] != -1) {
        operator1[0][0][0] = operator1[0][1][0];
        update = true;
      }
      
      if (operator1[0][1][1] != operator1[0][0][1] && operator1[0][1][1] != -1) {
        operator1[0][0][1] = operator1[0][1][1];
        update = true;
      }
      
      if (operator1[0][1][2] != operator1[0][0][2] && operator1[0][1][2] != -1) {
        operator1[0][0][2] = operator1[0][1][2];
        update = true;
      }
      
      if (update)
        sendVarUpdate(address, operator1[0][0][0], operator1[0][0][1], operator1[0][0][2], 3);
    }
    
    // Operator 2
    if (address == 0x14) {
      operator2[0][1][0] = getBlockValue(address);
      operator2[0][1][1] = getBlockValue(address,8);
      operator2[0][1][2] = getBlockValue(address,7);
      
      boolean update = false;
      
      if (operator2[0][1][0] != operator2[0][0][0] && operator2[0][1][0] != -1) {
        operator2[0][0][0] = operator2[0][1][0];
        update = true;
      }
      
      if (operator2[0][1][1] != operator2[0][0][1] && operator2[0][1][1] != -1) {
        operator2[0][0][1] = operator2[0][1][1];
        update = true;
      }
      
      if (operator2[0][1][2] != operator2[0][0][2] && operator2[0][1][2] != -1) {
        operator2[0][0][2] = operator2[0][1][2];
        update = true;
      }
      
      if (update)
        sendVarUpdate(address, operator2[0][0][0], operator2[0][0][1], operator2[0][0][2], 3);
    }
    
    // Operator 3
    if (address == 0x15) {
      operator3[0][1][0] = getBlockValue(address);
      operator3[0][1][1] = getBlockValue(address,8);
      operator3[0][1][2] = getBlockValue(address,7);
      
      boolean update = false;
      
      if (operator3[0][1][0] != operator3[0][0][0] && operator3[0][1][0] != -1) {
        operator3[0][0][0] = operator3[0][1][0];
        update = true;
      }
      
      if (operator3[0][1][1] != operator3[0][0][1] && operator3[0][1][1] != -1) {
        operator3[0][0][1] = operator3[0][1][1];
        update = true;
      }
      
      if (operator3[0][1][2] != operator3[0][0][2] && operator3[0][1][2] != -1) {
        operator3[0][0][2] = operator3[0][1][2];
        update = true;
      }
      
      if (update)
        sendVarUpdate(address, operator3[0][0][0], operator3[0][0][1], operator3[0][0][2], 3);
    }
    
  }
}

void reset () {
    
    if(okToSend) {
      Serial.write("<RESET>");
    }
    
    for (int i = 0; i < maxBlocks; i++) {
      order[i] = 0;
      block[0][i] = 0;
      block[1][i] = 0;
    }
    
    for (int i = 0; i < 3; i++) {
      variableBlocks[0][i] = 0;
      variableBlocks[1][i] = 0;
    }
    
    
}

//Get the values of a block
int getBlockValue (byte addr) {
  return getBlockValue(addr, 9);
}

int getBlockValue (byte addr, byte which) {
  transmit(addr, which, true);  
  Wire.requestFrom((int) addr,1);
  int bt = -1;
  bt = Wire.read();
  return bt;
}


//   TWI Communication functions

void transmit (byte to, byte bt, boolean dl) {
  Wire.beginTransmission(to);
  Wire.write(bt);
  Wire.endTransmission();
  if (dl) delayMicroseconds(baketsuRelayDelay);
}



//    Serial communicatino functions
void sendVarUpdate(int addr, int val) {
  sendVarUpdate(addr, val, 0, 0, 1);
}

void sendVarUpdate (int addr, int val1, int val2, int val3, int vals) {
  if (okToSend) {      
    Serial.write("<U:");  
      Serial.write((byte)addr);
      Serial.write(":");
      Serial.write((byte)val1);
      
      if (vals == 2) {
        Serial.write((byte)val2);
      }
      
      if (vals == 3) {
        Serial.write((byte)val2);
        Serial.write((byte)val3);
      }
      
      Serial.write(">");
      //stat.concat(">");
      //Serial.println(stat);
  }
}

void sendOrder () {
  if (okToSend) {
      
      int count = 0;
      
      Serial.write("<");
      //String stat = "<";
    
      for (int i = 0; i < maxBlocks; i++) {
        if (order[i] != 0) count ++;
        else break;
      }
      
      if (count > 0) {
        for (int i = 0; i < count; i++) {
          Serial.write((byte) order[i]);
          //stat.concat(order[i]);
        }
      } else {
        Serial.write("E");
        //stat.concat("E");
      }
      
      //stat += ">";
      Serial.write(">");
      
      //Serial.println(stat);
  }
}

