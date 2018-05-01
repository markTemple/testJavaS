//(() => {
// get info from php scripts as to which rithm was chosen
//alert(frameNum);
//let PHP_Algorithm = '3bp'

function algorithmOptions(frameNum) {
	let mapping = {
		'3': [3, 1], // Reading frame codons
		'1': [3, 3], // Protein sequence
		'3bp': [3, 1], // Tri-nucleotides
		'2bpx2': [2, 1], // Di-nucleotide pairs
		'2bp': [2, 2], // Di-nucleotides
		'1bp': [1, 1] // Mono-nucleotides
	};
	return mapping[frameNum];
}
function codonToFreq(motif) {
	let mapping = {
		xxx: 0,
		g: 220,
		a: 440,
		t: 660,
		c: 880,
		ag: 164.81,
		tg: 174.61,
		cg: 196,
		gg: 220,
		aa: 246.94,
		ta: 261.63,
		ca: 293.66,
		ga: 329.63,
		at: 349.23,
		tt: 392,
		ct: 440,
		gt: 493.88,
		ac: 523.25,
		tc: 587.33,
		cc: 659.26,
		gc: 698.46,
		gca: 164.81,
		gcc: 164.81,
		gcg: 164.81,
		gct: 164.81,
		aga: 164.81,
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
		tgt: 246.94,
		caa: 261.63,
		cag: 261.63,
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
	};
	return mapping[motif];
}
function getDNAmotif(index, dna, motif_len) {
	if (motif_len === 3) {
		return [dna[index], dna[index + 1], dna[index + 2]].join('');
	} else if (motif_len === 2) {
		return [dna[index], dna[index + 1]].join('');
	} else if (motif_len === 1) {
		return dna[index];
	} else {
		throw new Error('error in getDNAmotif');
	}
}

window.onload = function() {
	var canvas = document.getElementById("dnapaper"),
		c = canvas.getContext("2d");

	//get stopstart seq from php scripts
	// get dna2 seq from php scripts
	let mode = '';
	if (mode === 'php') {
		var dna = dna2.toLowerCase().split('');
		var motif_len = algorithmOptions(frameNum)[0]; // from PHP scripts
		var RF_numb = algorithmOptions(frameNum)[1]; // from PHP scripts
	} else {
		//var dna = 'gggggggggtgagggggggtgagggggggtgaatgggggatgggggatgggggggggggg'.toLowerCase().split('');
		//var dna = 'ggggggggggggggtgagtgagtgaatggatggatgggggggggggggggggggggtgagtgagtgaatggatggatgggggggggggggggggggggtgagtgagtgaatggatggatgggggggggggggggggggggtgagtgagtgaatggatggatggggggg'.toLowerCase().split('');
		var motif_len = 3;
		var RF_numb = 1;
		//var stopstart = 'strict';
	}

	var dnaArray = ['ggggggggggtgagggggggggggggtgacgacagcccgacgaatggatgccccccggggggggggtgagggggggggggggtgacgacagcccgacgaatggatgccccccggggggggggtgagggggggggggggtgacgacagcccgacgaatggatgccccccggggggggggtgagggggggggggggtgacgacagcccgacgaatg'.toLowerCase().split(''), 'gggggggggtgaggggtga'.toLowerCase().split('')];

	var dna = dnaArray[0];

	let AudioContext = window.AudioContext || window.webkitAudioContext;
	let DNAaudioContext = new AudioContext();
	const animationQueue = []


	// cancel requestAnimationFrame at end of sequence...
	let silentWave = []

	function LoopMotifToNote(index) {
		// console.log(currentTime)
		// console.log(dna)
		let wave_type = index % motif_len; //counter 0, 1, 2
		let motif = getDNAmotif(index, dna, motif_len); // get  1, 2, 3 seq, example g or gg or ggg
		if (motif.length !== motif_len) return // dont play last couple of gg or g when want
		if (motif === 'tga' || motif === 'tag' || motif === 'taa') {
			// if (/^(tga|tag|taa)$/.test(motif)) {
			silentWave[wave_type] = true
			console.log(index, motif, 'silentWave', silentWave);
		} else if (motif === 'atg') {
			silentWave[wave_type] = false // play normally
			console.log(index, motif, 'silentWave', silentWave);
		}
		if (!silentWave[wave_type]) {
			let freq = codonToFreq(motif); // march seq to frequence of note eg, A = 440Hz
			let time = +(index * 0.16) // set interval between notes
			//console.log('ADD', index, freq, 'time', time, 'wave_type', wave_type, motif);
			//console.log(index, freq, 'time', time, 'wave_type', wave_type, motif);
			MakeOscillatorNote(freq, time, wave_type, motif); //play the note
		}
		//window.requestIdleCallback(() => LoopMotifToNote(index + 1));
		//window.requestAnimationFrame(() => LoopMotifToNote(index + RF_numb));
		//setTimeout(() => LoopMotifToNote(index + 1));
		LoopMotifToNote(index + 1);
	}

	function MakeOscillatorNote(freq, time, wave_type, motif) {
		animationQueue.push({freq,time,wave_type,motif})
		let oscillator = DNAaudioContext.createOscillator();
		let stoptime = time + 0.15;
		let DNAgain = DNAaudioContext.createGain();
		let wave = ['square', 'triangle', 'sawtooth'];
		oscillator.type = wave[wave_type];
		oscillator.frequency.setValueAtTime(freq, time);
		var filter = DNAaudioContext.createBiquadFilter();
		filter.type = 'lowpass';
		filter.frequency.value = 1300;
		filter.Q.value = 0;
		//filter.gain.value = 0; //not used for lowpass
		DNAgain.gain.setValueAtTime(0.16, time);
		DNAgain.gain.exponentialRampToValueAtTime(0.01, time + stoptime);
		oscillator.connect(filter);
		filter.connect(DNAgain);
		DNAgain.connect(DNAaudioContext.destination);
		oscillator.start(DNAaudioContext.currentTime + time);
		oscillator.stop(DNAaudioContext.currentTime + stoptime);
	}
	LoopMotifToNote(0, 0);


function clearCanvas(time) {
	c.clearRect(0,0,width,height);
}

	var posX = 0;
	function drawShapesInCanvas(time) {
		posX = time * 10 +100;
		posY = 90;
		c.fillStyle = "rgba(255,0,0,0.8)";
		c.beginPath();
		c.arc(posX, posY, 60, 0, Math.PI * 2, false);
		c.fill();
	};

	function printTextInCanvas(motif, time, wave_type) {
		c.fillStyle = "black";
		c.font = '24px serif';
		posX = time * 10 +100;
		posY = 75 + 25*wave_type;
		c.beginPath();
		c.fillText(motif, posX, posY);
		posX = 10;
		posY = 75 + 25*wave_type;
		c.beginPath();
		c.fillText(wave_type, posX, posY);
	}

	function syncThis() {
		const items = animationQueue.filter((x) => {
			return DNAaudioContext.currentTime >= x.time
			console.log(index, freq, 'time', time, 'wave_type', wave_type, motif);

		})
		animationQueue.splice(0, items.length)
		for (const item of items) {
			drawShapesInCanvas(item.time)
			printTextInCanvas(item.motif, item.time, item.wave_type)
		}
		window.requestAnimationFrame(() => syncThis())

	};
	syncThis()
} //end window.onload
//})();
