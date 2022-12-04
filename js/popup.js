// when delete button clicked removes the group number
// from google sync and from the popup page of extension
window.deleteButton.addEventListener('click', async () => {
  const isCheckedArray = document.querySelectorAll('.container input:checked');

  //use method isChecked to loop through checkboxes and see if checked or not 
  // if checked displays conirmation message, if nothing checked displays erro rmessage
  if(isCheckedArray.length) {
    ModalWindow.openModal({
      title: "Do you want to delete?",
      content: "This will permanently delete selected rules",
      buttons: true
    })
  }
  else {
    ModalWindow.openModal({
    title:'No Group Checked!',
    content: 'Please check tab group to delete a rule!'
  })
  }
});

window.addButton.addEventListener('click', async () => {
  addGroup(); 
});

window.gobackButton.addEventListener('click', async () => {
  // deleteButtonLogic(isCheckedArray, tabGroupsArray, dropDownBox, true)
  goBackButtonLogic()
})
window.editAddButton.addEventListener('click', async function ()  {
  editGroup()
});

zoomLg.addEventListener('click', async() => {
  document.getElementById('page-style').setAttribute('href', "/css/style.css")
  document.getElementById('alert-style').setAttribute('href', "/css/alert-boxes.css")
})
zoomReg.addEventListener('click', async() => {
  document.getElementById('page-style').setAttribute('href', "/css/styles2.css")
  document.getElementById('alert-style').setAttribute('href', "/css/alert-boxes2.css")
})
