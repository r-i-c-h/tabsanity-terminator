chrome.browserAction.onClicked.addListener(function() {
  var offsetForPinnedTabs = 0

  var getDomGroup = function(urlStr) {
    if (/^chrome/i.test(urlStr)) { return 'chrome' }
    if (/^about/i.test(urlStr)) { return 'about' }
    if (/^file/i.test(urlStr)) { return 'file' }
    if (/^(https?:\/\/)?localhost/i.test(urlStr)) {
      return 'localhost'
    }
    if (/^(https?:\/\/)?127\.\d[^:/]+/i.test(urlStr)) {
      return urlStr.match(/^https?:\/\/(127\.\d[^:/]+)/i)[1] // Eliminates Port #s...
    }

    var getFirstGroup = function(str) {
      var txt = str
      txt = txt.replace(/^((https?|ftp):?)?(\/+)?(www\.)?/i, '') // Remove URL Start
      // Test for user:pass@somedomain.com...
      if (/^[^:]+:[^@]+@/i.test(txt)) {
        txt = txt.replace(/^[^:]+:[^@]+@/i, '')
      }
      txt = txt.replace(/[/:].*$/gi, '') // Kill all after next '/' or ':' (to nuke Port#s)
      return txt
    }

    var firstGroup = getFirstGroup(urlStr)
    var groupPiecesArr = firstGroup.split('.')
    if (groupPiecesArr.length === 2) {
      return firstGroup
    }
    if (groupPiecesArr.length === 3) {
      // Look for obvious endings in 3rd piece:
      if (/com|net|org/i.test(groupPiecesArr[2])) {
        return groupPiecesArr.slice(-2).join('.')
      }
      // The last of 3 pieces is 2characters
      if (groupPiecesArr[2].length === 2) {
        // Is it ____.xx.xx or ____.xxx.xx pattern?
        if (groupPiecesArr[1].length === 2 || groupPiecesArr[1].length === 3) {
          return groupPiecesArr.join('.')
        }
        // ___.xx - Two character TLD ?
        return groupPiecesArr.slice(-2).join('.')
      }
    }
    if (groupPiecesArr.length >= 4) {
      /** Big Assumption Here **/
      return groupPiecesArr.slice(-3).join('.')
    }

    // ??? Did not hit a matched 'if' condition. ???
    return firstGroup
  }

  var uniquifyTabs = function(arr) {
    var hashObj = {} 
    var outputArr = []
    for (var i = 0; i < arr.length; i++) {
      var uriStr = encodeURIComponent(arr[i].url)
      if (!hashObj[uriStr]) {
        hashObj[uriStr] = 1
        outputArr.push(arr[i])
      } else {
        chrome.tabs.remove(arr[i].id);
      }
    }
    return outputArr
  }

  var makeTabObjsArr = function(arrOfTabs) {
    var uniqueList = uniquifyTabs(arrOfTabs.slice());
    return uniqueList.map(function(tabElem) {
      var dataObj = {
        tabId: tabElem.id,
        fullURL: tabElem.url,
        domGroup: getDomGroup(tabElem.url)
      }
      return dataObj
    });
  };

  var tabShifter = function(arrOfTabs) {
    var tabObjsArr = makeTabObjsArr(arrOfTabs)
    var sortedByURL = tabObjsArr.slice().sort(function(a, b) {
      if (a.domGroup < b.domGroup) { return -1 }
      if (a.domGroup > b.domGroup) { return 1 }
      if (a.domGroup === b.domGroup) {
        if (a.fullURL < b.fullURL) { return -1 }
        if (a.fullURL > b.fullURL) { return 1 }
      }
      return 0;
    })

    for (var i = 0; i < sortedByURL.length; i++) {
      chrome.tabs.move(sortedByURL[i].tabId, {
        index: i + offsetForPinnedTabs
      });
    }
  };

  chrome.tabs.query({ windowType: 'normal', pinned: true }, 
    function(pinned) { offsetForPinnedTabs = pinned.length; });
  chrome.tabs.query({ windowType: 'normal', pinned: false }, tabShifter);
}); // end addListener


// For Testing: module.exports = getDomGroup