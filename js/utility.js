
const checkName = (fullName) => {
    let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
    if(!nameRegex.test(fullName)) throw 'Enter Valid Name';
}

const checkNumber = (phoneNumber) => {
    let phnRegex = RegExp('\\d{2}\\d{10}');
    if(!phnRegex.test(phoneNumber)) throw 'Enter Valid Number'
      
}