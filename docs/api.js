
window.addEventListener('load', function() {
  document.body.appendChild(createNav());
});

function getFunctionName(apiSynopsys) {
  return apiSynopsys.replace(/[\(\:].*$/, '');
}

function createNavItem(name) {
  var item = document.createElement('div');
  item.textContent = name;
  item.addEventListener('click', function() {
    location.hash = name;
  });
  return item;
}

function createNav() {
  var nav = document.createElement('nav');

  var srchbox = document.createElement('input');
  srchbox.type = 'text';
  srchbox.value = 'Search';
  srchbox._empty = true;
  srchbox.style.color = '#bbb';
  srchbox.addEventListener('focus', focusSearchbox);
  srchbox.addEventListener('blur', blurSearchbox);
  srchbox.addEventListener('keypress', keypressSearchbox);
  srchbox.addEventListener('keyup', keyupSearchbox);

  var navlist = document.createElement('div');
  navlist.className = 'nav-list';

  nav.appendChild(srchbox);
  nav.appendChild(navlist);

  var arr = document.getElementsByTagName('h3');
  for (var i = 0; i < arr.length; i++) {
    var h3 = arr[i];
    var name = getFunctionName(h3.textContent);
    h3.id = name;
    navlist.appendChild(createNavItem(name));
  }

  return nav;
}

function focusSearchbox(event) {
  var textbox = event.currentTarget;
  if (textbox._empty) {
    textbox.value = '';
    textbox.style.color = '#bbb';
  }
}

function blurSearchbox(event) {
  var textbox = event.currentTarget;
  if (textbox._empty) {
    textbox.value = 'Search';
    textbox.style.color = '#bbb';
  }
}

function keypressSearchbox(event) {
  var textbox = event.currentTarget;
  var navlist = textbox.nextElementSibling;
  if (event.key.length === 1) {
    filterNav(navlist.firstElementChild, textbox.value + event.key);
  }
}

function keyupSearchbox(event) {
  var textbox = event.currentTarget;
  var navlist = textbox.nextElementSibling;
  filterNav(navlist.firstElementChild, textbox.value);
  textbox._empty = !textbox.value;
  if (!textbox._empty) {
    textbox.style.color = 'black';
  }
}

function filterNav(firstItem, text) {
  //console.log(text);
  for (var item = firstItem; item != null; item = item.nextElementSibling) {
    var regex = new RegExp(text, 'i');
    item.style.display = regex.test(item.textContent) ? 'block' : 'none';
    //console.log(item.textContent, regex.test(item.textContent));
  }
}
