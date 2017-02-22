# chroma-hci
HCI Research Project Based On Chroma Keyboards

# This only works on windows.
This will require you to install more than 8GB of bullshit sdks.

1. install https://go.microsoft.com/fwlink/p/?LinkId=323507
2. Make a project in Visual Studio, that installs another 3gigs of C++ sdks. y tho?
3. Run `cmd` in Admin mode.
4. Run `:set GYP_MSVS_VERSION=2015`
5. Run `npm config set msvs_version 2015 --global`
6. Run `npm install`
7. Run `node pilot.js`

**Dev Note:** The fact that I need to use Win10 to develop this, proves God does not exist :-/