/*<![CDATA[*/

function SpanGradient(){
 var spans=document.getElementsByTagName('SPAN');
 for (var txt,s,ss,c,z0=0;z0<spans.length;z0++){
  if (spans[z0].className){
   s=spans[z0].className.split('#');
   if (s[0]=='gradient'){
    txt=spans[z0].innerHTML.split('');
    c=zxcGradient(s[1],s[2],txt.length)
    spans[z0].innerHTML='';
    for (var z0a=0;z0a<txt.length;z0a++){
     ss=document.createElement('SPAN');
     ss.appendChild(document.createTextNode(txt[z0a]));
     ss.style.color='rgb('+c[z0a][0]+','+c[z0a][1]+','+c[z0a][2]+')';
     spans[z0].appendChild(ss);
    }
   }
  }
 }
}

function zxcGradient(srt,fin,nu){
 var scol=zxcHexRGB(srt);
 var fcol=zxcHexRGB(fin);
 var ary=[[scol[0],fcol[0]],[scol[1],fcol[1]],[scol[2],fcol[2]]]
 var rgbinc=[(ary[0][1]-ary[0][0])/nu,(ary[1][1]-ary[1][0])/nu,(ary[2][1]-ary[2][0])/nu];
 for (var rgb=[],z0=0;z0<nu;z0++){
  rgb[z0]=[];
  for (var z0a=0;z0a<3;z0a++)
   rgb[z0][z0a]=Math.max(Math.round(ary[z0a][0]+rgbinc[z0a]*z0),0);
 }
 return rgb;
}

function zxcHexRGB(hex){
 hex=hex.replace('#','');
 return [parseInt(hex.substring(0,2),16),parseInt(hex.substring(2,4),16),parseInt(hex.substring(4,6),16)];
}

SpanGradient();

/*]]>*/