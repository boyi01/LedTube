/*
This example will receive multiple universes via Artnet and control a strip of sk6812RGBW leds via
Adafruit's NeoPixel library: https://github.com/adafruit/Adafruit_NeoPixel
This example may be copied under the terms of the MIT license, see the LICENSE file for details
*/
#include <Artnet.h>

#include <C:\Users\Boyi\Documents\Arduino\libraries\Ethernet\src\Ethernet.h>
#include <EthernetUdp.h>
#include <SPI.h>
Artnet artnet;
#include <NeoPixelBus.h>



// Neopixel settings
const int numLeds = 80; // change for your setup
const int channelsPerLed = 4;
const int numberOfChannels = numLeds * channelsPerLed; // Total number of channels you want to receive (1 led = 4 channels)
const byte dataPin = 28;
NeoPixelBus<NeoRgbwwFeature, NeoWs2812xMethod> strip(numLeds, dataPin);





//TEST
#include <Adafruit_NeoPixel.h>
Adafruit_NeoPixel strip2(1, 16, NEO_GRBW + NEO_KHZ800); 

#define OTETHERNET
#include <ArduinoOTA.h>

// Check if we got all universes
uint16_t universe1 = 0; // 0 - 32767
bool sendFrame = 1; 
int previousDataLength = 0;
EthernetUDP Udp;  
// Change ip and mac address for your setup
byte mac[] = {0x04, 0xE9, 0xE5, 0x00, 0x69, 0xEC};

byte ip[] = {192, 168, 1, 177};
IPAddress myDns(192, 168, 1, 1);
byte broadcast[] = {192, 168, 1, 255};


struct ArtPollReplyMetadata
{
    uint16_t oem {0x00FF};      // OemUnknown https://github.com/tobiasebsen/ArtNode/blob/master/src/Art-NetOemCodes.h
    uint16_t esta_man {0x0000}; // ESTA manufacturer code
    uint8_t status1 {0x00};     // Unknown / Normal
    uint8_t status2 {0x08};     // sACN capable
    String short_name {"Arduino ArtNet"};
    String long_name {"Ardino ArtNet Protocol by hideakitai/ArtNet"};
    String node_report {""};
};


void setup()
{   
 Ethernet.init(5);
  Ethernet.begin(mac, ip);
 artnet.begin();
  strip.Begin();
  strip.Show();
  strip2.begin();
  strip2.show();
  // this will be called for each packet received
   artnet.subscribeArtDmxUniverse(0, [&](const uint8_t *data, uint16_t size, const ArtDmxMetadata &metadata, const ArtNetRemoteInfo &remote) {
       int offset =  1;
        float colorBalance = ((float) data[0])/255;
        // read universe and put into the right part of the display buffer
                //  Serial.println(data[1]+data[2]+data[3]+data[4]);
                
    strip2.setPixelColor(0,strip2.Color(data[1],data[2],data[3],data[4]));
    strip2.show();
        for (int i = 0; i < size  / channelsPerLed; i++)
        { 
          int led = i;
          if (led < numLeds) {
            strip.SetPixelColor(led, RgbwwColor( data[i * channelsPerLed + offset], data[i * channelsPerLed + 1 + offset], data[i * channelsPerLed + 2 + offset],round(((float) data[i * channelsPerLed + 3 + offset]) * colorBalance),round(((float) data[i * channelsPerLed + 3 + offset]) * abs(colorBalance-1))));
                 //  strip.SetPixelColor(i, RgbwwColor(10,10,10,10,10));
          }

        }

        strip.Show();




    });
 ArduinoOTA.begin(Ethernet.localIP(), "Arduino", "password", InternalStorage);


}



void loop()
{

      ArduinoOTA.poll();
  // we call the read function inside the loop
  artnet.parse();
}




