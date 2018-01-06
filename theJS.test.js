/** NOTE: 
 * This is TDD code from my Jest unit-tests of the func() that parses 'the
 * real domains' for initial grouping from the tabs' reported URLs.
 * As it stands, the extension's code is NOT setup to be tested.
 * To do so, you NEED TO EXPORT the getURLgroup func() from theJS.js
 ***/
 var getURLgroup = require('./theJS.js')

describe('Normalish URLs', () => {

  test('Parses .com Domains from links', () => {
    expect( getURLgroup('https://www.yahoo.com/somepath/somefile.html') ).toBe('yahoo.com')
  })

  test('Parses http (non-https) .com Domains from links', () => {
    expect( getURLgroup('http://www.yahoo.com/somepath/somefile.html') ).toBe('yahoo.com')
  })

  test('Parses .org  Domains from links', () => {
    expect( getURLgroup('https://www.worldwildlife.org/somepath/somefile.html') ).toBe('worldwildlife.org')
  })

  test('Parses .net  Domains from links', () => {
    expect( getURLgroup('https://www.slideshare.net/somepath/somefile.html') ).toBe('slideshare.net')
  })

  test('Parses domains even without a www prefix', () => {
    expect( getURLgroup('https://hackernoon.com/somepath/somefile.html') ).toBe('hackernoon.com')
  })

  test('Parses URLs that end with a forward slash', () => {
    expect( getURLgroup('https://www.yahoo.com/somepath/somefile/') ).toBe('yahoo.com')
  })

  test('Parses URLs that end without a forward slash or file extension', () => {
    expect( getURLgroup('https://www.yahoo.com/somepath/somefile') ).toBe('yahoo.com')
  })

})
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

describe('Subdomains and Non-US', () => {

  test('Parses domains from URLs with a [single] subdomain', () => {
    expect( getURLgroup('https://gist.github.com/jlong/2428561') ).toBe('github.com')
  })

  test('Parses domains from unusual non-standard domains', () => {
    expect( getURLgroup('https://khan4019.github.io/front-end-Interview-Questions/sort.html') ).toBe('github.io')
  })

  test('Parses domains from URLs with a  ___.xx.xx non-us domain', () => {
    expect( getURLgroup('https://www.bbc.co.uk/news/technology-42561169') ).toBe('bbc.co.uk')
  })

  test('Parses domains from URLs with a  ___.xxx.xx non-us domain', () => {
    expect( getURLgroup('https://www.amazon.com.au/foo') ).toBe('amazon.com.au')
  })
  
})

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
describe('URLs with extra info', () => {

  test('Parses domains from URLs with a port#', () => {
    expect( getURLgroup('https://www.adomain.com:9999/foo/bar.html') ).toBe('adomain.com')
  })

  test('Parses domains from URLs with a hash#', () => {
    expect( getURLgroup('http://www.richwerden.com/index.html#blog') ).toBe('richwerden.com')
  })

  test('Parses domains from URLs with a ? search', () => {
    expect( getURLgroup('https://www.yahoo.com/index.html?search=term&beep=boop') ).toBe('yahoo.com')
  })

  test('Parses domains with a user@pass combo', () => {
    expect( getURLgroup('https://userBob:pa55w0rd@www.yahoo.com/index.html') ).toBe('yahoo.com')
  })

})
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
describe('Non-HTTP URLs', () => {

  test('returns about: links domain as "about" ', () => {
    expect( getURLgroup('about:blank') ).toBe('about')
  })

  test('returns chrome: links domain as "chrome" ', () => {
    expect( getURLgroup('chrome://extensions/') ).toBe('chrome')
  })

  test('returns file: links domain as "file" ', () => {
    expect( getURLgroup('file:///Users/anon/Desktop/someFile.txt') ).toBe('file')
  })

  test('returns ftp links domains', () => {
    expect( getURLgroup('ftp://ftp.bar.com:21/blahblahblah/') ).toBe('bar.com')
  })

  test('responds to localhost requests with localhost', () => {
    expect( getURLgroup('http://localhost:8080/index.html') ).toBe('localhost')
  })

  test('responds to IP4 requests with ??? ip address ??? ', () => {
    expect( getURLgroup('http://127.0.0.1:4000/index.html') ).toBe('127.0.0.1')
  })
  
})