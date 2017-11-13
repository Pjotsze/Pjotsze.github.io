    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    
    var a = -2144.5;
    var b = 19312.79;
    var k = b/a;
    
    var minHp;
    var minDef;
    var maxHp;
    var maxDef;
    var krokHp;
    var krokDef;
    
    var minDefenceValue = 1;
    var maxDefenceValue = 3000;
    
    var dmgTaken = document.getElementById("dmgTaken");
    var defenceToGain = document.getElementById("defenceToGain");
    var defSpr = 0;
    
    var defWzr = 0;
    var dmgWzr = 0;
    
    var defWzr = 0;
    var dmgWzr = 0;
    
    var istniejeVisualizacja = false;
    
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    
    zielony  = "rgba(0,150,0,1)";
    czerwony = "rgba(150,0,0,1)";
    czarny   = "rgba(0,0,0,1)";
    
    c.addEventListener('mousemove', function(evt) {
        if(istniejeVisualizacja){
            var mousePos = getMousePos(c, evt);
            ctx.clearRect(550, 0, c.width, c.height);
            if(mousePos.x >= 50 && mousePos.x <= 450 && mousePos.y >= 50 && mousePos.y <= 450){
                if(DMG(minDef + krokDef*(mousePos.x-50), defWzr, dmgWzr) < minHp+krokHp*(mousePos.y-50)){
                    ctx.fillStyle = zielony;
                }else{
                    ctx.fillStyle = czerwony;
                }
                
                ctx.font = "30px Arial";
                ctx.fillText("HP:",550,220);
                ctx.fillText("DEFENCE:",550,280);
                ctx.fillText(parseInt(minHp+krokHp*(mousePos.y-50)),730,220);
                ctx.fillText(parseInt(minDef+krokDef*(mousePos.x-50)),730,280);
            }
        }
    }, false);
    
    
    function DMG(def, defence, dmgTaken){
        return ((Math.log(def) + k)/(Math.log(defence) + k))*dmgTaken;
    }
    
    function plusMinus(wartosc){
        if(wartosc >= 0){
            return "+";
        }
        return "";
    }
    
    function updateDamage(){
        var dmgTakenValue = DMG(defSpr, defWzr, dmgWzr);
        dmgTaken.innerHTML = "You would take: " + dmgTakenValue +" damage";
        var deltaDef = defSpr-defWzr;
        var deltaDmg = dmgTakenValue - dmgWzr;
        defenceToGain.innerHTML = "So " + plusMinus(deltaDef) + deltaDef.toPrecision(4) + " def changed dmg taken by " + deltaDmg.toPrecision(6);
    }
    
    class NumberChosingObject {
        constructor(rangeInput, numberInput, minValue, maxValue) {
            var self = this;
            self.rangeInput  = document.getElementById(rangeInput);
            self.numberInput = document.getElementById(numberInput);
            
            self.rangeInput.max = maxValue
            self.rangeInput.min = minValue
            
            self.numberInput.max = maxValue
            self.numberInput.min = minValue
            
            self.numberInput.value = Math.floor((minValue+maxValue)/2);
            defSpr = self.numberInput.value
            self.rangeInput.value  = numberInput.value;
            
            self.rangeInput.oninput = function() {
                if(this.value > maxValue) this.value = maxValue;
                if(this.value < minValue) this.value = minValue;
                self.numberInput.value = this.value;
                defSpr = self.numberInput.value
                updateDamage();
            }
            self.numberInput.oninput = function() {
                if(this.value > maxValue) this.value = maxValue;
                if(this.value < minValue) this.value = minValue;
                self.rangeInput.value = this.value;
                defSpr = self.numberInput.value
                updateDamage();
            }
            updateDamage();
        }
        
        setValue(value){
            this.rangeInput.value = value;
            this.numberInput.value = value;
            defSpr = value
            updateDamage();
        }
        
        getValue(){
            return this.rangeInput.value;
        }
    }
    
    var numberObject1 = new NumberChosingObject("myRange", "myNumber", minDefenceValue, maxDefenceValue);
    
    
    var defence  = document.getElementById("def");
    defence.oninput = function() {
        if(this.value > maxDefenceValue) this.value = maxDefenceValue;
        if(this.value < minDefenceValue) this.value = minDefenceValue;
        numberObject1.setValue(this.value);
        defWzr = this.value;
        updateDamage();
    }
    
    var damage = document.getElementById("dmg");
    damage.oninput = function() {
        dmgWzr = this.value;
        updateDamage();
    }
    
    var przyciskVisualizacja = document.getElementById("przyciskVisualizacja");
    przyciskVisualizacja.onclick = function() {
        istniejeVisualizacja = true;
        minHp  = 1000.0;
        minDef = 100.0;
        
        maxHp  = Math.max(minHp, DMG(minDef, defWzr, dmgWzr));
        maxDef = Math.max(minDef, Math.exp((minHp/dmgWzr)*(Math.log(defWzr) + k) - k));
        
        krokHp  = (maxHp-minHp)   / 400.0;
        krokDef = (maxDef-minDef) / 400.0;
        
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.font = "30px Arial";
        ctx.fillStyle = czarny;
        ctx.fillText("Defence",200,30);
        ctx.fillText("Hp",     10,250);
        
        for(var i = 50; i <= 450; i+=1){
            for(var j = 50; j <= 450; j+=1){
                if(DMG(minDef + krokDef*(i-50), defWzr, dmgWzr) < minHp+krokHp*(j-50)){
                    ctx.fillStyle = zielony;
                }else{
                    ctx.fillStyle = czerwony;
                }
                
                ctx.fillRect( i, j, 1, 1 );
            
                if(i % 50 == 0 && j == 450){
                    ctx.fillStyle = czarny;
                    ctx.moveTo(i,j);
                    ctx.lineTo(i,j+10);
                    ctx.stroke();
                    ctx.font = "10px Arial";
                    ctx.fillText(parseInt(minDef + krokDef*(i-50)), i-10,j+10+10);
                }
                if(j % 50 == 0 && i == 450){
                    ctx.fillStyle = czarny;
                    ctx.moveTo(i,j);
                    ctx.lineTo(i+10,j);
                    ctx.stroke();
                    ctx.font = "10px Arial";
                    ctx.fillText(parseInt(minHp+krokHp*(j-50)), i+10+5,j+3);
                }
            } 
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    