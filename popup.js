console.log("enter");

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function getCurrentTabComplete(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    if (tab.status == "complete")
    {
      callback(tab);
    }
    else
    {
      setTimeout(function () {
        getCurrentTabComplete(callback)
      }, 500);
    }
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function closeCurrentTab() {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];
    console.log(tab);
    chrome.tabs.remove(tab.id, function() { });

  });
}

function getCurrentTabWindow(callback){
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    console.log(tab.windowId);

    chrome.windows.get(tab.windowId, null, callback);
  });
}

function backup(url)
{
  function url_domain(data) 
  {
      if (data)
      {
          var a = document.createElement('a');
          a.href = data;
          return a.hostname;
      }
      else
      {
          return null;
      }
  }  

  ldomain = url_domain(url);
  console.log(1);
  console.log("'" + ldomain + "'");

  chrome.tabs.executeScript(null, {"file": "backup.js"}, function(){
    getCurrentTabComplete(function(tab){
      console.log(tab)
      lnewUrl = tab.url;
      lnewDomain = url_domain(lnewUrl);
      console.log(2);
      console.log("'" + lnewDomain + "'");

      if (!lnewDomain.localeCompare(ldomain))
      {
        if (lnewDomain.localeCompare(url))
        {
          chrome.tabs.remove(tab.id);
        }
        else
        {
          console.log(3);
          backup(url);
        }
      }
      else if (lnewDomain == "newtab")
      {
        chrome.tabs.remove(tab.id);
      }
    });
  })
}

document.addEventListener('DOMContentLoaded', function() {
  console.log("enter2");
  var buttonNos = document.getElementsByClassName('btnno');
  console.log(buttonNos)
  for (ix = 0; ix < buttonNos.length; ix++)
  {
    console.log(ix);
    buttonNo = buttonNos.item(ix);
    console.log(buttonNo)
    buttonNo.addEventListener('click', function() {
      var lmessage = this.innerText;
      getCurrentTabUrl(function(url){
        console.log("About to post to " + url);

        $.ajax({
            url: url,
            context: document.body,
            data: {
              "sent-by": "no",
              "version": 1,
              "message": lmessage
            },
            method: "GET",
        }).done(function(response){
          alert("You just sent this message: '" + lmessage + "'")

          backup(url);

          //closeCurrentTab();
        }).fail(function(){
          alert("fail sending to " + url)
        });
      })
    });
  }
});

console.log("leave");
