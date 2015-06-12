#include <TinyWireS.h>

//-------------------------------------------------
//                 LOOP BLOCK
//                    startblock
//-------------------------------------------------

#define SEEK_IN 1
#define SEEK_OUT 3
#define I2C_SLAVE_ADDRESS 0x11


#ifndef TWI_RX_BUFFER_SIZE
#define TWI_RX_BUFFER_SIZE ( 16 )
#endif

byte sendByte = 0;
int value[2] = {0,0};

int tresshold = 5;
boolean pot = false;
int maxPotCount = 3;
int potCount = 0;

void setup () {
  pinMode(SEEK_IN,INPUT);
  pinMode(SEEK_OUT,OUTPUT);
  
  digitalWrite(SEEK_OUT,LOW);
  
  TinyWireS.begin(I2C_SLAVE_ADDRESS);
  TinyWireS.onReceive(receiveEvent);
  TinyWireS.onRequest(requestEvent);
}

void requestEvent() {
  
  byte output;
  
  switch (sendByte) {
    case 0:
      output = (digitalRead(SEEK_IN) == HIGH) ? 1 : 0;
      break;
    case 9:
      output = map((1023-value[1]), 0, 1023, 1, 9);
      //output = map(value[1], 0, 1023, 0, 10);
      break;
    default:
      output = map((1023-value[1]), 0, 1023, 1, 9);
      //output = map(value[1], 0, 1023, 0, 1);
      break;
  }
  
  TinyWireS.send(output);
}

//Handles receiving i2c data.
void receiveEvent(uint8_t howMany) {
    if (TinyWireS.available()) {
      
      //Sanity check  
      if (howMany < 1) return;
      if (howMany > TWI_RX_BUFFER_SIZE) return;
      
      byte bt = TinyWireS.receive();
      parseCommand(bt);
  }
}

void parseCommand (byte bt) {
  byte out = 0;
  
  switch (bt) {
    case 1:
      //Ping adjacent block
      digitalWrite(SEEK_OUT, HIGH);
      break;
    case 2:
      //Stop pinging adjacent block
      digitalWrite(SEEK_OUT, LOW);
      break;
    default:
      out = bt;
      break;
  }
  
  sendByte = out;
}

void updateValue () {
    int v = analogRead(A2);
    int diff = value[0]-v;
    if (diff < 0) diff *= -1;
    
    if (diff <= tresshold) {      
      if (potCount >= maxPotCount) pot = true;
      else potCount ++;
    } else {
     potCount = 0;
     pot = false; 
    }
    
    value[0] = value[1];
    value[1] = v;
}

void loop() {
  updateValue();
  TinyWireS_stop_check();
}
