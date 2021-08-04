// This file is used for linking the database to the UI

var urlBase = 'http://cop4331-group16.xyz/LAMPAPI';
var extension = 'php';

var contactList = [];
var userId = 0;
var tempid="";

//Cookies
function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
   
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "./index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Hello,  " + firstName + " " + lastName;
	}
}

// toggle functions
var x=document.getElementById("login");
var y=document.getElementById("register");
var z=document.getElementById("btn");

function loginSwitch()
{
	
	document.getElementById("login").style.left="50px";
	document.getElementById("register").style.left="450px";
	document.getElementById("btn").style.left="0px";
}

function registerSwitch()
{
	document.getElementById("login").style.left="-400px";
	document.getElementById("register").style.left="50px";
	document.getElementById("btn").style.left="110px";
}

// functionality
function login()
{
	// Grab the users username and password 
	var login = document.getElementById("login-username").value;
	var password = document.getElementById("password-username").value;
	
	// Encrypt the users password 
	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	// Create json payload object 
	var object = new Object();
	object.username = login;
	object.password= hash;	
	
	var jsonPayload = JSON.stringify(object);

	// Append the correct URL
	var url = urlBase + '/Login.' + extension;

	// Open a new HTTP Request to the server
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
					
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				//userId = jsonObject.userId;

				saveCookie();
	
				window.location.href = "contact.html";
        document.getElementById("SearchResult").innerHTML = "Search for contacts";
			} 
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

// Checks if the password strings are equal
function ValidatePassword(pass1, pass2)
{
	if(pass1=="") return false; 
 	if(pass1 != pass2) return false; 
 	return true;
}

// Registers a User into the Database
function register()
{
	userId = 0;
 
	// Recieve users register information 
	var firstname = document.getElementById("reg-first-name").value;
	var lastname = document.getElementById("reg-last-name").value;
	var userName = document.getElementById("reg-username").value;
	var password = document.getElementById("reg-password").value;
	var password2 = document.getElementById("reg-confirm").value;	
	
	if (!ValidatePassword(password, password2))
	{
		alert("Password don't match");
		return;
	} 

	// Encrypt the password
	var hash = md5( password );
	
	document.getElementById("registerResult").innerHTML = "";
	
	// create json payload
	var object = new Object();
	object.firstName = firstname;
	object.lastName= lastname;
	object.username=userName;
	object.password=hash;
	
	// saveCookie();
	var jsonPayload = JSON.stringify(object);

	
	// Append the correct URL
	var url = urlBase + '/Register.' + extension;
	
	// Open a new HTTP Request with the server
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
	
				window.location.href = "index.html";
			} 
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

// Logs out of the Users account
function logOut()
{
   // delete the coockie
   window.location.href="./index.html";
}
 
// Search for a regular expression of a string in the Users Contact List
function searchContact()
{
	// Value to search for
 	var srch= document.getElementById("SearchText").value;
	//document.getElementById('id04').style.display='block';
	document.getElementById("SearchResult").innerHTML = "";
	
	// Create empty ContactList array that will store the Users contact search results
	// Create the json payload object
	var object = new Object();
	object.UserID = userId;
	object.search = srch;
	var jsonPayload = JSON.stringify(object);
	

	// Append the correct URL
	var url = urlBase + '/SearchContact.' + extension;
	
	// Create a new HTTP request to the server
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("SearchResult").innerHTML = "  Search Results:  ";
				var jsonObject = JSON.parse( xhr.responseText );
				var indexIds = [];
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					//Adding a line between the contacts
      					contactList[i]= "<br /><hr />\n";
				 	let newStr = jsonObject.results[i];
          
					//unchanged string to pass to the search Edit function
          				var editStr = newStr;
          
					var indexID; 
					indexID = newStr.slice(-2); 
					indexIds[i] = indexID; 
					
					if (indexIds[i].length == 2)
					{
						newStr = newStr.slice(0, -3);
					}
					else
					{
						newStr = newStr.slice(0, -4); 
					}
					
					contactList[i]+= newStr;
	
					// Printing contacts to container 
					document.getElementById("SearchResult").innerHTML += contactList[i]+"  ";

					//EDIT:
                			var btn = document.createElement('BUTTON');
                			btn.className="EditButton";
               				btn.innerHTML="Edit";
                			btn.value = editStr;
                 			document.getElementById("SearchResult").appendChild(btn);
                 			
					//DELETE
                 			var btnDel = document.createElement("button");
                 			btnDel.className="DeleteButton";
                 			btnDel.innerHTML="Delete";
                			btnDel.value = indexIds[i];
                 			document.getElementById("SearchResult").appendChild(btnDel);
				}
       
				var btns = document.querySelectorAll(".EditButton");
                		btns.forEach(btn => 
				{
                    			btn.onclick = function() 
					{ 
						searchEdit(btn.value);
                    			};
                  		});

                  		var btnsDel = document.querySelectorAll(".DeleteButton");
               			btnsDel.forEach(btnDel=> 
				{
                    			btnDel.onclick = function() 
					{
						searchDelete(btnDel.value);
                    			};
                  		});

				//adding the last line to the array
        			contactList[contactList.length-1]+= "<br/><hr />";
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementsById("SearchResults").innerHTML = err.message;
	}			
}
 
// Adds a contact the users ContactList
function addContact()
{
	// Get user inputted values to add the contact
	var firstname = document.getElementById("add-firstname").value;
	var lastname = document.getElementById("add-lastname").value;
	var addPhone = document.getElementById("add-phone").value;
	var addEmail = document.getElementById("add-email").value;

	// Create json payload object
	var object = new Object();
	object.FirstName=firstname;
	object.LastName =lastname;
	object.Phone = addPhone;
	object.Email = addEmail;
	object.UserID = userId;
	
	var jsonPayload = JSON.stringify(object);

	// Append the correct url
	var url = urlBase + '/AddContact.' + extension;

	// Open a new server request
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
			} 
		};

		xhr.send(jsonPayload);
		document.getElementById('id01').style.display='none';
		document.getElementById("addResult").innerHTML = "";
	}
	catch(err)
	{
		document.getElementById("addResult").innerHTML = err.message;
	}
}

function editContact()
{
	var obj = new Object();
        
        obj.FirstName = document.getElementById("edit-firstname").value;
        obj.LastName = document.getElementById("edit-lastname").value;
        obj.Phone = document.getElementById("edit-phone").value;
        obj.Email = document.getElementById("edit-email").value;
        obj.ID=tempid;
        
        var jsonPayload = JSON.stringify(obj);
        var url = urlBase + '/Edit.' + extension;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                var jsonObject = JSON.parse( xhr.responseText );

                        }
                };

                xhr.send(jsonPayload);
                document.getElementById('edit-modal').style.display='none';
                document.getElementById("edit-result").innerHTML = "";
        }
        catch(err)
        {
                document.getElementById("edit-result").innerHTML = err.message;
        }

}

function searchDelete(id)
{
        var choice= confirm("Are you sure you want to delete this contact?");

        if (choice)
	{
		var object = new Object ();
        	object.ID=id;
 		
		var jsonPayload = JSON.stringify(object);
		var url = urlBase + '/Delete.' + extension;

		var xhr = new XMLHttpRequest();

		xhr.open("POST", url, false);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		try
		{
        		xhr.onreadystatechange = function()
        	{
                	if (this.readyState == 4 && this.status == 200)
                	{
                        	var jsonObject = JSON.parse( xhr.responseText );
                	}
        	};
			        		xhr.send(jsonPayload);

		}	
		catch(err)
		{
        		alert("An error occured");
		}
	}
}

function searchEdit(editStr)
{
        var arr = editStr.split(" ");
        var first = arr[0];
        var last = arr[1].slice(0, -1);
        var phone = arr[2].slice(0,-1);
        var email = arr[3];
        var id = arr[4];
        var test = arr[5]; 
        id=test;
        
	// Saves the id of the contact to delete
        tempid = id;
        document.getElementById("edit-firstname").value = first;        
        document.getElementById("edit-lastname").value = last;
        document.getElementById("edit-phone").value = phone;
        document.getElementById("edit-email").value = email;
        document.getElementById('edit-modal').style.display='inline';
}
 
function openAdd()
{
 	// Neither blocks are displaying, when I inspect is shows that they are there, but i still cant see them.
 	document.getElementById('id01').style.display='block';
 	document.getElementById('id01cont').style.display='block';
}
