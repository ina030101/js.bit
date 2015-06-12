#include <SoftwareServo.h>

SoftwareServo servo;

void setup()
{ 
  servo.attach(4);
  servo.write(0);
}

void loop() {
    int pos;
    for(pos = 0; pos < 180; pos += 1) { 
        servo.write(pos);              
        delay(10);                      
        SoftwareServo::refresh();//this row....
    } 
    for(pos = 180; pos>=1; pos-=1) {                                
        servo.write(pos);              
        delay(10);                      
        SoftwareServo::refresh();//This row....
    } 
}
