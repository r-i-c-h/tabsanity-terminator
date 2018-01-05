#Tabsanity Terminator (Treatment?)
==================================
An open-source Google Chrome Extension by [Rich Werden][richsite] to save you from redundant/duplicate tabs and disorganized tab groupings.

I know that when I'm doing research on a subject, I'm constantly opening page-links in new tabs that themselves link to other pages. Then, opening those other pages' links in new tabs... often I'll end up chasing my tail as my tab bar fills up with pages cross-referencing one another. That's why I wanted this extension.

So, first thing this extension does is check if any of your window's open tabs are duplicates of one another and closes those that are.

Then, it [tries to] sort the remaining tabs first by grouping your tabs together *alphabetically by domain* and then sub-sort those groups *alphabetically by URL*  - Grouping the domains is very difficult particularly because of those newer TLDs[^1] that are longer than 2-3 characters (things like '.business' or '.guide'). The only way to get 100% coverage would be to regularly fetch the 2K [IANA list of valid domains][IANA], which I feel is overkill for something that is supposed to be 'lightweight'.

The extension leaves 'pinned' tabs right where they are.

This extension only applies to one window at a time - the window you clicked the extension's button in.

## Usage:
I'd hope it's pretty self-explanatory? 
1. Enable the extension
1. Click the extension's button
1. _KAPOOF_ Tabs shuffle and close.

## How to get it:
### Chrome Web-Store
(WIP)
[A link goes here]

### Load as unpacked extension via Developer Mode
1. Clone this repo 
1. Go to `chrome://extensions`
1. Click the Developer Mode checkbox
1. Click the 'Load unpacked extension... button that shows up
1. Select the right directory
1. Click the `enabled` checkbox

___

*** Copyright and licensed under [the MIT license](/LICENSE) ***


[IANA]: https://www.iana.org/domains/root/db
[richsite]: http://www.richwerden.com/

[^1]: TLD is short for top-level domains which are the `.com` or `.org` or `.co.uk` endings of all URLs