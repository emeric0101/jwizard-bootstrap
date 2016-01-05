# JWizard-boostrap

Par Emeric BAVEUX (Emeric0101)
5 janvier 2016

## Requirements

	* jquery 1 or 2
	* boostrap 3+

## Installation

	* include wizard.js and wizard.css into your html project
	* create a main wrapper with class wizard
	* create a wrapper with class "page" into the wizard
	* call the constructor with $(your main wrapper selector).wizard()
	
## Settings

You can pass to the constructor an object for settings the wizard
```
{
	wizardMode: true, // active or not the wizard now
	callback: null, // the callback called by submitting 
	nextCaption: 'Next', // the name of next button
	previousCaption: 'Previous', // the name of previous button
	submitCaption:'Submit', // the name of submit button (only if callback is specified, else, the button does not exist)
}
```

You can set the title of each page with the balise data-title. You can specify the title of the wizard with data-title on the main wrapper.

You can disable a page with data-enable="false" on the page wrapper

You can add a callback on a page with data-callback="callback1".
```
function callback1() {
	return true; // the user can change the page only if the function of the page's callback return true
}
```
