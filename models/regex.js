//testing the regex in the console using:
//    node models/regex.js "444-12345"      and other entries that should be true or false.
let regex = /^(\d{2}|\d{3})-\d\d\d\d+$/
console.log(process.argv[2])
console.log(regex.test(process.argv[2]))