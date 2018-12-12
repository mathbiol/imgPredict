flearn=function(){}

var c = document.getElementById("canvasbase");
var ctx = c.getContext("2d");
var div1 = document.getElementById("div1");
var div2 = document.getElementById("div2");
var div3 = document.getElementById("div3");
var globali = 2;
var global_list = [];

//creating the canvases and adding them over
var upcanvas = document.createElement("canvas");
var id = "canvastop";
upcanvas.id = id;
upcanvas.width = 500;
upcanvas.height = 500;
upcanvas.style.position = "absolute";
upcanvas.style.top = 0;
upcanvas.style.left = 0;
upcanvas.style.zIndex = 2;
upcanvas.addEventListener('click', pick);
div2.append(upcanvas);
var ctxupcanvas = upcanvas.getContext("2d");

main();

function main()
{
    var inputFileToLoad = document.createElement("input");
    inputFileToLoad.type = "file";
    inputFileToLoad.id = "inputFileToLoad";
    inputFileToLoad.onchange = loadImageFileAsURL;
    div1.appendChild(inputFileToLoad);
}

function isNumeric(evt)
{
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 8 && charCode != 46 && charCode > 3  && (charCode < 48 || charCode > 57))
    {
    alert('Enter only numbers');
    return false;
    }
    return true;
}
  
function loadImageFileAsURL()
{
    var filesSelected = document.getElementById("inputFileToLoad").files;
    if (filesSelected.length > 0)
    {
        var fileToLoad = filesSelected[0];
        if (fileToLoad.type.match("image.*"))
        {
            var fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent) 
            {
                  var img = new Image();    
                  img.onload = function() {
                  // scaling the image to the canvas width and height                  
                  ctx.drawImage(img, 0, 0, img.width,img.height,      // source rectangle
                                0, 0, c.width, c.height);  // destination rectangle
                  img.style.display = 'none';
                  // harvesting all the pixels of the image
                  getPixels();
                  addDistTextBox();
                }
                img.src = fileLoadedEvent.target.result;
            }
            fileReader.readAsDataURL(fileToLoad);
        }   
        c.addEventListener('click', pick);
    }
}

function getPixels(){
    //flearn.global_canvas_info =[];
    //flearn.global_checkbox_info = [];
    flearn.imgstack=[]
        for(i = 0; i < c.height; i++){
            flearn.imgstack[i] = [];
            for(j = 0; j < c.width; j++){
                flearn.imgstack[i][j]=ctx.getImageData(i, j, 1, 1).data.slice(0,3)
            }
        }
}
  
function addDistTextBox(){
    var divTemp = document.createElement("divTemp");
    divTemp.style.marginLeft = "85px";
    divTemp.appendChild(document.createTextNode('Distance'));
    div1.appendChild(divTemp);

    var distRangeBar = document.createElement("INPUT");
    distRangeBar.setAttribute("type", "range");
    distRangeBar.setAttribute("min", 0);
    distRangeBar.setAttribute("max", 400);
    distRangeBar.setAttribute("step", 10);
    distRangeBar.setAttribute("value", 50);
    distRangeBar.setAttribute("id", "distValue")
    distRangeBar.style.marginLeft = "10px";
    distRangeBar.style.marginTop = "10px";
    div1.appendChild(distRangeBar);

    var distVal = document.createElement("distval");
    distVal.style.marginLeft = "10px";
    div1.appendChild(distVal);
    distVal.innerHTML = distRangeBar.value;
    distRangeBar.oninput = function() { distVal.innerHTML = this.value; }
}

//event on checkbox check and unchcek
function checkboxEvent(){
    if(this.checked){
      //flearn.global_checkbox_info[this.id] = true;
      //var canvasid = flearn.global_canvas_info[this.id];
      //var canvas = document.getElementById(canvasid);
      //canvas.hidden = false;
      global_list.push(this.value);
      eucledianDistance(ctxupcanvas);     
    }else{
      //flearn.global_checkbox_info[this.id] = false;
      //var canvasid = flearn.global_canvas_info[this.id];
      //var canvas = document.getElementById(canvasid);
      //canvas.hidden = true;
      var i = global_list.indexOf(this.value);
      if(i != -1){
        global_list.splice(i, 1);
      }
      eucledianDistance(ctxupcanvas);
    }
}

function pick(event) {
    var x = event.layerX;
    var y = event.layerY;
    var pixel = ctx.getImageData(x, y, 1, 1);
    var data = pixel.data;
    var rgb_of_clicked_pt = pixel.data.slice(0,3);
    var copy_gloabal_i = globali++;
    global_list.push(rgb_of_clicked_pt.toString());


    var name = x + ', ' + y + ', ' + data[0] + ', '+data[1] + ', '+data[2];
    //flearn.global_canvas_info[name] = id
    //flearn.global_checkbox_info[name] = true;

    //creating the checkboxes in div3
    var radioInput = document.createElement('input');
    var value = rgb_of_clicked_pt;
    var radioLabel = document.createTextNode(name);
    radioInput.id = name;
    radioInput.setAttribute('type', 'checkbox');
    radioInput.style.marginRight = "20px";
    radioInput.checked = true;
    radioInput.setAttribute('value',value);
    radioInput.addEventListener('change',checkboxEvent);
    div3.appendChild(radioLabel);
    div3.appendChild(radioInput);

    eucledianDistance(ctxupcanvas);

    var rgba = 'rgba(' + data[0] + ', ' + data[1] +
                ', ' + data[2] + ', ' + (data[3] / 255) + ')';
    var color = document.getElementById("color");
    color.style.background =  rgba;
    color.textContent = rgba;
}

function eucledianDistance(ctxupcanvas){
    var count = 0;
    ctxupcanvas.clearRect(0, 0, upcanvas.width, upcanvas.height);
    var reqd_rga = [];
    var segMask = flearn.imgstack.map(dd => {
        return dd.map(d=>{
            return false;
        });
    });
    var constDist = document.getElementById("distValue").value;
    for(var i = 0; i < global_list.length; i++){
        segMask = calculateMatrix(global_list[i], segMask, constDist, flearn.imgstack, count);
    }

    var n = flearn.imgstack.length
    var m = flearn.imgstack[0].length
    segNeig = [...Array(n)].map(_=>{
        return [...Array(m)].map(_=>[0])
    })
    var dd=segMask
    for(var i=1;i<(n-1);i++){
        for(var j=1;j<(m-1);j++){
            segNeig[i][j]=[dd[i-1][j-1],dd[i-1][j],dd[i-1][j+1],dd[i][j-1],dd[i][j],dd[i][j+1],dd[i+1][j-1],dd[i+1][j],dd[i+1][j+1]]
        }
    }

    segEdge = segNeig.map(dd=>{
        return dd.map(d=>{
            var s=d.reduce((a,b)=>a+b)
            return (s>3 & s<9)
        })
    })
    var c = 0;
    for(var i = 0; i < segEdge.length; i++){
        for(var j = 0; j < segEdge[i].length; j++){
            if(segEdge[i][j] == true){
                c++;
            }
        }
    }
    console.log("C: " + c);

    transpire(ctxupcanvas,segEdge, segMask)
}

function calculateMatrix(point, segMask, constDist, matrix, count){
    var point_arr = point.split(',').map(x => parseInt(x));
    for(var i = 0; i < segMask.length; i++){
        for(var j = 0; j < segMask[i].length; j++){
            var d = matrix[i][j];
            if(segMask[i][j] == false){
                var dist = Math.sqrt( Math.pow((point_arr[0] - d[0]), 2) + 
                                    Math.pow((point_arr[1] - d[1]), 2) +  
                                    Math.pow((point_arr[2] - d[2]), 2));
                segMask[i][j] = dist < constDist;
                if(segMask[i][j] == true){
                    count++;
                }
            }else{
                count++;
            }
        }
    }
    console.log("count is" + count);
    return segMask;
}

transpire=function(ct, segEgde, segMask){
    var tp = Math.round(2.55*parseInt(51)) // range value
    var clrEdge = [255,255,0,255] // yellow
    var clrMask = [255,255,255,0]
    imwrite(ct, segEdge.map((dd,i)=>{
        return dd.map((d,j)=>{
            var c =[0,0,0,0]
            if(d){
                c=clrEdge 
            }else if(!segMask[i][j]){
                c=clrMask
            }
            return c
        })
    }))
}

imwrite=function(ct,im,dx,dy){
    if(!im.data){im=data2imData(im)}
    ct.putImageData(im,dx,dy);
    return ct;
}

data2imData=function(data){ // the reverse of im2data, data is a matlabish set of 4 2d matrices, with the r, g, b and alpha values
    var n=data.length, m=data[0].length;
    var imData = document.createElement('canvas').getContext('2d').createImageData(m,n);
    for (var i=0;i<n;i++){ //row
        for (var j=0;j<m;j++){ // column
            ij=(j*m+i)*4;
            imData.data[ij]=data[i][j][0];
            imData.data[ij+1]=data[i][j][1];
            imData.data[ij+2]=data[i][j][2];
            imData.data[ij+3]=data[i][j][3];
        }
    }
    return imData;
}
