var minDefenceValue = 1;
    var maxDefenceValue = 3000;
    
    var a = -5;
    var b = 18700.57;
    
    var dmgTaken = document.getElementById("dmgTaken");
    var defenceToGain = document.getElementById("defenceToGain");
    var defSpr = 0;
    
    var defWzr = 0;
    var dmgWzr = 0;
    
    function plusMinus(wartosc){
        if(wartosc >= 0){
            return "+";
        }
        return "";
    }
    
    function updateDamage(){
        dmgTakenValue = (((a*defSpr + b)/Math.log10(defSpr)*dmgWzr*Math.log10(defWzr))/(a*defWzr + b));
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