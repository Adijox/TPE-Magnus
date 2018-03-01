// valeur du zoom sur l'espace de dessin
var zoom = 13;

//On crée des variables globales de Slider
var rS,mS, ctS, sS, rhoS, angleS, gS;
var S = [];
var txt = [];
var Smin = [0.01,0.01, 0.001,-500,1,0,1,1,1];
var Smax = [0.05,5,10,300,10,89,15,50,50];

var Sstep = [0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.5];
// On définit les constantes concernant la balle, et le milieu
var r = 0.032;
var m = 0.055;
var ct = 0.5;
var s = 5;
var rho = 1.28;
var angle = 30;
var g = 9.81;

// On définit les paramètres de la boucle (méthode de Euler)

var step = 0.125;
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


var inputs = [];
var focus = [];

var Sval = [r,m,ct,s,rho,angle,g,v,zoom];
function setup() {
    createCanvas(600, 600);
    background(51);
    angleMode(DEGREES);
    textSize(15);
    

// On définit les constantes concernant la balle, et le milieu
    for(var i = 0; i < 9; i++) {
        S[i] = createSlider(Smin[i], Smax[i], Sval[i], Sstep[i]);
        S[i].id('slid' + i);
        S[i].position(700, i*50 + 50);
    }
//On crée ensuite les zones d'entrée qui correspondent à chaque curseur, dont elles héritent la valeur (Sval[i])
    for(var i = 0; i < S.length; i++) {
        inputs[i] = createInput(Sval[i]).size(50);
    }

    for(var i = 0; i < S.length; i++) {
        inputs[i].position(630, i*50 + 50);
        inputs[i].id('champs' + i);
        focus[i] = false;
    }
}

function draw() {
//--------------------
//Première partie du programme : mise en place de l'interface graphique (curseurs, zones de texte et d'entrée)
//--------------------
    background(51);
    fill(255);
//On supprime les textes affichés et les boites d'entrée pour en dessiner de nouveaux, avec des valeurs actualisées
    for(var i = 0; i < txt.length; i++) {
        txt[i].remove();
    }

r = S[0].value(); 
m = S[1].value();   
ct = S[2].value();   
s = S[3].value();   
rho = S[4].value();   
angle = S[5].value();   
g = S[6].value();
v = S[7].value();
zoom = S[8].value();


//Puis tous les boites d'entrées 
    for(var i = 0; i < S.length; i++) {
//fonction nécessaire au bon fonctionnement de Jquery dans une boucle 'for' (méthode de 'closure') 
        (function(i) {
        var paramname;
//On associe à chaque valeur de i le nom d'un des paramètres
    switch(i) {
        case 0:paramname = r;
            break;
        case 1:paramname = m;
            break;
        case 2:paramname = ct;
            break;
        case 3:paramname = s;
            break;
        case 4:paramname = rho;
            break;
        case 5:paramname = angle;
            break;
        case 6:paramname = g;
            break;
        case 7:paramname = v;
            break;
        case 8:paramname = zoom;
            break;
            
            
            }
//Systeme de détection de la sélection d'un champ d'entrée qui permet de momentanément désactiver la syncro slider-textbox
         $('#champs' + i).bind('input propertychange', function() {
             console.log(i + ' is on focus');
        focus[i] = true;
    });
    $( "#champs" + i ).blur( function() {
    focus[i] = false;
});

    $("#champs" + i).keypress(function(e) { 
        if (e.which == 13) {

            $(this).blur();
            
            paramname = $('#champs'+ i).val();
            $('#slid' + i).val(paramname);
            console.log(S[i].value() + ' S à value ');
            e.which = -2;
        }
             

});
        
//Dès que le slider change de position, on affiche une nouvelle boite dentrée anvec la nouvelle valeur actualisée
if( document.getElementById('champs' + i).value != paramname && focus[i] == false) {
    inputs[i].remove();
    
    inputs[i] = createInput(paramname).size(50);
    inputs[i].id('champs' + i);

    } 
//Enfin, on s'assure que les zones d'entrée sont bien positionnées
inputs[i].position(630, i*50 + 50);
    })(i);
}

//On dessine tous les textes avec les nouvelles valeurs
txt[0] = createDiv('Rayon de la balle : ' + r + ' m').position(880, 50);
txt[1] = createDiv('Masse de la balle : ' + m + ' kg').position(880, 100);
txt[2] = createDiv('Coefficient de trainée : ' + ct).position(880, 150);
txt[3] = createDiv('Vitesse angulaire donnée à la balle : ' + s + ' rad/s ( ' + Number((s)/(2*PI)).toFixed(1) + ' tours/sec)').position(880, 200);
txt[4] = createDiv('Masse volumique du fluide : ' + rho + ' kg*m^-3').position(880, 250);
txt[5] = createDiv('Angle de frappe : ' + angle + '°').position(880, 300);
txt[6] = createDiv('Accélération de la pesanteur : ' + g + ' m*s^-2').position(880, 350);
txt[7] = createDiv('Vitesse donnée lors de la frappe : ' + v + ' m*s^-1').position(880, 400);
txt[8] = createDiv('Zoom : ' + zoom).position(880, 450);
 
    
    
    
//--------------------
// Deuxième partie du programme : La méthode d'Euler et l'application des formules de force
//--------------------
    
// on calcule d'abord la vitesse initiale de la balle sur les x    
var vix = cos(angle)*v;
    
    for(var i=0; i<end; i+=step) {
        i = Number((i).toFixed(5));
        if(i == 0) {
        accx[0] = 0;
        velsx[0] = vix;
        posx[0] = xi; 
        } else {
        if(i == step) {
    var ax = ((1/2)*(rho*PI*r*r*vix*vix * (-cos(angle)*ct))
             +(4/3)*4*PI*PI*r*r*r*-s*rho*vix*sin(angle))/m;
//on en déduit la nouvelle vitesse sur x
    var vfx = sqrt(vix*vix+2*ax);
//on en déduit la nouvelle position sur x
    var xf = xi + vix*step + (1/2)*ax*step*step;
    accx[step] = ax;
    velsx[step] = vfx;
    posx[step] = xf;
    
        }else {
            posx[i] = posx[i-step] + velsx[i-step]*step + (1/2)*accx[i-step]*step*step;
            velsx[i] = ((2*(posx[i]-posx[i-step]))/step) - velsx[i-step];
            accx[i] = ((1/2)*(rho*PI*r*r*velsx[i]*velsx[i]*(-cos(angle)*ct)) 
                       + (4/3)*4*PI*PI*r*r*r*-s*rho*velsx[i]*sin(angle))/m;

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
    var ay = -g + ((1/2)*(rho*PI*r*r*viy*viy * (-sin(angle)*ct))
                  +(4/3)*4*PI*PI*r*r*r*-s*2*PI*rho*viy*cos(angle))/m;
//on en déduit la nouvelle vitesse sur y
    var vfy = viy + ay*step;
//on en déduit la nouvelle position sur y
    var yf = yi + viy*step + (1/2)*ay*step*step;
    accy[step] = ay;
    velsy[step] = vfy;
    posy[step] = yf;
    
        }else {
            posy[i] = posy[i-step] + velsy[i-step]*step + (1/2)*accy[i-step]*step*step;
            velsy[i] = ((2*(posy[i]-posy[i-step]))/step) - velsy[i-step];
            accy[i] = -g + ((1/2)*(rho*PI*r*r*velsy[i]*velsy[i]*(-sin(angle)*ct))
                           +(4/3)*4*PI*PI*r*r*r*-s*2*PI*rho*velsy[i]*cos(angle))/m;  
            }
        }
    }
    
//On réinitialise tous les éléments de la liste focus à false
    for(elt of focus) {
        elt = false;
    }
        
Affichage();
Terrain();
    
}

function Terrain() {
// On ajuste la taille d'écriture au zoom
    if(zoom < 8) {
        textSize(8);
    }else{
        textSize(15);
    }
// on trace des segments tous les 5 mètres
    for(var i = 0; i<300; i+= 5) {
        
        //échelle horizontale
        line(50, 400, i*zoom + 10*zoom + 50, 400);
        line(i*zoom + 50, 400, i*zoom + 50, 410);
        text(i, i*zoom + 40, 425);
        //échelle verticale
        line(50, 400, 50, -i*zoom+400);
        line(50, 400 - i*zoom, 40, -i*zoom+400);
        
        text(i, 20, 405 - i*zoom);
    }
    line(11.89*zoom + 50, 400, 11.89*zoom + 50, 400-(0.914*zoom));
    
}
function Affichage() {
    for(var i = 0; i<end; i+=step) {
        fill(255);
//On repère les deux points les plus proches du filet
        if(posx[i] > 11.89 && posx[i-step] < 11.89) {
//On détermine la droite qui passe par ces deux points
            var a = (posy[i]-posy[i-step])/(posx[i]-posx[i-step]);
            var b = posy[i]-(a*posx[i]);
           break;
        }
    }
// on vérifie pour chaque point s'il respecte les conditions nécessaires pour etre affiché
    for(var i = 0; i<end; i+=step) {

        if((a*(11.89) + b - r > 0.914 || posx[i] < 11.89)  && posy[i] > 0) {
//conditions si-dessus:     ^                                  ^
//             l'ordonnée de la balle doit etre             on ne dessine que les 
//             supérieure à celle du filet et son           balles au-dessus de
//             rayon doit lui permettre de passer           la surface du terrain
           
// On dessine la balle (de rayon indépendant du zoom pour un confort visuel)
                ellipse(posx[i]*zoom + 50, -posy[i]*zoom + 400, 300*r, 300*r);
   
        }else{
//On différencie les motifs de faute
            //On commence par les balles trop courtes/longues
            if(posy[i-step] > 0 && ((posx[i] + posx[i-step])/2 < 11.89 || (posx[i] + posx[i-step])/2 > 23.77) ) {
                if(a*(11.89) + b - r < 0.914 && a*(11.89) + b - r > 0) {
                Faute('Filet');
            }else if((posx[i] + posx[i-step])/2 < 11.89) {
                    Faute('Balle trop courte');
                }else{
                   Faute('Balle trop longue'); 
                }
        }
            // Puis les balles dans le filet
            
        }
    }
}

function Faute(motif) {
    fill(255, 0, 0);
    text('Faute : ' + motif, 150, 100);
    fill(255);
}

function refreshValue() {
    console.log(this.value());
}
