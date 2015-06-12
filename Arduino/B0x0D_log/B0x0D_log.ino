#include <Wire.h>
#include <Servo.h> 

//-------------------------------------------------
//                 LOG BLOCK
//-------------------------------------------------

#define SEEK_IN 12
#define SEEK_OUT 11
#define I2C_SLAVE_ADDRESS 0x0D // 1 DEC

Servo myservo;

byte sendByte = 0;
int value[2] = {0,0};

int tresshold = 6;
boolean pot = false;
int maxPotCount = 3;
int potCount = 0;
int valueAsAddr = 0;

void setup () {
  pinMode(SEEK_IN,INPUT);
  pinMode(SEEK_OUT,OUTPUT);
  
  digitalWrite(SEEK_OUT,LOW);
  
  Wire.begin(I2C_SLAVE_ADDRESS);
  Wire.onReceive(receiveEvent);
  Wire.onRequest(requestEvent);
  
  myservo.attach(9);
  
  srvWrt(170);
  
  Serial.begin(9600);
  Serial.write("hello");
  
}

void requestEvent() {
  
  byte output;
  
  switch (sendByte) {
    case 0:
      output = (digitalRead(SEEK_IN) == HIGH) ? 1 : 0;
      break;
    case 9:
      output = valueAsAddr;
      //output = map(value[1], 0, 1023, 0, 10);
      break;
    default:
      output = valueAsAddr;
      //output = map(value[1], 0, 1023, 0, 1);
      break;
  }
  
  Wire.write(output);
}

//Handles receiving i2c data.
void receiveEvent(int howMany) {
    if (Wire.available()) {
      
      //Sanity check  
      if (howMany < 1) return;
      
      if (howMany == 2) {
        
        byte bt = Wire.read();
        byte ang = Wire.read();
        
        Serial.println("Writting angle ");
        Serial.println(ang);
        
        if (ang >= 0 && ang <= 180) {
          srvWrt(ang);
        }
        
      } else {
        byte bt = Wire.read();
        parseCommand(bt);
      }
      
      
  }
}

void srvWrt (int ang) {
     
     myservo.write(ang);
     //delay(1000);
     //myservo.detach();
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
    updateValue();
    //Serial.println(valueAsAddr);
}

void updateValue () {
    int v = analogRead(A3);
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
    
    valueAsAddr = (pot) ? convertVar(v) : 0;
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
