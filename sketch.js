//On crée des variables globales de Slider
var rS,mS, ctS, cpS, rhoS, angleS, gS;
var txt = [];
// On définit les constantes concernant la ball, et le milieu
var r = 0.032;
var m = 0.14;
var ct = 0.5;
var cp = 0.6;
var rho = 1.28;
var angle = 80;
var g = 9.81;

// On définit les paramètres de la boucle (méthode de Euler)
var step = 0.25;
var end = 100;
// On définit les valeurs initiales de vitesse et position de la simulation
var v = 10;


var xi = 0;
var yi = 0;
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
    
// On définit les constantes concernant la ball, et le milieu
rS = createSlider(0.01, 0.05, 0.032, 0.001);
mS = createSlider(0.01, 5, 0.14, 0.001);
ctS = createSlider(0.01, 1, 0.5, 0.001);
cpS = createSlider(0.01, 1, 0.6, 0.001);
rhoS = createSlider(1, 2, 1.28, 0.001);
angleS = createSlider(0, 89, 80, 0.001);
gS = createSlider(5, 15, 9.81, 0.001);
vS = createSlider(1, 50, v, 0.001);
    
rS.position(700, 50);
mS.position(700, 100);
ctS.position(700, 150);
cpS.position(700, 200);
rhoS.position(700, 250);
angleS.position(700, 300);
gS.position(700, 350);
vS.position(700, 400);
    
}

function draw() {
  background(51);
    
r = rS.value();    
m = mS.value();   
ct = ctS.value();   
cp = cpS.value();   
rho = rhoS.value();   
angle = angleS.value();   
g = gS.value();
v = vS.value();

txt[0] = createDiv('Rayon de la balle');
txt[1] = createDiv('Masse de la balle');
txt[2] = createDiv('Coefficient de trainée');
txt[3] = createDiv('Coefficient de portance');
txt[4] = createDiv('Masse volumique du fluide');
txt[5] = createDiv('Angle de frappe');
txt[6] = createDiv('Accélération de la pesanteur');
txt[7] = createDiv('Vitesse donnée lors de la frappe');
    
 
txt[0].position(850, 50);
txt[1].position(850, 100);
txt[2].position(850, 150);
txt[3].position(850, 200);
txt[4].position(850, 250);
txt[5].position(850, 300);
txt[6].position(850, 350);
txt[7].position(850, 400);
    var vix = cos(angle)*v;
    
    for(var i=0; i<end; i+=step) {
        if(i == 0) {
    var ax = (rho*PI*r*r*vix*vix * (-cos(angle)*ct -cos(PI-angle)*cp))/2*m;
//on en déduit la nouvelle vitesse sur x
    var vfx = vix + ax*step;
//on en déduit la nouvelle position sur x
    var xf = xi + vix*step + (1/2)*ax*step*step;
    accx[0] = ax;
    velsx[0] = vfx;
    posx[0] = xf;
    
        }else {
            velsx[i] = velsx[i-step] + accx[i-step]*step;
            posx[i] = posx[i-step] + velsx[i-step]*step + (1/2)*accx[i-step]*step*step;
            accx[i] = (rho*PI*r*r*velsx[i]*velsx[i]*(-cos(angle)*ct -cos(90-angle)*cp))/2*m;
            
        }
    }
// on effectue une deuxième boucle très similaire pour les y
    
    var viy = sin(angle)*v;;

    for(var i=0; i<end; i+=step) {
        if(i == 0) {
    var ay = -g + (rho*PI*r*r*viy*viy * (-sin(angle)*ct -sin(90-angle)*cp))/2*m;
//on en déduit la nouvelle vitesse sur y
    var vfy = viy + ay*step;
//on en déduit la nouvelle position sur y
    var yf = yi + viy*step + (1/2)*ay*step*step;
    accy[0] = ay;
    velsy[0] = vfy;
    posy[0] = yf;
    
        }else {
            velsy[i] = velsy[i-step] + accy[i-step]*step;
            posy[i] = posy[i-step] + velsy[i-step]*step + (1/2)*accy[i-step]*step*step;
            accy[i] = -g + (rho*PI*r*r*velsy[i]*velsy[i]*(-cos(angle)*ct -cos(90-angle)*cp))/2*m;
            
        }
    }
    for(var i = 0; i<end; i+=step) {
       ellipse(posx[i]*10 + width/2, -posy[i]*10 + height/2, 300*r, 300*r);
    }
}