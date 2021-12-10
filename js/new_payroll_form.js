/*Creating Event Handler to Show Error when there is no element in name*/ 
let isUpdate = false;
let employeePayrollObj = {};
window.addEventListener('DOMContentLoaded',(event)=>{
    const name=document.querySelector('#name');
    const textError = document.querySelector('.text-error');
    name.addEventListener('input',function(){
        if(name.value.length == 0){
            textError.textContent="";
            return;
        }
        try{                                                                //Try catch block to catch error thrown when name entered is according to regex.
            (new EmployeePayrollData()).name=name.value;;
            textError.textContent="";
        }
        catch(e){
            textError.textContent=e;
        }
    });
    const salary= document.querySelector('#salary');                        //Event Handler to update value when we scroll salary column
    const output =document.querySelector('.salary-output');

    output.textContent=salary.value;
    salary.addEventListener('input',function(){
        output.textContent=salary.value;
    });

    var date = document.getElementById("day");
    var month = document.getElementById("month");
    var year = document.getElementById("year");
    const dateError = document.querySelector(".date-error");
    
    date.addEventListener("input", validateDate);
    month.addEventListener("input", validateDate);
    year.addEventListener("input", validateDate);

    function validateDate() {
    let startDate = Date.parse(year.value + "-" + month.value + "-" + date.value);
    try {
      new EmployeePayrollData().startDate = startDate;
      dateError.textContent = "";
    } catch (e) {
      dateError.textContent = e;
    }
    }
    checkForUpdate();
    });

/**save() method to save data */
const save = () =>{                                                 //save function to save the details
    try{
        setEmployeePayrollObject();
        createAndUpdateStorage();
        resetForm();
        window.location.replace(site_properties.home_page);
    }
    catch (e){
        return;
    }
}
/**getInputValueById() method to verify values. and modify date in require format]
 * 
 */
const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}
/*getInputElementValue() method to take input values  */
const getInputElementValue = (id) => {
    let value =document.getElementById(id).value;
    return value;
}

/**resetForm() method to rest form to default */

const resetForm = ()=>{
    setValue('#name','');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary','');
    setValue('#notes','');
    setValue('#day','1');
    setValue('#month','January');
    setValue('#year','2020');
}
/**Unselectedvalues() function is to empty the all the values in the form after entering the details */
const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}
/**setTextValue() function to show the error when we entered the wrong value */
const setTextValue = (id,value) => {
    const element =document.querySelector(id);
    element.textContent = value;
}

/**setValue() method to reset form to default */
const setValue = (id, value) =>{
    const element = document.querySelector(id);
    element.value = value;
}
/**checkForUpdate() function to after clicking edit option to fill the form with previous employee details */
const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if(!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}

/**setForm() method to  set the form to previous details after clicking edit button in home page*/
const setForm = () => {
    setValue('#name', employeePayrollObj._name);
    setSelectedValues('[names=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]',employeePayrollObj._gender);
    setSelectedValues('[name=department]',employeePayrollObj._department);
    setValue('#salary',employeePayrollObj._salary);
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes',employeePayrollObj._notes);
    let date = stringifyDate(employeePayrollObj._startDate.split(" "));
    setValue('#day',date[0]);
    setValue('#month',date[1]);
    setValue('#year',date[2]);
}
/** setSelectedValues() function to set selected values in given range  in employee details*/
const setSelectedValues = (propertyValue,value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item =>{
        if(Array.isArray(value)){
            if(value.includes(item.value)) {
                item.checked = true;
            }
        }
        else if (item.value === value )
        item.checked = value;
});
}
/**setEmployeePayrollObject() function to create object of employee details */
const setEmployeePayrollObject = () => {
    employeePayrollObj._name = getInputValueById('#name');
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = getInputValueById('#salary');
    employeePayrollObj._notes = getInputValueById('#notes');

    let date = getInputValueById('#day')+" "+getInputValueById('#month')+" "+getInputValueById('#year');
    employeePayrollObj._startDate =date;
}

/** createAndUpdateStorage() method to add employeedetail object to  local storage*/
const createAndUpdateStorage = () => {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if(employeePayrollList){
        let employeePayrollData = employeePayrollList.find(empData => empData._id == employeePayrollObj._id);
        if (!employeePayrollData){
            employeePayrollList.push(createEmployeePayrollData());
        }
        else {
            const index = employeePayrollList.map(empData => empData).indexOf(employeePayrollData._id);
            employeePayrollList.splice(index,1,createEmployeePayrollData(employeePayrollData._id));
        }
    }
    else {
        employeePayrollList = [createEmployeePayrollData()]
    }
    localStorage.setItem("EmployeePayrollList",JSON.stringify(employeePayrollList))
}

/** createEmployeePayrollData() metjhod to create employee detail object*/
const createEmployeePayrollData = (id) => {
    if (!id) employeePayrollObj._id = createNewEmployeeId();
    else employeePayrollObj._id = id;
    setEmployeePayrollData(employeePayrollObj);
    return employeePayrollObj;
}

/** setEmployeePayrollData() function to set employee details specific variable  */
const setEmployeePayrollData = (employeePayrollData) => {
    try{
        employeePayrollData.name = employeePayrollObj._name;
    }catch(e){
        setTextValue('.text-error',e);
        throw e;
    }
    employeePayrollData.profilePic = employeePayrollObj._profilePic;
    employeePayrollData.gender = employeePayrollObj._gender;
    employeePayrollData.department = employeePayrollObj._department;
    employeePayrollData.salary = employeePayrollObj._salary;
    employeePayrollData.notes = employeePayrollObj._notes;
    try{
        employeePayrollData.startDate = new Date(Date.parse(employeePayrollObj._startDate));
    }catch (e){
        setTextValue('.date-error',e);
        throw e;
    }
    alert(employeePayrollObj.toString());
}
/**createNewEmployeeId() function to create new employeeid for every employee
 */
const createNewEmployeeId = () => {
    let empID =localStorage.getItem("EmployeeID");
    empID =!empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID",empID);
    return empID;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let selItems = [];
    allItems.forEach(item => {
        if (item.checked) selItems.push(item.value);
    });
    return selItems;
}