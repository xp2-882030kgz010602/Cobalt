var w=window.innerWidth;
var h=window.innerHeight;
var focusx=0;
var focusy=0;
var centerx=0;
var centery=0;
var zoom=1;
var n;//The cells at their default size and transition select buttons have a size of 3n+1. This allows the neighborhoods to be shown on the transition select buttons, accounting for the border.
//This means that we have to convert stuff to the 3n+1 scale if we want to display it, hence the math. Only the neighborhoods use a size smaller than 3n+1.
var ruleindex=0;
var paused=true;
var pmouseIsPressed=false;
var clicked=false;
if(h>w){
  n=Math.floor((w/30-1)/3);
  h=(3*n+1)*Math.floor(h/(3*n+1));
  w=30*(3*n+1);
}else{
  n=Math.floor((h/30-1)/3);
  h=30*(3*n+1);
  w=(3*n+1)*Math.floor(w/(3*n+1));
}
var wn=3*(w/(3*n+1));
var hn=3*(h/(3*n+1));
function setup(){
  var canvas=createCanvas(w+1,h+1);
  canvas.style("display","block");//Doesn't remove the scrollbars :(
  noSmooth();
  textFont("Courier New");
  if(h>w){
    centerx=45;
    centery=3*Math.floor((h+45*n)/(6*n+2));
  }else{
    centerx=3*Math.floor((w+45*n)/(6*n+2));
    centery=45;
  }
}
var line1=function(x0,y0,x1,y1){
  line((x0*n+Math.floor(x0/3))+0.5,(y0*n+Math.floor(y0/3))+0.5,(x1*n+Math.floor(x1/3))+0.5,(y1*n+Math.floor(y1/3))+0.5);//The 0.5 offset seems to make everything super sharp!
};
var rect1=function(x0,y0,x1,y1){
  var w1=x1-x0;
  var h1=y1-y0;
  if(h>w){
    rect(1+x0*n+Math.floor(x0/3),1+y0*n+Math.floor(y0/3),w1*n+Math.floor(w1/3),h1*n+Math.floor(h1/3));
  }else{
    rect(1+y0*n+Math.floor(y0/3),1+x0*n+Math.floor(x0/3),h1*n+Math.floor(h1/3),w1*n+Math.floor(w1/3));
  }
};
var text1=function(text_,x,y){
  if(h>w){
    text(text_,(x*n+Math.floor(x/3))+0.5,(y*n+Math.floor(y/3))+0.5);
  }else{
    text(text_,(y*n+Math.floor(y/3))+0.5,(x*n+Math.floor(x/3))+0.5);
  }
};
var rectpair=function(x,y){
  rect3(x,y,x+3,y+3);
  rect3(x,y+18,x+3,y+21);
};
var rect2=function(x,y){
  rect3(x,y,x+1,y+1);
};
var rect3=function(x0,y0,x1,y1){
  noStroke();
  rect1(x0,y0,x1,y1);
  if(h>w){
    stroke(0,255,0);
    line1(x0,y0,x1,y0);
    line1(x1,y0,x1,y1);
    line1(x1,y1,x0,y1);
    line1(x0,y1,x0,y0);
  }else{
    stroke(0,255,0);
    line1(y0,x0,y1,x0);
    line1(y1,x0,y1,x1);
    line1(y1,x1,y0,x1);
    line1(y0,x1,y0,x0);
  }
};
var rect4=function(x,y){
  rect1(x,y,x+1,y+1);
};
var rect5=function(x0,y0,x1,y1){
  noStroke();
  fill(0);
  if(h>w){
    rect1(wn-x1,hn-y1,wn-x0,hn-y0);
  }else{
    rect1(hn-y1,wn-x1,hn-y0,wn-x0);
  }
  stroke(0,255,0);
  line1(wn-x0,hn-y0,wn-x1,hn-y0);
  line1(wn-x1,hn-y0,wn-x1,hn-y1);
  line1(wn-x1,hn-y1,wn-x0,hn-y1);
  line1(wn-x0,hn-y1,wn-x0,hn-y0);
};
var text5=function(text_,x,y){
  text(text_,w-(x*n+Math.floor(x/3))+0.5,h-(y*n+Math.floor(y/3))+0.5);
};
var rect6=function(x0,y0,x1,y1){
  noStroke();
  fill(0);
  if(h>w){
    rect1(x0,y0+45,x1,y1+45);
    stroke(0,255,0);
    line1(x0,y0+45,x1,y0+45);
    line1(x1,y0+45,x1,y1+45);
    line1(x1,y1+45,x0,y1+45);
    line1(x0,y1+45,x0,y0+45);
  }else{
    rect1(y0,x0+45,y1,x1+45);
    stroke(0,255,0);
    line1(x0+45,y0,x1+45,y0);
    line1(x1+45,y0,x1+45,y1);
    line1(x1+45,y1,x0+45,y1);
    line1(x0+45,y1,x0+45,y0);
  }
};
var text6=function(text_,x,y){
  if(h>w){
    text(text_,(x*n+Math.floor(x/3))+0.5,(y*n+Math.floor(y/3))+45*n+15.5);
  }else{
    text(text_,(x*n+Math.floor(x/3))+45*n+15.5,(y*n+Math.floor(y/3))+0.5);
  }
};
var drawtransition=function(grid,transition,type,x,y){
  var fulltransition=type+transition;
  fill(0,127,0);
  noStroke();
  if(fulltransition==="B0"){
    grid=[[1,1,1],[1,1,1],[1,1,1]];
  }
  if(transitionslist[ruleindex][fulltransition]){//transitionslist is defined in patevolve.js
    if(h>w){
      for(var i=0;i<3;i++){
        for(var j=0;j<3;j++){
          if(grid[j][i]){
            rect4(x+i,y+j);
          }
        }
      }
    }else{
      for(var i=0;i<3;i++){
        for(var j=0;j<3;j++){
          if(grid[j][i]){
            rect4(x+j,y+i);
          }
        }
      }
    }
  }
  fill(0,255,0);
  if(fulltransition==="B0"&&transitionslist[ruleindex][fulltransition]){
    fill(0);
  }
  text1(transition,x+1.5,y+1.5);
};
var drawtransitionpair=function(grid,transition,x,y){
  drawtransition(grid,transition,"B",x,y);
  drawtransition([grid[0],[grid[1][0],1,grid[1][2]],grid[2]],transition,"S",x,y+18);
  var neighbors=transition[0]*1;
  if(neighbors<4){
    var invertedtransition=(8-neighbors)+transition[1];
    var invertedbgrid=[[1-grid[0][0],1-grid[0][1],1-grid[0][2]],[1-grid[1][0],0,1-grid[1][2]],[1-grid[2][0],1-grid[2][1],1-grid[2][2]]];
    var invertedsgrid=[[1-grid[0][0],1-grid[0][1],1-grid[0][2]],[1-grid[1][0],1,1-grid[1][2]],[1-grid[2][0],1-grid[2][1],1-grid[2][2]]];
    if(neighbors===3){
      drawtransition(invertedbgrid,invertedtransition,"B",x,y+6);
      drawtransition(invertedsgrid,invertedtransition,"S",x,y+24);
      return;
    }
    if(neighbors===2){
      drawtransition(invertedbgrid,invertedtransition,"B",x-21,y+12);
      drawtransition(invertedsgrid,invertedtransition,"S",x-21,y+30);
      return;
    }
    if(neighbors===1){
      drawtransition(invertedbgrid,invertedtransition,"B",x+9,y+12);
      drawtransition(invertedsgrid,invertedtransition,"S",x+9,y+30);
      return;
    }
  }
};
var drawselectedtransition=function(grid,transition,type,x,y){
  var fulltransition=type+transition;
  fill(0);
  rect1(x,y,x+3,y+3);
  fill(0,95,0);
  noStroke();
  if(fulltransition==="B0"){
    grid=[[1,1,1],[1,1,1],[1,1,1]];
  }
  if(h>w){
    for(var i=0;i<3;i++){
      for(var j=0;j<3;j++){
        if(grid[j][i]){
          rect4(x+i,y+j);
        }
      }
    }
  }else{
    for(var i=0;i<3;i++){
      for(var j=0;j<3;j++){
        if(grid[j][i]){
          rect4(x+j,y+i);     
        }
      }
    }
  }
  fill(0,255,0);
  if(fulltransition==="B0"){
    fill(0);
  }
  text1(transition,x+1.5,y+1.5);
  noFill();
  rect3(x,y,x+3,y+3);
  if(clicked){
    transitionslist[ruleindex][fulltransition]=!transitionslist[ruleindex][fulltransition];
  }
};
var bottomtext="";
var drawrulepicker=function(){
  //Transition selection GUI
  fill(0);
  stroke(0,255,0);
  rect3(0,0,90,45);
  fill(0,255,0);
  noStroke();
  textAlign(CENTER,CENTER);
  textSize(n*2.4);
  text1("B",7.5,7.5);
  text1("S",7.5,25.5);
  if(h>w){
    text1("<",82.5,25.5);
    text1(">",82.5,28.5);
    text1("+",82.5,34.5);
    text1("-",82.5,37.5);
  }else{
    text1("<",70.5,37.5);
    text1(">",73.5,37.5);
    text1("+",79.5,37.5);
    text1("-",82.5,37.5);
  }
  drawtransitionpair([[0,0,0],[0,0,0],[0,0,0]],"0",12,6);
  drawtransitionpair([[1,0,0],[0,0,0],[0,0,0]],"1c",18,6);
  drawtransitionpair([[0,1,0],[0,0,0],[0,0,0]],"1e",21,6);
  drawtransitionpair([[1,1,0],[0,0,0],[0,0,0]],"2a",27,6);
  drawtransitionpair([[1,0,1],[0,0,0],[0,0,0]],"2c",30,6);
  drawtransitionpair([[0,1,0],[1,0,0],[0,0,0]],"2e",33,6);
  drawtransitionpair([[0,1,0],[0,0,0],[0,1,0]],"2i",36,6);
  drawtransitionpair([[0,1,0],[0,0,0],[0,0,1]],"2k",39,6);
  drawtransitionpair([[1,0,0],[0,0,0],[0,0,1]],"2n",42,6);
  drawtransitionpair([[1,1,0],[1,0,0],[0,0,0]],"3a",48,6);
  drawtransitionpair([[1,0,1],[0,0,0],[0,0,1]],"3c",51,6);
  drawtransitionpair([[0,1,0],[1,0,1],[0,0,0]],"3e",54,6);
  drawtransitionpair([[1,0,0],[1,0,0],[1,0,0]],"3i",57,6);
  drawtransitionpair([[0,0,1],[0,0,1],[0,1,0]],"3j",60,6);
  drawtransitionpair([[0,1,0],[1,0,0],[0,0,1]],"3k",63,6);
  drawtransitionpair([[1,0,1],[1,0,0],[0,0,0]],"3n",66,6);
  drawtransitionpair([[1,0,0],[1,0,0],[0,0,1]],"3q",69,6);
  drawtransitionpair([[0,1,1],[0,0,0],[0,1,0]],"3r",72,6);
  drawtransitionpair([[1,0,1],[0,0,0],[0,1,0]],"3y",75,6);
  drawtransitionpair([[1,0,0],[1,0,0],[1,1,0]],"4a",6,12);
  drawtransitionpair([[1,0,1],[0,0,0],[1,0,1]],"4c",9,12);
  drawtransitionpair([[0,1,0],[1,0,1],[0,1,0]],"4e",12,12);
  drawtransitionpair([[1,0,1],[1,0,1],[0,0,0]],"4i",15,12);
  drawtransitionpair([[0,0,1],[1,0,1],[0,1,0]],"4j",18,12);
  drawtransitionpair([[0,1,1],[1,0,0],[0,0,1]],"4k",21,12);
  drawtransitionpair([[1,0,0],[1,0,0],[1,0,1]],"4n",24,12);
  drawtransitionpair([[1,1,0],[1,0,0],[0,0,1]],"4q",27,12);
  drawtransitionpair([[0,1,1],[0,0,1],[0,1,0]],"4r",30,12);
  drawtransitionpair([[1,1,1],[0,0,0],[0,1,0]],"4t",33,12);
  drawtransitionpair([[1,0,0],[1,0,0],[0,1,1]],"4w",36,12);
  drawtransitionpair([[1,0,1],[0,0,0],[1,1,0]],"4y",39,12);
  drawtransitionpair([[1,1,0],[0,0,0],[0,1,1]],"4z",42,12);
  drawtransitionpair([[1,1,1],[1,0,1],[1,1,1]],"8",36,18);
  noFill();
  rectpair(6,6);
  for(var i=18;i<24;i+=3){
    rectpair(i,6);
    rectpair(i+9,18);
  }
  for(var i=6;i<24;i+=3){
    rectpair(i,18);
    rectpair(i+21,6);
  }
  for(var i=48;i<78;i+=3){
    rectpair(i,6);
    rectpair(i,12);
  }
  for(var i=6;i<45;i+=3){
    rectpair(i,12);
  }
  rectpair(12,6);
  rectpair(36,18);
  if(h>w){
    rect3(42,36,78,39);
    rect3(81,24,84,27);
    rect3(81,27,84,30);
    rect3(81,33,84,36);
    rect3(81,36,84,39);
    if(getg0()){
      fill(0,255,0);
    }
    rect3(81,18,84,21);
  }else{
    rect3(81,6,84,33);
    rect3(69,36,72,39);
    rect3(72,36,75,39);
    rect3(78,36,81,39);
    rect3(81,36,84,39);
    if(getg0()){
      fill(0,255,0);
    }
    rect3(63,36,66,39);
  }
  noStroke();
  fill(0,255,0);
  if(h>w){
    if(getg0()){
      fill(0);
    }
    text1("G0",82.5,19.5);
  }else{
    if(getg0()){
      fill(0);
    }
    text1("G0",64.5,37.5);
  }
  textAlign(LEFT,CENTER);
  fill(0,255,0);
  if(h>w){
    text1("Rule "+(ruleindex+1)+"/"+transitionslist.length,42.5,37.5);
  }else{
    text1("Rule "+(ruleindex+1)+"/"+transitionslist.length,82.5,6.5);
  }
};
var drawplaybackgui=function(){
  noFill();
  if(h>w){
    rect3(0,45,wn,hn);
  }else{
    rect3(0,45,hn,wn);
  }
  fill(0,63,0);
  if(h>w){
    rect3(0,45,6,51);
    rect3(12,45,18,51);
    rect3(0,57,6,63);
    rect3(12,57,18,63);
    rect3(6,51,12,57);
  }else{
    rect3(0,45,6,51);
    rect3(12,45,18,51);
    rect3(0,57,6,63);
    rect3(12,57,18,63);
    rect3(6,51,12,57);
  }
  fill(0);
  for(var i=0;i<24;i+=6){
    rect5(i,0,i+6,6);
  }
  rect6(6,0,12,6);
  rect6(0,6,6,12);
  rect6(6,12,12,18);
  rect6(12,6,18,12);
  if(h>w){
    rect6(84,0,90,6);
    rect6(84,6,90,12);
  }else{
    rect5(0,78,6,84);
    rect5(0,84,6,90);
  }
  fill(0,255,0);
  noStroke();
  textAlign(CENTER,CENTER);
  textSize(n*4.5);
  if(paused){
    text5(">",3,3);
  }else{
    text5("||",3,3);
  }
  text5("|>",9,3);
  text5("<|",15,3);
  text5("|<",21,3);
  text6("^",9,3);
  text6("<",3,9);
  text6(">",15,9);
  text6("V",9,15);
  if(h>w){
    text6("-",87,9);
    text6("+",87,3);
  }else{
    text5("-",3,81);
    text5("+",3,87);
  }
  textAlign(LEFT,TOP);
  textSize(n*2.4);
  text1("Generation: "+generations+"\nPopulation: "+cells.length,0.5,0.5);//Defined in patevolve.js
  textAlign(LEFT,BOTTOM);
  if(h>w){
    text1(bottomtext,0.5,44.5);
  }else{
    text1(bottomtext,89.5,0.5);
  }
};
var rect8=function(x0,y0,x1,y1){
  var w1=x1-x0;
  var h1=y1-y0;
  stroke(0,255,0);
  if(h>w){
    point(Math.floor(x0*n+x0/3)+0.5,Math.floor(y0*n+y0/3)+0.5);//This stops cells from being invisible if you zoom too far out.
    noStroke();
    rect(Math.floor(x0*n+x0/3),Math.floor(y0*n+y0/3),Math.floor(x1*n+x1/3)-Math.floor(x0*n+x0/3),Math.floor(y1*n+y1/3)-Math.floor(y0*n+y0/3));
  }else{
    point(Math.floor(y0*n+y0/3)+0.5,Math.floor(x0*n+x0/3)+0.5);//This stops cells from being invisible if you zoom too far out.
    noStroke();
    rect(Math.floor(y0*n+y0/3),Math.floor(x0*n+x0/3),Math.floor(y1*n+y1/3)-Math.floor(y0*n+y0/3),Math.floor(x1*n+x1/3)-Math.floor(x0*n+x0/3));
  }
};
var draw_cell=function(x,y){
  if(h>w){
    rect8(centerx+3*(x-focusx)*zoom,centery+3*(y-focusy)*zoom,centerx+3*((x+1)-focusx)*zoom,centery+3*((y+1)-focusy)*zoom);
  }else{
    rect8(centery+3*(y-focusy)*zoom,centerx+3*(x-focusx)*zoom,centery+3*((y+1)-focusy)*zoom,centerx+3*((x+1)-focusx)*zoom);
  }
};
var draw_cells=function(){
  if(bkgd===0){//Defined in patevolve.js
    fill(0,255,0);
  }else{
    fill(0);
  }
  noStroke();
  for(var i=0;i<cells.length;i++){//Defined in patevolve.js
    var cell=cells[i];//Defined in patevolve.js
    draw_cell(cell[0],cell[1]);
  }
};
var get3n=function(x){
  return 3*Math.floor(x/(3*n+1));
};
var drawmousestuffpart1=function(){
  bottomtext="";
  var nx=3*mouseX/(3*n+1);
  var ny=3*mouseY/(3*n+1);
  if(h<=w){
    nx=[ny,ny=nx][0];//How to swap in a single line, without any temporary variables
  }
  if(nx<0||ny<45||mouseX>w||mouseY>h){
    return;
  }
  if(nx<18&&ny<63){
  }else if(h>w&&nx>=wn-6&&ny<57){
  }else if(h<=w&&nx<12&&ny>=wn-6){
  }else if(h>w&&ny>=hn-6&&nx>=wn-24){
  }else if(h<=w&&ny>=wn-24&&nx>=hn-6){
  }else{
    if(h<=w){
      nx=[ny,ny=nx][0];//How to swap in a single line, without any temporary variables
    }
    nx-=centerx;
    ny-=centery;
    //Coordinates converted to the 3n+1 scale don't need to be converted again, just snapped to the grid.
    var cx=Math.floor(nx/(3*zoom))+focusx;
    var cy=Math.floor(ny/(3*zoom))+focusy;
    fill(0,127,0);
    draw_cell(cx,cy);
    bottomtext="Cell selected: "+cx+","+cy;
    if(clicked){
      togglecell(cx,cy);//Defined in patevolve.js
    }
  }
};
var drawmousestuffpart2=function(){
  var nx=get3n(mouseX);
  var ny=get3n(mouseY);
  fill(0,127,0);
  if(h<=w){
    nx=[ny,ny=nx][0];//How to swap in a single line, without any temporary variables
  }
  if(nx<0||ny<0||mouseX>w||mouseY>h){//These positions are blank
    return;
  }
  if(ny===18&&nx>=39&&nx!==81){//These positions are blank
    return;
  }
  if((ny%18===6&&ny<39)&&(nx<12||nx===15||nx===24||nx===45)){//These positions are blank
    return;
  }
  if((ny%18===12&&ny<39)&&nx===45){//These positions are blank
    return;
  }
  if((ny%18===0&&ny<39)&&(nx===24||nx===33)){//These positions are blank
    return;
  }
  if(ny<39&&nx>=6&&nx<84&&ny>=6){//Mouse is over transition selection panel, and not near the edges where there aren't any buttons
    fill(0,255,0);
    noStroke();
    textAlign(CENTER,CENTER);
    textSize(n*2.4);
    if(ny%6===3&&nx<78){//Every other row/column here is blank
      return;
    }
    if(h>w){
      if(nx===78){//This column is blank
        return;
      }
      if(nx===81){
        if(ny<18||ny===21||ny===30){//These positions are blank
          return;
        }else{//<>+- buttons
          var buttontext;
          if(ny===18){
            buttontext="G0";
            if(clicked){
              toggleg0();
            }
          }else if(ny===24){
            buttontext="<";
            if(clicked){
              ruleindex+=transitionslist.length-1;
              ruleindex=ruleindex%transitionslist.length;
            }
          }else if(ny===27){
            buttontext=">";
            if(clicked){
              ruleindex+=1;
              ruleindex=ruleindex%transitionslist.length;
            }
          }else if(ny===33){
            buttontext="+";
            if(clicked){
              transitionslist.splice(ruleindex,0,copy1(transitionslist[ruleindex]));
              ruleindex+=1;
            }
          }else if(ny===36){
            buttontext="-";
            if(clicked&&transitionslist.length>1){
              transitionslist.splice(ruleindex,1);
              if(ruleindex===transitionslist.length){
                ruleindex-=1;
              }
            }
          }
          fill(0,127,0);
          rect3(nx,ny,nx+3,ny+3);
          fill(0,255,0);
          noStroke();
          text1(buttontext,nx+1.5,ny+1.5);
        }
      }
      if(ny===36&&nx>=39&&nx<78){//These positions are blank
        return;
      }
    }else if(h<=w){
      if(nx>=78&&ny<36){//These positions are blank
        return;
      }
      if(ny===36){
        if((nx>=39&&nx<63)||nx===66||nx===75){//These positions are blank
          return;
        }else if(nx>=63){//<>+- buttons
          var buttontext;
          if(nx===63){
            buttontext="G0";
            if(clicked){
              toggleg0();
            }
          }else if(nx===69){
            buttontext="<";
            if(clicked){
              ruleindex+=transitionslist.length-1;
              ruleindex=ruleindex%transitionslist.length;
            }
          }else if(nx===72){
            buttontext=">";
            if(clicked){
              ruleindex+=1;
              ruleindex=ruleindex%transitionslist.length;
            }
          }else if(nx===78){
            buttontext="+";
            if(clicked){
              transitionslist.splice(ruleindex,0,copy1(transitionslist[ruleindex]));
              ruleindex+=1;
            }
          }else if(nx===81){
            buttontext="-";
            if(clicked&&transitionslist.length>1){
              transitionslist.splice(ruleindex,1);
              if(ruleindex===transitionslist.length){
                ruleindex-=1;
              }
            }
          }
          fill(0,127,0);
          rect3(nx,ny,nx+3,ny+3);
          fill(0,255,0);
          noStroke();
          text1(buttontext,nx+1.5,ny+1.5);
        }
      }
    }
    if(ny===6){//B0123
      if(nx===12){//B0
        drawselectedtransition([[0,0,0],[0,0,0],[0,0,0]],"0","B",nx,ny);
      }else if(nx>=18&&nx<24){//B1
        if(nx===18){//B1c
          drawselectedtransition([[1,0,0],[0,0,0],[0,0,0]],"1c","B",nx,ny);
        }else{//B1e
          drawselectedtransition([[0,1,0],[0,0,0],[0,0,0]],"1e","B",nx,ny);
        }
      }else if(nx>=27&&nx<45){//B2
        if(nx===27){//B2a
          drawselectedtransition([[1,1,0],[0,0,0],[0,0,0]],"2a","B",nx,ny);
        }else if(nx===30){//B2c
          drawselectedtransition([[1,0,1],[0,0,0],[0,0,0]],"2c","B",nx,ny);
        }else if(nx===33){//B2e
          drawselectedtransition([[0,1,0],[1,0,0],[0,0,0]],"2e","B",nx,ny);
        }else if(nx===36){//B2i
          drawselectedtransition([[0,1,0],[0,0,0],[0,1,0]],"2i","B",nx,ny);
        }else if(nx===39){//B2k
          drawselectedtransition([[0,1,0],[0,0,0],[0,0,1]],"2k","B",nx,ny);
        }else{//B2n
          drawselectedtransition([[1,0,0],[0,0,0],[0,0,1]],"2n","B",nx,ny);
        }
      }else{//B3
        if(nx===48){//B3a
          drawselectedtransition([[1,1,0],[1,0,0],[0,0,0]],"3a","B",nx,ny);
        }else if(nx===51){//B3c
          drawselectedtransition([[1,0,1],[0,0,0],[0,0,1]],"3c","B",nx,ny);
        }else if(nx===54){//B3e
          drawselectedtransition([[0,1,0],[1,0,1],[0,0,0]],"3e","B",nx,ny);
        }else if(nx===57){//B3i
          drawselectedtransition([[1,0,0],[1,0,0],[1,0,0]],"3i","B",nx,ny);
        }else if(nx===60){//B3j
          drawselectedtransition([[0,0,1],[0,0,1],[0,1,0]],"3j","B",nx,ny);
        }else if(nx===63){//B3k
          drawselectedtransition([[0,1,0],[1,0,0],[0,0,1]],"3k","B",nx,ny);
        }else if(nx===66){//B3n
          drawselectedtransition([[1,0,1],[1,0,0],[0,0,0]],"3n","B",nx,ny);
        }else if(nx===69){//B3q
          drawselectedtransition([[1,0,0],[1,0,0],[0,0,1]],"3q","B",nx,ny);
        }else if(nx===72){//B3r
          drawselectedtransition([[0,1,1],[0,0,0],[0,1,0]],"3r","B",nx,ny);
        }else{//B3y
          drawselectedtransition([[1,0,1],[0,0,0],[0,1,0]],"3y","B",nx,ny);
        }
      }
    }else if(ny===12){//B45
      if(nx>=6&&nx<45){//B4
        if(nx===6){//B4a
          drawselectedtransition([[1,0,0],[1,0,0],[1,1,0]],"4a","B",nx,ny);
        }else if(nx===9){//B4c
          drawselectedtransition([[1,0,1],[0,0,0],[1,0,1]],"4c","B",nx,ny);
        }else if(nx===12){//B4e
          drawselectedtransition([[0,1,0],[1,0,1],[0,1,0]],"4e","B",nx,ny);
        }else if(nx===15){//B4i
          drawselectedtransition([[1,0,1],[1,0,1],[0,0,0]],"4i","B",nx,ny);
        }else if(nx===18){//B4j
          drawselectedtransition([[0,0,1],[1,0,1],[0,1,0]],"4j","B",nx,ny);
        }else if(nx===21){//B4k
          drawselectedtransition([[0,1,1],[1,0,0],[0,0,1]],"4k","B",nx,ny);
        }else if(nx===24){//B4n
          drawselectedtransition([[1,0,0],[1,0,0],[1,0,1]],"4n","B",nx,ny);
        }else if(nx===27){//B4q
          drawselectedtransition([[1,1,0],[1,0,0],[0,0,1]],"4q","B",nx,ny);
        }else if(nx===30){//B4r
          drawselectedtransition([[0,1,1],[0,0,1],[0,1,0]],"4r","B",nx,ny);
        }else if(nx===33){//B4t
          drawselectedtransition([[1,1,1],[0,0,0],[0,1,0]],"4t","B",nx,ny);
        }else if(nx===36){//B4w
          drawselectedtransition([[1,0,0],[1,0,0],[0,1,1]],"4w","B",nx,ny);
        }else if(nx===39){//B4y
          drawselectedtransition([[1,0,1],[0,0,0],[0,1,1]],"4y","B",nx,ny);
        }else{//B4z
          drawselectedtransition([[1,1,0],[0,0,0],[0,1,1]],"4z","B",nx,ny);
        }
      }else{//B5
        if(nx===48){//B5a
          drawselectedtransition([[0,0,1],[0,0,1],[1,1,1]],"5a","B",nx,ny);
        }else if(nx===51){//B5c
          drawselectedtransition([[0,1,0],[1,0,1],[1,1,0]],"5c","B",nx,ny);
        }else if(nx===54){//B5e
          drawselectedtransition([[1,0,1],[0,0,0],[1,1,1]],"5e","B",nx,ny);
        }else if(nx===57){//B5i
          drawselectedtransition([[0,1,1],[0,0,1],[0,1,1]],"5i","B",nx,ny);
        }else if(nx===60){//B5j
          drawselectedtransition([[1,1,0],[1,0,0],[1,0,1]],"5j","B",nx,ny);
        }else if(nx===63){//B5k
          drawselectedtransition([[1,0,1],[0,0,1],[1,1,0]],"5k","B",nx,ny);
        }else if(nx===66){//B5n
          drawselectedtransition([[0,1,0],[0,0,1],[1,1,1]],"5n","B",nx,ny);
        }else if(nx===69){//B5q
          drawselectedtransition([[0,1,1],[0,0,1],[1,1,0]],"5q","B",nx,ny);
        }else if(nx===72){//B5r
          drawselectedtransition([[1,0,0],[1,0,1],[1,0,1]],"5r","B",nx,ny);
        }else{//B5y
          drawselectedtransition([[0,1,0],[1,0,1],[1,0,1]],"5y","B",nx,ny);
        }
      }
    }else if(ny===18){//B678
      if(nx>=6&&nx<24){//B6
        if(nx===6){//B6a
          drawselectedtransition([[0,0,1],[1,0,1],[1,1,1]],"6a","B",nx,ny);
        }else if(nx===9){//B6c
          drawselectedtransition([[0,1,0],[1,0,1],[1,1,1]],"6c","B",nx,ny);
        }else if(nx===12){//B6e
          drawselectedtransition([[1,0,1],[0,0,1],[1,1,1]],"6e","B",nx,ny);
        }else if(nx===15){//B6i
          drawselectedtransition([[1,0,1],[1,0,1],[1,0,1]],"6i","B",nx,ny);
        }else if(nx===18){//B6k
          drawselectedtransition([[1,0,1],[1,0,1],[1,1,0]],"6k","B",nx,ny);
        }else{//B6n
          drawselectedtransition([[0,1,1],[1,0,1],[1,1,0]],"6n","B",nx,ny);
        }
      }else if(nx>=27&&nx<33){//B7
        if(nx===27){//B7c
          drawselectedtransition([[0,1,1],[1,0,1],[1,1,1]],"7c","B",nx,ny);
        }else{//B7e
          drawselectedtransition([[1,0,1],[1,0,1],[1,1,1]],"7e","B",nx,ny);
        }
      }else if(nx===36){//B8
        drawselectedtransition([[1,1,1],[1,0,1],[1,1,1]],"8","B",nx,ny);
      }
    }else if(ny===24){//S0123
      if(nx===12){//S0
        drawselectedtransition([[0,0,0],[0,1,0],[0,0,0]],"0","S",nx,ny);
      }else if(nx>=18&&nx<24){//S1
        if(nx===18){//S1c
          drawselectedtransition([[1,0,0],[0,1,0],[0,0,0]],"1c","S",nx,ny);
        }else{//S1e
          drawselectedtransition([[0,1,0],[0,1,0],[0,0,0]],"1e","S",nx,ny);
        }
      }else if(nx>=27&&nx<45){//S2
        if(nx===27){//S2a
          drawselectedtransition([[1,1,0],[0,1,0],[0,0,0]],"2a","S",nx,ny);
        }else if(nx===30){//S2c
          drawselectedtransition([[1,0,1],[0,1,0],[0,0,0]],"2c","S",nx,ny);
        }else if(nx===33){//S2e
          drawselectedtransition([[0,1,0],[1,1,0],[0,0,0]],"2e","S",nx,ny);
        }else if(nx===36){//S2i
          drawselectedtransition([[0,1,0],[0,1,0],[0,1,0]],"2i","S",nx,ny);
        }else if(nx===39){//S2k
          drawselectedtransition([[0,1,0],[0,1,0],[0,0,1]],"2k","S",nx,ny);
        }else{//S2n
          drawselectedtransition([[1,0,0],[0,1,0],[0,0,1]],"2n","S",nx,ny);
        }
      }else{//S3
        if(nx===48){//S3a
          drawselectedtransition([[1,1,0],[1,1,0],[0,0,0]],"3a","S",nx,ny);
        }else if(nx===51){//S3c
          drawselectedtransition([[1,0,1],[0,1,0],[0,0,1]],"3c","S",nx,ny);
        }else if(nx===54){//S3e
          drawselectedtransition([[0,1,0],[1,1,1],[0,0,0]],"3e","S",nx,ny);
        }else if(nx===57){//S3i
          drawselectedtransition([[1,0,0],[1,1,0],[1,0,0]],"3i","S",nx,ny);
        }else if(nx===60){//S3j
          drawselectedtransition([[0,0,1],[0,1,1],[0,1,0]],"3j","S",nx,ny);
        }else if(nx===63){//S3k
          drawselectedtransition([[0,1,0],[1,1,0],[0,0,1]],"3k","S",nx,ny);
        }else if(nx===66){//S3n
          drawselectedtransition([[1,0,1],[1,1,0],[0,0,0]],"3n","S",nx,ny);
        }else if(nx===69){//S3q
          drawselectedtransition([[1,0,0],[1,1,0],[0,0,1]],"3q","S",nx,ny);
        }else if(nx===72){//S3r
          drawselectedtransition([[0,1,1],[0,1,0],[0,1,0]],"3r","S",nx,ny);
        }else if(nx===75){//S3y
          drawselectedtransition([[1,0,1],[0,1,0],[0,1,0]],"3y","S",nx,ny);
        }
      }
    }else if(ny===30){//S45
      if(nx>=6&&nx<45){//S4
        if(nx===6){//S4a
          drawselectedtransition([[1,0,0],[1,1,0],[1,1,0]],"4a","S",nx,ny);
        }else if(nx===9){//S4c
          drawselectedtransition([[1,0,1],[0,1,0],[1,0,1]],"4c","S",nx,ny);
        }else if(nx===12){//S4e
          drawselectedtransition([[0,1,0],[1,1,1],[0,1,0]],"4e","S",nx,ny);
        }else if(nx===15){//S4i
          drawselectedtransition([[1,0,1],[1,1,1],[0,0,0]],"4i","S",nx,ny);
        }else if(nx===18){//S4j
          drawselectedtransition([[0,0,1],[1,1,1],[0,1,0]],"4j","S",nx,ny);
        }else if(nx===21){//S4k
          drawselectedtransition([[0,1,1],[1,1,0],[0,0,1]],"4k","S",nx,ny);
        }else if(nx===24){//S4n
          drawselectedtransition([[1,0,0],[1,1,0],[1,0,1]],"4n","S",nx,ny);
        }else if(nx===27){//S4q
          drawselectedtransition([[1,1,0],[1,1,0],[0,0,1]],"4q","S",nx,ny);
        }else if(nx===30){//S4r
          drawselectedtransition([[0,1,1],[0,1,1],[0,1,0]],"4r","S",nx,ny);
        }else if(nx===33){//S4t
          drawselectedtransition([[1,1,1],[0,1,0],[0,1,0]],"4t","S",nx,ny);
        }else if(nx===36){//S4w
          drawselectedtransition([[1,0,0],[1,1,0],[0,1,1]],"4w","S",nx,ny);
        }else if(nx===39){//S4y
          drawselectedtransition([[1,0,1],[0,1,0],[0,1,1]],"4y","S",nx,ny);
        }else{//S4z
          drawselectedtransition([[1,1,0],[0,1,0],[0,1,1]],"4z","S",nx,ny);
        }
      }else{//S5
        if(nx===48){//S5a
          drawselectedtransition([[0,0,1],[0,1,1],[1,1,1]],"5a","S",nx,ny);
        }else if(nx===51){//S5c
          drawselectedtransition([[0,1,0],[1,1,1],[1,1,0]],"5c","S",nx,ny);
        }else if(nx===54){//S5e
          drawselectedtransition([[1,0,1],[0,1,0],[1,1,1]],"5e","S",nx,ny);
        }else if(nx===57){//S5i
          drawselectedtransition([[0,1,1],[0,1,1],[0,1,1]],"5i","S",nx,ny);
        }else if(nx===60){//S5j
          drawselectedtransition([[1,1,0],[1,1,0],[1,0,1]],"5j","S",nx,ny);
        }else if(nx===63){//S5k
          drawselectedtransition([[1,0,1],[0,1,1],[1,1,0]],"5k","S",nx,ny);
        }else if(nx===66){//S5n
          drawselectedtransition([[0,1,0],[0,1,1],[1,1,1]],"5n","S",nx,ny);
        }else if(nx===69){//S5q
          drawselectedtransition([[0,1,1],[0,1,1],[1,1,0]],"5q","S",nx,ny);
        }else if(nx===72){//S5r
          drawselectedtransition([[1,0,0],[1,1,1],[1,0,1]],"5r","S",nx,ny);
        }else{//S5y
          drawselectedtransition([[0,1,0],[1,1,1],[1,0,1]],"5y","S",nx,ny);
        }
      }
    }else{//S678
      if(nx>=6&&nx<24){//S6
        if(nx===6){//S6a
          drawselectedtransition([[0,0,1],[1,1,1],[1,1,1]],"6a","S",nx,ny);
        }else if(nx===9){//S6c
          drawselectedtransition([[0,1,0],[1,1,1],[1,1,1]],"6c","S",nx,ny);
        }else if(nx===12){//S6e
          drawselectedtransition([[1,0,1],[0,1,1],[1,1,1]],"6e","S",nx,ny);
        }else if(nx===15){//S6i
          drawselectedtransition([[1,0,1],[1,1,1],[1,0,1]],"6i","S",nx,ny);
        }else if(nx===18){//S6k
          drawselectedtransition([[1,0,1],[1,1,1],[1,1,0]],"6k","S",nx,ny);
        }else{//S6n
          drawselectedtransition([[0,1,1],[1,1,1],[1,1,0]],"6n","S",nx,ny);
        }
      }else if(nx>=27&&nx<33){//S7
        if(nx===27){//S7c
          drawselectedtransition([[0,1,1],[1,1,1],[1,1,1]],"7c","S",nx,ny);
        }else{//S7e
          drawselectedtransition([[1,0,1],[1,1,1],[1,1,1]],"7e","S",nx,ny);
        }
      }else if(nx===36){//S8
        drawselectedtransition([[1,1,1],[1,1,1],[1,1,1]],"8","S",nx,ny);
      }
    }
    //rect3(nx,ny,nx+3,ny+3);
  }else{//Mouse is over playback gui
    fill(0,127,0);
    if(nx<18&&ny<63&&ny>=45){//Mouse is over panning buttons
      nx=6*Math.floor(nx/6);
      ny-=3;
      ny=6*Math.floor(ny/6);
      ny+=3;
      if((nx+ny-3)%12===0){
        rect3(nx,ny,nx+6,ny+6);
        noStroke();
        fill(0,255,0);
        textSize(n*4.5);
        textAlign(CENTER,CENTER);
        var buttontext;
        if(h>w){
          if(nx===0){
            buttontext="<";
            if(clicked){
              focusx-=1/zoom;
            }
          }else if(nx===12){
            buttontext=">";
            if(clicked){
              focusx+=1/zoom;
            }
          }else if(ny===45){
            buttontext="^";
            if(clicked){
              focusy-=1/zoom;
            }
          }else if(ny===57){
            buttontext="V";
            if(clicked){
              focusy+=1/zoom;
            }
          }
        }else{
          if(nx===0){
            buttontext="^";
            if(clicked){
              focusy-=1/zoom;
            }
          }else if(nx===12){
            buttontext="V";
            if(clicked){
              focusy+=1/zoom;
            }
          }else if(ny===45){
            buttontext="<";
            if(clicked){
              focusx-=1/zoom;
            }
          }else if(ny===57){
            buttontext=">";
            if(clicked){
              focusx+=1/zoom;
            }
          }
        }
        text1(buttontext,nx+3,ny+3);
      }
    }else if(h>w&&nx>=wn-6&&ny<57&&ny>=45){//Mouse is over zooming buttons
      nx=84;
      ny-=3;
      ny=6*Math.floor(ny/6);
      ny+=3;
      rect3(nx,ny,nx+6,ny+6);
      noStroke();
      fill(0,255,0);
      textSize(n*4.5);
      textAlign(CENTER,CENTER);
      var buttontext;
      if(ny<51){
        buttontext="+";
        if(clicked){
          zoom*=2;
        }
      }else{
        buttontext="-";
        if(clicked){
          zoom/=2;
        }
      }
      text1(buttontext,nx+3,ny+3);
    }else if(h<=w&&nx<12&&ny>=wn-6){
      nx=6*Math.floor(nx/6);
      ny=wn-6;
      rect3(nx,ny,nx+6,ny+6);
      noStroke();
      fill(0,255,0);
      textSize(n*4.5);
      textAlign(CENTER,CENTER);
      var buttontext;
      if(nx<6){
        buttontext="+";
        if(clicked){
          zoom*=2;
        }
      }else{
        buttontext="-";
        if(clicked){
          zoom/=2;
        }
      }
      text1(buttontext,nx+3,ny+3);
    }else if(h>w&&ny>=hn-6&&nx>=wn-24){//Mouse is over play/pause/rewind/reset buttons
      nx=wn-nx+3;
      nx=6*Math.floor(nx/6);
      nx=wn-nx;
      ny=hn-6;
      rect3(nx,ny,nx+6,ny+6);
      noStroke();
      fill(0,255,0);
      textSize(n*4.5);
      textAlign(CENTER,CENTER);
      var buttontext;
      if(nx===84){
        if(paused){
          buttontext=">";
        }else{
          buttontext="||";
        }
        if(clicked){
          paused=!paused;
        }
      }else if(nx===78){
        buttontext="|>";
        if(clicked){
          paused=true;
          cells=evolve(cells);//Defined in patevolve.js
        }
      }else if(nx===72){
        buttontext="<|";
        if(clicked&&generations>0){
          paused=true;
          var past=rewind();//Defined in patevolve.js
          bkgd=past[0];//Defined in patevolve.js
          cells=past[1];//Defined in patevolve.js
        }
      }else if(nx===66){
        buttontext="|<";
        if(clicked&&generations>0){
          paused=true;
          var past=reset();//Defined in patevolve.js
          bkgd=past[0];//Defined in patevolve.js
          cells=past[1];//Defined in patevolve.js
        }
      }
      text1(buttontext,nx+3,ny+3);
    }else if(h<=w&&ny>=wn-24&&nx>=hn-6){
      nx=hn-6;
      ny=wn-ny+3;
      ny=6*Math.floor(ny/6);
      ny=wn-ny;
      rect3(nx,ny,nx+6,ny+6);
      noStroke();
      fill(0,255,0);
      textSize(n*4.5);
      textAlign(CENTER,CENTER);
      var buttontext;
      if(ny===wn-6){
        if(paused){
          buttontext=">";
        }else{
          buttontext="||";
        }
        if(clicked){
          paused=!paused;
        }
      }else if(ny===wn-12){
        buttontext="|>";
        if(clicked){
          paused=true;
          cells=evolve(cells);//Defined in patevolve.js
        }
      }else if(ny===wn-18){
        buttontext="<|";
        if(clicked&&generations>0){
          paused=true;
          var past=rewind();//Defined in patevolve.js
          bkgd=past[0];//Defined in patevolve.js
          cells=past[1];//Defined in patevolve.js
        }
      }else if(ny===wn-24){
        buttontext="|<";
        if(clicked&&generations>0){
          paused=true;
          var past=reset();//Defined in patevolve.js
          bkgd=past[0];//Defined in patevolve.js
          cells=past[1];//Defined in patevolve.js
        }
      }
      text1(buttontext,nx+3,ny+3);
    }
  }
};
function draw(){
  if(bkgd===0){//Defined in patevolve.js
    background(0);
  }else{
    background(0,255,0);
  }
  clicked=pmouseIsPressed&&!mouseIsPressed;
  draw_cells();
  drawmousestuffpart1();
  bottomtext+="\n";
  if(zoom>=1){
    bottomtext+="Zoom: "+zoom+"|Focus: "+focusx+","+focusy;
  }else{
    bottomtext+="Zoom: 1/"+1/zoom+"|Focus: "+focusx+","+focusy;
  }
  stroke(0,255,0);
  drawrulepicker();
  drawplaybackgui();
  drawmousestuffpart2();
  noStroke();
  if(!paused){
    cells=evolve(cells);//Defined in patevolve.js
  }
  pmouseIsPressed=mouseIsPressed;
}