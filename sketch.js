// valeur du zoom sur l'espace de dessin
var zoom = 13;

//On crée des variables globales de Slider
var rS,mS, ctS, cpS, rhoS, angleS, gS;
var txt = [];
// On définit les constantes concernant la balle, et le milieu
var r = 0.032;
var m = 0.14;
var ct = 0.5;
var cp = 0.6;
var rho = 1.28;
var angle = 30;
var g = 9.81;

// On définit les paramètres de la boucle (méthode de Euler)
var step = 0.25;
var end = 40;
end *= step;
// On définit les valeurs initiales de vitesse et position de la simulation
var v = 15;

var xi = 0;
var yi = 0.7;
// on crée des listes contenant toutes nos accélérations, vitesses et positions
var accx = [];
var velsx = [];
var posx = [];

var accy = [];
var velsy = [];
var posy = [];

function setup() {
    createCanvas(600, 600);
    background(51);
    angleMode(DEGREES);
    textSize(15);
    
    
    
// On définit les constantes concernant la balle, et le milieu
rS = createSlider(0.01, 0.05, r, 0.001);
mS = createSlider(0.01, 5, m, 0.001);
ctS = createSlider(0.001, 10, ct, 0.001);
cpS = createSlider(-50, 50, cp, 0.001);
rhoS = createSlider(1, 10, rho, 0.001);
angleS = createSlider(0, 89, angle, 0.001);
gS = createSlider(1, 15, g, 0.001);
vS = createSlider(1, 50, v, 0.001);
zS = createSlider(1, 50, zoom, 0.5);
    
rS.position(700, 50);
mS.position(700, 100);
ctS.position(700, 150);
cpS.position(700, 200);
rhoS.position(700, 250);
angleS.position(700, 300);
gS.position(700, 350);
vS.position(700, 400);
zS.position(700, 450);
    
}

function draw() {
  background(51);
    
    for(var i = 0; i < txt.length; i++) {
        txt[i].remove();
    }
    
r = rS.value();    
m = mS.value();   
ct = ctS.value();   
cp = cpS.value();   
rho = rhoS.value();   
angle = angleS.value();   
g = gS.value();
v = vS.value();
zoom = zS.value();

txt[0] = createDiv('Rayon de la balle : ' + r + ' m');
txt[1] = createDiv('Masse de la balle : ' + m + ' kg');
txt[2] = createDiv('Coefficient de trainée : ' + ct);
txt[3] = createDiv('Coefficient de portance : ' + cp);
txt[4] = createDiv('Masse volumique du fluide : ' + rho + ' kg*m^-3');
txt[5] = createDiv('Angle de frappe : ' + angle + '°');
txt[6] = createDiv('Accélération de la pesanteur : ' + g + ' m*s^-2');
txt[7] = createDiv('Vitesse donnée lors de la frappe : ' + v + ' m*s^-1');
txt[8] = createDiv('Zoom : ' + zoom);
    
 
txt[0].position(880, 50);
txt[1].position(880, 100);
txt[2].position(880, 150);
txt[3].position(880, 200);
txt[4].position(880, 250);
txt[5].position(880, 300);
txt[6].position(880, 350);
txt[7].position(880, 400);
txt[8].position(880, 450);
    
// on calcule d'abord la vitesse initiale de la balle sur les x    
var vix = cos(angle)*v;
    
    for(var i=0; i<end; i+=step) {
        
        if(i == 0) {
        accx[0] = 0;
        velsx[0] = vix;
        posx[0] = xi; 
        } else {
        if(i == step) {
    var ax = (rho*PI*r*r*vix*vix * (-cos(angle)*ct - sin(angle))*cp)/2*m;
//on en déduit la nouvelle vitesse sur x
    var vfx = vix + ax*step;
//on en déduit la nouvelle position sur x
    var xf = xi + vix*step + (1/2)*ax*step*step;
    accx[step] = ax;
    velsx[step] = vfx;
    posx[step] = xf;
    
        }else {
            velsx[i] = velsx[i-step] + accx[i-step]*step;
            posx[i] = posx[i-step] + velsx[i-step]*step + (1/2)*accx[i-step]*step*step;
            accx[i] = (rho*PI*r*r*velsx[i]*velsx[i]*(-cos(angle)*ct - sin(angle))*cp)/2*m;
            
        }
        }
    }
// on effectue une deuxième boucle très similaire pour les y
    
// on calcule d'abord la vitesse initiale de la balle sur les y
    var viy = sin(angle)*v;

    for(var i=0; i<end; i+=step) {
        if(i == 0) {
        accy[0] = 0;
        velsy[0] = viy;
        posy[0] = yi; 
        }else {
        if(i == step) {
    var ay = -g + (rho*PI*r*r*viy*viy * (-sin(angle)*ct + cos(angle)*cp))/2*m;
//on en déduit la nouvelle vitesse sur y
    var vfy = viy + ay*step;
//on en déduit la nouvelle position sur y
    var yf = yi + viy*step + (1/2)*ay*step*step;
    accy[step] = ay;
    velsy[step] = vfy;
    posy[step] = yf;
    
        }else {
            velsy[i] = velsy[i-step] + accy[i-step]*step;
            posy[i] = posy[i-step] + velsy[i-step]*step + (1/2)*accy[i-step]*step*step;
            accy[i] = -g + (rho*PI*r*r*velsy[i]*velsy[i]*(-sin(angle)*ct + cos(angle)*cp))/2*m;
            
        }
        }
    }
    for(var i = 0; i<end; i+=step) {
        fill(255);
        if(posy[i] >= 0) {
        ellipse(posx[i]*zoom + 50, -posy[i]*zoom + 400, 300*r, 300*r);
        }
    }
    
Terrain();
    
}

function Terrain() {
// on trace des segments tous les 5 mètres
    for(var i = 0; i<300; i+= 5) {
        line(i*zoom + 50, 400, i*zoom + 10*zoom + 50, 400);
        line(i*zoom + 50, 400, i*zoom + 50, 410);
        text(i, i*zoom + 40, 425);
    }
    line(11.89*zoom + 50, 400, 11.89*zoom + 50, 400-(0.914*zoom));
    
}