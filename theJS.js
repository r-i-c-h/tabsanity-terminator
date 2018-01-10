chrome.browserAction.onClicked.addListener(function() {
  var offsetForPinnedTabs = 0

  var getURLgroup = function(urlStr) {
    if (/^chrome/i.test(urlStr)) { return '#chrome' } 
    if (/^about/i.test(urlStr)) { return '#about' }
    if (/^file/i.test(urlStr)) { return '#file' }
    if (/^(https?:\/\/)?localhost/i.test(urlStr)) {
      return '00localhost'
    }
    if (/^(https?:\/\/)?127\.\d[^:/]+/i.test(urlStr)) {
      return urlStr.match(/^https?:\/\/(127\.\d[^:/]+)/i)[1] // Eliminates Port #s...
    }
    
    var getURLStart = function(str) {
      var txt = str.toLowerCase()
      txt = txt.replace(/^((https?|ftp):?)?(\/+)?(www\.)?/i, '') // Remove URL Start
      // Test for user:pass@somedomain.com...
      if (/^[^:]+:[^@]+@/i.test(txt)) {
        txt = txt.replace(/^[^:]+:[^@]+@/i, '')
      }
      txt = txt.replace(/[/:].*$/gi, '') // Kill all after next '/' or ':' (to nuke Port#s)
      return txt
    }
    
    var urlStartGroup = getURLStart(urlStr)
    var piecesArr = urlStartGroup.split('.')
    var groupSize = piecesArr.length
    if (groupSize === 2) { return urlStartGroup }
    if (groupSize === 3) {
      var lastPc = piecesArr[2]
      var middlePcLength = piecesArr[1].length

      if (/com|net|org/i.test(lastPc)) {
        return piecesArr.slice(-2).join('.')
      }
      if (lastPc.length === 2) {
        if (middlePcLength === 2 || middlePcLength === 3) {
          return piecesArr.join('.')
        }
        return piecesArr.slice(-2).join('.')
      }
    }
    if (groupSize >= 4) {
      /** Big Assumption Here **/
      return piecesArr.slice(-3).join('.')
    }

    return urlStartGroup
  }

  var makeUniqTabObjsArr = function(arrOfTabs) {
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

    var uniqueArr = uniquifyTabs(arrOfTabs.slice());
    
    return uniqueArr.map(function(tabElem) {
      var dataObj = {
        tabId: tabElem.id,
        fullURL: tabElem.url,
        domGroup: getURLgroup(tabElem.url)
      }
      return dataObj
    });
  };

  var tabsArrSorter = function(arrOfTabObj) {
    return arrOfTabObj.slice().sort(function(a,b){
      var domSort = (a.domGroup).localeCompare(b.domGroup)
      if (domSort === 0){
        return (a.fullURL).localeCompare(b.fullURL)
      }
      return domSort;
    })
  }

  var moveTheTabs = function(sortedArr) {
    for (var i = 0; i < sortedArr.length; i++) {
      chrome.tabs.move(sortedArr[i].tabId, {
        index: i + offsetForPinnedTabs
      });
    }
    return null;
  }
  
  var tabsanity = function(arrOfTabs){
    var tabObjsArr = makeUniqTabObjsArr(arrOfTabs)
    var sortedByURL = tabsArrSorter(tabObjsArr)
    return moveTheTabs(sortedByURL)
  }
  
  chrome.tabs.query({ windowType: 'normal', windowId: chrome.windows.WINDOW_ID_CURRENT, pinned: true },
    function(pinned) { offsetForPinnedTabs = pinned.length; });
  chrome.tabs.query({ windowType: 'normal', windowId: chrome.windows.WINDOW_ID_CURRENT, pinned: false }, tabsanity);
}); // end addListener
// For Testing: module.exports = getDomGroup