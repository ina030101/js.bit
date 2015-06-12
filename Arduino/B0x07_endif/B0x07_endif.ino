//-------------------------------------------------
//                 IF BLOCK
//                 END
//-------------------------------------------------

#include <TinyWireS.h>

#define SEEK_IN 1
#define SEEK_OUT 3
#define I2C_SLAVE_ADDRESS 0x7


#ifndef TWI_RX_BUFFER_SIZE
#define TWI_RX_BUFFER_SIZE ( 16 )
#endif

byte sendByte = 0;
byte st[2] = {0,0};

int potTresshold = 50;
int value[2] = {0,0};
int treshold = 50;

boolean pinging = false;

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
      output = map(0, 0, 1023, 0, 10);
      break;
    default:
      output = map(0, 0, 1023, 0, 1);
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

void loop() {
  TinyWireS_stop_check();
}
