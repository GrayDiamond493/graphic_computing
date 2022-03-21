const canvas = document.querySelector("#miwebgl");
const ctx = canvas.getContext("2d");

var theta = 0;
var s = 5;
var e = 1;
//coords
var originX = 200;
var originY = 300;
var allX = [];
var allY = [];

//to be used outside
var hip
var length
var wide
var back
var sleeve

//exclusive use in foreach
var point_names = ['hip_left', 'hip_right', 'neck_right', 'neck_left', 'end_right', 'end_left',
'armpit_right', 'armpit_left', 'shoulder_right', 'shoulder_left', 'start_left_up',
'end_left_up', 'start_left_down', 'end_left_down', 'start_right_up',
'end_right_up', 'start_right_down', 'end_right_down', 'hole', 'neck_hole', 'left_sleeve_hole', 'right_sleeve_hole']

function rotateShirt(dir) {
    if ((theta > 0 && dir < 0) || (theta < 0 && dir > 0)) {
        theta = 0
    }
    theta += dir;
    //to rad
    theta = theta * 0.0174533
    console.log(theta)

    aux1 = allX['hip_left']
    aux2 = allY['hip_left']
    point_names.forEach((value, index) => {
        allX[value] = (Math.cos(theta) * allX[value]) - (Math.sin(theta) * allY[value])
        allY[value] = (Math.cos(theta) * allY[value]) + (Math.sin(theta) * allX[value])
    })
    //direction
    if (dir < 0) {
        mult = -1
    } else {
        mult = 1
    }

    //move to origin
    xMove = Math.abs(aux1 - allX['hip_left'])
    yMove = Math.abs(aux2 - allY['hip_left'])
    point_names.forEach((value, index) => {
        allX[value] = allX[value] + (mult * xMove)
        allY[value] = allY[value] - (mult * yMove)
    })
    draw();

}

function translateShirt(opt) {
    switch (opt) {
        case 0:
            if (originX > 0) {
                //failsafe
                originX = originX - s;
                point_names.forEach((value, index) => {
                    allX[value] = allX[value] - s
                })
                console.log('moved to', allX)
            }
            break;
        case 1:
            if (originX < 1366) {
                //failsafe
                originX = originX + s;
                point_names.forEach((value, index) => {
                    allX[value] = allX[value] + s
                })
                console.log('moved to', allX)
            }
            break;
        case 2:
            if (originY > 0) {
                //failsafe
                originY = originY - s;
                point_names.forEach((value, index) => {
                    allY[value] = allY[value] - s
                })
                console.log('moved to', allY)
            }
            break;
        case 3:
            if (originX < 780) {
                //failsafe
                originY = originY + s;
                point_names.forEach((value, index) => {
                    allY[value] = allY[value] + s
                })
                console.log('moved to', allY)
            }
            break;
    }
    console.log("input:", hip, length, wide, back, sleeve);
    draw();
}

function escalateShirt(opt) {

    if ((e > 1 && opt < 0) || (e < 1 && opt > 0)) {
        e = 1
    }
    e = e + (0.001 * opt)

    console.log('e', e)

    aux1 = allX['hip_left']
    aux2 = allY['hip_left']
    point_names.forEach((value, index) => {
        allX[value] = (allX[value] * e)
        allY[value] = (allY[value] * e)
    })
    //move to origin
    xMove = Math.abs(aux1 - allX['hip_left'])
    yMove = Math.abs(aux2 - allY['hip_left'])
    point_names.forEach((value, index) => {
        allX[value] = allX[value] - (opt * xMove)
        allY[value] = allY[value] - (opt * yMove)
    })

    draw();

}

//locates each shirt point in canvas
function planCoordsShirt() {
    //To center back & width according to hip
    centerX = (originX + (originX + hip)) / 2;
    //hip coords
    planShirt('hip_left', originX, originY)
    planShirt('hip_right', originX + hip, originY)

    //hole cp
    planShirt('hole', centerX, originY)

    //neck coords
    planShirt('neck_right', originX + hip * (3 / 4), originY - length - 10)
    planShirt('neck_left', centerX - (allX['neck_right'] - centerX), allY['neck_right'])

    //neck hole
    planShirt('neck_hole', centerX, allY['neck_right'] + 10)

    //main hole
    planShirt('end_right', allX['hip_right'] + hip / 20, originY + length / 20)
    planShirt('end_left', allX['hip_left'] - hip / 20, originY + length / 20)

    //width
    planShirt('armpit_left', centerX - wide / 2, originY - length * (2 / 3))
    planShirt('armpit_right', centerX + wide / 2, originY - length * (2 / 3))

    //back
    planShirt('shoulder_left', centerX - back / 2, originY - length * (19 / 20))
    planShirt('shoulder_right', centerX + back / 2, originY - length * (19 / 20))
}

//locates every point and assings coordinates to sleeves
function planCoordsSleeves() {
    //Assuming 45 degrees
    //left
    planShirt('start_left_up', allX['shoulder_left'], allY['shoulder_left'])
    planShirt('end_left_up', allX['shoulder_left'] - sleeve / 2, allY['shoulder_left'] + sleeve / 2)

    planShirt('start_left_down', allX['armpit_left'], allY['armpit_left'])
    planShirt('end_left_down', allX['armpit_left'] - sleeve / 2, allY['armpit_left'] + sleeve / 2)

    //right
    planShirt('start_right_up', allX['shoulder_right'], allY['shoulder_right'])
    planShirt('end_right_up', allX['shoulder_right'] + sleeve / 2, allY['shoulder_left'] + sleeve / 2)

    planShirt('start_right_down', allX['armpit_right'], allY['armpit_right'])
    planShirt('end_right_down', allX['armpit_right'] + sleeve / 2, allY['armpit_right'] + sleeve / 2)

    //holes
    planShirt('left_sleeve_hole', allX['end_left_up'] - 5, (allY['end_left_down'] + allY['end_left_up']) / 2)
    planShirt('right_sleeve_hole', allX['end_right_up'] + 5, (allY['end_right_down'] + allY['end_right_up']) / 2)
}

//locates every point and assings coordinates globally
function planShirt(index, x, y) {
    allX[index] = x;
    allY[index] = y;
    console.log('index: ', index, 'succesfully located at (', x, ',', y, ')')
}

function makeLine(ctx, i1, i2) {
    from = []
    to = []
    from['x'] = allX[i1]
    from['y'] = allY[i1]

    to['x'] = allX[i2]
    to['y'] = allY[i2]

    console.log("drawing");
    ctx.beginPath();
    ctx.moveTo(from["x"], from["y"]);
    ctx.lineTo(to["x"], to["y"]);
    ctx.stroke();
}

function makeCurve(ctx, cp, i1, i2) {
    from = []
    to = []
    from['x'] = allX[i1]
    from['y'] = allY[i1]

    to['x'] = allX[i2]
    to['y'] = allY[i2]

    ctx.beginPath();
    ctx.moveTo(from["x"], from["y"]);
    ctx.bezierCurveTo(
        cp["x1"],
        cp["y1"],
        cp["x2"],
        cp["y2"],
        to["x"],
        to["y"]
    );
    ctx.stroke();
}

//draws everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cp = [];
    //sleeves
    makeLine(ctx, 'start_left_down', 'end_left_down');
    makeLine(ctx, 'start_right_down', 'end_right_down');

    cp["x1"] = allX['shoulder_left']
    cp["y1"] = allY['shoulder_left']
    cp["x2"] = allX['shoulder_left']
    cp["y2"] = allY['shoulder_left']
    makeCurve(ctx, cp, 'end_left_up', 'neck_left');

    cp["x1"] = allX['shoulder_right']
    cp["y1"] = allY['shoulder_right']
    cp["x2"] = allX['shoulder_right']
    cp["y2"] = allY['shoulder_right']
    makeCurve(ctx, cp, 'end_right_up', 'neck_right');

    //sleeve holes
    cp["x1"] = allX['left_sleeve_hole']
    cp["y1"] = allY['left_sleeve_hole']
    cp["x2"] = allX['left_sleeve_hole']
    cp["y2"] = allY['left_sleeve_hole']
    makeCurve(ctx, cp, 'end_left_down', 'end_left_up');

    cp["x1"] = allX['right_sleeve_hole']
    cp["y1"] = allY['right_sleeve_hole']
    cp["x2"] = allX['right_sleeve_hole']
    cp["y2"] = allY['right_sleeve_hole']
    makeCurve(ctx, cp, 'end_right_down', 'end_right_up');

    //neck
    cp["x1"] = allX['neck_hole']
    cp["y1"] = allY['neck_hole']
    cp["x2"] = allX['neck_hole']
    cp["y2"] = allY['neck_hole']
    makeCurve(ctx, cp, 'neck_left', 'neck_right');

    //sides
    cp["x1"] = allX['hip_left'];
    cp["y1"] = allY['hip_left'];
    cp["x2"] = allX['armpit_left'];
    cp["y2"] = allY['armpit_left'];
    makeCurve(ctx, cp, 'end_left', 'armpit_left');

    cp["x1"] = allX['hip_right'];
    cp["y1"] = allY['hip_right'];
    cp["x2"] = allX['armpit_right'];
    cp["y2"] = allY['armpit_right'];
    makeCurve(ctx, cp, 'end_right', 'armpit_right');

    //main hole
    cp["x1"] = allX['hole']
    cp["y1"] = allY['hole']
    cp["x2"] = allX['hole']
    cp["y2"] = allY['hole']
    makeCurve(ctx, cp, 'end_right', 'end_left');

}

function program() {
    console.log("running");

    hip = parseFloat(document.getElementById("hip").value);
    length = parseFloat(document.getElementById("len").value);
    wide = parseFloat(document.getElementById("wide").value);
    back = parseFloat(document.getElementById("back").value);
    sleeve = back / 3;

    console.log("input:", hip, length, wide, back, sleeve);
    planCoordsShirt();
    planCoordsSleeves();
    draw();
}
