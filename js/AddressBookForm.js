let isUpdate = false;
let personDataObj = {};
window.addEventListener('DOMContentLoaded',(event) => {
    const name = document.querySelector('#name');
    const textError = document.querySelector('.text-error');
    name.addEventListener('input',function(){
        try{
            checkName(name.value);
            textError.textContent = "";
        }catch(e){
            textError.textContent = e;
        }
    });
    const number = document.querySelector('#number');
    const numberError = document.querySelector('.number-error');
    number.addEventListener('input',function(){
        try{
            checkNumber(number.value);
            numberError.textContent = "";
        }catch(e){
            numberError.textContent = e;
        }
    })
    checkForUpdate();
});

const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try{
        setPersonDataObject();
        if(site_properties.use_local_storage.match("true")){
            createAndUpdateStorage();
            resetForm();
            window.location.replace(site_properties.home_page);
        }else{
            createOrUpdatePerson();
        }
    }catch(e){
        return;
    }
}
const createOrUpdatePerson = () => {
    let postURL = site_properties.server_url;
    let methodCall = "POST";
    if(isUpdate){
        let methodCall = "PUT";
        postURL = postURL + "/" + personDataObj.id.toString();
        methodCall = "PUT";
        postURL = postURL+"/"+personDataObj.id.toString();
    }
    makeServiceCall(methodCall,postURL,true,personDataObj)
     .then(responseText => {
         resetForm();
         window.location.replace(site_properties.home_page);
     })
     .catch(error => {
         throw error;
     })
}
const setPersonDataObject = () => {
    if(!isUpdate && site_properties.use_local_storage.match("true")){
        personDataObj.id = getNewId();
    }
    personDataObj._fullName = getInputValueById('#name'); 
    personDataObj._phoneNumber = getInputValueById('#number') 
    personDataObj._address = getInputValueById('#address') 
    personDataObj._city = getInputValueById('#city')
    personDataObj._state = getInputValueById('#state'); 
    personDataObj._zipCode = getInputValueById('#zipcode'); 
}
const getNewId = () => {
    let personID = localStorage.getItem("PersonID");
    personID = !personID ? 1 : (parseInt(personID) + 1).toString();
    localStorage.setItem("PersonID",personID);
    return personID;
}

const resetForm = () => {
    setValue('#name','');
    setValue('#number','');
    setValue('#address','');
    setValue('#city','Select City');
    setValue('#state','Select State');
    setValue('#zipcode','');
} 


const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const createAndUpdateStorage=()=> {
    let addressBookList = JSON.parse(localStorage.getItem("AddressBookList"));
    if(addressBookList){
        let personData = addressBookList.find(person => person.id == personDataObj.id);
        if(!personData){
            addressBookList.push(personDataObj);
        }else{
            const index = addressBookList.map(person => person.id)
                                         .indexOf(personData.id);
            addressBookList.splice(index,1,personDataObj);
        }
    }else{
        addressBookList = [personDataObj];
    }
    localStorage.setItem("AddressBookList", JSON.stringify(addressBookList));
}
const createPersonData = (id) => {
    let personData = new Person(); 
    if (!id) 
        personData.id = getNewId(); 
    else 
        personData.id = id; 
    setPersonData(personData); 
    return personData; 
} 
const checkForUpdate = () => {
    const personDataJson = localStorage.getItem('editPerson');
    isUpdate = personDataJson ? true : false;
    if(!isUpdate) return;
    personDataObj = JSON.parse(personDataJson);
    setForm();
}

const setForm = () => {
    setValue('#name',personDataObj._fullName);
    setValue('#number',personDataObj._phoneNumber);
    setValue('#address',personDataObj._address);
    setValue('#city',personDataObj._city);
    setValue('#state',personDataObj._state);
    setValue('#zipcode',personDataObj._zipCode);
}

const setTextValue = (id,value) => {
    const element = document.querySelector(id);
    element.value = value;
}

const setValue = (id,value) => {
    const element = document.querySelector(id);
    element.value = value;
}
const cancel = () => {
    window.location.replace(site_properties.home_page);
}