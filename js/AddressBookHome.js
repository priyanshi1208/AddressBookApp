let personList;
window.addEventListener('DOMContentLoaded',(event)=>{
    if(site_properties.use_local_storage.match("true")){
        getPersonDataFromLocalStorage();
    }else{
        getPersonDataFromServer();
    }
});

const processPersonResponse=()=>{
    createInnerHtml();
    localStorage.removeItem('editPerson');
}
function getPersonDataFromLocalStorage(){
    personList= localStorage.getItem('AddressBookList') ?
        JSON.parse(localStorage.getItem('AddressBookList')) : [];
    processPersonResponse();
}
const getPersonDataFromServer = () => {
    makeServiceCall("GET",site_properties.server_url,true)
    .then(responseText => {
        personList = JSON.parse(responseText);
        processPersonResponse();
    })
    .catch(error => {
        console.log("GET Error Status "+JSON.stringify(error));
        personList = [];
        processPersonResponse();
    });

}
const createInnerHtml=()=>{
    if (personList.length == 0) return;
    const headerHtml="<th id='name'>Fullname</th><th id='address'>Address</th><th id='city'>City</th><th id='state'>State</th><th id='zipcode'>ZipCode</th><th id='phoneNumber'>Phone Number</th><th id='actions'></th>"
    let innerHtml = `${headerHtml}`;
    for (const person of personList){
        innerHtml = `${innerHtml}
         <tr>
          <td>${person._fullName}</td>
          <td>${person._address}</td>
          <td>${person._city}</td>
          <td>${person._state}</td>
          <td>${person._zipCode}</td>
          <td>${person._phoneNumber}</td>
          <td>
          <img class="delete-button" id="${person.id}" src="../images/icons/delete-black-18dp.svg" onclick="remove(this)" alt="delete">
          <img class="update-button" id="${person.id}" src="../images/icons/create-black-18dp.svg" onclick="update(this)" alt="edit">
          </td>
        </tr>`;
    }    
    document.querySelector('#display').innerHTML = innerHtml;
}
const remove=(node)=>{
    let personData = personList.find(person => person.id == node.id);
    if(!personData) return;
    const index = personList.map(person => person.id).indexOf(personData.id);
    personList.splice(index,1);
    if(site_properties.use_local_storage.match("true")){
        localStorage.setItem("AddressBookList",JSON.stringify(personList));
        createInnerHtml();
    }else{
        const deleteURL = site_properties.server_url+"/"+personData.id.toString();
        makeServiceCall("DELETE",deleteURL,false)
         .then(responseText => {
             createInnerHtml();
         })
         .catch(error => {
             console.log("Delete error status :"+JSON.stringify(error));
         });
    }
    
}
const update=(node)=>{
    let person = personList.find(person => person.id == node.id);
    if(!person) return;
    localStorage.setItem('editPerson',JSON.stringify(person));
    window.location.replace("../html/AddressBookForm.html");
}