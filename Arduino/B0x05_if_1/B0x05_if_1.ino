#include <Wire.h>


//-------------------------------------------------
//                 IF BLOCK
//                 MAIN CHIP
//-------------------------------------------------

#define SEEK_IN 12
#define SEEK_OUT 11
#define I2C_SLAVE_ADDRESS 0x5 //1

int sendByte = 0;

int input1[2] = {0,0};
int input2[2] = {0,0};

uint8_t inputs[3] = {0,0,0};

int pot = 0;

boolean in1 = true;
boolean in2 = true;

int tresshold = 5;

int maxPotCount = 3;
int dif1Count = 0;
int dif2Count = 0;

void requestEvent(void) {
  int output;
  switch (sendByte) {
  case 0:
    output = (digitalRead(SEEK_IN) == HIGH) ? 1 : 0;
    break;
  case 9:
    output = inputs[0];
    break;
  case 8:
    output = inputs[1];
    break;
  case 7:
    output = inputs[2];
    break;
  default:
    break;
  }
  Wire.write(output);
}

//Handles receiving i2c data.
void receiveEvent(int howMany) {
  if(Wire.available() > 0) {      
    int bt = Wire.read();
    parseCommand(bt);
  }
}

void setup(){
  pinMode(SEEK_IN,INPUT);
  pinMode(SEEK_OUT,OUTPUT);

  Wire.begin(I2C_SLAVE_ADDRESS);
  Wire.onReceive(receiveEvent);
  Wire.onRequest(requestEvent);

  Serial.begin(9600);
}

void loop() {
  updateValue ();
  Serial.println("------------");
  Serial.println(inputs[0]);
  Serial.println(inputs[1]);
  Serial.println(inputs[2]);
}

void parseCommand (int bt) {

  int out = 0;

  switch (bt) {
  case 1:
    //Ping adjacent block
    digitalWrite(SEEK_OUT, HIGH);
    break;
  case '1':
    //Ping adjacent block
    digitalWrite(SEEK_OUT, HIGH);
    break;
  case 2:
    digitalWrite(SEEK_OUT, LOW);
    //Stop pinging adjacent block
    break;
  case '2':
    digitalWrite(SEEK_OUT, LOW);
    //Stop pinging adjacent block
    break;
  default:
    out = bt;
    break;
  }

  sendByte = out;
}


void updateValue () {

  int input1v = analogRead(A3);
  int input2v = analogRead(A2);
  int pot_v = analogRead(A1);

  int diff1 = input1[0]-input1v;
  int diff2 = input2[0]-input2v;

  pot = pot_v;

  if (diff1 < 0) diff1 *= -1;
  if (diff2 < 0) diff2 *= -1;

  if (diff1 <= tresshold) {      
    if (dif1Count >= maxPotCount) in1 = true;
    else dif1Count ++;
  } 
  else {
    dif1Count = 0;
    in1 = false; 
  }

  if (diff2 <= tresshold) {      
    if (dif2Count >= maxPotCount) in2 = true;
    else dif2Count ++;
  } 
  else {
    dif2Count = 0;
    in2 = false; 
  }

  input1[0] = input1[1];
  input1[1] = input1v;

  input2[0] = input2[1];
  input2[1] = input2v;
  
  inputs[0] = (in1) ? convertVar(input1v) : 0;
  inputs[1] = (in2) ? convertVar(input2v) : 0;
  inputs[2] = map((1023-pot), 0, 1023, 0, 255);
}

int convertVar(int input) {
  
  if (input > 900)
    return 1;
  else if (input < 800 && input > 400)
    return 2;
  else if (input < 300)
    return 3;
  return 0;
  
}

