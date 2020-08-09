//Declaring Area

//Declare Custom Rules' Dictionary

let customRules = {};

//Declare first textbox (text) and second textbox (tetx)

const text = document.getElementById("text");
const tetx = document.getElementById("tetx");

//Declare translateSection (the translator's area) and rulesSection (the Custom Rules' Area)
//Declare the switching variable

const rulesSection = document.getElementById("rulesSection");
const translateSection = document.getElementById("translateSection");
var SelectedMode = "Translate";

//Declare add rule's textboxes and custom rules' list

origWord = document.getElementById("origWord");
transWord = document.getElementById("transWord");

customRuleList = document.getElementById("customRuleList");


//Startup and listeners Area

var customRulesData = window.localStorage.getItem("customRules");
if (customRulesData && customRulesData != 'null') {
    customRules = JSON.parse(customRulesData);
}

updateTable();

text.addEventListener('input', (e) => {transTetx();});


//Functions Area


//Function: Translates the text given to the function (Made by Marekkon and edited smth by me)

function translate(input) {
    //Make lower case just to get more matches i guess
    input = input.toLowerCase();
	
	for(let k in customRules) {
		input = input.replace(new RegExp(k, 'g'), altCheck(customRules[k]));
    }
    for(let k in dictionary) {
        input = input.replace(new RegExp(k, 'g'), altCheck(dictionary[k]));
    }
    return input;
}

//Function: Translate directly the textbox (to fix translateButton)

function transTetx() {tetx.value = translate(text.value);}

//Function: 1/5 probablity to break translation even more

function maybeBreakMore(k) {
	//Every last letter of k is divided and added in a list
	var letter1 = k.slice(-1);
	var letter2 = k.slice(-2, -1);
	var letter3 = k.slice(-3, -2);
	var letters = [letter1, letter2, letter3];
	
	if (Math.floor(Math.random() * 5) == 1) {
		return k.replace(k.slice(-3), '') + letters[Math.floor(Math.random() * 3)] + letters[Math.floor(Math.random() * 3)] + letters[Math.floor(Math.random() * 3)];
	}
	else {return k}
}

//Function: Check if a word has alternatives (by looking if it's an array) and if it does, it randomizes one of them. Also applies maybeBreakMore()

function altCheck(k) {
	if (typeof k == "object") {return maybeBreakMore(k[Math.floor(Math.random() * k.length)])}
	else return maybeBreakMore(k);
}

//Function: Redirects to Google Translate which will try to translate the bronke tetx

function tryOnGoogle() {
	if (tetx.value == '') M.toast({html: 'You should translate something first!'});
	else window.location.href = "https://translate.google.com/#view=home&op=translate&sl=en&tl=en&text=" + tetx.value;
}

//Function: Clears the text if clearButton clicked

function clearText() {
	text.value = '';
	tetx.value = '';
}

//Function: Copy tetx to clipborad

function copyTetx() {
	var copyText = document.querySelector("#tetx");
	copyText.select();
	copyText.setSelectionRange(0, 99999);
	document.execCommand("copy");
	M.toast({html: 'Text copied to Clipboard'});
}

//Function: Switches between Rules and Tranlator Sections

function ModeSwitch() {
	if (SelectedMode == 'Translate') {
		SelectedMode = 'Rules';
		translateSection.style = 'display: none';
		rulesSection.style = 'display: inline';
		}
	else {
		SelectedMode = 'Translate';
		translateSection.style = 'display: inline';
		rulesSection.style = 'display: none';
	}
}

//Function: Add a new Rule when asked for

function addRule(orig, trans) {
	customRules[orig] = trans;
}

//Function: Delete an existing custom rule and updates the list

function delRule(rule) {
	delete customRules[rule];
	updateTable();
}

//Function: Update the classesTable and uploads customRules in browser's storage

function updateTable() {
	customRuleList.innerHTML = "";
	for(let k in customRules) {
		var spacerw = document.createElement('div');
		var txt = document.createElement('p');
		txt.innerText = k + " = " + customRules[k];
		txt.classList.add('delglow');
		txt.addEventListener('click', (e) => {delRule(k);});
		spacerw.classList.add("spacerw");
		customRuleList.appendChild(txt);
		customRuleList.appendChild(spacerw);
    }
	window.localStorage.setItem("customRules", JSON.stringify(customRules));
}

//Function: Gets the Quote of the Day using Quotes REST API and translates it

function QuoteOfDay() {
	var request = new XMLHttpRequest();
	request.open("GET", "https://quotes.rest/qod?language=en");
	request.onreadystatechange = () => {
		if (request.readyState == 4 && request.status == 200) {
			text.value = JSON.parse(request.response).contents.quotes[0].quote;
			transTetx();
		}
	}
	request.send();
}

console.log(translate('I will play minecraft in a sec lmao'));