
var theta = 0;
var s = 5;
//coords
var originX = 200;
var originY = 300;
const armpit_left = [];
const armpit_right = [];
const hip_left = [];
const hip_right = [];
const neck_right = [];
const neck_left = [];
const shoulder_right = [];
const shoulder_left = [];
const end_right = [];
const end_left = [];
//sleeve coords
const start_left_up = [];
const end_left_up = [];
const start_left_down = [];
const end_left_down = [];
const start_right_up = [];
const end_right_up = [];
const start_right_down = [];
const end_right_down = [];

//input
var hip = 0;
var length = 0;
var wide = 0;
var back = 0;
var sleeve = back / 3;

function rotateImg(dir) {
    theta += dir;
    rotation = "rotate(" + theta + "deg)";
    document.querySelector("#miwebgl").style.transform = rotation;
}

function translateShirt(opt) {
    const canvas = document.querySelector("#miwebgl");
    const ctx = canvas.getContext("2d");
    switch (opt) {
        case 0:
            if (originX > 0) {
                originX = originX - s;
            }
            break;
        case 1:
            if (originX < 480) {
                originX = originX + s;
            }
            break;
        case 2:
            if (originY > 0) {
                originY = originY - s;
            }
            break;
        case 3:
            if (originX < 640) {
                originY = originY + s;
            }
            break;
    }
    console.log("input:", hip, length, wide, back, sleeve);
    //Comment to appreciate comparison
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    planShirt(hip, length, wide, back);
    calculateSleeves();
    draw(ctx);
}

function scale(opt) {
    const canvas = document.querySelector("#miwebgl");
    const ctx = canvas.getContext("2d");
    switch (opt) {
        case 0:
            if (hip < 1000) {
                hip += s;
                length += s;
                wide += s;
                back += s;
                sleeve = back / 3;
            }
            break;
        case 1:
            if (hip > 10) {
                hip -= s;
                length -= s;
                wide -= s;
                back -= s;
                sleeve = back / 3;
            }
            break;
    }
    console.log("input:", hip, length, wide, back, sleeve);
    //Comment to appreciate comparison
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    planShirt(hip, length, wide, back);
    calculateSleeves();
    draw(ctx);
}

//locates every point and assings coordinates
function planShirt(hip, length, wide, back) {
    //Hip
    centerX = (originX + (originX + hip)) / 2;
    hip_left["x"] = originX;
    hip_left["y"] = originY;
    hip_right["x"] = originX + hip;
    hip_right["y"] = originY;
    //Length
    lenPos = originX + hip * (3 / 4);
    neck_right["x"] = lenPos;
    neck_right["y"] = originY - length - 10;
    neck_left["x"] = centerX - (neck_right["x"] - centerX);
    neck_left["y"] = neck_right["y"];

    //shirt end
    end_right["x"] = hip_right["x"] + 10;
    end_right["y"] = originY + 10;

    end_left["x"] = hip_left["x"] - 10;
    end_left["y"] = originY + 10;

    //wide
    armpit_left["x"] = centerX - wide / 2;
    armpit_right["x"] = centerX + wide / 2;
    widePosY = originY - length * (2 / 3);
    armpit_left["y"] = widePosY;
    armpit_right["y"] = widePosY;

    //back
    shoulder_left["x"] = centerX - back / 2;
    shoulder_right["x"] = centerX + back / 2;
    backPosY = originY - length * (19 / 20);
    shoulder_left["y"] = backPosY;
    shoulder_right["y"] = backPosY;
}

//locates every point and assings coordinates for sleeve lines
function calculateSleeves() {
    //Assuming 45 degrees
    //left

    //up
    ogX = shoulder_left["x"];
    start_left_up["x"] = ogX;
    start_left_up["y"] = shoulder_left["y"];

    end_left_up["x"] = ogX - sleeve / 2;
    end_left_up["y"] = shoulder_left["y"] + sleeve / 2;

    //down
    ogX2 = armpit_left["x"];
    start_left_down["x"] = ogX2;
    start_left_down["y"] = armpit_left["y"];

    end_left_down["x"] = ogX2 - sleeve / 2;
    end_left_down["y"] = armpit_left["y"] + sleeve / 2;

    //right

    //up
    ogX = shoulder_right["x"];
    start_right_up["x"] = ogX;
    start_right_up["y"] = shoulder_right["y"];

    end_right_up["x"] = ogX + sleeve / 2;
    end_right_up["y"] = shoulder_left["y"] + sleeve / 2;

    //down
    ogX2 = armpit_right["x"];
    start_right_down["x"] = ogX2;
    start_right_down["y"] = armpit_right["y"];

    end_right_down["x"] = ogX2 + sleeve / 2;
    end_right_down["y"] = armpit_right["y"] + sleeve / 2;
}

function makeLine(ctx, from, to) {
    console.log("drawing");
    ctx.beginPath();
    ctx.moveTo(from["x"], from["y"]);
    ctx.lineTo(to["x"], to["y"]);
    ctx.stroke();
}

function makeCurve(ctx, cp, from, to) {
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
function draw(ctx) {
    cp = [];
    //sleeves
    makeLine(ctx, start_left_up, end_left_up);
    makeLine(ctx, start_right_up, end_right_up);
    makeLine(ctx, start_left_down, end_left_down);
    makeLine(ctx, start_right_down, end_right_down);
    cp["x1"] = end_left_down["x"] - 3;
    cp["y1"] = (end_left_down["y"] + end_left_up["y"]) / 2;
    cp["x2"] = end_left_down["x"] - 3;
    cp["y2"] = (end_left_down["y"] + end_left_up["y"]) / 2;
    console.log(cp);
    makeCurve(ctx, cp, end_left_down, end_left_up);

    cp["x1"] = end_right_down["x"] + 3;
    cp["y1"] = (end_right_down["y"] + end_right_up["y"]) / 2;
    cp["x2"] = end_right_down["x"] + 3;
    cp["y2"] = (end_right_down["y"] + end_right_up["y"]) / 2;
    makeCurve(ctx, cp, end_right_down, end_right_up);

    //shoulder
    makeLine(ctx, shoulder_left, neck_left);
    makeLine(ctx, shoulder_right, neck_right);

    //neck
    cp["x1"] = centerX;
    cp["y1"] = originY - length;
    cp["x2"] = centerX;
    cp["y2"] = originY - length;
    makeCurve(ctx, cp, neck_left, neck_right);

    //sides
    cp["x1"] = hip_left["x"];
    cp["y1"] = hip_left["y"];
    cp["x2"] = armpit_left["x"];
    cp["y2"] = armpit_left["y"];
    makeCurve(ctx, cp, end_left, armpit_left);

    cp["x1"] = hip_right["x"];
    cp["y1"] = hip_right["y"];
    cp["x2"] = armpit_right["x"];
    cp["y2"] = armpit_right["y"];
    makeCurve(ctx, cp, end_right, armpit_right);

    //hole
    cp["x1"] = centerX - 10;
    cp["y1"] = hip_right["y"];
    cp["x2"] = centerX + 10;
    cp["y2"] = hip_right["y"];
    makeCurve(ctx, cp, end_right, end_left);
}

function program() {
    console.log("running");
    const canvas = document.querySelector("#miwebgl");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hip = parseInt(document.getElementById("hip").value);
    length = parseInt(document.getElementById("len").value);
    wide = parseInt(document.getElementById("wide").value);
    back = parseInt(document.getElementById("back").value);
    sleeve = back / 3;
    console.log("input:", hip, length, wide, back, sleeve);
    planShirt(hip, length, wide, back);
    calculateSleeves();
    draw(ctx);
}
