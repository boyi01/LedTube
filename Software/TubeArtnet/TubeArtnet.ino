/*
This example will receive multiple universes via Artnet and control a strip of sk6812RGBW leds via
Adafruit's NeoPixel library: https://github.com/adafruit/Adafruit_NeoPixel
This example may be copied under the terms of the MIT license, see the LICENSE file for details
*/

const uint16_t tubeNumber = 1;
const uint16_t startUniver = 3;
const bool half = true;
byte mac[] = {0x04, 0xE9, 0xE5, 0xA5, 0x6A, 0xEC};
#include <Artnet.h>

#include <C:\Users\Boyi\Documents\Arduino\libraries\Ethernet\src\Ethernet.h>
#include <EthernetUdp.h>
#include <SPI.h>
Artnet artnet;
#include <NeoPixelBus.h>

// Neopixel settings
const int numLeds = 59; // change for your setup
const int channelsPerLed = 4;
const int numberOfChannels = numLeds * channelsPerLed; // Total number of channels you want to receive (1 led = 4 channels)
const byte dataPin = 28;
NeoPixelBus<NeoRgbwFeature, NeoWs2812xMethod> strip(numLeds, dataPin);

#include <Adafruit_NeoPixel.h>
#define PIN 16
#define NUMPIXELS 1
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);



// Check if we got all universes

const uint16_t universe1 =startUniver+tubeNumber-1;




bool sendFrame = 1; 
int previousDataLength = 0;

int uR = 0;
int uG = 0;
int uB = 0;
// Change ip and mac address for your setup


byte ip[] = {192, 168, 1, 177};
IPAddress myDns(192, 168, 1, 1);
byte broadcast[] = {192, 168, 1, 255};

struct ArtPollReplyMetadata
{
    uint16_t oem {0x00FF};      // OemUnknown https://github.com/tobiasebsen/ArtNode/blob/master/src/Art-NetOemCodes.h
    uint16_t esta_man {0x0000}; // ESTA manufacturer code
    uint8_t status1 {0x00};     // Unknown / Normal
    uint8_t status2 {0x08};     // sACN capable
    String short_name {"Tube"};
    String long_name {"Tube by Christoph Team Number: "};
    String node_report {""};
};

float colorBalance = 0;
void setup()
{   
  pixels.begin();  
 pixels.setPixelColor(0, pixels.Color(20, 0, 0));
      pixels.show();

 Ethernet.init(5);
  Ethernet.begin(mac);
 artnet.begin();
  strip.Begin();
  strip.Show();
  // this will be called for each packet received
    artnet.subscribeArtDmx([&](const uint8_t *data, uint16_t size, const ArtDmxMetadata& metadata, const ArtNetRemoteInfo& remote) {
        // if Artnet packet comes, this function is called for every universe
      int offset =0;
      if (half){
        offset=236;
      }
      if (metadata.universe == universe1){       
          for (int i = 0; i < size  / channelsPerLed; i++)
        { 
          int led = i;
          if (led < numLeds) {
            strip.SetPixelColor(led, RgbwColor(  data[i * channelsPerLed + 1+offset ],data[i * channelsPerLed +offset], data[i * channelsPerLed + 2+offset ],data[i * channelsPerLed + 3+offset ]));
                 //  strip.SetPixelColor(i, RgbwwColor(10,10,10,10,10));
          }

        }
      }
       strip.Show();
    });


}



void loop()
{

  
  // we call the read function inside the loop
  artnet.parse();
}



