//const countryMap = new Map();
var   countryMap = new Map();
var   countrySet ;
function ValidateValues(InputValue)
{
  if (!InputValue) {
    return false; 
  }
    return true;

}
// get number of case for country by date and status.
async function GetCases(CountryName, CountryDate,status ) {

  var TodayConfirmed;
  try {
     
       if (IfToday(CountryDate) )
  {
     // GET today Total cases
 await fetch('https://covid-api.mmediagroup.fr/v1/cases?country=' + CountryName ).then((response) => {
  return response.json();
  })
  .then((myJson) => {
    console.log( 'Today');
    if (status = 'confirmed')
       {TodayConfirmed =  myJson.All.confirmed;}
    else 
      {TodayConfirmed = myJson.All.deaths;}
   
 });
  }

 // GET yesterday Total Cases
 await fetch('https://covid-api.mmediagroup.fr/v1/history?country=' + CountryName + '&status='+ status).then((response) => {
 return response.json();
 })
 .then((myJson) => {
  
  countryMap.set(CountryName, myJson.All.dates);
  var yesterday = new Date(CountryDate - 86400000); // that is: 24 * 60 * 60 * 1000
  if (!IfToday(CountryDate) )
  {
  TodayConfirmed = countryMap.get(CountryName)[getValidFormat(CountryDate)] ;
  }
  //totalCase is the number of current day case minus the day before
  var totalCase =  TodayConfirmed - countryMap.get(CountryName)[getValidFormat(yesterday)];
  console.log('totalCase=' + totalCase);
  
  return [CountryDate,totalCase];
});


  }
catch (Message) {
  console.log (Message);
}
}
/*async function getCasesbyDate(date,CountryName,status)
{
  var TodayCases;
  try {
     
  //if (IfToday(date) )
  //{
     // GET today Total cases

      await fetch('https://covid-api.mmediagroup.fr/v1/cases?country=' + CountryName).then((response) => {
    return response.json();
    })
    .then((myJson) => {
     
    if (status = 'confirmed')
       {TodayCases =  myJson.All.confirmed;}
    else 
      {TodayCases = myJson.All.deaths;}
      //alert(TodayCases);
 });
 
return  TodayCases;



  }
catch (Message) {
  console.log ('Error getCasesbyDate ' + Message);
}
  
}*/
function GetConfirmedCases() {

  
  var CountryName = document.getElementById("CountryName").value;
  var CountryDate = new Date(document.getElementById("CountryDate").value);
  var Total;
  try {
     
         if (!ValidateValues(CountryName) || !ValidateValues(CountryDate) )
            {
              throw 'Country Name or date are missing';
          
            }
        
           Total = GetCases(CountryName, CountryDate,'confirmed' ) ;
          document.getElementById("TotalCases").innerHTML = 'Total Confirmed: ' + Total.totalCase;
  
  }
  catch (Message) {
  console.log (Message);
  }
}
 
// if today
function IfToday(someDate)
{
  const today = new Date();
  return someDate.getDate() == today.getDate() &&
         someDate.getMonth() == today.getMonth() &&
         someDate.getFullYear() == today.getFullYear();

}

//Get date in format YYYY-MM-DD
function getValidFormat(date) {

  var date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  var result = date.toISOString().split('T')[0];
  return result;
 
}

function AddCountry()
{
try { 
    var UserName = document.getElementById("UserName").value;
    var CountryName = document.getElementById("CountryName").value;
    if (!ValidateValues(UserName)|| !ValidateValues(CountryName))
    {
        throw 'No User name or Country Was Given';
    }
    
    if (countryMap.has(UserName)) // if user Exist
      {
        
        var countryArray = countryMap.get(UserName);
        var index = countryArray.indexOf(CountryName); 
        if (index !== -1)//check for Duplicate
           { throw 'Country Already Exist for that User.'; }
        countryArray.push(CountryName);
        countryMap.set(UserName, countryArray);
        console.log(CountryName +' add to Exist User '+UserName );
        //console.log(countryMap.get(UserName));
      } 
      else // create new array for existing user
      {
        var countryArray= [CountryName];
        countryMap.set(UserName, countryArray);
        console.log(CountryName +' add to '+ UserName );
        console.log(countryMap.get(UserName));
      }
    }
catch(Message){
   alert(Message);
   }
}

function DeleteCountry()
{
    try{
        var UserName = document.getElementById("UserName").value;
        var CountryName = document.getElementById("CountryName").value;
        if (!ValidateValues(UserName)|| !ValidateValues(CountryName))
        {
            throw 'No User name or Country Was Given';
        }
        if (!countryMap.has(UserName) )
        {
         throw 'There are No Country list for that user.';
        }
     countrySet = countryMap.get(UserName);
     var index = countrySet.indexOf(CountryName);
     if (index !== -1) {
             countrySet.splice(index, 1);
         }
     else 
     {
         throw 'Country did not exist for that user.';
     }
     countryMap.set(UserName, countrySet);
     console.log(CountryName +' Deleted From '+ UserName );
    console.log(countryMap.get(UserName));
    }
    catch(Message)
         {
            alert(Message);
         }

}

function GetAllCountries()
{
    try{
        var UserName = document.getElementById("UserName").value;
        var CountryName = document.getElementById("CountryName").value;
        if (!ValidateValues(UserName)|| !ValidateValues(CountryName))
        {
            throw 'No User name or Country Was Given';
        }
    
        var Countries;
        if (countryMap.has(UserName))
           {
            document.getElementById("TotalCountryByUser").innerHTML =  countryMap.get(UserName) ;
            console.log(countryMap.get(UserName));
            return countryMap.get(UserName);
           }
           else 
           {
               throw 'No Such User.';
           }
           
            
        }
   catch(Message)
        {
           alert(Message);
        }

}

async function NumberOfCases(Status)
{
  // Validation!!!!
  let allCases = new Set(new Map());
  let DateFrom = new Date(document.getElementById("DateFrom").value);
  let DateTo   = new Date(document.getElementById("DateTo").value);
  let AllCountries = GetAllCountries(); 
  
  var PromiseAll = [];
 
    for (let index = 0; index < AllCountries.length; ++index) // for each country 
     {
      while (DateTo >= DateFrom)
      {

        //PromiseAll.push(AllCountries[index], getValidFormat(DateTo), getCasesbyDate(DateTo,(AllCountries[index]),Status) );
        PromiseAll.push( getValidFormat(DateTo), GetCases((AllCountries[index]),DateTo,Status) );
        await Promise.all(PromiseAll,{
          mode: 'no-cors'
        });
        DateTo = new Date(DateTo - 86400000);
      }
      allCases.add(AllCountries[index],PromiseAll ); 
      console.log(AllCountries[index] +'|||'+PromiseAll.values());

      
     }
  //console.log(allCases.keys());
  console.log(JSON.stringify(PromiseAll.values()));
  //console.log(JSON.stringify(PromiseAll));
  //for (let item of allCases.values()){ item.forEach((x, i) => console.log(x)); }
  
  document.getElementById("TotalCountryByUser").innerHTML =  JSON.stringify(PromiseAll);
  document.getElementById("TotalCases").innerHTML =  JSON.stringify(allCases);
  console.log('END NumberOfCases');
}


async function HighestCases(Status)
{
  //Same as NumberOfCases
  // For Every day, get the country ant the number of cases
  // like this = >    < 17-10-2020 , {[GERMANY, 2000], [ITALY, 4000]} > 
  // and for every day get the max value

 
}