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
  const database = firebase.database()
  
  // Set up our register function
  function register () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    full_name = document.getElementById('full_name').value
    repass = document.getElementById('repass').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Email or Password',
            icon: 'error',
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
    
    if (validate_field(full_name) == false) {
        Swal.fire({
            title: 'Error!',
            text: 'Full name invalid',
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
  
      // DOne
      Swal.fire({
        title: 'Awesome!',
        text: 'User created',
        icon: 'success',
        confirmButtonText: 'Continue'
      })
    })
    .catch(function(error) {
        Swal.fire({
            title: 'Error!',
            text: 'User could not be created',
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
            icon: 'error',
            confirmButtonText: 'Try again'
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
        confirmButtonText: 'Continue'
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