![js.bit header](http://jsbit.cc/github/jsbit.github.header.jpg)

# js.bit, a device to study javascript by connecting blocks

![js.bit](http://jsbit.cc/gallery/photo1.jpg)

js.bit is a system consisting of a set of 28 physical blocks that represents syntactic parts of JavaScript and an iPad application. Each block represents a part of a computer program, for example, a variable. When these blocks are connected to the main block or to each other, a program is created. The code of the program can be seen and analyzed in real time, the code can also be executed outputing physical actions such as lighting an LED or moving a motor. The system recognizes the block array and outputs in a display the information about the blocks.


##Hardware & Building Guides
Building guides will be posted to instructables and linked here during the second week of July.

##Software (iOS App)
The software of js.bit (the xcode project) is located under the App folder. The main javascript application is located on that folder's assets directory.

This app receives via BLE the status of the blocks as events and draws the corresponding graphics on screen. It can relay messages to the main block via BLE which in turn relays it to the corresponding block. (for example when running the code).

##Firmware
The software to be burned in the Atmega chips can be found in the Arduino Folder of this repository.

All blocks have a microprocessor, and communicate with the main block using a protocol called TWI or I2C.

js.bit uses two kinds of chips, the ATMEGA 328 and the ATTiny 85 depending on the quantity of inputs/outputs on the blocks.

ATTiny chips allows for one input/output using the js.bit configuration. It makes use of the [TinyWire](https://github.com/rambo/TinyWire) library on the ATTiny and Wire on Arduino.

To burn the firmware on the js.bit blocks a writer device must be created. The circuit needed to burn the firmware to an ATTiny and an ATMEGA is different, so in order to build all the blocks, two burners must be created.

The main block is built with a combination of arduino and konashi. (Now it seems that there are better options to do that). Konashi handles communication with the iPad and Arduino manages communication with the blocks. Arduino sends the status of the blocks using UART to konashi  which in turn relays it to the iPad app via BLE. The iPad app interpret these messages as events.

The first part of the folder name represents the Hexadecimal number for the I2C ID of each block, then an underscore and the block name.

##Comments
The code is very buggy and most part of it is uncommented, so this repository is just for reference and demonstation use only.
You can download it, modify it fork it or do whatever you want with it.
If you make something using this repository I'll be very glad if you could make me know about it!
And please, don't forget to keep the link to the author.

##Licence
js.bit 0.8
José María Campaña Rojas

[http://jsbit.cc](http://jsbit.cc)

developed by [design by chemisax](http://chemisax.com) @ [Institute of Advanced Media Arts and Sciences](http://iamas.ac.jp)
Main contact: [chemisax@chemisax.com](mailto:chemisax@chemisax.com?Subject=js.bit%20github%20contact%20fom)

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">js.bit</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://chemisax.com" property="cc:attributionName" rel="cc:attributionURL">José María Campaña Rojas</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="http://jsbit.cc" rel="dct:source">http://jsbit.cc</a>.

Other libraries js.bit uses:

* [TinyWire](https://github.com/rambo/TinyWire)
* [Arduino](http://www.arduino.cc) 
* [Konashi-js-sdk](https://github.com/YUKAI/konashi-js-sdk)
* [jQuery](https://jquery.com)
* [svg.js](https://github.com/wout/svg.js)
