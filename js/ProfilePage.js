function cookieSplitter() {
  let userCookie = document.cookie;
  let cookiearray = userCookie.split(';');
  let key = "";
  let value = "";

  for (let i = 0; i < cookiearray.length; i++) {
    key = cookiearray[i].split('=')[0];
    value = cookiearray[i].split('=')[1];

    console.log("Cookie Key", key)
    console.log("Cookie Value", value)
  }
  console.log("What is in value? ", value)
  return value;
}
