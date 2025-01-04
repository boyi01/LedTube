/*
  Q Light Controller Plus
  Noise.js

  Copyright (c) Doug Puckett

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0.txt

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// Development tool access
var testAlgo;
var heightSave;
var widthSave;
var oldValue;
var goValue;
var cwStart;
var wwStart;
var oldgasdas;

(
    function () {
        var algo = {};
        algo.apiVersion = 2;
        algo.name = 'noise';
        algo.author = 'Doug Puckett';
        algo.properties = [];
        algo.acceptColors = 1;
        algo.cwStart = Number("0");
        algo.wwStart = Number("0");
        algo.maxOffset=Number("0");
        algo.properties.push("name:cwStart|type:range|display:cw|values:0,255|write:setcw|read:getcw");
        oldgasdas = 0;
        algo.setcw = function (_cwStart) {
            algo.cwStart = _cwStart;
        };

        algo.getcw = function () {
            return algo.cwStart;
        };

        
        algo.properties.push("name:wwStart|type:range|display:ww|values:0,255|write:setww|read:getww");

        algo.setww = function (_wwStart) {
            algo.wwStart = _wwStart;   
        };

        algo.getww = function () {
            return algo.wwStart;
        };

        algo.properties.push("name:maxOffset|type:range|display:maxOffset|values:0,255|write:setmaxOffset|read:getmaxOffset");

        algo.setmaxOffset = function (_maxOffset) {
            algo.maxOffset = _maxOffset;   
        };

        algo.getmaxOffset = function () {
            return algo.maxOffset;
        };
      
        //qlc plus rgbmap function where the work is done
        algo.rgbMap = function (width, height, rgb, step) {
            var map = new Array(height);
            var offset = height/2;
            var stepSelect = 1000;
       
         
            
            if ( heightSave != height || widthSave != width || cwStart != algo.cwStart|| wwStart != algo.wwStart){
          
                heightSave=height;
                widthSave=width;
                cwStart=algo.cwStart;
                wwStart=algo.wwStart;
                oldValue = new Array(height/2);
                goValue = new Array(height/2);
                var intR = (rgb >> 16) & 0x00FF;  // split color of user selected color
                var intG = (rgb >> 8) & 0x00FF;   
                var intB = rgb & 0x00FF;      
                for (var y = 0; y < height/2; y++) {
                    oldValue[y]=[];
                    goValue[y]=[];
                    for (var x = 0; x < width; x++) {
                        oldValue[y][x] = new Array(5)
                        goValue[y][x] =  new Array(5)           
                        oldValue[y][x]['cw'] =  Number(algo.cwStart);
                        oldValue[y][x]['ww'] =  Number(algo.wwStart);
                        oldValue[y][x]['r'] =   Number(intR);
                        oldValue[y][x]['g'] =   Number(intG);
                       
                        
                        oldValue[y][x]['b'] =   Number(intB);
                        goValue[y][x]['cw'] =  Number("0");
                        goValue[y][x]['ww'] = Number("0");
                        goValue[y][x]['r'] =   Number("0");
                        goValue[y][x]['g'] =  Number("0");
                        goValue[y][x]['b'] =   Number("0");
                    }
                }     
                                                                 
            }
        
            var intCw = algo.cwStart;  // split color of user selected color
            var intWw = algo.wwStart;   
            var intR = (rgb >> 16) & 0x00FF;  // split color of user selected color
            var intG = (rgb >> 8) & 0x00FF;   
            var intB = rgb & 0x00FF;  


  
            for (var y = 0; y < height/2; y++) {
                map[y] = [];
                map[y+offset] = [];
                for (var x = 0; x < width; x++) {
                    var oldCw =  oldValue[y][x]['cw'];
                    var oldWw =  oldValue[y][x]['ww'];  
                    var oldR =  oldValue[y][x]['r'];
                    var oldG =  oldValue[y][x]['g'];
                    var oldB =  oldValue[y][x]['b'];
                    
                    
                    var goCw =goValue[y][x]['cw'];
                    var goWw = goValue[y][x]['ww'];
                    var goR = goValue[y][x]['r'];
                    var goG = goValue[y][x]['g'];
                    var goB =goValue[y][x]['b'];
                    
              
                    var faktor =  stepSelect- ((step) % stepSelect);
                    
                    
                    if (faktor == 0) faktor = Number("1");
                    faktor = faktor/stepSelect  ;


                    var stepCw = oldCw + Math.floor((goCw-oldCw)*faktor);
                    var stepWw = oldWw + Math.floor((goWw-oldWw)*faktor);
                    var stepR = oldR + Math.floor((goR-oldR)*faktor);
                    var stepG = oldG+ Math.floor((goG-oldG)*faktor);
                    var stepB = oldB+Math.floor((goB-oldB)*faktor);
       

                    
               

                    if ( stepCw > 255) stepCw=Number("255");
                    if ( stepCw< 0) stepCw=Number("0");
                    if ( stepWw > 255) stepWw=Number("255");
                    if ( stepWw< 0) stepWw=Number("0");
                    if ( stepR > 255) stepR=Number("255");
                    if ( stepR< 0) stepR=Number("0");
                    if ( stepG > 255) stepG=Number("255");
                    if ( stepG< 0) stepG=Number("0");
                    if ( stepB > 255) stepB=Number("255");
                    if ( stepB< 0) stepB=Number("0");

           

                    var cColor =  (stepR << 16) + (stepG << 8) + stepB;   // put rgb parts back together
                    var cWhite =  (stepCw << 16) + (stepWw << 8) + Number("0");
                  
                    
                 
                    map[y][x] = cColor; 
                map[y+offset][x] = cWhite;      

                }
            }

           
            if (step%stepSelect== 0){
                for (var y = Number("0"); y < height/2; y++) {
                    for (var x = Number("0"); x < width; x++) {
                        


                   

                        var oldCw =Number(goValue[y][x]['cw']);  // split color of user selected color
                        var oldWw = Number(goValue[y][x]['ww']);  // split color of user selected color
                        var oldR =Number(goValue[y][x]['r']);  // split color of user selected color
                        var oldG = Number(goValue[y][x]['g']);  // split color of user selected color
                        var oldB = Number(goValue[y][x]['b']);  // split color of user selected color


                       

                         oldValue[y][x]['cw'] =  oldCw;
                        oldValue[y][x]['ww'] =  oldWw;
                        oldValue[y][x]['r'] =   oldR;
                        oldValue[y][x]['g'] =   oldG;
                        oldValue[y][x]['b'] =   oldB;    
                       
                        
                       

                        // create random color level from 1 to 255
                        var  cw = oldCw + Math.floor(Math.random()*20-10); 
                        var  ww = oldWw + Math.floor(Math.random()*20-10); 
                        var  rr = oldR + Math.floor(Math.random()*20-10); 
                        var  gg = oldG + Math.floor(Math.random()*20-10); 
                        var  bb = oldB + Math.floor(Math.random()*20-10); 


        
                        
                        
                        

                        // Limit each color element to the maximum for chosen color or make 0 if below 0
                        if ( cw > intCw + algo.maxOffset ) cw=intCw + Number(algo.maxOffset);
                        if ( cw < intCw - algo.maxOffset ) cw=intCw - Number(algo.maxOffset);
                        if ( ww > intWw + Number(algo.maxOffset) ) ww=intWw + Number(algo.maxOffset);
                        if ( ww < intWw - Number(algo.maxOffset) ) ww=intWw - Number(algo.maxOffset);
                        if ( rr > intR + Number(algo.maxOffset) ) rr=intR + Number(algo.maxOffset);
                        if ( rr < intR - Number(algo.maxOffset) ) rr=intR - Number(algo.maxOffset);
                        if ( gg > intG + Number(algo.maxOffset) ) gg=intG + Number(algo.maxOffset);
                        if ( gg < intG - Number(algo.maxOffset) ) gg=intG - Number(algo.maxOffset);
                        if ( bb > intB + Number(algo.maxOffset) ) bb=intB + Number(algo.maxOffset);
                        if ( bb < intB - Number(algo.maxOffset) ) bb=intB - Number(algo.maxOffset);
                        if ( cw > 255) cw=Number("255");
                        if ( cw < 0) cw=Number("0");
                        if ( ww > 255) ww=Number("255");
                        if ( ww < 0) ww=Number("0");
                        if ( rr > 255) rr=Number("255");
                        if ( rr < 0) rr=Number("0");
                        if ( gg > 255) gg=Number("255");
                        if ( gg < 0) gg=Number("0");
                        if ( bb > 255) bb=Number("255");
                        if ( bb< 0) bb=Number("0");
                       
                        
                        
                    
                   
                     
                    
                  
                      
                        //goValue[y][x] =  (algo.cwStart << 32) + (algo.wwStart << 24) + rgb;  
                        goValue[y][x]['cw'] =  cw;
                        goValue[y][x]['ww'] =  ww;
                        goValue[y][x]['r'] =  rr;
                        goValue[y][x]['g'] =  gg;
                        goValue[y][x]['b'] =  bb;   
                        
                        
                        
                    }
                }
            }

            return map;
           
        };
        


        algo.rgbMapStepCount = function (width, height) {
            return width * height * 100;
        };

        // Development tool access
        testAlgo = algo;

        return algo;
    }
)();
