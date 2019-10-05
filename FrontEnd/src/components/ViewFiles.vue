<template>
  <div class="view-files">
    <h1>{{ heading }}</h1>
    <p>{{ msg }}</p>
    <div id="gallery"></div>
  </div>
</template>

<script>
export default {
  name: "ViewFiles",
  data() {
    return {
      heading: "View files",
      msg: "Here are the images you uploaded:",
      url: "Or upload from URL:"
    };
  }
};

var url = "https://picsum.photos/v2/list?page=2&limit=100";
var xhr = new XMLHttpRequest();
xhr.open("GET", url);
xhr.onload = function() {
  var context = this.responseText;
  gallery(context);
};
xhr.onerror = "error";
xhr.send();

function gallery(context) {
  var images = "";
  var json = JSON.parse(context);
  for (var i = 0; i < json.length; i++) {
    images +=
      '<span class="img"><img src="' +
      json[i].download_url +
      '" alt=""></span>';
  }
  document.getElementById("gallery").innerHTML = images;
}
</script>
