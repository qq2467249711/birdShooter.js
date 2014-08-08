var birdI = new Image();
var weapon = new Image();
var bulletI = new Image();
var background = new Image();
var birds = [];
var bulletArrayCode = 0;
var birdId = 0;
var ui = false;
var pi = false;
var hit = [];
var level_complete;
var fail;
var backgroundMusic;
var bullets = [];
var birdArrayCode = 0;
var titleDisplayLength = 4000;
var birdWidth = 105;
var birdHeight = 95;
var weaponHeight = 70;
var bulletWidth = 6;
var bulletHeight = 39;
var fontSize = 72;
var frameInterval = false;
var weapono;
var timer;
var timerInterval = false;
var sop = "n";
var canvas;
var spawnBirds = false;
var bmvd = false;
var context;
var blink = true;
var xhrs = new XMLHttpRequest();
var xhrl = new XMLHttpRequest();
var punx = Math.round((screen.width-240)/2-50);
var puny = Math.round(screen.height/2-40);
var punby = Math.round(screen.height/2+10);
var hcl = Math.round(screen.width/2);
var mp = (Math.round(screen.height)-birdHeight)/2;
var hhcl = Math.round(screen.width/4);
var sx = hhcl-birdWidth/2;
var mx = hhcl-birdWidth+hcl;
var iterationCount = 0;
var mainInterval = -1024;
var player = {
    username:"",
    password:"",
    birdsKilled:0,
    bulletsLeft:0,
    bulletsShot:0,
    eggs:0,
    reloadTime:250,
    weaponCooldownT:30,
    weaponSpeed:15,
    bulletSpeed:4,
    level:1
};
var level = [
    {birdsKilled:0,
        birdsReleased:0,
        birdSpeedMax:10,
        birdSpeedMin:15,
        spawnBirdInterval:100,
        leastKills:1000,
        timeLimit:100,
        wonMessage:"#$Fatal_error::good_job_you_beat_the_game",
        lostMessage:"#$Fatal_error::corrupted_or_nonexistent_level_data",
        name:"Level #$Unknown_value::undefined_undefined",
        bullets:1000
    },{
        birdsKilled:0,
        birdsReleased:0,
        birdSpeedMax:3,
        birdSpeedMin:1,
        spawnBirdInterval:1000,
        leastKills:30,
        timeLimit:60,
        wonMessage:"Got the hang of it?",
        lostMessage:"......",
        name:"Level 1: Clumsy little birds",
        bullets:100
    },{
        birdsKilled:0,
        birdsReleased:0,
        birdSpeedMax:4,
        birdSpeedMin:2,
        spawnBirdInterval:950,
        leastKills:60,
        timeLimit:70,
        wonMessage:" Great Job! :) ",
        lostMessage:"Pratice practice practice",
        name:"Level 2: Things just got messy",
        bullets:100
    },{
        birdsKilled:0,
        birdsReleased:0,
        birdSpeedMax:4,
        birdSpeedMin:2,
        spawnBirdInterval:500,
        leastKills:80,
        timeLimit:100,
        wonMessage:" Even greater Job! :) ",
        lostMessage:"Patience patience patience",
        name:"Level 3: Things just got even worse",
        bullets:100
    },{
        birdsKilled:0,
        birdsReleased:0,
        birdSpeedMax:5,
        birdSpeedMin:5,
        spawnBirdInterval:1000,
        leastKills:1,
        timeLimit:1,
        wonMessage:"...or you would've lost",
        lostMessage:"...because you've only got one chance at this",
        name:"Level 4: You better be ready...",
        bullets:1
    }];
var splr;
var a;
var A = false;
var D = false;
var spacebar = false;
var memClrAlreadyRunning = false;
var bulletY;
var clrIntervals = false;
function bird(ID){
    return ID-birdArrayCode < 0 ? undefined : birds[ID-birdArrayCode];
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function cfk(i,bulletM){
    if(!birds[i])
        return;
    if(birds[i].x<bulletM.x&&birds[i].x+birdWidth>bulletM.x&&birds[i].y+birdHeight>bulletM.y&&birds[i].y<bulletM.y)
        killBird(i+birdArrayCode);
    cfk(i+1,bulletM);
}
function fireLoop(ID){
    if(!bullets[ID] || ID > bullets.length)
        return;
    if(bullets[ID].y < -bulletHeight){
        if(ID === 0)
            bullets.shift();
        else
            bullets.slice(ID,ID);
        fireLoop(ID);
        return;
    }
    cfk(0,{x:bullets[ID].x+3,y:bullets[ID].y-2});
    bullets[ID].y-=player.bulletSpeed;
    fireLoop(ID+1);
}
function memClr(){
    if(memClrAlreadyRunning)
        return;
    memClrAlreadyRunning = true;
    window.setTimeout(function(){
        var i = 0;
        while(birds[i]){
            if(birds[i].x>canvas.width || birds[i].x<-birdI.width || birds[i].speed > level[player.level].birdSpeedMax || birds[i].direction<0 || birds[i].direction >3){
                birds.shift();
                birdArrayCode++;
            }else{
                i++;
            }
            memClrAlreadyRunning = false;
        }},500);
}
function fire(x,y){
    if(player.bulletsLeft--<0)
        return;
    player.bulletsShot++;
    x+=24;
    bullets.push({x:x,y:y,IGotIt:false});
}
function spawnBird(x,y,d,s){
    if(x && y && d && s)
        birds.push({x:x,y:y,direction:d,speed:s});
    else
    if(x && y && d)
        birds.push({x:x,y:y,direction:d,speed:random(level[player.level].birdSpeedMin,level[player.level].birdSpeedMax)});
    else
    if(x && y)
        birds.push({x:x,y:y,direction:random(2,3),speed:random(level[player.level].birdSpeedMin,level[player.level].birdSpeedMax)});
    else
        var side = random(0,1);
    if (side === 0)
        birds.push({x:-birdWidth,y:random(0,a),direction:2,speed:random(level[player.level].birdSpeedMin,level[player.level].birdSpeedMax)});
    else
    if(side === 1)
        birds.push({x:screen.width,y:random(0,a),direction:3,speed:random(level[player.level].birdSpeedMin,level[player.level].birdSpeedMax)});
    level[player.level].birdsReleased++;
}
function pauseOn(){
    //this function must and should be used with memClr
    endGame();
    timerInterval = false;
    clrIntervals = true;
    document.onkeydown = null;
}
function pauseOff(){
    clrIntervals = false;
    timerInterval = true;
	frameInterval = true;
    document.onkeydown = keydown;
}
function pause(){
    if(clrIntervals){
		pauseOff();
		return;
    }
    pauseOn();
    som();
    memClr();
}
function rb(i){
    if(!bird[i])
        return;
    removeBird(i+birdArrayCode);
    rb(++i)
}
function memClrAll(){
    endGame();
    window.setTimeout(function(){
        bullets = [];
        bulletArrayCode = 0;
        birds = [];
        birdArrayCode = 0;
        birdId = 0;
    },400);
    return "All memory cleared"
}
function playhit(i){
    if(!hit[i]){
        hit.push(new Audio("hit.wav"));
        hit[hit.length-1].play();
        return;
    }
    if(hit[i].paused){
        hit[i].play();
        return;}
    playhit(i+1)
}
function removeBird(birdID){
    if(bird(birdID))
        bird(birdID).x = 1096574;
    return bird(birdID)?"Removed bird with ID "+birdID:"Bird ID "+birdID+" does not exist";
}
function killBird(birdID){
    removeBird(birdID);
    playhit(0);
    level[player.level].birdsKilled++;
}
function drawbird(i){
    if(!birds[i])
        return;
    context.drawImage(birdI, 90, 219, birdWidth, birdHeight, birds[i].x, birds[i].y, birdWidth, birdHeight);
    drawbird(i+1);
}
function drawbullet(j){
    if(!bullets[j])
        return;
    context.drawImage(bulletI,bullets[j].x,bullets[j].y,bulletWidth,bulletHeight);
    drawbullet(j+1);
}
function newFrame(){
    clrScreen();
    mbs(0);
    fireLoop(0);
    drawbird(0);
    drawbullet(0);
    context.fillStyle = "blue";
    context.font = fontSize+"px Calibri";
    context.fillText(timer, 0, 50);
}
function clrScreen(){
    context.drawImage(background,0,0,canvas.width,canvas.height);
    context.drawImage(weapon,weapono.x,weapono.y);
}
function displayText(text,x,y,size,color,font){
    if(color)
        context.fillStyle = color;
    else
        context.fillStyle = 'blue';
    if(font)
        context.font = size+"px "+font;
    else
    if(size)
        context.font = size+"px Calibri";
    else
        context.font = fontSize+"px Calibri";
    if(x&&y)
        context.fillText(text,x,y);
    else
        context.fillText(text,Math.round((screen.width-30*text.length)/2),Math.round(screen.height/2-20));
}
function tick(){
    if(timer--<=0)
        game();
}
function game(){
    if(spawnBirds === false){
        sop = "s";
        backgroundMusic.volume = 1;
        level[player.level].birdsKilled = 0;
        level[player.level].birdsReleased = 0;
        clrScreen();
        memClrAll();
        pauseOff();
        timerInterval = false;
        timer = level[player.level].timeLimit;
        displayText(level[player.level].name);
        player.bulletsLeft = level[player.level].bullets;
        window.setTimeout(startGame,titleDisplayLength);
    }else{
        endGame();
        memClrAll();
        pauseOn();
        player.birdsKilled+=level[player.level].birdsKilled;
        //bmvd = true;
        if(level[player.level].birdsKilled >= level[player.level].leastKills){
            window.setTimeout(function(){level_complete.play()},500);
            displayText(level[player.level].wonMessage);
            player.level++;
            window.setTimeout(game,titleDisplayLength);
        }else{
            window.setTimeout(function(){fail.play();},500);
            displayText(level[player.level].lostMessage);
            window.setTimeout(game,titleDisplayLength);
        }}
}
function mbs(i){
    if(!birds[i])
        return;
    switch(birds[i].direction){
        case 0:
            birds[i].y = birds[i].y+birds[i].speed;
            break;
        case 1:
            birds[i].y = birds[i].y-birds[i].speed;
            break;
        default:
        case 2:
            birds[i].x = birds[i].x+birds[i].speed;
            break;
        case 3:
            birds[i].x = birds[i].x-birds[i].speed;
    }
    mbs(i+1)
}
function mainIntervalf(){
    iterationCount+=10;
    if(iterationCount%100 === 0 && bmvd){
        backgroundMusic.volume -=0.2;
        if(backgroundMusic.volume<=0)
            bmvd = false;
    }
    if(iterationCount%level[player.level].spawnBirdInterval === 0 && spawnBirds)
        spawnBird();
    if(iterationCount%1000 === 0 && timerInterval)
        tick();
    if(frameInterval)
        newFrame();
    if(iterationCount%player.weaponCooldownT === 0){
        if(A && weapono.x > 0)
            ox(0);
        else
        if(D && weapono.y <canvas.width)
            oc(0);
    }
    if(iterationCount%player.reloadTime === 0&& spacebar)
        fire(weapono.x,bulletY);
    if(iterationCount%500 === 0){
        if(pi)
            pp();
        else
        if(ui)
            pun();
        blink = !blink;
    }
}
function startGame(){
    spawnBirds = true;
    timerInterval = true;
    frameInterval = true;
    document.onkeyup = keyup;
    document.onkeydown = keydown;
    pauseOff();
    return "Automatic bird spawning ON"
}
function save(){
    xhrs.open("POST","/save",true);
    xhrs.setRequestHeader('Content-type','application/json;');
    console.log("SENT: "+JSON.stringify(player));
    xhrs.send(JSON.stringify(player));
    savel();
}
function somf(){
    context.drawImage(birdI, 90, 219, birdWidth, birdHeight, sx, mp, birdWidth, birdHeight);
    context.drawImage(birdI, 90, 219, birdWidth, birdHeight, mx, mp, birdWidth, birdHeight);
    context.drawImage(birdI, 90, 219, birdWidth, birdHeight, hhcl+hcl, mp, birdWidth, birdHeight);
    displayText("Singleplayer",sx-8,mp-18,28,"rgb(255,255,255)");
    displayText("Multiplayer",mx+32,mp-18,32,"rgb(255,255,255)");
    switch(sop){
        case "s":
            displayText("( Continue )",sx-5,hcl+birdWidth/2,32,"rgb(255,255,255)");
            break;
        case "m":
            displayText("( Continue )",mx+32,hcl+birdWidth/2,32,"rgb(255,255,255)");
            break;
    }
}
function som(){
    canvas.onmousemove = comm;
    canvas.onclick = coc;
    document.onkeydown = okd;
    context.fillStyle = 'blue';
    context.fillRect(0,0,hcl,canvas.height);
    context.fillStyle = 'red';
    context.fillRect(hcl,0,hcl,canvas.height);
    somf();
}
function savel(){
    window.localStorage.username = player.username;
    window.localStorage.password = player.password;
    window.localStorage.eggs = player.eggs;
    window.localStorage.level = player.level;
    window.localStorage.bulletsShot = player.bulletsShot;
    window.localStorage.birdsKilled = player.birdsKilled;
    window.localStorage.weaponCooldownT = player.weaponCooldownT;
    window.localStorage.reloadTime = player.reloadTime;
    window.localStorage.bulletSpeed = player.bulletSpeed;
    window.localStorage.weaponSpeed = player.weaponSpeed;
}
function load(){
    loadl();
    xhrl.open("POST","/load",true);
    xhrl.setRequestHeader('Content-type','application/json;');
    xhrl.onreadystatechange = function(){
        if(xhrl.status === 200 && xhrl.readyState === 4){
            switch(xhrl.responseText){
                case "nonexistent":
                case "error":
                    som();
                    break;
                default:
                    var temp = {u:player.username,p:player.password};
                    player = JSON.parse(xhrl.responseText);
                    player.username = temp.u;
                    player.password = temp.p;
                    savel();
                    som();
            }
        }
    };
    xhrl.send(JSON.stringify({username:player.username,password:player.password}));
}
function loadl(){
    if(window.localStorage.username)
        player.username = window.localStorage.username;
    if(window.localStorage.eggs)
        player.eggs = window.localStorage.eggs;
    if(window.localStorage.level)
        player.level = window.localStorage.level;
    if(window.localStorage.bulletsShot)
        player.bulletsShot = window.localStorage.bulletsShot;
    if(window.localStorage.birdsKilled)
        player.birdsKilled = window.localStorage.birdsKilled;
    if(window.localStorage.weaponCooldownT)
        player.weaponCooldownT = window.localStorage.weaponCooldownT;
    if(window.localStorage.reloadTime)
        player.reloadTime = window.localStorage.reloadTime;
    if(window.localStorage.reloadTime)
        player.bulletSpeed = window.localStorage.bulletSpeed;
    if(window.localStorage.bulletSpeed)
        player.weaponSpeed = window.localStorage.weaponSpeed;
}
function endGame(){
    spawnBirds = false;
    frameInterval = false;
    document.onkeydown = null;
    backgroundMusic.pause();
    save();
    return "Automatic bird spawning OFF"
}
function ox(i){
    if(!(i<=player.weaponSpeed))
        return;
    weapono.x--;
    ox(i+1);
}
function keydown(event){
    switch(event.key){
        case "4":
        case "a":
        case "A":
        case "Left":
            A = true;
            break;
        case "6":
        case "d":
        case "D":
        case "Right":
            D = true;
            break;
        case "W":
        case "S":
        case "w":
        case "s":
        case "Up":
        case "Down":
        case "5":
        case " ":
            spacebar = true;
            fire(weapono.x,bulletY);
    }
}
function oc(i){
    if(!(i<player.weaponSpeed))
        return;
    weapono.x++;
    oc(i+1);
}
function username(event){
    if(event.key.length == 1){
        player.username += event.key;
        pun()}
    else
        switch(event.key){
            case "Enter":
                document.onkeydown = password;
                ui = false;
                window.setTimeout(function(){pi = true},500);
                break;
            case "Del":
                player.username = player.username.slice(0,-1);
                pun();
        }
}
function password(event){
    if(event.key.length == 1){
        player.password += event.key;
        pp();}
    else
        switch(event.key){
            case "Enter":
                document.onkeydown = null;
                pi = false;
                load();
                break;
            case "Del":
                player.password = player.password.slice(0,-1);
                pp();
        }
}
function keyup(event){
    switch(event.key){
        case "4":
        case "a":
        case "A":
        case "Left":
            A = false;
            break;
        case "6":
        case "d":
        case "D":
        case "Right":
            D = false;
            break;
        case "p":
        case "P":
            startGame();
            pause();
            break;
        case "W":
        case "S":
        case "w":
        case "s":
        case "Up":
        case "Down":
        case "5":
        case " ":
            spacebar = false;
    }
}
function pp(){
    clrScreen();
    displayText('Password',Math.round((screen.width-30*8)/2-50),puny,Math.round(fontSize/2));
    if(blink)
        displayText(player.password,Math.round((screen.width-30*8)/2-50),punby);
    else
        displayText(player.password+"_",Math.round((screen.width-30*8)/2-50),punby);
}
function pun(){
    clrScreen();
    displayText('Username',punx,puny,Math.round(fontSize/2));
    if(blink)
        displayText(player.username,punx,punby,fontSize);
    else
        displayText(player.username+"_",punx,punby,fontSize);
}
function login(){
    document.onkeydown = username;
    ui = true;
}
function sf(){
    splr = true;
    context.fillStyle = 'rgb(100,150,255)';
    context.fillRect(0,0,hcl,canvas.height);
    context.fillStyle = 'red';
    context.fillRect(hcl,0,hcl,canvas.height);
    somf()
}
function comm(event){
    if(event.clientX<hcl)
        sf();
    else
        mf();
}
function coc(){
    nillist();
    switch(sop){
        default:
            game();
            break;
        case "s":
            startGame();
            break;
        case "m":
            ;
    }
    nillist()
}
function nillist(){
    canvas.onmousemove = null;
    canvas.onclick = null;
    document.onkeydown = keydown;
}
function okd(event){
    switch(event.key){
        case "Right":
        case "6":
        case "D":
        case "d":
            mf();
            break;
        case "Left":
        case "4":
        case "A":
        case "a":
            sf();
            break;
        case "Enter":
            switch(sop){
                default:
                    game();
                    break;
                case "s":
                    startGame();
                    break;
                case "m":
            }
            nillist();
    }
}
function mf(){
    splr = false;
    context.fillStyle = 'blue';
    context.fillRect(0,0,hcl,canvas.height);
    context.fillStyle = 'rgb(255,150,100)';
    context.fillRect(hcl,0,hcl,canvas.height);
    somf();
}
window.onload = function(){
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");
    canvas.width = screen.width;
    canvas.height = screen.height;
    birdI.src = "bird_sheet.png";
    weapon.src = "weapon.png";
    bulletI.src = "bullet.png";
    a = canvas.height-weaponHeight-birdHeight;
    weapono = {x:Math.round(canvas.width/2-weapon.width),y:Math.round(screen.height-weaponHeight)};
    bulletY = weapono.y-bulletHeight;
    background.src = "background.png";
    backgroundMusic = new Audio("background.mp3");
    backgroundMusic.onpause = function(){backgroundMusic.play()};
    backgroundMusic.play();
    level_complete = new Audio("level_complete.mp3");
    fail = new Audio("fail.mp3");
    mainInterval = window.setInterval(mainIntervalf,10);
    login();
    document.onclick = function(){canvas.mozRequestFullScreen();document.onclick = null;};
};