/* 
    File: title_bar.js
    Author: Luis David Villalobos Gonzalez
    Date: 20/02/2021
*/

const customTitlebar = require('custom-electron-titlebar');
var titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#252525'),
    menu: null,
    maximizable: true,
    unfocusEffect: true,
    icon : '../img/feather.ico',
    titleHorizontalAlignment: 'left'
});

titlebar.updateTitle('Tiny Editor');