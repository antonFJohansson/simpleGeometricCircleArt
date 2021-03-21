var canvasArt = document.getElementById("artCircleCanvas");
var ctxArt = canvasArt.getContext("2d");




canvasArt.width = canvasArt.clientWidth;
canvasArt.height = canvasArt.clientHeight;


function particle(x, y, vx, vy, currCircleRad, drawCol, vspeed) {
    this.x = x;
    this.y = y;
    this.vx = vspeed*vx;
    this.vy = vspeed*vy;
    this.currCircleRad = currCircleRad;
    
    this.drawCol = drawCol;
    this.vspeed = vspeed;

    this.currX = x;
    this.currY = y;


    var self = this;
    //console.log(this.x)

    var newX, newY;
    var partialStep;
    var rotVec;
    var oldHitPts = [[x, y]];


    this.drawStep = function() {

        ctxArt.strokeStyle = self.drawCol;
        for (var i=0; i<(oldHitPts.length - 1); i++) {
            //ctxArt.strokeStyle = '#ff0000';
            ctxArt.beginPath();
            ctxArt.moveTo(oldHitPts[i][0], oldHitPts[i][1]);
            ctxArt.lineTo(oldHitPts[i + 1][0], oldHitPts[i + 1][1]);
            ctxArt.stroke();
        }

        ctxArt.beginPath();
        ctxArt.moveTo(oldHitPts[oldHitPts.length - 1][0], oldHitPts[oldHitPts.length - 1][1]);


        newX = self.currX + self.vx;
        
        newY = self.currY + self.vy;

        // Is it outside the circle?
        if (calcLen(newX, newY) > self.currCircleRad) {
            partialStep = getRemStep(self.currX, self.currY);
            newX = self.currX + partialStep*self.vx;
            newY = self.currY + partialStep*self.vy;
            
            rotVec = flipVec(self.vx, self.vy, newX, newY)
            
            self.vx = self.vspeed*rotVec[0];
            self.vy = self.vspeed*rotVec[1];
            
            oldHitPts[oldHitPts.length] = [newX, newY];
            
        }
        

        ctxArt.lineTo(newX, newY);
        ctxArt.stroke();
        
        self.currX = newX;
        self.currY = newY;
        
        
    }
    
    var len;
    function calcLen(x1, y1) {
        
        len = Math.sqrt(Math.pow((x1- orgX), 2) + Math.pow((y1 - orgY), 2));
        
        return len
    }

    // Remaining step before stepping outside the circle
    function getRemStep(x, y) {
        var p1, t1, vsquared;
        x1 = (x - orgX);
        y1 = (y - orgY);
        vsquared = Math.pow(self.vspeed, 2)
        p1 = Math.pow((x1*self.vx + y1*self.vy)/vsquared, 2) + (self.currCircleRad*self.currCircleRad - x1*x1 - y1*y1)/vsquared;
        t1 = -1*(x1*self.vx + y1*self.vy)/vsquared + Math.sqrt(p1);
        
        return t1
    }

    // Flip the direction vector so that it bounces around
    function flipVec(vx1, vy2, touchPtX, touchPtY) {
        var vecOrgX, vecOrgY, theta;
        var innerProd1, innerProd2;
        var rotVecX, rotVecY;
        v1 = vx1/self.vspeed;
        v2 = vy2/self.vspeed;
        
        vecOrgX = -1*(orgX - touchPtX)/self.currCircleRad;
        vecOrgY = -1*(orgY - touchPtY)/self.currCircleRad;
        
        innerProd1 = v1*vecOrgX + v2*vecOrgY;
        theta = Math.acos(innerProd1);
        
        rotVecX = Math.cos(theta)*v1 - Math.sin(theta)*v2;
        rotVecY = Math.sin(theta)*v1 + Math.cos(theta)*v2;
        innerProd2 = rotVecX*vecOrgX + rotVecY*vecOrgY;
        
        if (innerProd2 > innerProd1) {
            rotVecX = -1*(Math.cos(2*theta)*v1 - Math.sin(2*theta)*v2);
            rotVecY = -1*(Math.sin(2*theta)*v1 + Math.cos(2*theta)*v2);
        } else {
            rotVecX = -1*(Math.cos(-2*theta)*v1 - Math.sin(-2*theta)*v2);
            rotVecY = -1*(Math.sin(-2*theta)*v1 + Math.cos(-2*theta)*v2);
        }
        return [rotVecX, rotVecY]
    }
}

function addAllParticles(numPartLargeCirc, numPartSmallCirc) {

    var randSmallStep, randExtraStep, startPosLargeCircle;

    for (var i=0; i<numPartLargeCirc; i++) {
        randThetaPos = Math.random()*Math.PI/2;
        randSmallStep = Math.random()*0.5;
        randExtraStep = 0.9*randSmallStep*(largeCircleRad - smallCircleRad);
        startPosLargeCircle = (smallCircleRad + randExtraStep);

        startX = orgX + startPosLargeCircle*Math.cos(randThetaPos) + randSmallStep*smallCircleRad*Math.sin(randThetaPos);
        startY = orgY + startPosLargeCircle*Math.sin(randThetaPos) - randSmallStep*smallCircleRad*Math.cos(randThetaPos);
        startVx = Math.sin(randThetaPos);
        startVy = -Math.cos(randThetaPos);
        randSpeed = particleSpeed;//1+Math.random()*8;
        myPart = new particle(startX, startY,startVx,startVy, largeCircleRad, circleCols[0], randSpeed);
        storePart[storePart.length] = myPart;
    }

    for (var i=0; i<numPartSmallCirc; i++) {
        

        randThetaPos = Math.random()*Math.PI/2;
        startX = orgX + 0.5*Math.random()*smallCircleRad;
        startY = orgY + 0.5*Math.random()*smallCircleRad;//Math.random()*1;
        startVx = Math.sin(randThetaPos);
        startVy = -Math.cos(randThetaPos);

        randSpeed = particleSpeed;//1+Math.random()*8;
        myPart = new particle(startX, startY,startVx,startVy, smallCircleRad, circleCols[1], randSpeed);
        storePart[storePart.length] = myPart;
    }

}


// We have to cancel this one as well
var currTimeoutEvent;
function drawParticle() {
    ctxArt.clearRect(0,0,canvasArt.clientWidth, canvasArt.clientHeight);
    
    for (var i=0; i<storePart.length; i++) {
        storePart[i].drawStep();
    }

    if (currDrawStep < maxDrawSteps) {
        currTimeoutEvent = setTimeout(drawParticle, 10);
    }
    
    currDrawStep = currDrawStep + 1;
}

function drawArt() {

    // Here we check if we have a callback
    // If we do, we cancel it.
    // Otherwise we just go on
    currDrawStep = 0;
    var colCircleInd = Math.floor(Math.random()*allCircleCols.length);
    circleCols = allCircleCols[colCircleInd];
    clearTimeout(currTimeoutEvent);
    getUserInput();
    storePart = [];

    addAllParticles(numPartLargeCirc, numPartSmallCirc)
    drawParticle()

}

function getUserInput() {

    var val1, val2, val3, val4;
    var elem = document.getElementById('inp1');
    val1 = elem.value; 
    var elem = document.getElementById('inp2');
    val2 = elem.value; 
    var elem = document.getElementById('inp3');
    val3 = elem.value; 
    var elem = document.getElementById('inp4');
    val4 = elem.value/10; 
    
    ctxArt.lineWidth = val4;
    numPartLargeCirc = val1;
    numPartSmallCirc = val2;
    particleSpeed = val3;
}


var startX, startY, randThetaPos, randThetaV, randRad;
var startVx, startVy;
var storePart = []
var smallCircleRad, largeCircleRad;
var randSpeed;

//ctxArt.lineWidth = 0.5;//0.2;


var orgX, orgY;
orgX = canvasArt.width/2;
orgY = canvasArt.height/2;

//Good colors
// ['#7A9FA4', '#114777'], ['#F2B33D', '#D95204']
var allCircleCols = [['#7A9FA4', '#114777'], ['#F2B33D', '#D95204'], ['#345251', '#CFA929']];
var circleCols;
var orgRad1, orgRad2, orgRad3, orgRad4;
orgRad1 = canvasArt.width/2*0.5
orgRad2 = canvasArt.height/2*0.5
orgRad3 = canvasArt.width/2*0.9
orgRad4 = canvasArt.height/2*0.9

smallCircleRad = Math.min(orgRad1, orgRad2);
largeCircleRad = Math.min(orgRad3, orgRad4);

var numPartLargeCirc;
var numPartSmallCirc;
var particleSpeed;



var maxDrawSteps = 9000;
var currDrawStep = 0;





