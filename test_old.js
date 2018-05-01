(function () {
var dna ="gtacatggtacatggtacatg".toLowerCase();
console.log(dna);

function sliceDNA(dna){
	return dna.slice(0,3);
}

function codon_toNumb(codon){
	var mapping = {
		gca: 164.81,
		gcc: 164.81,
		gcg: 164.81,
		gct: 164.81,
		aga: 174.61,
		agg: 174.61,
		cga: 174.61,
		cgc: 174.61,
		cgg: 174.61,
		cgt: 174.61,
		aac: 196,
		aat: 196,
		gac: 220,
		gat: 220,
		tgc: 246.94,
		tgt: 261.63,
		caa: 261.63,
		cag: 261,
		gaa: 293.66,
		gag: 293.66,
		gga: 329.63,
		ggc: 329.63,
		ggg: 329.63,
		ggt: 329.63,
		cac: 349.23,
		cat: 349.23,
		ata: 392,
		atc: 392,
		att: 392,
		cta: 440,
		ctc: 440,
		ctg: 440,
		ctt: 440,
		tta: 440,
		ttg: 440,
		aaa: 493.88,
		aag: 493.88,
		atg: 523.25,
		ttc: 587.33,
		ttt: 587.33,
		cca: 659.26,
		ccc: 659.26,
		ccg: 659.26,
		cct: 659.26,
		agc: 698.46,
		agt: 698.46,
		tca: 698.46,
		tcc: 698.46,
		tcg: 698.46,
		tct: 698.46,
		taa: 783.99,
		tag: 783.99,
		tga: 783.99,
		aca: 880,
		acc: 880,
		acg: 880,
		act: 880,
		tgg: 987.77,
		tac: 1046.5,
		tat: 1046.5,
		gta: 1174.7,
		gtc: 1174.7,
		gtg: 1174.7,
		gtt: 1174.7
	}

	return mapping[codon];
}

var numb_codon =[ [],[],[] ];
var noteSeqAll = [];
var mycnt = 0;
function eatDNA(dna){
	if (dna.length < 3){
			return (dna);
		}else{
			if(mycnt == 3){mycnt = 0;}
			sliced = sliceDNA(dna);
			numb64 = codon_toNumb(sliced);
			/*numb_codon[mycnt].push(numb64); three frames*/
			noteSeqAll.push(numb64);/*combined frames*/
			mycnt++;
			eatDNA(dna.substr(1));
		}
		/*return numb_codon;*/
		return noteSeqAll;
	}
var codonArray = eatDNA(dna);

console.log(codonArray);

	var DNAaudioContext;
	DNAaudioContext = new AudioContext();

function createContext() {
var frameNumb = 0;
for (var i = 0; i < codonArray.length; i++) {
	if(frameNumb == 3){frameNumb = 0;}
			var freq = codonArray[i];
			var time = i*0.16
			codon_Sound(freq, time, frameNumb)
			frameNumb++;
	};
}
createContext()

		function codon_Sound(freq, time, frameNumb){
			var oscillator = DNAaudioContext.createOscillator();
			var stoptime = time+0.15;
	    var DNAgain = DNAaudioContext.createGain();

			var wave = ['sine','square', 'sawtooth'];
			oscillator.type = wave[frameNumb];

			oscillator.frequency.setValueAtTime(freq, time);

			DNAgain.gain.setValueAtTime(0.25, time);
			DNAgain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);

			oscillator.connect(DNAgain);
			DNAgain.connect(DNAaudioContext.destination);

			oscillator.start(DNAaudioContext.currentTime + time);
			oscillator.stop(DNAaudioContext.currentTime + stoptime);
		}

		/*createContext();*/

})();
