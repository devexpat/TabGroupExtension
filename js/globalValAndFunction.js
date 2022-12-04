window.tabGroupPrefix = `GROUP`;

function initEventsVariables() {
  console.log("REINIT")
  // get variables for buttons ahere
  window.deleteButton = document.getElementById('delete-group');
  window.addButton = document.getElementById('add-group');
  window.gobackButton = document.getElementById('go-back');
  window.editAddButton = document.getElementById('edit-add-group');
  window.isCheckedArray = document.querySelectorAll('.container input');
  window.dropDownAll = document.querySelectorAll('.dropdown');
  window.boxAll = document.querySelectorAll('.box');
  window.colors = {
    'blue': '#8ab4f7',
    'yellow': '#fed663',
    'purple': '#c589f9',
    'green': '#81c895',
    'red': '#f18b82',
    'pink': '#ff8bcb',
    'orange': '#fbac70',
    'cyan': '#78d9ec',
    'grey': 'grey'
  }

  window.tabGroupsArray = window.tabGroupsArray || [];
  window.zoomLg = document.getElementById('zoom-lg');
  window.zoomReg = document.getElementById('zoom-reg');
  // provides functions for each color picking box => changes color/toggles display when clicked 
  for (let i = 0; i < window.dropDownAll.length; i += 1) {
    // this assigns unique function to dropdown icon for each color box
    window.dropDownAll[i].onclick = () => {
      for (let j = 0; j < window.boxAll.length; j += 1) {
        // if there are other drop downs open other than this one clsoe them
        if (i !== j && window.boxAll[j].classList.contains('active-box')) {
          window.boxAll[j].classList.toggle('active-box');
        }
      }
      window.boxAll[i].classList.toggle('active-box');
    };
    // loops through all color options and all boxes and assigns them all functions, if any of these colors are clicked, assigns the parent element the color of them and toggles
    //active box class. This triggers when the drop down box is opened and a color is clicked.
    for (const color in window.colors) {
      if (color === 'grey') continue
      window.boxAll[i].querySelector(`.${color}-box`).onclick = function () {
        this.parentElement.style.backgroundColor = colors[color];
        this.parentElement.classList.toggle('active-box');
        this.parentElement.setAttribute('value', color);
      }
    }
  }

}
initEventsVariables();
// function that switches a btn elements inner html between two strings
const toggleButtonText = (btn, str1, str2) => {
  btn.innerHTML = (btn.innerHTML === str1) ? str2 : str1;
};

function prepareTemplate(n,edit=false){
  let template='<div class = "center rule"> <label class="container"> <input type="checkbox" '+(edit?'checked=checked':'')+' /> <span class="checkmark"></span> </label> <div class = "rule-content name-content"> <input class ="name" id = "name-'+n+'" value = "" disabled/> </div> <div class = "rule-content"> <input class = "flex-center" id = "url-'+n+'" value ="" disabled /> </div> <div class = "color-content"> <div class = "box" id = "box-'+n+'" value = "grey"> <div class = "blue-box" > </div> <div class = "yellow-box"> </div> <div class = "purple-box"> </div> <div class = "green-box"> </div> <div class = "pink-box"> </div> <div class = "red-box"> </div> <div class = "orange-box"> </div> <div class = "cyan-box"> </div> </div> <div class = "dropdown"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill = "white"> <path d="M143 256.3L7 120.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0L313 86.3c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.4 9.5-24.6 9.5-34 .1zm34 192l136-136c9.4-9.4 9.4-24.6 0-33.9l-22.6-22.6c-9.4-9.4-24.6-9.4-33.9 0L160 352.1l-96.4-96.4c-9.4-9.4-24.6-9.4-33.9 0L7 278.3c-9.4 9.4-9.4 24.6 0 33.9l136 136c9.4 9.5 24.6 9.5 34 .1z"/> </svg> </div> </div></div>';
  const ruleblock = document.getElementById('ruleBlock');
  let currentHtml=ruleblock.innerHTML;
  ruleblock.innerHTML=(currentHtml+template);

}
// Looks at second argument for parent element, if it has parent element
// that doesn't have class of dropdown and doesn't match element in the elmeArr toggles
// active-box away from it, ignores drop down when clicked since
// we have a functoin for that already that toggles when that is clicked among other things.
const determineClickHandlerInB = (elemArr, elemToMatch) => {
  for (let i = 0; i < elemArr.length; i += 1) {
    if (elemToMatch.parentElement) {
      // check if the element is the svg clicked, the path in the svg or dropdown, if any of these
      // use the other click handler set for dropdown instead
      // without this two click events are fired leading to issues with drop down boxes not closing properly
      if (!elemToMatch.classList.contains('dropdown') &&
        !elemToMatch.parentElement.classList.contains('dropdown') && elemToMatch.tagName !== 'path' &&
        elemToMatch.parentElement !== elemArr[i]) {
        elemArr[i].classList.toggle('active-box');
      }
    }
  }
};

  // click outside drop down to close 
  document.addEventListener('mouseup', (e) => {
    // if the target of the click isn't the container nor a descendant of the container
    const activeBoxes = document.querySelectorAll('.active-box');
    determineClickHandlerInB(activeBoxes, e.target);
  });
// make chormestorage get a promise instead of callback avoid callback hell
function chromeStorageGet(result) {
  return new Promise((resolve, reject) => {
    if (resolve) {
      resolve(result);
    } else {
      reject();
    }
  });
}
function buildRows(){
  let ruleblock = document.getElementById('ruleBlock');
  ruleblock.innerHTML='';
  chromeStorageGet(chrome.storage.sync.get(['TABGROUPS'])).then((result) => {
    if (Object.keys(result).length !== 0) {
      window.tabGroupsArray = [];
      for (let i = 0; i < result.TABGROUPS.length; i += 1) {
        prepareTemplate(i);
      }
      const names = document.querySelectorAll('.name');
      const urls = document.querySelectorAll('.flex-center');
      const boxes = document.querySelectorAll('.box');
      for (let i = 0; i < result.TABGROUPS.length; i += 1) {
        if (result.TABGROUPS[i] === null) result.TABGROUPS[i] = {}
        window.tabGroupsArray.push(result.TABGROUPS[i]);
        const group = `GROUP${String(i + 1)}`;
        if (
          Object.prototype.hasOwnProperty.call(result.TABGROUPS[i], group) &&
          result.TABGROUPS[i][group].NAME !== undefined
        ) {
          names[i].setAttribute('value', result.TABGROUPS[i][group].NAME);
          urls[i].setAttribute('value', result.TABGROUPS[i][group].URL);
          boxes[i].setAttribute('value', result.TABGROUPS[i][group].COLOR);
          boxes[i].style.backgroundColor =  window.colors[result.TABGROUPS[i][group].COLOR];
        }
      }
    }
    initEventsVariables();
  });
}
window.onload = () => {
 buildRows();
};

// Switches an elements display between none and block
const toggleElementDisplay = (elem) => {
  const selectedElem = elem;
  if (window.getComputedStyle(selectedElem, null).display === 'block') {
    selectedElem.style.display = 'none';
  } else {
    selectedElem.style.display = 'block';
  }
};

// Toggles input disabled from true and false and border to none and solid px effectively
const toggleInputDisabled = (elem) => {
  const selectedElem = elem;
  selectedElem.disabled = !selectedElem.disabled;
  selectedElem.style.border = selectedElem.disabled ? 'none' : '1px solid grey'
};

// Hides and unhides the dropdown box for the color picker box
const toggleDropdownBox = (elem) => {
  const selectedElem = elem;
  selectedElem.style.display = (window.getComputedStyle(selectedElem, null).display === 'none') ? 'flex' : 'none'
};

// helper function for toggling input and dropdown
const toggleInputAndDropdown = (nameField, urlField, dropDown) => {
  toggleInputDisabled(nameField);
  toggleInputDisabled(urlField);
  toggleDropdownBox(dropDown);
}

// helper function for toggling display elements
let toggleDisplays = (button) => {
  toggleElementDisplay(document.getElementById('go-back'))
  toggleElementDisplay(deleteButton)
  toggleButtonText(window.editAddButton, "Edit", "Save")
}

// helper function for setting field values
let setValues = (nameField, urlField, box, title, url, color) => {
  try{
    nameField.setAttribute('value', title)
    nameField.value = title
    urlField.setAttribute('value', url[0])
    urlField.value = url[0]
    box.setAttribute('color', color);
    box.style.backgroundColor = window.colors[color]
  }catch(e){
    console.log(e);
  }
  
}

// Returns true if either name or url or color field is blank if it is checked in tool false othersiwe
const isBlank = (isCheckedArray, checkedNameField, checkedUrlField, boxField) => {
  for (let i = 0; i < isCheckedArray.length; i += 1) {
    if (isCheckedArray[i].checked) {
      if (!checkedNameField[i].value || !checkedUrlField[i].value ||
        boxField[i].getAttribute('value') === 'grey') {
        return true
      }
    }
  }
  return false;
}
window.addEn=false;
let addGroup = () => {
  const isCheckedArray = document.querySelectorAll('.container input:checked');
  if(isCheckedArray.length){ return; }
  const rows=document.querySelectorAll('.center.rule');
  console.log("ADD",rows.length,rows);
  window.addEn=true;
  prepareTemplate(rows.length,true);
  console.log("ADDed",rows.length,rows);
  initEventsVariables();
  editGroup();

}

let editGroup = () => {
  console.log("RUNING")
  const isCheckedArray = document.querySelectorAll('.container input');
  const inputBox = document.querySelectorAll('.container');
  const checkedNameField = document.querySelectorAll('.name');
  const checkedUrlField = document.querySelectorAll('.flex-center');
  const dropDownBox = document.querySelectorAll('.dropdown');
  const boxField = document.querySelectorAll('.box');

  // if save button clicked  because should be only
  // Save Button text when delete button is not visible
  if (window.editAddButton.innerHTML=='Save') {
    saveButtonLogic(this, inputBox, isCheckedArray, checkedNameField, checkedUrlField, boxField, dropDownBox);
    buildRows();
  } 
  else {
    if(isChecked(isCheckedArray)) {
      editButtonLogic(this, isCheckedArray, checkedNameField, checkedUrlField, dropDownBox);
    }
    else {
      ModalWindow.openModal({
      title:'No Group Checked!',
      content: 'Please check tab group to edit/add a rule!'
    })
    }
  }
}

// Get input value as typed and update its value attribute 
function updateInputWhenTyped(e) {
  e.target.setAttribute('value', e.target.value);
}
// Loops through list and sees if a value is checked, if not returns false otherwise returns true
let isChecked = (isCheckedArray) => {
  let checkedInput = false;
  for (let i = 0; i < isCheckedArray.length; i ++) {
    if (isCheckedArray[i].checked) checkedInput = true
  }
  return checkedInput;
}
let goBackButtonLogic = () => {
  // toggle element display buttons
  toggleDisplays(window.editAddButton)
  // update pointer events for check boxes
  document.querySelectorAll('.container').forEach(e => e.style.pointerEvents = 'auto')
  // loop through the tabGroupsArray and set corresponding values
  console.log("GO BACK:",window.tabGroupsArray)
  buildRows();
}
let deleteButtonLogic = (isCheckedArray) => {
  let tabGroupsArray=window.tabGroupsArray;
  for (let i = 0; i < isCheckedArray.length; i++) {
    const rowElement=document.querySelectorAll('.center.rule')[i];
    // runs on last item, if checked => remove everything and end here, if not => return 
    if (isCheckedArray[i].checked && !isCheckedArray[i].getAttribute('removed')) {
      //setValues(checkedNameField, checkedUrlField, box, '', [''], 'grey')
      rowElement.style.display='none';
      isCheckedArray[i].setAttribute('removed',true);
      // remove this from tabsGroupArray which should be array of all groups retrieved from google Sync
     // if(typeof tabGroupsArray[i]!=='undefined'){
        console.log("Deleting ",tabGroupsArray.length,i,1)
        tabGroupsArray.splice(i,1);
     // }
    }
  }
  chrome.storage.sync.set({
    TABGROUPS: tabGroupsArray
  });
  buildRows();
}
// save logic
let saveButtonLogic = (button, inputBox, isCheckedArray, checkedNameField, checkedUrlField, boxField, dropDownBox) => {
  // Loops through all rules if any are checked if they are blank 
  if (isBlank(isCheckedArray, checkedNameField, checkedUrlField, boxField)) {
    ModalWindow.openModal({
      title: 'Field is Blank!',
      content: 'Make sure name and url fields are not blank, and color box is not grey!'
    })
    return;
  }
  tabGroupsArray = [];
  // unchecks everything that is checked
  for (let i = 0; i < isCheckedArray.length; i += 1) {
    const groupNumber = `GROUP${String(i + 1)}`;
    inputBox[i].style.pointerEvents = 'auto';
    // let matchingText = checkedUrlField[i].value;
    // let matchingTextSplitComma = matchingText.split(',');
    // let matchingTextRemoveSpace = matchingTextSplitComma.map((item) => item.trim());
    if (isCheckedArray[i].checked) {
      tabGroupsArray.push({
        [groupNumber]: {
          COLOR: document.querySelectorAll('.box')[i].getAttribute('value'),
          NAME: checkedNameField[i].value,
          URL: checkedUrlField[i].value.split(',').map((item) => item.trim()),
        },
      });
      toggleInputAndDropdown(checkedNameField[i], checkedUrlField[i], dropDownBox[i])
      isCheckedArray[i].checked = false;
    } else if (checkedNameField[i].value && checkedUrlField[i].value &&
      boxField[i].getAttribute('value') !== 'grey') {
      tabGroupsArray.push({
        [groupNumber]: {
          COLOR: document.querySelectorAll('.box')[i].getAttribute('value'),
          NAME: checkedNameField[i].value,
          URL: checkedUrlField[i].value.split(',').map((item) => item.trim()),
        },
      });
    } else {
      tabGroupsArray.push({});
    }
  }
  chrome.storage.sync.set({
    TABGROUPS: tabGroupsArray
  });
  toggleDisplays(button)
}
let editButtonLogic = (button, isCheckedArray, checkedNameField, checkedUrlField, dropDownBox) => {
  for (let i = 0; i < isCheckedArray.length; i += 1) {
    document.querySelectorAll('.container')[i].style.pointerEvents = 'none';
    if (isCheckedArray[i].checked) {
      toggleInputAndDropdown(checkedNameField[i], checkedUrlField[i], dropDownBox[i])
    }
  }
  toggleDisplays(button)
}