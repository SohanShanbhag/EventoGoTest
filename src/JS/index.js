// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD3kUhbd7Pi0-ElI0NrnBEukcfvT-i3hzs",
    authDomain: "eventogo-45da6.firebaseapp.com",
    databaseURL: "https://eventogo-45da6-default-rtdb.firebaseio.com",
    projectId: "eventogo-45da6",
    storageBucket: "eventogo-45da6.appspot.com",
    messagingSenderId: "544033520609",
    appId: "1:544033520609:web:502647ed2212103486f0a0"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize variables
  const auth = firebase.auth()
  const database = firebase.database();
  var full;
  
  // Set up our register function
  function register () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    full_name = document.getElementById('full_name').value
    repass = document.getElementById('repass').value

    //validate full name
    if (validate_field(full_name) == false) {
      Swal.fire({
          title: 'Error!',
          text: 'Full name invalid',
          icon: 'error',
          confirmButtonText: 'Try again'
        })
    return
  }
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Email or Password',
            icon: 'warning',
            confirmButtonText: 'Try again'
          })
      return
      // Don't continue running the code
    }

    if (password != repass) {
        Swal.fire({
            title: 'Error!',
            text: 'Password does not match',
            icon: 'error',
            confirmButtonText: 'Try again'
          })
      return
    }
    
    
   
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        email : email,
        full_name : full_name,
        
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data)

      database.ref().child('users/' + user.uid+ "/email").on("value", function(snapshot) {
        var sender="contact.eventogo@gmail.com"
        var pswd="sohan026182"
        var reciever=snapshot.val()
        var mesg="Welcome to EventoGo! Your account has been created. Please login to continue. Thank you!"
        Email.send({ 
        Host: "smtp.gmail.com", 
        Username: sender, 
        Password:pswd, 
        To: reciever, 
        From: sender, 
        Subject: "EventoGo account has been created",
        Body: mesg, 
        }).then(function (message) { 
         
        });         
    }, function (error) {
      console.log("Error: " + error.code);
    });
  
      // DOne
      Swal.fire({
        title: 'Awesome!',
        text: 'User created',
        icon: 'success',
        confirmButtonText: 'Continue'
      })  .then((result) => {
        if (result.isConfirmed) {
          window.location.href = "login.html"
        }
      })
    })
    .catch(function(error) {
        Swal.fire({
            title: 'Error!',
            text: error.message,  
            icon: 'error',
            confirmButtonText: 'Try again'
          })
    })
  }
  
  // Set up our login function
  function login () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Email or Password',
            icon: 'warning',
            confirmButtonText: 'Try again',
            
          })
          
      return
      // Don't continue running the code
    }
  
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)
  
      // DOne
      Swal.fire({
        title: 'Awesome!',
        text: 'You have been logged in',
        icon: 'success',
        confirmButtonText: 'Continue to home'
      }).then((result) => {
        if(result.isConfirmed){
          // window.location.href = "home.html"
          document.getElementById("title").innerHTML = "EventoGo Home"
          document.getElementById("main").style.display = "none" 
          document.getElementById("welcome").style.display = "block";
          
          document.getElementsByTagName("body")[0].style.backgroundColor = "#0D0D0D";
          database_ref.child('users/' + user.uid+ "/full_name").on("value", function(snapshot) {
            console.log(snapshot.val());
            
            var myArray = (snapshot.val()).split(" ");
            full = myArray[0];
            document.getElementById("wlcname").innerHTML = myArray[0];
         }, function (error) {
            console.log("Error: " + error.code);
         });
        }
      })
      
    })
    .catch(function(error) {
        Swal.fire({
            title: 'Error!',
            text: 'Email or Password is incorrect',
            icon: 'error',
            confirmButtonText: 'Try again',
          })
    })
  }
  
  function logout(){
    auth.signOut();
    Swal.fire({
        title: 'Are you sure?',
        icon: 'question',
        confirmButtonText: 'Yes',
        showCancelButton: true,
      }).then((result) => {
        if(result.isConfirmed){
          Swal.fire({
            title: 'Logged out!',
            icon: 'success',
            confirmButtonText: 'Continue',
          }).then((result) => {
            if(result.isConfirmed){
              window.location.href = "index.html"
              
            }
          })
        }
      })
  }

  function deleteAcc(){
    var user = auth.currentUser;
    auth.currentUser.delete().then(function() {
      Swal.fire({
        title: 'Are you sure?',
        icon: 'question',
        confirmButtonText: 'Yes',
        showCancelButton: true,
      }).then((result) => {
        if(result.isConfirmed){
          Swal.fire({
            title: 'Deleted!',
            icon: 'success',
            confirmButtonText: 'Continue',
          }).then((result) => {
            if(result.isConfirmed){
              database.ref().child('users/'+user.uid).remove();
              window.location.href = "index.html"
              
            }
          })
        }
      })
    }).catch(function(error) {
      Swal.fire({
        title: 'Error!',
        text: 'User could not be deleted',
        icon: 'error',
        confirmButtonText: 'Try again',
      })
    } );
  }

  function resetpass(){
    var email = document.getElementById('email').value;
    auth.sendPasswordResetEmail(email).then(function() {
      Swal.fire({
        title: 'Password reset email sent!',
        icon: 'success',
        confirmButtonText: 'Continue',
      }).then((result) => {
        if(result.isConfirmed){
          window.location.href = "login.html"
        }
      })
    }).catch(function(error) {
      Swal.fire({
        title: 'Email not sent',
        text: 'Please fill in the email input space and try again',
        icon: 'error',
        confirmButtonText: 'Try again',
      })
    } );
  }

  function changepass(){
    var password = document.getElementById('password').value;
    var newpassword = document.getElementById('newpassword').value;
    var newpassword2 = document.getElementById('newpassword2').value;
    const user = auth.currentUser;
    if(newpassword != newpassword2){
      Swal.fire({
        title: 'Error!',
        text: 'New passwords do not match',
        icon: 'error',
        confirmButtonText: 'Try again',
      })
      return
    }
    auth.currentUser.updatePassword(newpassword).then(function() {
       
      database.ref().child('users/' + user.uid+ "/email").on("value", function(snapshot) {
          var sender="contact.eventogo@gmail.com"
          var pswd="sohan026182"
          var reciever=snapshot.val()
          var mesg="Hello " + full + " .Your password has been changed, if you did not change your password please contact us immediately. \nBest wishes, EventoGo Team"
          alert(reciever) 
          Email.send({ 
          Host: "smtp.gmail.com", 
          Username: sender, 
          Password:pswd, 
          To: reciever, 
          From: sender, 
          Subject: "Your password was changed",
          Body: mesg, 
          }).then(function (message) { 
          alert("mail sent successfully") 
          });         
      }, function (error) {
        console.log("Error: " + error.code);
      });
      Swal.fire({
        title: 'Password changed!',
        icon: 'success',
        confirmButtonText: 'Continue',
      }).then((result) => {
        if(result.isConfirmed){
          window.location.href = "#"
        }
      },function (error) {
          console.log("Error: " + error.code);
      });
    }).catch(function(error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Try again',
      })
    } );
  }
  
  // Validate Functions
  function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
  function validate_field(field) {
    if (field == null) {
      return false
    }
  
    if (field.length <= 0) {
      return false
    } else {
      return true
    }
  }