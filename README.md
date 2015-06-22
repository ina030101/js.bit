# js.bit

![js.bit](http://jsbit.cc/github/jsbit.github.header.jpg)


js.bit is a system consisting of a set of 28 physical blocks that represents syntactic parts of JavaScript and an iPad application. Each block represents a part of a computer program, for example, a variable. When these blocks are connected to the main block or to each other, a program is created. The code of the program can be seen and analyzed in real time, the code can also be executed outputing physical actions such as lighting an LED or moving a motor. The system recognizes the block array and outputs in a display the information about the blocks.

##Build guide
Building guides will be posted to instructables and linked here during the second week of July.

##Software
The software of js.bit (the xcode project) is located under the App folder.
The main javascript application is located on that folder's assets directory.

##Firmware
The software to be burned in the Atmega chips can be found in the Arduino Folder of this repository. 
The first part of the folder name represents the Hexadecimal number for the I2C ID of each block, then an underscore and the block name.

##Comments
The code is very buggy, so this repository is just for reference use only.
You can download it, modify it fork it or do whatever you want.
If you make something using this repository I'll be very glad if you could make me know it!
And please, don't forget to keep the link to the author.

##Licence
js.bit release 1
José María Campaña Rojas

[http://jsbit.cc].
developed by [design by chemisax](http://chemisax.com) @ [IAMAS](http://iamas.ac.jp)
contact: [chemisax@chemisax.com](mailto:chemisax@chemisax.com?Subject=js.bit%20github%20contact%20fom)

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">js.bit</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://chemisax.com" property="cc:attributionName" rel="cc:attributionURL">José María Campaña Rojas</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="http://jsbit.cc" rel="dct:source">http://jsbit.cc</a>.

Other libraries js.bit uses:

* [Konashi-js-sdk](https://github.com/YUKAI/konashi-js-sdk)
* [Arduino](http://www.arduino.cc) 
* [jQuery](https://jquery.com)
* [svg.js](https://github.com/wout/svg.js)
